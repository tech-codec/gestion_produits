let dbPromise = indexedDB.open("stockDB", 2);

dbPromise.onupgradeneeded = function(event) {
    let db = event.target.result;
    let objectStore = db.createObjectStore("ventes", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("name_customer", "name_customer", { unique: false });
    objectStore.createIndex("name_product", "nom_product", { unique: false });
    objectStore.createIndex("price", "price", { unique: false });
    objectStore.createIndex("quantities", "quantities", { unique: false });
    objectStore.createIndex("date", "date", { unique: false });
};


showModal_new = ()=>{
    restoreFormData()
    document.getElementById("new_Dialog").showModal()
}

showModal_edit = ()=>{
  document.getElementById("edit_Dialog").showModal()
}

addVente = () => {
    let name_customer = document.getElementById("name_customer").value
    let name_product = document.getElementById("name_product").value
    let price = document.getElementById("price").value
    let quantities = document.getElementById("quantities").value
    let date = document.getElementById("date").value

    let vente = {
      name_customer: name_customer,
      name_product: name_product,
      quantities: quantities,
      price:price,
      date: date
    }


    let transaction = dbPromise.result.transaction(["ventes"], "readwrite");
    let objectStore = transaction.objectStore("ventes");

    if(name_customer.trim()=="" || 
    name_product.trim()=="" || 
    price.trim()=="" || 
    quantities.trim()=="" || 
    date.trim()==""){
      alert("vous avez des champs vides ou incorrects!");
    }else{
      //sessionStorage.setItem("vente", JSON.stringify(vente))
      let request = objectStore.add({ 
        name_customer: name_customer, 
        nom_product: name_product, 
        price: price, 
        quantities: quantities, 
        date: date});
        request.onsuccess = function(event) {
          console.log("Vente ajouté avec succès à IndexedDB");
          displayVentes();
        };
    
        request.onerror = function(event) {
          console.log("Erreur lors de l'ajout du produit à IndexedDB");
        };
    }

}
 
displayVentes = ()=>{
    let tbodyVentes = document.getElementById("list_ventes")
    tbodyVentes.innerHTML = ""

    let transaction = dbPromise.result.transaction(["ventes"], "readonly");
    let objectStore = transaction.objectStore("ventes");
    let request = objectStore.openCursor();

    request.onsuccess = function(event) {
      let cursor = event.target.result;
      if (cursor) {

        let tr = document.createElement("tr")
        let td_1 = document.createElement("td")
        td_1.setAttribute("class","ecfec_vente")

        let td_2 = document.createElement("td")
        td_2.textContent = cursor.value.name_customer

        let td_3 = document.createElement("td")
        td_3.textContent = cursor.value.nom_product

        let td_4 = document.createElement("td")
        td_4.textContent =  separateHundreds(Number(cursor.value.price)) +" FCFA"

        let td_5 = document.createElement("td")
        td_5.textContent = cursor.value.quantities

        let td_6 = document.createElement("td")
        td_6.textContent = cursor.value.date

        let td_7 = document.createElement("td")
        let btn_edit = document.createElement("button")
        btn_edit.textContent = "Modifier"
        btn_edit.setAttribute('id', "edit")
        let btn_delete = document.createElement("button")
        btn_delete.textContent = "Supprimer"
        btn_delete.setAttribute("id", "delete")
        const key = cursor.key
        const vente = cursor.value
        btn_edit.onclick = ()=>{
          editVente(key, vente)
        }
        btn_delete.onclick = ()=>{
          let conf = confirm("voulez-vous vraiment supprimer cette vente?")
          if(conf)
            deleteVente(key)
        }

        tr.appendChild(td_1)
        tr.appendChild(td_2)
        tr.appendChild(td_3)
        tr.appendChild(td_4)
        tr.appendChild(td_5)
        tr.appendChild(td_6)
        td_7.appendChild(btn_edit)
        td_7.appendChild(btn_delete)
        tr.appendChild(td_7)
        tbodyVentes.appendChild(tr)
        reorderIds()
        cursor.continue();

      }
    };
  }


  modal_close = ()=>{
    let name_customer = document.getElementById("name_customer").value
    let name_product = document.getElementById("name_product").value
    let price = document.getElementById("price").value
    let quantities = document.getElementById("quantities").value
    let date = document.getElementById("date").value

    let vente = {
      name_customer: name_customer,
      name_product: name_product,
      quantities: quantities,
      price:price,
      date: date
    }
    sessionStorage.setItem("vente", JSON.stringify(vente))
    document.getElementById("new_Dialog").close();
    displayVentes()
}

editVente = (id, venteDatabase)=>{
  if(venteDatabase){
    let venteId = document.getElementById("venteId_edit")
    let name_customer = document.getElementById("name_customer_edit")
    let name_product = document.getElementById("name_product_edit")
    let price = document.getElementById("price_edit")
    let quantities = document.getElementById("quantities_edit")
    let date = document.getElementById("date_edit")
    venteId.value = id
    name_customer.value = venteDatabase.name_customer
    name_product.value = venteDatabase.nom_product
    price.value = venteDatabase.price
    quantities.value = venteDatabase.quantities
    date.value = venteDatabase.date
    showModal_edit()
  }else{
    console.log("la vente n'existe pas")
  }
}

updateVente = ()=>{

  let venteId = Number(document.getElementById("venteId_edit").value) 
  let name_customer = document.getElementById("name_customer_edit").value
  let name_product = document.getElementById("name_product_edit").value
  let price = document.getElementById("price_edit").value
  let quantities = document.getElementById("quantities_edit").value
  let date = document.getElementById("date_edit").value

  console.log("la clé du produit est "+venteId)

  let transaction = dbPromise.result.transaction(["ventes"], "readwrite");
  let objectStore = transaction.objectStore("ventes");
  let request = objectStore.get(venteId);

  request.onsuccess = function(event) {
    if(name_customer.trim()=="" || 
    name_product.trim()=="" || 
    price.trim()=="" || 
    quantities.trim()=="" || 
    date.trim()==""){
      alert("vous avez des champs vides ou incorrects!");
    }else{
      let venteDataBase = event.target.result;
      venteDataBase.name_customer = name_customer;
      venteDataBase.nom_product = name_product;
      venteDataBase.price = price;
      venteDataBase.quantities = quantities;
      venteDataBase.date = date
      let updateRequest = objectStore.put(venteDataBase);

      updateRequest.onsuccess = function(event) {
        console.log("vente mis à jour avec succès dans IndexedDB");
        displayVentes();
      };

      updateRequest.onerror = function(event) {
        console.log("Erreur lors de la mise à jour de la vente dans IndexedDB");
      };
    }
    
  };

  request.onerror = function(event) {
    console.log("Erreur lors de la récupération de la vente à mettre à jour");
  };
}


deleteVente = (venteId)=>{
  let transaction = dbPromise.result.transaction(["ventes"], "readwrite");
  let objectStore = transaction.objectStore("ventes");
  let request = objectStore.delete(venteId);

  request.onsuccess = function(event) {
    console.log("Produit supprimé avec succès de IndexedDB");
    displayVentes();
  };

  request.onerror = function(event) {
    console.log("Erreur lors de la suppression du produit de IndexedDB");
  };
}


function separateHundreds(number) {
  if (typeof number !== 'number') {
    return "Veuillez fournir un nombre valide.";
  }

  // Convertir le nombre en chaîne pour pouvoir travailler avec chaque chiffre individuellement
  var numberString = number.toString();
  
  // Déterminer la longueur de la chaîne de nombre
  var length = numberString.length;

  // Initialiser un tableau pour stocker les parties séparées
  var separatedParts = [];

  // Parcourir la chaîne de nombre de droite à gauche pour séparer les centaines
  for (var i = length - 1; i >= 0; i--) {
    // Ajouter chaque chiffre au début du tableau séparé
    separatedParts.unshift(numberString[i]);

    // Si nous avons atteint un multiple de trois (en partant de la fin), ajouter une virgule à la liste séparée
    if ((length - i) % 3 === 0 && i !== 0) {
      separatedParts.unshift(",");
    }
  }

  // Convertir le tableau séparé en une chaîne et la renvoyer
  return separatedParts.join("");
}


// Fonction pour réorganiser les IDs après la suppression
function reorderIds() {
  let venteList = document.getElementsByClassName("ecfec_vente");
  for (let i = 0; i < venteList.length; i++) {
    let venteId = "vente_" + (i + 1); // Nouvel ID basé sur l'index
    venteList[i].setAttribute("id", venteId);
    venteList[i].textContent = ""
    venteList[i].textContent = ""+(i + 1)
  }
}


// Fonction pour restaurer les données du formulaire depuis sessionStorage
restoreFormData = ()=> {
  let vente_sessinStorage = sessionStorage.getItem('vente')?.toString();
  if (vente_sessinStorage) {
    let vente = JSON.parse(vente_sessinStorage);

    document.getElementById("name_customer").value = vente.name_customer
    document.getElementById("name_product").value = vente.name_product
    document.getElementById("price").value = vente.price
    document.getElementById("quantities").value = vente.quantities
    document.getElementById("date").value = vente.date

    // document.getElementById("name_customer").value = vente.name_customer
    // document.getElementById("name_product").value = vente.name_product
    // document.getElementById("price").value = vente.price
    // document.getElementById("quantities").value = vente.quantities
    // document.getElementById("date").value = vente.date

  }
}

// restoreFormData_save = ()=>{
//   document.getElementById("name_customer").value = ""
//   document.getElementById("name_product").value = ""
//   document.getElementById("price").value = ""
//   document.getElementById("quantities").value = ""
//   document.getElementById("date").value = ""
// }

// Function to logout a user
function logout() {
  // Remove the cookie 
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  console.log(document.cookie)
  alert("vous êtes déconnectée!")
}

function getCookiePath(cookieName) {
  var cookies = document.cookie.split(';'); // Divise la chaîne de cookies en un tableau

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim(); // Supprime les espaces en début et fin de chaque cookie
    if (cookie.startsWith(cookieName + "=")) {
      var cookieParts = cookie.split('='); // Divise le cookie en son nom et sa valeur
      return cookieParts[0].substr(cookieName.length + 1); // Retourne le chemin du cookie
    }
  }

  return null; // Retourne null si le cookie n'est pas trouvé
}



 // Fonction pour récupérer la valeur d'un cookie par son nom
 function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

redirection = ()=>{
  window.location.href = "../index.html";
}

// Vérifier si l'utilisateur est déjà connecté au chargement de la page
window.onload = function() {
  var loggedInUser = getCookie("username");
  if (loggedInUser) {
    displayVentes();
    restoreFormData();
  }else{
    redirection()
  }
};