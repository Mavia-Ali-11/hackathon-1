let db = firebase.firestore();

var userRole = document.getElementsByName("userRole");
var emailInp = document.getElementById("emailInp");
var passwordInp = document.getElementById("passwordInp");
var pswRepeat = document.getElementById("pswRepeat");
var resName = document.getElementById("resName");
var username = document.getElementById("username");
var phonenum = document.getElementById("phonenum");
var restaurantWrapper = document.getElementById("restaurantWrapper");
var cutsomerWrapper = document.getElementsByClassName("cutsomerWrapper");
var country = document.getElementById("country");
var cities = document.getElementsByName("cities");
var itemName = document.getElementsByName("itemName");
var price = document.getElementsByName("price");
var foodCategory = document.getElementsByName("foodCategory");
var deliveryType = document.getElementsByName("deliveryType");

function signup() {
  if (passwordInp.value == pswRepeat.value) {
    firebase.auth().createUserWithEmailAndPassword(emailInp.value, passwordInp.value)
      .then((userCredential) => {
        let user = userCredential.user;

        if (checkUserRole() == "restaurant") {
          var newUser = {
            userRole: checkUserRole(),
            uid: user.uid,
            email: emailInp.value,
            restaurant: resName.value,
            country: country.value,
            city: checkCity()
          }

          db.collection('restaurant').doc(user.uid).set(newUser)
            .then(() => {
              checkUserScopes(null);
              alert("Your restaurant has been registered successfully");
            })
        }
        else if (checkUserRole() == "customer") {
          var newUser = {
            uid: user.uid,
            userRole: checkUserRole(),
            username: username.value,
            email: emailInp.value,
            phonenumber: phonenum.value,
            country: country.value,
            city: checkCity()
          }

          db.collection('customer').doc(user.uid).set(newUser)
            .then(() => {
              checkUserScopes(null);
              alert("Signup successfully");
            })
        }
      })
      .catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
      });
  }
  else {
    alert("Password doesn't match in both fields");
  }
}

function checkUserRole() {
  var selectedRole;
  for (var i = 0; i < userRole.length; i++) {
    if (userRole[i].checked) {
      selectedRole = userRole[i].value;
    }
  }
  return selectedRole;
}

function checkCity() {
  var cities = document.getElementsByClassName("cities");
  for (var i = 0; i < cities.length; i++) {
    if (cities[i].hidden == false) {
      var selectedCity = cities[i].value;
    }
  }
  return selectedCity;
}

function swapRoles(elem) {
  if (elem.value == "restaurant") {
    cutsomerWrapper[0].hidden = true;
    cutsomerWrapper[1].hidden = true;
    restaurantWrapper.hidden = false;
  }
  else {
    restaurantWrapper.hidden = true;
    cutsomerWrapper[0].hidden = false;
    cutsomerWrapper[1].hidden = false;
  }
}

function swapCities(elem) {
  var cities = document.getElementsByClassName("cities");
  if (elem.value == "Pakistan") {
    cities[1].hidden = true;
    cities[2].hidden = true;
    cities[3].hidden = true;
    cities[0].hidden = false;
  }
  else if (elem.value == "India") {
    cities[0].hidden = true;
    cities[2].hidden = true;
    cities[3].hidden = true;
    cities[1].hidden = false;
  }
  else if (elem.value == "Saudia Arabia") {
    cities[0].hidden = true;
    cities[1].hidden = true;
    cities[3].hidden = true;
    cities[2].hidden = false;
  }
  else {
    cities[0].hidden = true;
    cities[1].hidden = true;
    cities[2].hidden = true;
    cities[3].hidden = false;
  }
}

function signin() {
  firebase.auth().signInWithEmailAndPassword(emailInp.value, passwordInp.value)
    .then((userCredential) => {
      let user = userCredential.user;
      var docRef = db.collection("restaurant").doc(user.uid);
      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data().userRole);
          checkUserScopes(doc.data().userRole);
        } else {
          if (doc.data() == undefined) {
            var docRef = db.collection("customer").doc(user.uid);
            docRef.get().then((doc) => {
              if (doc.exists) {
                console.log("Document data:", doc.data().userRole);
                checkUserScopes(doc.data().userRole);
              } else {
                console.log("No such document!");
              }
            }).catch((error) => {
              console.log("Error getting document:", error);
            });
          }

        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

    })
    .catch((error) => {
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function signout() {
  firebase.auth().signOut()
    .then(() => {
      checkUserScopes(null);
    }).catch((error) => {
      console.log(error)
    });
}

function checkUserScopes(userRole) {
  firebase.auth().onAuthStateChanged((user) => {
    let pageLocArr = window.location.href.split('/');
    let pageName = pageLocArr[pageLocArr.length - 1];
    let authenticatedPages = ['dashboard.html', "customer.html"];

    if (user && authenticatedPages.indexOf(pageName) === -1 && (checkUserRole() == 'restaurant' || userRole == 'restaurant')) {
      window.location.replace('./dashboard.html');
    }
    else if (user && authenticatedPages.indexOf(pageName) === -1 && (checkUserRole() == 'customer' || userRole == 'customer')) {
      window.location.replace('./customer.html');
    }
    else if ((!user && pageName === 'dashboard.html') || (!user && pageName === 'customer.html')) {
      window.location.replace('./index.html');
    }
  });
}

// Dasboard

function changeTabs(tabIndex) {
  var tabSections = document.getElementsByClassName("tabSections");
  var tabLink = document.getElementsByClassName("tabLink");

  for (var i = 0; i < tabSections.length; i++) {
    if (tabIndex != i) {
      tabSections[i].hidden = true;
      tabLink[i].classList.remove("active")
    }
    else {
      tabSections[tabIndex].hidden = false;
      tabLink[tabIndex].classList.add("active");
    }
  }
}

function addDishToMenu() {
  var newDish = {
    userRole: checkUserRole(),
    uid: user.uid,
    itemName: itemName.value,
    price: price.value,
    foodCategory: foodCategory.value,
    deliveryType: deliveryType.value
  }

  if (itemName.value != "" || price.value != "") {
    db.collection('dishes').doc(user.uid).set(newDish)
      .then(() => {
        checkUserScopes(null);
        alert("Your dish has been added successfully");
      })
  }
  else {
    alert("Please fill all fields to add items.")
  }
}

// Customer page

// Store - Navbar

var navbarClose = true;
function openNavbar() {
    var navbar = document.getElementById('navbar');
    var header = document.getElementsByClassName('header')[0];
    if(navbarClose) {
        navbar.hidden = false
        header.style.backgroundColor = "#f2f2f2";
        navbarClose = false;
    }
    else {
        navbar.hidden = true;
        header.style.backgroundColor = "transparent";
        navbarClose = true;
    }
}

// Store - Product details

function showDetails(elem, targetDiv) {
    var targetDiv = document.getElementById(targetDiv);
    if(elem.innerHTML == 'More details') {
        targetDiv.style.overflow = 'auto';
        targetDiv.scrollTop = targetDiv.scrollHeight;
        elem.innerHTML = 'Less details';
    }
    else {
        targetDiv.scrollTop = 0;
        targetDiv.style.overflow = 'hidden';
        elem.innerHTML = 'More details';
    }
}