/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';
import { currentUser } from './homepage.js';   
import { redirectToHomepage } from './homepage.js';
import { signout } from './homepage.js';
import { supabase } from './homepage.js';

document.addEventListener("DOMContentLoaded", redirectToHomepage);
var user = await (async () => {
    var user = await currentUser();
    console.log("This current user:", user);
    const userNameElement = document.getElementById("user-name");
    userNameElement.textContent = user.username || "Guest"; // default to "Guest" if no username
    return user;
})(); 
// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data array
    
    let index = 0;
    for (let game of games) {
        
        index++;
        console.log(game,index);
        
    }
        let elements = [];

        // create a new div element, which will become the game card
    for (let game of games) {
        
        let element=document.createElement("div");
        elements.push(element);
        
     

        // add the class game-card to the list
        
        element.classList.add("game-card");



        // set the inner HTML using a template literal to display some info 
        // about each game
        element.innerHTML = `
        <div class='game-img-card'>
            <img class='game-img' src="${game.img}" alt="${game.name}" />
            <img class='save-icon' src="assets/bookmark.png" alt="Save icon" aria-hidden="true"/>
        </div>
            <h2 class='game-name'>${game.name}</h2>
            <p class='game-description'>${game.description}</p>
            <p class='game-pledged'>Pledged: $${game.pledged.toLocaleString()}</p>
            <p class='game-goal'>Goal: $${game.goal.toLocaleString()}</
            p>
            <p class='game-backers'>Backers: ${game.backers.toLocaleString()}</p>
        `;  
         

         
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")

        // append the game to the games-container
        gamesContainer.appendChild(element);

}
loader();
clickHandler();
}
addGamesToPage(GAMES_JSON); // call the function to add the games to the page

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/


// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((total, game) => total + game.backers, 0);


// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
    
    <p class="card-value">${totalContributions.toLocaleString()}</p>`;


// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `
    
    <p class="card-value">$${totalRaised.toLocaleString()}</p>`;



// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.length;
gamesCard.innerHTML = `
    <p class="card-title">Total Games:${totalGames}</p>`


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);
    console.log(unfundedGames);





    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);


}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);
    console.log(fundedGames);


    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);

}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games

const unfundedGamesCount = GAMES_JSON.filter(game => game.pledged < game.goal).length;



// create a string that explains the number of unfunded games using the ternary operator

const displaystr= `A total of $${totalRaised.toLocaleString()} has been raised for ${totalGames} ${totalGames>1?'games':'game'}. Currently, ${unfundedGamesCount} ${unfundedGamesCount>1?'games':'game'} remain unfunded.`;


// create a new DOM element containing the template string and append it to the description container
const descriptionElement = document.createElement("p");
descriptionElement.innerHTML = displaystr;
descriptionContainer.appendChild(descriptionElement);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
var [topGame, runnerUpGame, ...rest] = sortedGames;
console.log(...rest);
console.log(topGame, runnerUpGame);

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameElement=document.createElement("p");
firstGameElement.innerHTML = `
    <strong>${topGame.name}</strong> - $${topGame.pledged.toLocaleString()} pledged
`;

firstGameContainer.appendChild(firstGameElement);


// do the same for the runner up item
const secondGameElement=document.createElement("p");
secondGameElement.innerHTML = `
    <strong>${runnerUpGame.name}</strong> - $${runnerUpGame.pledged.toLocaleString()} pledged
`;

secondGameContainer.appendChild(secondGameElement);
//implement and add a search bar to the page
/************************************************************************************
 * Challenge 8: Implement a search function to find games by name
 * Skills used: DOM manipulation, filter, event listeners
*/




var searchInput = document.getElementById("search-bar");
// implement a search function that allows users to search for a game by name
function searchGames() {
    // grab the search input element
    
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    console.log(searchTerm);

    // filter the games based on the search term
    const filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchTerm));
     
    // clear the games container and add the filtered games to the page
    deleteChildElements(gamesContainer);
    addGamesToPage(filteredGames);
      // Re-attach click handlers to save icons after filtering
}
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
searchGames();
searchInput.addEventListener("input", addGamesToUl);
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchGames();
        // clickHandler(); // Call clickHandler to add event listeners to save icons

          
    }
}); 
 

const signoutBtn = document.getElementById("signout-btn");
signoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        await signout();
        location.href = "homepage.html"; // redirect to homepage after sign-out
        
    } catch (error) {
        console.error("Sign out failed:", error);
    }
});
async function saveGame(gameName, saveIcon) {
    const { data, error } = await supabase.from("saved_games").select('game_name').eq('user_id', user.id);

    // Check if the game is already saved
    const storage =  JSON.stringify(data)  || [];

    console.table(`Print out:${data.length}   first data, ${storage} `);
    var collector=new Set(); 
    if (data.length === 0) {
        console.log(`No saved games found for user: ${user.id}`);
        const { data, error } = await supabase.from("saved_games").insert({ game_name: [gameName], user_id: user.id, user_name: user.username, updated_at: new Date().toISOString() });
    }
    else{
        console.log(`Saved games found for user: ${user.id}`);
        for (const item of data[0].game_name) {
            console.log(`Game name: ${item }`);
            collector.add(item );
        }

     

        if (!(collector.has(gameName))) {
            // If not saved, save the game
            const { data, error} = await supabase.from("saved_games").update({game_name: [...collector, gameName], updated_at: new Date().toISOString()}).eq('user_id', user.id);
            console.log(`user_id: ${user.id}, username: ${user.username}`);
            console.log(`Game ${gameName} saved successfully!`);
             
            if (!!error) {
                console.error('Insert failed', { status, code: error.code, message: error.message, details: error.details, hint: error.hint });
                return;
            }

        }
        else{
            console.log(await supabase.from("saved_games").select('game_name') );
        }
    }
    saveIcon.src = "assets/saved-icon.png"; // Change icon to filled
    console.log(`Game ${gameName} saved successfully!`);
    const {data: go, error: stop} = await supabase.from("saved_games").select('game_name').eq('user_id', user.id);
    console.log(go[0].game_name);

     
}    
async function deleteSavedGame(gameName) {
    const { data, error } = await supabase.from("saved_games").select('game_name').eq('user_id', user.id);

    if (error) {
        console.error("Error fetching saved games:", error);
        return;
    }

    const gameToDelete = data.find(item => item.game_name === gameName);
    if (gameToDelete) {
        const { error: deleteError } = await supabase.from("saved_games").delete().eq('id', gameToDelete.id);
        if (deleteError) {
            console.error("Error deleting saved game:", deleteError);
        } else {
            console.log(`Game deleted successfully: ${gameName}`);
        }
    } else {
        console.log(`Game not found: ${gameName}`);
    }
}
async function loader(){
    var gamecardsave = document.querySelectorAll(".game-img-card> img.save-icon");
    const { data, error } = await supabase.from("saved_games").select('game_name').eq('user_id', user.id);
    gamecardsave.forEach((saveIcon) => {
        const gameName = saveIcon.closest('.game-card').querySelector('img.game-img').alt;
        console.log(gameName); 
        if (!!data && data.length > 0) {
            const isSaved = data[0].game_name.includes(gameName);
            if (isSaved) {
                saveIcon.src = "assets/saved-icon.png"; // Change icon to filled
            } else {
                saveIcon.src = "assets/bookmark.png"; // Change icon to empty
            }
        } else {
            saveIcon.src = "assets/bookmark.png"; // Default to empty icon if no saved games
        }


    });


}

function clickHandler(){
    var gamecardsave = document.querySelectorAll(".game-img-card> img.save-icon");
    gamecardsave.forEach((saveIcon) => {
         
        saveIcon.addEventListener("click", (e) => {
            const gameName = e.target.closest('.game-card').querySelector('img.game-img').alt;
            console.log(gameName); 


            console.log(`Save icon clicked for game: ${gameName}`);
            console.log(`Save icon src: ${saveIcon.src}`);
            if (saveIcon.src=== "http://127.0.0.1:5500/assets/saved-icon.png") {
                deleteSavedGame(gameName);
                saveIcon.src = "assets/bookmark.png"; // Change icon to empty
            }
            else {
                console.log(`Saving game: ${gameName}`);
                saveGame(gameName, saveIcon);
            }
             
            // Update alt text
        });
    });
} 
// Attach click handlers to save icons

let arr=[1,2,3,4,5,6,7,8,9,10];
const dict={};
for (let num of arr) {

    dict[num] = num * num;
}
if (10 in dict) {
    console.log(`The square of 5 is ${dict[10]}`);
}
arr.splice(0, 5);
while(dict && Object.keys(dict).length > 0) {
    let key = Object.keys(dict)[0];
    console.log(`The square of ${key} is ${dict[key]}`);
    delete dict[key];
}
arr.push(11, 12, 13);
arr.pop();
arr.push(14, 15);
var anotherArray = [];
console.log(anotherArray.length)

arr.coun
 
let i= 0;
for (let item of arr.slice(i , arr.length)){
    console.log(item);
    i++;
}
console.log(`The final array is: ${arr},${typeof arr}`);
arr.values()

arr.includes(10) ? console.log("10 is in the array") : console.log("10 is not in the array");

arr.filter(item => item > 5).forEach(item => console.log(`Filtered item: ${item}`));
console.log(arr.filter(item => item > 5));
console.log(dict[-1]== undefined);
