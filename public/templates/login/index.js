Template.Login.onRendered(function(){
});
Template.Login.events({
    'submit #login_form' (e,t) {
        e.preventDefault();
        let username = e.target.username.value,
            password = e.target.password.value;
        if(username.replace(' ','') && password.replace(' ','')) {
            $.post(
                "http://localhost:3000/api/v1/isMember",
                { username, password }
            ).done( data =>{
                //เก็บ token role ไว้ใน localstorage
                let {token,role,tName,tSurname} = data;
                localStorage.setItem('token',token);
                localStorage.setItem('role',role);
                localStorage.setItem('tName',tName);
                localStorage.setItem('tSurname',tSurname);
                //redirect หน้าไปที่ index
                App.redirect("public.index");
            }).fail( data=>{
                console.log(data.responseText)
            })
        }
    }
});
Template.Login.onDestroyed(function (){
    console.log("destroy login");

});
