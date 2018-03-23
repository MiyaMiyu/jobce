Template.editProfile.onRendered(function(){
    let token = localStorage.getItem('token');
    $.post(
        "http://localhost:3000/api/v1/profile",
        { token }
    ).done( data =>{
            $('#eName').append(
                data.eName);
    }).fail( data=>{
        console.log(data.responseText)
    })
});

Template.editProfile.onDestroyed(function(){
    console.log("destroy edit profile");
});