const listenToClick = async function() {
    document.addEventListener('click', function (event){
        const clickedTitle = event.target.closest('.js-game')
        if (clickedTitle){
            let gameTitle = clickedTitle.textContent;
            console.log(gameTitle)
        }
    })
}

const apiKey = "a839e6bdc7604e56bc2b77e17b377309";
const baseUrl = "https://api.rawg.io/api/games";

const getGames = async function() {
    const params = {
        key: apiKey,
        ordering: '-metacritic',  // Sort by metacritic score in descending order
        page_size: 40,             // Number of results to fetch
    };

    try {
        const url = new URL(baseUrl);
        url.search = new URLSearchParams(params).toString();
        const response = await fetch(url);
        const data = await response.json();

        // Extract relevant information (e.g., title) from fetched games
        const topGames = data.results.map(game => {
            return {
                title: game.name,
                rating: game.rating,
                metacritic: game.metacritic,
                released: game.released,
                background_image: game.background_image
            };
        });

        // Call function to display game titles
        showGames(topGames);

    } catch (error) {
        console.log('An error occurred:', error);
    }
};

const showGames = function(games) {
    const gameContainer = document.querySelector('.game-range'); // Assuming you have a container with class 'game-range'

    // Clear existing content (if any)
    gameContainer.innerHTML = '';

    // Loop through the games array and create elements to display titles
    games.forEach(game => {
        // Create a button element
        const button = document.createElement('button');
        button.className = 'c-game js-game';
        button.style.backgroundImage = `url(${game.background_image})`; // Set the background image of the button
        button.style.backgroundSize = 'cover'; // Make sure the background image covers the button    
        // Create a span element for game title
        const span = document.createElement('span');
        span.className = 'c-title js-title';
        span.textContent = game.title; // Set the text content to the game title

        // Append span to button
        button.appendChild(span);

        // Append button to container
        gameContainer.appendChild(button);
    });
};





function createGameButtons() {
    const container = document.querySelector('.game-range'); // Assuming you have a container in your HTML with id 'gameContainer'
    console.log(container)
    for (let i =2; i <= 40; i++) {
      const button = document.createElement('button');
      button.className = 'c-game js-game';
        const span = document.createElement('span');
      span.className = 'c-title js-title';
      span.textContent = `Game${i}`;
  
      button.appendChild(span);
  
      container.appendChild(button);
    }
  }





const init = function(){
    // createGameButtons()

    listenToClick()
    getGames()


}
document.addEventListener('DOMContentLoaded',init);
