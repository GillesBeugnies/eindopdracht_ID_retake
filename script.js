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

const getGames = async function(platformId, genreId) {
    const params = {
        key: apiKey,
        ordering: '-metacritic',
        page_size: 40
    };

    if (platformId) {
        params.platforms = platformId;
    }

    if (genreId) {
        params.genres = genreId;
    }

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



let selectedPlatformId = null;
let selectedGenreId = null;

const listentoPlatformfilter = function() {
    const platformfilter = document.querySelector('.js-platform-filter');
    platformfilter.addEventListener('change', function(){
        console.log('Platform filter changed');
        const platformMap = {
            'platform1': 18,   // PlayStation 4
            'platform2': 4,    // PC
            'platform3': 7,    // Nintendo Switch
            'platform4': 1     // Xbox One
        };

        const selectedPlatform = this.value;

        if (selectedPlatform === 'all') {
            selectedPlatformId = null;
        } else {
            selectedPlatformId = platformMap[selectedPlatform];
        }

        // Fetch games based on the currently selected platform and genre
        getGames(selectedPlatformId, selectedGenreId);
    });
}

const listentoGenreFilter = function() { 
    const genrefilter = document.querySelector('.js-genre-filter');
    genrefilter.addEventListener('change', function() {
        console.log('Genre filter changed');
        const genreMap = {
            'genre1': 4,  // Action
            'genre2': 5,  // RPG
            'genre3': 2,  // Shooter
            'genre4': 3   // Adventure
        };
    
        const selectedGenre = this.value;
        selectedGenreId = genreMap[selectedGenre] || null;
    
        // Fetch games based on the currently selected platform and genre
        getGames(selectedPlatformId, selectedGenreId);
    });
}


// function handlePlatformClick(event) {
//     const platformId = event.target.dataset.platformId;

//     if (platformId) {
//         getGames(platformId);
//     }
// }    

const getGameDetails = function(gameTitle){
    const apiURL = `https://api.rawg.io/api/games/${gameTitle}?key=${apiKey}`

    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        openModal(data)
        getPlatforms()
        console.log(data)}
        
    )
    .catch(error =>{

     console.log('An error occurred:', error)})

}

const showchart = function()
{
    const ratings = [
        { id: 1, title: "skip", count: 9 },
        { id: 3, title: "meh", count: 16 },
        { id: 4, title: "recommended", count: 51 },
        { id: 5, title: "exceptional", count: 397 }
    ];

    const ctx = document.querySelector('.js-modal-rating-chart').getContext('2d');
    const ratingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ratings'], // Single bar for stacking
            datasets: [
                {
                    label: 'Skip',
                    data: [ratings[0].count],
                    backgroundColor: '#FF3B30', // Red
                },
                {
                    label: 'Meh',
                    data: [ratings[1].count],
                    backgroundColor: '#FFCC00', // Yellow
                },
                {
                    label: 'Recommended',
                    data: [ratings[2].count],
                    backgroundColor: '#4CD964', // Green
                },
                {
                    label: 'Exceptional',
                    data: [ratings[3].count],
                    backgroundColor: '#007AFF', // Blue
                }
            ]
        },
        options: {
            indexAxis: 'y', // Horizontal bar
            scales: {
                x: {
                    stacked: true,
                    display: false // Hide x-axis
                },
                y: {
                    stacked: true,
                    display: false // Hide y-axis
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom' // Legend at the bottom
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
                        }
                    }
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 0
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

}





const showGames = function(games) {
    const gameContainer = document.querySelector('.game-range'); 
    const stockImage = '/Img/stock.jpg'; 

    let loadedImages = 0;
    const totalImages = games.length;

    const checkIfAllImagesLoaded = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
            document.querySelector('.js-loading-screen').style.display = 'none';
            document.querySelector('.c-body').style.display = 'block';
        }
    };

    gameContainer.innerHTML = '';

    games.forEach(game => {
        const button = document.createElement('button');
        button.className = 'c-game js-game';

        const image = new Image();
        image.onload = function() {
            button.style.backgroundImage = `url(${game.background_image})`; 
            checkIfAllImagesLoaded(); 
        };
        image.onerror = function() {
            console.log('Image not found');
            button.style.backgroundImage = `url(${stockImage})`; 
            checkIfAllImagesLoaded(); 
        };
        image.src = game.background_image;

        button.style.backgroundSize = 'cover'; 

        const span = document.createElement('span');
        span.className = 'c-title js-title';
        span.textContent = game.title; 
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






const getPlatforms = function(){
    const platform = document.querySelector('.js-modal-platforms')
    const platforms = platform.querySelectorAll('li')

    const platformlogos = {
        'Nintendo Switch': '',
        'Playstation 5': '',
        'PlayStation 4': '',
        'PlayStation 3': '',
        'PlayStation 2': '',
        'PlayStation 1': '',
        'Xbox One': '',
        'Xbox 360': '',
        'Xbox': '',
        'PC': '',
        'iOS': '',
        'Android': '',
        'macOS': '',
        'Linux': '',
        'Nintendo 64': '',
        'Nintendo DS': '',
        'Nintendo 3DS': '',
        'Nintendo GameCube': '',
        'Nintendo Wii': '',
        'Nintendo Wii U': ''

    }


    platforms.forEach(platform => {
        const platformName = platform.textContent.trim();
        if (platformlogos[platformName]) {
            platform.innerHTML = platformlogos[platformName];
        }
    });

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
    showchart()
}




const init = function(){
    createGameButtons()
    listenToClick()
    getGames()
    ListenToSearch()
    listentoPlatformfilter()
    listentoGenreFilter()



}
document.addEventListener('DOMContentLoaded',init);
