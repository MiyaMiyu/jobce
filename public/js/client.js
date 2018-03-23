//use hashbang
App.baseRoute('/#!');   //hashbang notation
App.routeOptions({      //enable hashbang 
    hashbang: true
});

//every page go to this
App.route('*', {
    name: 'middleware.template',
    before(ctx,next){
        console.log(`before ${ctx.path}`);  
        //token จาก localstorage จากหน้า login.js
        let token = localStorage.getItem('token');
        //ถ้ามี token
        if(token) {
            //สร้าง ไฟล์ json เก็บข้อมูลที่จำเป็นหรือข้อมูลที่ใช้โหลดหน้าบ่อยๆ เช่นข้อมูล user
            let user = {
                token,
                role:localStorage.getItem('role'),
                tName:localStorage.getItem('tName'),
                tSurname:localStorage.getItem('tSurname')
            }
            ctx.user = user;  // แนบ user ไปกับ ctx เพื่อใช้งานกับทุก template
            console.log(user.tName);
            next();
        }
        //ถ้าไม่มี token role
        else {
            console.log(ctx.path); 
            //เลือก path ถ้า path ไปไหนก็ไปตามนั้น
            switch(ctx.path){
                case '/':
                case '/login':
                case '/signup':
                case '/profile': //ต้องเอาออก ตอนนี้เทสก่อน
                case '/editProfile': //ต้องเอาออก ตอนนี้เทสก่อน
                next();
                break;  
                default : console.log("eiei"); 
                this.redirect('public.login');
            } 
        } 
    },
    action(ctx,next){
        Template.Layout.render('body',{
            user:ctx.user
        }); //render template layout file to body
        next();
    },
    after(ctx,next){
        console.log(`after ${ctx.path}`);  //
        next();             //only middleware use next();
    }
})

App.route('/',{
    name: 'public.index', 
    before(ctx,next){
        next();
    },
    action(ctx){
        console.log("Home");
          //render template layout file to body
        Template.Home.render('#MainContainer');
    }
});

App.route('/signup',{
    name: 'public.signup', 
    before(ctx,next){
        next();
    },
    action(ctx){
        console.log("Sign Up");
          //render template layout file to body

        Template.SignUp.render('#MainContainer',{
            name:"kik"   //pass data to template
        });
    },
    after(ctx,next){
        Template.SignUp.destroy();
        next();
    }
});

App.route('/login',{
    name: 'public.login', 
    before(ctx,next){
        next();
    },
    action(ctx){
        console.log("Login");
          //render template layout file to body
        Template.Login.render('#MainContainer');
    },
    after(ctx,next){
        Template.Login.destroy();
        next();
    }
});

App.route('/jobposting',{
    name: 'public.jobposting', 
    before(ctx,next){
        next();
    },
    action(ctx){
        console.log("JobPosting");
          //render template layout file to body
        Template.JobPosting.render('#MainContainer',{
            jobList:[
                {
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework1",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework2",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework3",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework4",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework5",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework6",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework1",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework2",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework3",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework4",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework5",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework6",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },
            ]
        });
    }
});

App.route('/posts',{
    name: 'public.posts', 
    before(ctx,next){
        next();
    },
    action(ctx){
        console.log("View Posting");
          //render template layout file to body
        Template.Query.render('#MainContainer',{
            jobList:[
                {
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework1",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework2",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework3",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework4",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework5",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework6",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework1",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework2",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework3",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework4",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework5",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },{
                    img: "img/corp.jpg",
                    title: "เขียนเว็บไซต์ เว็บแอ็ปพลิเคชั่นด้วย Framework6",
                    detail: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
                    update: "Last updated 3 mins ago"
                },
            ]
        });
    }
});

App.route('/profile',{
    name: 'private.profile', 
    before(ctx,next){
        next();
    },
    action(ctx){
        console.log("Profile");
          //render template layout file to body
        Template.Profile.render('#MainContainer',{
            user:ctx.user   //let user object insert in this template
        });
    },
    after(ctx,next){
        Template.Profile.destroy();
        next();
    }
});

App.route('/editProfile',{
    name: 'private.editProfile', 
    before(ctx,next){
        next();
    },
    action(ctx){
        console.log("Profile");
          //render template layout file to body
        Template.editProfile.render('#MainContainer');
    },
    after(ctx,next){
        Template.editProfile.destroy();
        next();
    }
});


App.startup(function(){
    console.log('hello');
    this.setLanguage('th');
    console.log(localStorage);
});