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
        ordering: '-metacritic',  
        page_size: 40,             
    };

    try {
        const url = new URL(baseUrl);
        url.search = new URLSearchParams(params).toString();
        const response = await fetch(url);
        const data = await response.json();

        const topGames = data.results.map(game => {
            return {
                title: game.name,
                rating: game.rating,
                metacritic: game.metacritic,
                released: game.released,
                background_image: game.background_image
            };
        });

        showGames(topGames);

    } catch (error) {
        console.log('An error occurred:', error);
    }
};

const showGames = function(games) {
    const gameContainer = document.querySelector('.game-range'); // Assuming you have a container with class 'game-range'
    const stockImage = '/Img/stock.jpg'; // Path to your stock image

    gameContainer.innerHTML = '';

    games.forEach(game => {
        const button = document.createElement('button');
        button.className = 'c-game js-game';

        const image = new Image();
        image.onload = function() {
            button.style.backgroundImage = `url(${game.background_image})`; // Set the background image of the button
        };
        image.onerror = function() {
            console.log('Image not found');
            button.style.backgroundImage = `url(${stockImage})`; // Set the stock image if the background image is not found
        };
        image.src = game.background_image;

        button.style.backgroundSize = 'cover'; // Make sure the background image covers the button

        const span = document.createElement('span');
        span.className = 'c-title js-title';
        span.textContent = game.title; // Set the text content to the game title

        button.appendChild(span);

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


const GetSearch = function () {
    const search = document.querySelector('.js-search').value;
    console.log(search)
    try {
        const url = new URL(baseUrl);
        url.search = new URLSearchParams({key: apiKey, search: search}).toString();
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const searchGames = data.results.map(game => {
                return {
                    title: game.name,
                    rating: game.rating,
                    metacritic: game.metacritic,
                    released: game.released,
                    background_image: game.background_image
                };
            });
            showGames(searchGames)
        })

        
}
catch (error) {
    console.log('An error occurred:', error);
}
}
const ListenToSearch = function () {    
    const searchButton = document.querySelector('.js-search-button');
    searchButton.addEventListener('click', GetSearch);
}





const init = function(){
    // createGameButtons()
    listenToClick()
    getGames()
    ListenToSearch()



}
document.addEventListener('DOMContentLoaded',init);
