signup = ()=> {
    let users = []
    let username = document.getElementById("name").value;
    let useremail = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let user = {
        name:username,
        email: useremail,
        password: password
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(username.trim()=="" || !emailPattern.test(useremail) || password.trim()==""){
        alert("vous avez des champs vides ou incorrects!");
        return false
    }else{
        let users_storage = localStorage.getItem("users")?.toString()
        if(users_storage){
            let users_save = JSON.parse(users_storage)
            users = [...users_save]
        }
        users.push(user)
        localStorage.setItem('users', JSON.stringify(users));
        setCookie("username", username, 30);
        alert("Compte créé avec succès!");
        return true
    }
   
}

enregistrer = (e)=>{
    if(signup()){

    }else{
        e.preventDefault()
    }
}

function setCookie(cookieName, cookieValue, expirationDays) {
    var date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    var path = "path=/"; // Définir le chemin du cookie sur le chemin de base "/"
    document.cookie = cookieName + "=" + cookieValue + "; " + expires + "; " + path;
}