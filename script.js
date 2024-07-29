const listenToClick = async function() {
    document.addEventListener('click', function (event){
        const clickedTitle = event.target.closest('.js-game')
        if (clickedTitle){
            let gameTitle = clickedTitle.textContent;
            console.log(gameTitle)
            let slug = clickedTitle.querySelector('.js-title').id;
            getGameDetails(slug)

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
                background_image: game.background_image,
                slug: game.slug
            };
        });

        showGames(topGames);

    } catch (error) {
        console.log('An error occurred:', error);
    }
};

const getGameDetails = function(gameTitle){
    const apiURL = `https://api.rawg.io/api/games/${gameTitle}?key=${apiKey}`

    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        openModal(data)
        console.log(data)}
    )
    .catch(error =>{

     console.log('An error occurred:', error)})

}


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
        span.id = game.slug;
        button.appendChild(span);
        
        gameContainer.appendChild(button);

        console.log(game.slug)
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


function setupModal() {
    const modal = document.getElementById('modal');
    const span = document.getElementsByClassName('close')[0];

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function openModal(game) {
    console.log("HIIII")
    console.log(game)
    const modal = document.querySelector('.js-modal');
    const modalTitle = document.querySelector('.js-modal-title');
    const modalImage = document.querySelector('.js-modal-image');
    const modalRating = document.querySelector('.js-modal-rating');
    const modalMetacritic = document.querySelector('.js-modal-metacritic');
    const modalReleased = document.querySelector('.js-modal-released');
    const modalDescription = document.querySelector('.js-modal-description');
    const modalGenres = document.querySelector('.js-modal-genres');
    const modalPlatforms = document.querySelector('.js-modal-platforms');
    const modalWebsite = document.querySelector('.js-modal-website-link')
    modalWebsite.href = game.website;
    modalReleased.innerHTML = game.released;
    modalRating.innerHTML = game.rating;
    modalTitle.innerHTML = game.name;
    modalDescription.innerHTML = game.description;

    // modalPlatforms.innerHTML = game.platforms.map(platform => platform.platform.name).join(', ');
    let genresHTML = '';
    game.genres.forEach(genre => {
      genresHTML += `<li>${genre.name}</li>`;
    });
    let platformsHTML = '';
    game.platforms.forEach(platform => {
      platformsHTML += `<li>${platform.platform.name}</li>`;
    });
    
    // Set the innerHTML of the genres list
    modalGenres.innerHTML = genresHTML;    
    modalPlatforms.innerHTML = platformsHTML;
    modal.style.display = 'block';
}




const init = function(){
    // createGameButtons()
    listenToClick()
    getGames()
    ListenToSearch()



}
document.addEventListener('DOMContentLoaded',init);
