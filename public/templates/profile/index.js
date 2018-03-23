Template.Profile.onRendered(function(){
    let token = localStorage.getItem('token');
    $.post(
        "http://localhost:3000/api/v1/profile",
        { token }
    ).done( data =>{
        //let exp = data;
        $.each(data, function( index, value ) {
            $('.exp').append(
                `<div class="card bg-light mb-1">
                    <div class="card-body">
                        <h5>`+data[index].position+`</h5>
                        <p class="card-text">`+data[index].company+`</p>
                    </div>
                </div>`);

          });

    }).fail( data=>{
        console.log(data.responseText)
    })
});

Template.Profile.onDestroyed(function(){
    console.log("destroy profile");

});