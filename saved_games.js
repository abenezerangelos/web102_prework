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
var searchInput = document.getElementById("search-bar");
// implement a search function that allows users to search for a game by name
 
// grab the search button and add an event listener to it
function addGamesToUl() {
    const UlElement = document.getElementById("search-menu");
    UlElement.hidden = false; // show the search menu
    const searchTerm = searchInput.value.toLowerCase().trim();
    console.log(searchTerm);  // filter the games based on the search term
    let filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().startsWith(searchTerm));
    if (searchTerm === "") {
        filteredGames =  [];
    }
    const ul = document.getElementById("search-menu");
    if (!ul) return;
    deleteChildElements(ul);
    filteredGames.forEach(game => {
        const li = document.createElement("li");
        li.id = "search-item";
        li.style.height = "40px";
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.position = "relative";

        const img = document.createElement("img");
        li.style.display = "flex";
        li.style.flexDirection = "row"; // Ensure the image and text are in a row
 
        img.src = game.img;
        img.style.width = "70px";
        img.style.height = "40px";
        img.style.marginRight = "10px";
        img.style.alignSelf = "center";
        img.alt = game.name;

        const saveIcon = document.createElement("img");
        saveIcon.className = "save-icon";
        saveIcon.src = "assets/bookmark.png";
        saveIcon.alt = "Save icon"; 

        li.appendChild(img); // Append the image first
        li.appendChild(saveIcon); // Append the save icon
        const textNode = document.createTextNode(game.name); // Create a text node for the game name
        li.appendChild(textNode); // Append the text after the image
        li.classList.add("dropdown-item");
        li.role = "button";
        li.tabIndex = 0; // Make it focusable
        li.addEventListener("click", () => {
            searchInput.value = game.name; // set the input value to the selected game name
            searchGames(); // call the search function to display the game
            ul.hidden = true; // hide the search menu after selection
        });
        ul.appendChild(li);
    });
}

searchInput.addEventListener("input", addGamesToUl);

const {username} = await currentUser();
console.log("This current user:", username);
const userNameElement = document.getElementById("user-name");
userNameElement.textContent = username || "Guest"; // default to "Guest" if no username


 
document.addEventListener("DOMContentLoaded", redirectToHomepage);

//table structure for saved games
async function displaySavedGames() {
    const user = await currentUser();
    if (!user) {
        redirectToHomepage();
        return;
    }
    const { data, error } = await supabase.from("saved_games").select('*').eq('user_id', user.id);
    if (error) {
        console.error("Error fetching saved games:", error);
        return;
    }
    
    const tableBody = document.getElementById("saved-games-table-body");
    deleteChildElements(tableBody); // clear existing rows

    data.forEach(game => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${game.game_name}</td>
            <td>${game.created_at}</td>
            <td>
                <button class="btn btn-danger delete-btn" data-game-name="${game.game_name}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async (e) => {
            const gameName = e.target.dataset.gameName;
            await deleteSavedGame(gameName);
            displaySavedGames(); // Refresh the saved games list
        });
    });
}