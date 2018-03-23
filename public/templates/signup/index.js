// Template.SignUp.onRendered(function (){
//     console.log(this.data);
//     this.custom = 1;
//     // var ele = document.getElementById('BtnLinkedIn');
//     // // ele.onclick = function(){ console.log("AAAA")}
//     this.$("#BtnLinkedIn").click(function(e){   
//         console.log(e);
//         console.log("You Click LinkedIn Btn!");
//     });
// });

// Template.SignUp.onDestroyed(function (){
//     console.log("Destroy Signup");
//     console.log(this.custom);
// });

// Template.SignUp.events({
//     'click #BtnLinkedIn'(e,t){
//         console.log("events",t.data);
//     }
// });

Template.SignUp.onRendered(function(){
    $(document).ready(function () {
        $(".select").addClass("collapse");
        $("#role").change(function () {
            var selector = '.' + $(this).val();
            $(".select").collapse("hide");
            $(".select").collapse("dispose");
            $(selector).collapse("show");

            if(selector === '.company'){
                $('#idStudent').prop('required',false);
                $('#tCompany,#eCompany,#tName,#tSurname').prop('required',true);
            }
            else if(selector === '.student'){
                $('#tCompany,#eCompany,#tName,#tSurname').prop('required',false);
                $('#idStudent').prop('required',true);
            }
            else  $('#tCompany,#eCompany,#tName,#tSurname,#idStudent').prop('required',false);
        });
    });
});

// Template.SignUp.onRendered(function(){
//     $('#role').change(function () {
//         console.log(this.value);
//         if(this.value === 'company') {
//             $('.student').remove();  
//             $('.' + this.value).append('<label><h6>ข้อมูลบริษัท</h6></label>');
//         }
//         else if(this.value === 'student'){
//             $('.company').remove();

//     }
// });
// });

Template.SignUp.events({
     'submit #formSignup' (e,t) {
         e.preventDefault();
         let username = e.target.username.value,
             password = e.target.password.value,
             role = e.target.role.value,
             idCitizen = e.target.idCitizen.value,
             tName = e.target.tName.value,
             tSurname = e.target.tSurname.value,
             tCompany = e.target.tCompany.value,
             eCompany = e.target.eCompany.value,
             idStudent = e.target.idStudent.value;
            
         if(username.replace(' ','') && password.replace(' ','')) {
             $.post(
                 "http://localhost:3000/api/v1/signup",
                 {role,tCompany,eCompany,idStudent,idCitizen,tName,tSurname,username,password}
             ).done( data =>{
                console.log(data.msg)
                App.redirect("public.login");
    //             //เก็บ token role ไว้ใน localstorage
    //             let {msg} = data;
    //             localStorage.setItem('token',token);
    //             localStorage.setItem('role',role)
    //             //redirect หน้าไปที่ index
    //             App.redirect("public.index");
             }).fail( data=>{
                 console.log(data.responseText)
             })
         }
     }
});
Template.SignUp.onDestroyed(function (){
    console.log("destroy signup");
});
