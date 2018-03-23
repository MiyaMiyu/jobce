const random = require('meteor-random');
let DB = require('./db_2');
let client = DB.connect("postgres://postgres:57010014@127.0.0.1:5432/postgres");
let XCE = require('./xce');

module.exports = {

/****************************start versioning****************************************/
    test: function(req,res){
        console.log("version 1.0");
        res.send('eiei');
    },
    test2: function(req,res){
        console.log("version 1.1");
    },
/*****************************end versioning***************************************/

/*****************************start services******************************************/

    isMember:function(req,res){
        //let client = DB.connect("postgres://postgres:57010014@127.0.0.1:5432/postgres");
        let {username} = req.body;
        let {password} = req.body;
        DB.select(client,`SELECT * FROM public.users WHERE username = $1;`,[username],(err,queryUsername) => {
            if (err) {
                res.status(500).send(err)
                } 
            else {
                if(queryUsername == null) 
                    res.status(403).send({msg:"your username is incorrect"});
                else {
                    DB.select(client,`SELECT * FROM public.users WHERE password = $1;`,[password],(err,query) => {
                        if (err) {
                            res.status(500).send(err)
                            } 
                        else {
                            if(query == null) 
                                res.status(403).send({msg:"your password is incorrect."});  
                            else  {
                                if(query.user_status === 0) res.status(403).send({msg:'your account inactive'});
                                else if(query.user_status === 2) res.status(403).send({msg:'your account banded'});
                                else if(query.user_status === 1) {
                                        //query token 
                                    DB.select(client,`SELECT * FROM public.tokens WHERE uid = $1;`,[query._id],(err,queryToken) => {
                                        if(err) res.status(500).send(err);
                                        else {  // no error then ...
                                            if (queryToken){  //check if have token do...
                                                // query users table
                                                DB.select(client,`SELECT t_name,t_surname FROM public.users WHERE _id = $1;`,[queryToken.uid],(err,queryUser) => {
                                                    if(err) res.status(500).send(err);
                                                    else {
                                                        res.status(200).send({ //ถ้ามี ให้ query ออกมา
                                                                token:queryToken.token,
                                                                role:query.role,
                                                                tName:queryUser.t_name,
                                                                tSurname:queryUser.t_surname
                                                        });
                                                    }
                                                });
                                            }
                                            else{   //ถ้าไม่มี token ให้สร้าง token แล้ว save ลง table 'token'
                                                let uid = query._id;
                                                let token=random.id();
                                                DB.select(client,`INSERT INTO public.tokens (uid,token) VALUES ($1,$2) RETURNING *`,[uid,token],(err,insertToken)=> {
                                                    if(err) res.status(500).send(err);
                                                    else {
                                                        DB.select(client,`SELECT t_name,t_surname FROM public.users WHERE _id = $1;`,[queryToken.uid],(err,queryUser) => {
                                                            if(err) res.status(500).send(err);
                                                            else {
                                                                res.status(200).send({ //ถ้ามี ให้ query ออกมา
                                                                        token:queryToken.token,
                                                                        role:query.role,
                                                                        tName:queryUser.t_name,
                                                                        tSurname:queryUser.t_surname
                                                                });
                                                            } 
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                        });

                                }  
                            }     
                        }
                    });
                }
            }
        }); 
    },
    signup:function(req,res){
        console.log("signup start")
        let {role,tCompany,eCompany,idStudent,idCitizen,tName,tSurname,username,password} = req.body;
        let status = null;
        DB.select(client,`SELECT * FROM public.users WHERE username IN ($1)`,[username],(err,user)=> {
            let data = user;
            if(err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                if (data) {
                    res.status(403).send(
                        {
                            msg: 'This email already use.'
                        }
                    );
                }
                else {
                    if(role === 'student'){
                        DB.select(client,`SELECT * FROM public.users WHERE id_student IN ($1)`,[idStudent],(err,jobceStudent)=> {
                            if(err){
                                res.status(500).send(err);
                            }
                            else {
                                if(jobceStudent) res.status(403).send(
                                    {
                                        msg:'This Student ID already use.'
                                    }
                                );
                                else {
                                    XCE.connect(role,'SELECT *  FROM r_student WHERE student_id ='+ idStudent+ ' AND citizen_id = \'' + idCitizen+'\' ' +';',(err,xceStudent)=>{
                                        if(err){
                                            res.status(500).send({msg:'db sql error'});
                                            console.log(err);
                                        }
                                        else {
                                            if(xceStudent){
                                                let {student_id,t_prename,t_name,t_surname,e_prename,e_name,e_surname,status,gender,birth_date,citizen_id} = xceStudent;
                                                DB.select(client,`INSERT INTO public.users (id_student,t_prename,t_name,t_surname,e_prename,e_name,e_surname,student_status,gender,birthdate,id_citizen,username,password,role,user_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,[student_id,t_prename,t_name,t_surname,e_prename,e_name,e_surname,status,gender,birth_date,citizen_id,username,password,role,1],(err,insertStudent)=> {
                                                    if(err) {
                                                        res.status(500).send(err);
                                                    }
                                                    else {
                                                        res.status(200).send(
                                                            {
                                                                msg: 'Signup successful'
                                                            }
                                                        );
                                                    }
                                                });   
                                            }
                                            else {
                                                res.status(403).send({msg:'no this student'});//ไม่แน่ใจว่า 403 หรือเปล่า
                                                console.log('no this student');
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                    else {
                        //role = company
                        if(role === 'company'){
                            //insert in table users, column role = company 
                            DB.select(client,`INSERT INTO public.users (t_name,t_surname,id_citizen,username,password,role,user_status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[tName,tSurname,idCitizen,username,password,role,0],(err,insertUser)=> {
                                if(err){
                                    res.status(500).send(err);
                                }
                                else {
                                    if(insertUser){
                                        //หาชื่อบริษัทใน pg db ก่อน ถ้าไม่เจอให้ insert
                                        DB.select(client,`SELECT * FROM public.companies WHERE _name IN ($1) AND e_name IN ($2)`,[tCompany,eCompany],(err,company)=> {
                                            if(err){
                                                //ลบ insert  public.users ก่อนหน้า
                                                
                                                res.status(500).send(err);
                                            }
                                            else{
                                                if(company){
                                                    DB.select(client,`INSERT INTO public.users_companies (cid,uid) VALUES ($1,$2) RETURNING *`,[company._id,insertUser._id],(err,insertUserCompany)=> {
                                                        if(err){
                                                            //ลบ insert  public.users
                                                            
                                                            res.status(500).send(err);
                                                        }
                                                        else res.status(200).send({msg:'sign up company successful, please wait admin to approve'});
                                                    });
                                                }
                                                else{
                                                    //insert row in table companies
                                                    DB.select(client,`INSERT INTO public.companies (t_name,e_name) VALUES ($1,$2) RETURNING *`,[tCompany,eCompany],(err,insertCompany)=> {
                                                        if(err){
                                                            //ลบ insert  public.users
                                                            res.status(500).send(err);
                                                        }
                                                        else{
                                                            if(insertCompany){
                                                                DB.select(client,`INSERT INTO public.users_companies (cid,uid) VALUES ($1,$2) RETURNING *`,[insertCompany._id,insertUser._id],(err,insertUserCompany)=> {
                                                                    if(err){
                                                                        //ลบ insert  public.users และ public.companies
                                                                        res.status(500).send(err);
                                                                    }
                                                                    else res.status(200).send({msg:'sign up company successful, please wait admin to approve'});
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                        
                                    }
                                    else res.status(500).send({msg:'can not create user company'})
                                }
                            });
                        }
                    }
                }
            }
        });
    },
    logout:function(req,res){
        //ลบ token ใน pg db อย่างเดียว ยังไม่ทำ local storage ใน nodejs
        let {token} = req.body;
        DB.select(client,`SELECT * FROM public.tokens WHERE token IN ($1)`,[token],(err,userToken)=> {
            if(err){
                res.status(500).send(err);
            }
            else {
                if(userToken){
                    DB.select(client,`DELETE FROM public.tokens WHERE token IN ($1) RETURNING *`,[token],(err,result)=> {
                        if(err) res.status(500).send(err);
                        else {
                            if(result) {
                               // console.log(result);
                               res.status(200).send({msg:'log out successful'})
                                
                            }
                            else res.status(500).send({msg:'no this token'});
                        }
                    });
                }
                else res.status(403).send({msg:'no this token'});
            }
        });
    },
    profile:function(req,res){
        let {token} = req.body;
        DB.select(client,`SELECT uid FROM public.tokens WHERE token IN ($1)`,[token],(err,userToken)=> {
            if(err){
                res.status(500).send(err);
            }
            else {
                if(userToken === null) res.status(403).send({msg:'not log in'});
                else{
                    // DB.multiSel(client,`SELECT position,company FROM public.experiences WHERE uid IN ($1)`,[userToken.uid],(err,userExp)=> {
                    //     if(err){
                    //         res.status(500).send(err);
                    //     }
                    //     else res.status(200).send(userExp);
                    // });
                    res.status(200).send({eName:"Kornkanok",eSurname:"Tantipantarak"});
                }
            } 
        });
    },

    del:function(req,res){
        let {id} = req.body;
        DB.del(client,`DELETE FROM public.users WHERE _id = `+ id +` RETURNING *`,(err,result)=> {
             if(err) res.status(500).send(err);
             else res.status(200).send(result);
        });
    }


/********************************************end services**********************************************/
}
