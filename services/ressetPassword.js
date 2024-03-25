ressetPassword = ()=> {
    let users = []
    let username = document.getElementById("name_resset").value;
    let password = document.getElementById("password_resset").value;
    let user = {
        name:username,
        password: password
    }
    
    if(username.trim()=="" || password.trim()==""){
        alert("vous avez des champs vides ou incorrects!");
        return false
    }else{
        let users_storage = localStorage.getItem("users")?.toString()       
        if(users_storage){
            let users_save = JSON.parse(users_storage)
            users = [...users_save]
            let valid = users.find(user=>(user.name === username))
            if(valid !==undefined){
                valid.password = user.password
            }else{
                alert("Nom d'utilisateur incorrect. Car cet utilisateur n'existe pas en BD");
                return false
            }
        }
        localStorage.setItem('users', JSON.stringify(users));
        alert("Mot de passe modifier avec succès.");
        return true
    }
   
}

resset_password = (e)=>{
    if(ressetPassword()){

    }else{
        e.preventDefault()
    }
}