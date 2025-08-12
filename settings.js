import GAMES_DATA from './games.js';
import { currentUser } from './homepage.js';   
import { redirectToHomepage } from './homepage.js';


// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const {username} = await currentUser();
console.log("This current user:", username);
const userNameElement = document.getElementById("user-name");
userNameElement.textContent = username || "Guest"; // default to "Guest" if no username


 
document.addEventListener("DOMContentLoaded", redirectToHomepage);