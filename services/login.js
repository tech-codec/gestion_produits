login = ()=> {
    let username = document.getElementById("name").value;
    let password = document.getElementById("password").value;
    let users_Storage = localStorage.getItem('users')?.toString()
    
    if(users_Storage){
        let users = JSON.parse(users_Storage)
        let valid = users.find(user=>(user.name === username && user.password === password) )
        if(valid !==undefined){
            // Créer un cookie pour se souvenir de la connexion
            //document.cookie = "username=" + username;
            setCookie("username", username, 30);
            return true
        }else{
            alert("Nom d'utilisateur ou mot de passe incorrect.");
            return false
        }
    }
    
}

connexion = (e)=>{
    if(login()){

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
  
  
  




