import GAMES_DATA from './games.js';
import { currentUser } from './homepage.js';   
import { redirectToHomepage } from './homepage.js';
import { loader,saveGame,scrolltoItem,deleteSavedGame,addGamesToUl,addSearchGamesClickHandler,searchGames,selectorDocument } from './index.js';
import { supabase } from './homepage.js'; 

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
  
// implement a search function that allows users to search for a game by name
 
// grab the search button and add an event listener to it
 

// searchInput.addEventListener("input", addGamesToUl);

const {username} = await currentUser();
console.log("This current user:", username);
const userNameElement = document.getElementById("user-name");
userNameElement.textContent = username || "Guest"; // default to "Guest" if no username


 
// document.addEventListener("DOMContentLoaded", redirectToHomepage);

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
    // deleteChildElements(tableBody); // clear existing rows
    console.log(data[0].game_name);
    data.forEach(game => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${game.game_name}</td>
            <td>${Date(game.updated_at).toString() }</td>
            <td>
                <button class="btn btn-danger delete-btn" data-game-name="${game.game_name}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

      
    const savedGamesGrid = document.getElementById("saved-games-grid");

    GAMES_JSON.forEach(game => {
    const gameCard = document.getElementById("games-container").content.cloneNode(true);
    gameCard.querySelector(".game-img").src = game.img;
    gameCard.querySelector(".game-title").textContent = game.name; 
    gameCard.querySelector(".progress-bar").style.width = `${game.progress}%`;
    gameCard.querySelector(".pledged").textContent = `$${game.pledged}`;
    gameCard.querySelector(".goal").textContent = `$${game.goal}`;
    gameCard.querySelector(".backers").textContent = game.backers;

    savedGamesGrid.appendChild(gameCard);
    });  
    selectorDocument(document); 
    addGamesToUl();



    // Add event listeners to delete buttons
    // document.querySelectorAll(".delete-btn").forEach(button => {
    //     button.addEventListener("click", async (e) => {
    //         const gameName = e.target.dataset.gameName;
    //         await deleteSavedGame(gameName);
    //         displaySavedGames(); // Refresh the saved games list
    //     });
    // });
} 
// displaySavedGames();
document.addEventListener("DOMContentLoaded",displaySavedGames());