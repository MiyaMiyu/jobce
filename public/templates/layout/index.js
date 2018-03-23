// Template.Layout.helpers({
//     data1(){
//         console.log(this);
//         let {name} = this;
//         if (name == 'kik') return 'kornkanok';
//         else return 'srawoot'
//     }
// });
Template.Layout.onRendered(function(){
    console.log(this.data);
});

Template.Layout.events({
    'click #logout'(e,t){
        console.log("events",t.data);
        //ไปลบ token ใน nodejs 
        //ลบ token ใน localstorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('tName');
        localStorage.removeItem('tSurname');
        //เปลี่ยนหน้าไปหน้า home guest
        App.redirect("public.index");
    }
});