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
let baseUrl = "https://api.rawg.io/api/games";

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
        console.log(url.search);

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
            'action': 4,  // Action
            'adventure': 3,  
            'fighting': 6,  // Shooter
            'indie': 51,
            'mmo': 59,
            'platformer': 83,
            'puzzle': 7,
            'racing':1,
            'rpg':5,
            'simulation': 14,
            'sports': 15,
            'strategy': 10

        };

    
        const selectedGenre = this.value;
        selectedGenreId = genreMap[selectedGenre] || null;
        console.log("HIIIII")
        console.log(selectedGenreId);    
    
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


const displayStars = function(score){
    const svgString = `<svg width="36px" height="36px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z" fill="#FFD700"/>
    </svg>`;
    
        const halfStarSvg = `<svg fill="#FFD700" width="36px" height="36px" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>half-star-solid</title>
          <path class="clr-i-solid clr-i-solid-path-1" d="M34,16.78a2.22,2.22,0,0,0-1.29-4l-9-.34a.23.23,0,0,1-.2-.15L20.4,3.89a2.22,2.22,0,0,0-4.17,0l-3.1,8.43a.23.23,0,0,1-.2.15l-9,.34a2.22,2.22,0,0,0-1.29,4l7.06,5.55a.23.23,0,0,1,.08.24L7.35,31.21a2.22,2.22,0,0,0,3.38,2.45l7.46-5a.22.22,0,0,1,.25,0l7.46,5a2.2,2.2,0,0,0,2.55,0,2.2,2.2,0,0,0,.83-2.4l-2.45-8.64a.22.22,0,0,1,.08-.24ZM24.9,23.11l2.45,8.64A.22.22,0,0,1,27,32l-7.46-5a2.21,2.21,0,0,0-1.24-.38h0V4.44h0a.2.2,0,0,1,.21.15L21.62,13a2.22,2.22,0,0,0,2,1.46l9,.34a.22.22,0,0,1,.13.4l-7.06,5.55A2.21,2.21,0,0,0,24.9,23.11Z"></path>
          <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
        </svg>`;
    
        const totalStars = 10;
        const filledStars = Math.floor(score);
        const hasHalfStar = score % 2 !== 0;
    
        let filledSvg = svgString.repeat(filledStars);
    
        if (hasHalfStar) {
          filledSvg += halfStarSvg;
        }
        const starlocation = document.querySelector(".js-stars")
        starlocation.innerHTML = filledSvg;

      }    


let ratingsChart; // Declare the chart variable outside the function

const showchart = function(dynamicratings) {
    console.log("Boeeeee")
    console.log(dynamicratings)
    const ratings = dynamicratings.reverse();

    const ctx = document.querySelector('.js-modal-rating-chart').getContext('2d');

    // Destroy the previous chart instance if it exists
    if (ratingsChart) {
        ratingsChart.destroy();
    }

    // Create a new chart instance
    ratingsChart = new Chart(ctx, {
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
    for (game of games) {
    console.log(game);
    
    }
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

///html performanter maken door alles in 1 string te dan alles apart appendemn dus het geheel in 1 keer toevoegen





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






  const getPlatforms = function() {
    const platform = document.querySelector('.js-modal-platforms')
    const platforms = platform.querySelectorAll('li')

    const platformlogos = {
        'Nintendo Switch': '<svg id="Nintendo_Switch" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540.2 524.4" width="48" height="48"><style>.st0{fill:#e1131f}.st1{fill:#fff}</style><path class="st0" d="M540.2 524.4H0V.1c.7 0 1.4.1 2.1.1h538.1v524.2z"/><path class="st0" d="M286.4 165.1v160.5c0 5.1.3 5.4 5.3 5.4 15.6 0 31.2.1 46.8-.1 5.6-.1 11.3-.3 16.8-1.5 41.2-8.3 68.8-42.2 68.9-84.2.1-53.1 0-106.2 0-159.3 0-4-.2-8.1-.7-12.1-5.2-41.6-41-73.4-82.9-73.6-15.9-.1-31.7 0-47.6 0-6.6 0-6.6 0-6.6 6.4v158.5zM253.9 165.9V6.2c0-6-.1-6-5.8-6-22.9 0-45.9-.3-68.8.1-32.3.4-56.7 14.9-73.3 42.5-8.4 14-11.4 29.4-11.4 45.5.1 50.6 0 101.2 0 151.8 0 3.9.1 7.9.4 11.8 2.7 43.6 38.6 78.1 82.3 78.9 23.3.4 46.7.1 70 .1 6.5 0 6.5 0 6.5-6.6.1-52.8.1-105.6.1-158.4zM148.9 471.2c.6 1.8 1 2.6 1.2 3.5 4 14.2 8.1 28.4 11.8 42.7.9 3.4 2.4 4.7 5.9 4.4 3.5-.3 7.1-.3 10.6 0 3 .2 4.1-1 4.8-3.7 6.6-23.7 13.3-47.4 20-71 .3-1.1.4-2.2.8-3.7-4.7 0-8.9.2-13.1-.1-2.9-.1-4.1.8-4.8 3.7-4 15.6-8.2 31.1-12.3 46.7-.4 1.4-.8 2.9-1.5 5.4-.8-2.4-1.2-3.6-1.5-4.9-4-13.8-8-27.6-12.1-41.4-2.8-9.5-2.8-9.3-12.7-9.5-3.3-.1-4.5 1.2-5.3 4.2-4.4 15.6-9 31.2-13.5 46.8-.4 1.3-.9 2.6-1.6 4.6-4.7-17.9-9.2-34.9-13.8-52-.3-1.2-1.3-3.2-2.1-3.2-5.1-.3-10.3-.1-15.7-.1.4 1.7.6 2.8.8 3.8 5.8 20.7 11.6 41.3 17.5 61.9 1.1 4 1.2 9.6 3.9 11.6 2.9 2.1 8.2 1 12.5 1 7.2 0 5.7.7 7.5-5.7 4.2-14.7 8.3-29.3 12.7-45zM430.9 443.7v74.2c0 1.5-.8 3.7 2 3.8 4.6.1 9.1 0 14.2 0v-30.9h36.1v30.9c4.7 0 9-.1 13.2 0 2.4.1 3.2-.9 3.2-3.2-.1-4.6 0-9.2 0-13.8 0-19.1 0-38.3-.1-57.4 0-1.3-.9-3.7-1.5-3.7-4.9-.3-9.8-.2-15.1-.2v30.4h-35.7v-30.2c-5.5.1-10.6.1-16.3.1zM13 515.9c5.8 2 11 4.2 16.4 5.5 14 3.4 28.1 3.7 41.7-1.7 9.3-3.7 14-10.8 14.2-21 .1-10-5.5-15.6-14-18.7-6.2-2.3-12.8-3.8-19.2-5.5-5.8-1.6-11.7-2.7-17.4-4.6-1.6-.6-3.6-3.3-3.6-4.9.1-1.9 2-3.9 3.5-5.5.8-.9 2.3-1.3 3.6-1.4 5.2-.5 10.5-1.5 15.6-.9 6.5.7 13 2.7 19.9 4.2 1.6-4 3.4-8.4 5.3-13-9.3-3.7-18.4-5.7-27.9-6.1-9.7-.4-19.1 1.4-27.3 6.9-6.7 4.5-10.4 10.6-9.6 18.9.8 7.9 5.6 12.7 12.5 15.1 6.6 2.3 13.6 3.8 20.4 5.5 5.6 1.4 11.3 2.3 16.7 4.2 2.1.8 4.8 3.7 4.9 5.7.1 2.3-2.2 4.9-3.9 7-.9 1.1-2.7 1.7-4.2 1.8-6.2.5-12.6 1.7-18.7.9-7.2-.9-14.3-3.6-21.8-5.6-2 3.9-4.3 8.1-7.1 13.2zM400.9 494.9c-12.7 13.7-26.9 15.7-38.1 5.6-9.9-9-10.7-24-1.7-33.8 4.6-5.1 10.5-7.8 17.4-8 9.5-.3 16.7 4.2 22.3 12 4.4-3.8 8.5-7.5 12.5-11-9.5-15.2-29-22.2-46.4-16.9-18.5 5.6-30.2 22.5-29.5 42.5.6 17.9 14.2 34 32 38.2 16.9 3.9 36.4-3.9 43.7-17.8-3.9-3.6-8-7.1-12.2-10.8zM284.2 460.3v5.3c0 17.3.1 34.6-.1 51.9 0 3.1.7 4.6 4.1 4.3 3-.3 6-.3 9 0 3.4.3 4.2-1.1 4.1-4.3-.1-17.4-.1-34.8-.1-52.3v-4.9c7.1 0 13.7-.1 20.2.1 3 .1 4.4-.7 4.1-3.9-.3-3-.3-6 0-9 .3-3.4-1.1-4.2-4.3-4.1-19.3.1-38.5.1-57.8.1-1.3 0-2.5.1-3.8.2v16.7c8.3-.1 16.1-.1 24.6-.1zM223.6 443.7v77.8h17.1v-77.8h-17.1zM458.5 402c0 12.2 9.7 22 21.8 22.1 12.2.1 22.2-10 22.1-22.3-.1-12.2-9.9-22.1-21.9-22.2-12.1 0-22 10-22 22.4zM125.3 381.4v41.1h8.4v-26.6c1.4 1.8 2.1 2.6 2.7 3.4 5.1 6.9 10.5 13.8 15.3 20.9 2.5 3.6 5.8 2.5 8.8 2.2.7-.1 1.5-3.3 1.6-5.1.1-10.6.1-21.2.1-31.8 0-1.4-.1-2.8-.2-4.2h-8.5v26.6c-5.8-7.8-11.4-14.5-16-21.7-3.2-4.8-6.8-6.1-12.2-4.8zM53.6 422.3v-41h-8.2v25.4c-6.1-6.8-11.8-13.7-16.6-21.1-3.1-4.8-6.9-5.1-11.8-4.2v41.1h8.5v-26.9c5.9 8 11.4 14.9 16.2 22.2 3 4.4 6.4 6.1 11.9 4.5zM350.5 381.2v26.6c-6-8.1-11.3-15.2-16.7-22.3-3.8-5.1-5.1-5.5-11.9-3.8 0 13 0 26 .1 39.1 0 .6 1.2 1.7 1.9 1.8 2.1.2 4.3.1 6.8.1v-26.8c1.3 1.5 2 2.3 2.7 3.2 4.8 6.4 9.5 12.8 14.3 19.2 3.7 5 5 5.4 11.2 3.7v-40.9c-2.7.1-5.1.1-8.4.1zM393.6 401.9c0 5.9.1 11.8 0 17.7 0 2.4.8 3.3 3.2 3.2 4.8-.1 9.7.1 14.6-.1 11.2-.4 20.1-8.8 20.8-19.3.7-10.9-6.5-20.2-17.7-21.9-6-.9-12.3-.5-18.4-.4-.8 0-2.2 2-2.2 3-.4 6-.3 11.9-.3 17.8zM288 381c-9.6 0-19 .1-28.4-.1-3-.1-3.8.9-3.8 3.8.2 9.7.1 19.4.1 29.1 0 8.9 0 8.9 8.8 8.9h23.2v-8.2h-23v-9.4h21.3v-7.8h-21.4v-8.5H288V381zM191.3 390.2h5.6c8.3.1 7.1-1 7.2 7.4.1 6.9 0 13.9 0 20.8 0 1.4.2 2.7.3 4.1h9v-32.4h12.4v-8.8h-34.6c.1 3 .1 5.7.1 8.9zM85.1 381v41.5h8.7v-41.3c-1.3-.1-2.3-.2-3.4-.2h-5.3zM519.2 510.1c-1.2 6.2-.7 10.1 1.7 11.7.1-2.2.2-4.2.3-6.1 1.4 2 2.7 4 4.1 6 .9-1.8 1.9-3.6 2.8-5.3.1-.1.4-.1.4-.1.4 1.9.7 3.7 1.1 5.5.5-.1.9-.2 1.4-.3v-11.3c-5.5-1.1-3.5 4.9-6 6.5-2.4-1.8-.5-7.5-5.8-6.6zM510.2 513.1c.1 2.8.3 5.6.4 8.5.6 0 1.2.1 1.7.1.2-2.1.1-4.2.7-6.1.6-1.8 2-3.4 3-5.1h-9.3c-.1.3-.1.7-.2 1 1.3.5 2.5 1 3.7 1.6z"/><path class="st1" d="M286.4 165.1V6.6c0-6.4 0-6.4 6.6-6.4 15.9 0 31.7-.1 47.6 0 41.9.2 77.7 32 82.9 73.6.5 4 .7 8.1.7 12.1 0 53.1.1 106.2 0 159.3 0 42-27.7 75.9-68.9 84.2-5.5 1.1-11.2 1.4-16.8 1.5-15.6.2-31.2.1-46.8.1-5 0-5.3-.3-5.3-5.4V165.1zm98.5 17.1c0-18.6-14.6-33.2-33-33.2-18.3 0-33 14.6-33.1 32.9-.1 18.6 14.5 33.4 32.9 33.5 18.4 0 33.1-14.7 33.2-33.2zM253.9 165.9v158.5c0 6.6 0 6.6-6.5 6.6-23.3 0-46.7.3-70-.1-43.8-.8-79.6-35.3-82.3-78.9-.2-3.9-.4-7.9-.4-11.8V88.4c0-16.2 3-31.6 11.4-45.5 16.6-27.5 41-42 73.2-42.6 22.9-.4 45.9-.1 68.8-.1 5.7 0 5.8.1 5.8 6v159.7zM226.8 27.3h-53.3c-1.9 0-3.9.5-5.8.9-27.8 6.1-46.1 29.1-46.1 58.6-.1 52.4 0 104.9 0 157.3 0 4 .3 8.2 1 12.1 5.5 28.6 28.4 47.5 57.5 47.7 14.3.1 28.6 0 42.9 0 1.2 0 2.5-.2 3.8-.2V27.3zM148.9 471.2c-4.4 15.7-8.5 30.3-12.7 44.9-1.8 6.4-.3 5.7-7.5 5.7-4.3 0-9.6 1.1-12.5-1-2.7-2-2.8-7.6-3.9-11.6-5.9-20.6-11.7-41.3-17.5-61.9-.3-1-.4-2-.8-3.8 5.4 0 10.6-.1 15.7.1.8 0 1.8 2 2.1 3.2 4.6 17 9.1 34.1 13.8 52 .7-2 1.2-3.3 1.6-4.6 4.5-15.6 9.1-31.1 13.5-46.8.8-3 1.9-4.3 5.3-4.2 9.9.2 9.9 0 12.7 9.5 4 13.8 8.1 27.6 12.1 41.4.4 1.2.8 2.4 1.5 4.9.7-2.5 1.2-3.9 1.5-5.4 4.1-15.5 8.4-31.1 12.3-46.7.7-2.9 1.9-3.8 4.8-3.7 4.2.2 8.4.1 13.1.1-.3 1.5-.5 2.6-.8 3.7-6.7 23.7-13.4 47.3-20 71-.8 2.7-1.9 3.9-4.8 3.7-3.5-.3-7.1-.3-10.6 0s-5-.9-5.9-4.4c-3.8-14.3-7.9-28.5-11.8-42.7-.2-.8-.6-1.6-1.2-3.4zM430.9 443.7h16.3v30.2h35.7v-30.4c5.3 0 10.2-.1 15.1.2.6 0 1.5 2.4 1.5 3.7.1 19.1.1 38.3.1 57.4 0 4.6-.1 9.2 0 13.8.1 2.4-.8 3.3-3.2 3.2-4.3-.1-8.6 0-13.2 0v-30.9h-36.1v30.9h-14.2c-2.8 0-2-2.3-2-3.8v-50.7-23.6zM13 515.9c2.8-5.1 5.2-9.3 7.2-13 7.5 2 14.5 4.7 21.8 5.6 6.1.8 12.4-.4 18.7-.9 1.5-.1 3.3-.8 4.2-1.8 1.7-2.1 4-4.7 3.9-7-.1-2-2.7-4.9-4.9-5.7-5.4-1.9-11.1-2.8-16.7-4.2-6.8-1.7-13.8-3.2-20.4-5.5-7-2.4-11.8-7.3-12.5-15.1-.8-8.3 2.8-14.5 9.6-18.9 8.3-5.5 17.6-7.3 27.3-6.9 9.5.4 18.6 2.4 27.9 6.1-1.9 4.6-3.7 9-5.3 13-6.9-1.5-13.3-3.5-19.9-4.2-5.1-.6-10.4.4-15.6.9-1.2.1-2.8.6-3.6 1.4-1.5 1.6-3.5 3.6-3.5 5.5-.1 1.7 1.9 4.3 3.6 4.9 5.7 1.9 11.6 3 17.4 4.6 6.4 1.7 13 3.2 19.2 5.5 8.5 3.1 14.1 8.7 14 18.7-.1 10.2-4.8 17.3-14.2 21-13.6 5.4-27.7 5.1-41.7 1.7-5.5-1.4-10.7-3.7-16.5-5.7zM400.9 494.9c4.2 3.7 8.2 7.2 12.2 10.7-7.3 13.9-26.8 21.7-43.7 17.8-17.8-4.1-31.4-20.3-32-38.2-.7-20 11-36.9 29.5-42.5 17.4-5.3 36.8 1.7 46.4 16.9-4 3.6-8.1 7.2-12.5 11-5.5-7.8-12.7-12.2-22.3-12-6.9.2-12.7 2.9-17.4 8-9 9.8-8.2 24.8 1.7 33.8 11.2 10.2 25.4 8.2 38.1-5.5zM284.2 460.3h-24.4v-16.7c1.2-.1 2.5-.2 3.8-.2 19.3 0 38.5.1 57.8-.1 3.2 0 4.6.8 4.3 4.1-.3 3-.3 6 0 9 .3 3.3-1.1 4-4.1 3.9-6.5-.2-13.1-.1-20.2-.1v4.9c0 17.4-.1 34.8.1 52.3 0 3.2-.7 4.6-4.1 4.3-3-.3-6-.3-9 0-3.4.3-4.1-1.2-4.1-4.3.1-17.3.1-34.6.1-51.9-.2-1.4-.2-2.9-.2-5.2zM223.6 443.7h17.1v77.8h-17.1v-77.8zM458.5 402c0-12.3 9.9-22.4 22.1-22.3 12 .1 21.8 10 21.9 22.2.1 12.3-10 22.4-22.1 22.3-12.2-.2-21.8-10-21.9-22.2zm34.6-.1c0-6.9-6-12.9-12.9-12.7-6.8.1-12.4 5.9-12.4 12.7 0 6.9 5.5 12.6 12.4 12.7 6.9.1 12.9-5.8 12.9-12.7zM125.3 381.4c5.4-1.3 9 0 12.1 4.8 4.6 7.2 10.2 13.8 16 21.7v-26.6h8.5c.1 1.5.2 2.8.2 4.2 0 10.6.1 21.2-.1 31.8 0 1.8-.8 5.1-1.6 5.1-3 .3-6.3 1.4-8.8-2.2-4.8-7.1-10.2-14-15.3-20.9-.6-.8-1.3-1.6-2.7-3.4v26.6h-8.4c.1-13.6.1-27.3.1-41.1zM53.6 422.3c-5.5 1.6-8.9-.1-11.8-4.6-4.8-7.3-10.3-14.1-16.2-22.2v26.9h-8.5v-41.1c4.9-.9 8.7-.6 11.8 4.2 4.8 7.4 10.4 14.2 16.6 21.1v-25.4h8.2c-.1 13.8-.1 27.4-.1 41.1zM350.5 381.2h8.4v40.9c-6.2 1.7-7.6 1.2-11.2-3.7-4.8-6.4-9.5-12.8-14.3-19.2-.7-.9-1.4-1.7-2.7-3.2v26.8c-2.5 0-4.6.2-6.8-.1-.7-.1-1.9-1.2-1.9-1.8-.1-13.1-.1-26.1-.1-39.1 6.7-1.8 8-1.4 11.9 3.8 5.3 7.1 10.6 14.2 16.7 22.3v-26.7zM393.6 401.9c0-5.9-.1-11.8.1-17.7 0-1.1 1.4-3 2.2-3 6.1-.1 12.4-.5 18.4.4 11.3 1.7 18.5 11 17.7 21.9-.7 10.5-9.6 18.9-20.8 19.3-4.8.2-9.7-.1-14.6.1-2.4.1-3.2-.8-3.2-3.2.3-6 .2-11.9.2-17.8zm8.8-.1v2.4c.2 3.1.4 6.1.7 9.2 3.9-.1 7.9.3 11.6-.4 5-.9 8.5-6.3 8.4-11.5-.2-5.3-3.8-10-9-11-2.9-.6-6-.4-9-.6-2.1-.1-2.8.8-2.7 2.8v9.1zM288 381v8h-23.2v8.5h21.4v7.8h-21.3v9.4h23v8.2h-23.2c-8.8 0-8.8 0-8.8-8.9 0-9.7.1-19.4-.1-29.1 0-2.9.8-3.9 3.8-3.8 9.3.1 18.7-.1 28.4-.1zM191.3 390.2v-8.9h34.6v8.8h-12.4v32.4h-9c-.1-1.3-.3-2.7-.3-4.1v-20.8c-.1-8.4 1.1-7.3-7.2-7.4h-5.7zM85.1 381h5.3c1 0 2 .1 3.4.2v41.3h-8.7V381z"/><path class="st0" d="M519.2 510.1c5.4-.8 3.4 4.8 5.8 6.6 2.5-1.6.5-7.5 6-6.5v11.3c-.5.1-.9.2-1.4.3-.3-1.8-.7-3.7-1.1-5.5 0 0-.3 0-.4.1-1 1.8-1.9 3.5-2.8 5.3-1.4-2-2.7-4-4.1-6-.1 1.9-.2 3.9-.3 6.1-2.4-1.6-2.9-5.5-1.7-11.7zM510.2 513.1c-1.3-.6-2.4-1.1-3.6-1.7.1-.3.1-.7.2-1h9.3c-1.1 1.7-2.4 3.3-3 5.1-.6 1.9-.5 4.1-.7 6.1-.6 0-1.2-.1-1.7-.1-.2-2.7-.3-5.6-.5-8.4zM384.9 182.2c0 18.5-14.8 33.2-33.2 33.1-18.4-.1-33-14.9-32.9-33.5.1-18.3 14.8-32.9 33.1-32.9 18.4 0 33 14.7 33 33.3zM226.8 27.3v276.4c-1.3.1-2.6.2-3.8.2-14.3 0-28.6.1-42.9 0-29.1-.2-51.9-19-57.5-47.7-.8-4-1-8.1-1-12.1-.1-52.4-.1-104.9 0-157.3 0-29.5 18.3-52.5 46.1-58.6 1.9-.4 3.9-.9 5.8-.9h53.3zm-80.7 72.2c0 17.3 14.1 31.4 31.2 31.2 17-.2 30.8-14 30.9-31.2.1-17.2-13.9-31.3-31.1-31.4-17.2 0-31.1 14.1-31 31.4zM493.1 401.9c0 6.9-6 12.9-12.9 12.7-6.8-.1-12.4-5.8-12.4-12.7 0-6.9 5.6-12.6 12.4-12.7 6.9-.2 12.9 5.8 12.9 12.7zM402.4 401.8c0-3 .1-6 0-9-.1-2 .7-2.9 2.7-2.8 3 .2 6.1 0 9 .6 5.2 1 8.8 5.7 9 11 .2 5.1-3.4 10.5-8.4 11.5-3.8.7-7.7.3-11.6.4-.2-3.1-.5-6.1-.7-9.2-.1-.9 0-1.7 0-2.5z"/><path class="st1" d="M146.1 99.5c0-17.3 13.9-31.4 31-31.4 17.2 0 31.2 14.2 31.1 31.4-.1 17.2-13.9 31-30.9 31.2-17.1.2-31.2-13.9-31.2-31.2zM509.3 511.9v9.2h3.5v-9.2h2.9V509h-9.8v2.9zM518 509.5v11.6h2.3v-6.7c0-.4.5-.5.6-.1l2.5 6.8h2.4l1.8-7c.1-.2.4-.2.4 0v7h2.7v-11.6h-3.1l-2.7 7.4c-.1.2-.4.2-.4 0l-2.5-7.4h-4z"/></svg>',
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
        'Android': '<svg height="48" viewBox="32.9 57.77898118 414.2 366.56939652" width="48" xmlns="http://www.w3.org/2000/svg"><path d="m64.2 370.885c-10.7 0-17.9 8.4-17.9 19.2s7.2 19.2 17.9 19.2 17.9-8.4 17.9-19.2c-.1-10.8-7.3-19.2-17.9-19.2m-2.4-11.9c8.6 0 15.8 4.4 19.2 9.2v-8h13.2v59.9h-10.2a3.009 3.009 0 0 1 -3-3v-5c-3.4 4.8-10.5 9.2-19.2 9.2-16.4 0-28.9-14-28.9-31.1s12.4-31.2 28.9-31.2m47.4 1.2h13.2v8.1c3.6-6 10.4-9.3 18.2-9.3 13.9 0 22.9 9.8 22.9 25v36.1h-10.1a3.009 3.009 0 0 1 -3-3v-30.9c0-9.5-4.8-15.2-12.5-15.2-8.7 0-15.5 6.8-15.5 19.6v29.5h-10.1a3.009 3.009 0 0 1 -3-3zm95.9 10.7c-10.7 0-17.9 8.4-17.9 19.2s7.2 19.2 17.9 19.2 17.9-8.4 17.9-19.2-7.2-19.2-17.9-19.2m-2.4-11.9c8.6 0 15.8 4.4 19.2 9.2v-38h13.2v89.9h-10.1a3.009 3.009 0 0 1 -3-3v-5c-3.4 4.8-10.5 9.2-19.2 9.2-16.4 0-28.9-14-28.9-31.1s12.4-31.2 28.8-31.2m47.4 1.2h13.2v10.7a16.961 16.961 0 0 1 15.8-11.3 22.063 22.063 0 0 1 5.1.5v13.5a21.243 21.243 0 0 0 -6.6-1.1c-7.5 0-14.4 6.4-14.4 18.3v29.2h-10.1a3.009 3.009 0 0 1 -3-3zm69.6 48.8c10.5 0 18-8.3 18-18.9 0-10.7-7.4-18.9-18-18.9-10.7 0-18.1 8.3-18.1 18.9.1 10.7 7.4 18.9 18.1 18.9m0 12.3a31.151 31.151 0 1 1 31.4-31.1 30.948 30.948 0 0 1 -31.4 31.1m42.1-61.1h13.2v59.9h-10.1a3.009 3.009 0 0 1 -3-3zm6.6-13.1a8.985 8.985 0 0 1 -8.9-8.9 8.88 8.88 0 0 1 8.9-8.7 8.8 8.8 0 0 1 0 17.6m48.7 23.8c-10.7 0-17.9 8.4-17.9 19.2s7.2 19.2 17.9 19.2 17.9-8.4 17.9-19.2c-.2-10.8-7.2-19.2-17.9-19.2m-2.4-11.9c8.6 0 15.8 4.4 19.2 9.2v-38h13.2v89.9h-10.1a3.009 3.009 0 0 1 -3-3v-5c-3.4 4.8-10.5 9.2-19.2 9.2-16.4 0-28.9-14-28.9-31.1s12.4-31.2 28.8-31.2"/><path d="m341.5 129.185 34.5-59.7a7.17 7.17 0 0 0 -12.4-7.2l-34.9 60.4a216.078 216.078 0 0 0 -177.2 0l-34.9-60.4a7.17 7.17 0 0 0 -12.4 7.2l34.5 59.7c-59.5 32.2-99.9 92.1-105.8 162.8h414c-5.9-70.7-46.4-130.6-105.4-162.8zm-196.8 103.8a17.2 17.2 0 1 1 17.2-17.2 17.2 17.2 0 0 1 -17.2 17.2zm190.6 0a17.2 17.2 0 1 1 17.2-17.2 17.2 17.2 0 0 1 -17.2 17.2z" fill="#3ddc84"/></svg>',
        'macOS': '',
        'Linux': '',
        'Nintendo 64': '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 192.756 192.756"><g fill-rule="evenodd" clip-rule="evenodd"><path fill="#fff" d="M0 0h192.756v192.756H0V0z"/><path d="M182.949 17.834h5.065v8.148h1.908v3.67h-1.908v3.89h-3.743v-3.89h-6.533v-3.67l5.211-8.148zM167.977 23.853c.805-.765 2.016-1.139 3.008-1.1 3.035.115 4.754 2.207 4.697 5.211-.098 3.514-1.969 5.693-5.65 5.798-3.695.094-6.359-3.452-6.238-7.12.166-4.962 3.314-8.64 7.266-9.174 1.113-.105 2.082-.061 2.936.146v2.862c-2.75-.559-4.863.299-6.019 3.377zM166.801 41.762c.02.636-.199 1.187-.66 1.615a2.091 2.091 0 0 1-1.615.66 2.15 2.15 0 0 1-1.613-.66c-.43-.428-.648-.979-.66-1.615.012-.619.23-1.147.66-1.615a2.29 2.29 0 0 1 1.613-.66 2.227 2.227 0 0 1 1.615.66c.461.468.679.996.66 1.615zM149.186 23.339h2.863c4.709.035 8.584 3.667 8.588 8.073v3.964c-.004 4.445-3.879 8.079-8.588 8.073h-2.863c-4.691.006-8.545-3.628-8.514-8.073v-3.964c-.031-4.405 3.822-8.037 8.514-8.073z"/><path fill="#929496" d="M75.937 94.607L67.79 78.093l9.762-17.835 17.615 6.459-14.753 25.321-4.477 1.762v.807zM108.23 91.451l6.092 2.496 24.809 35.157V83.818l-17.176-6.532-13.725 14.165z"/><path d="M108.23 91.451l3.452-3.596v-27.67l-16.515 6.532-14.753 25.321 14.753-5.945 13.063 5.358z"/><path fill="#d0d1d3" d="M95.167 66.717l-17.615-6.459 16.954-5.945 17.176 5.872-16.515 6.532zM51.349 83.671L33 76.185l16.881-5.505 17.469 6.532-16.001 6.459zM121.955 77.286l18.131-7.487 17.615 6.386-18.57 7.633-17.176-6.532zM75.937 93.8l19.23-7.707 19.155 7.854-18.935 7.78-19.45-7.927z"/><path fill="#6d6e70" d="M140.086 156.994l-26.424-34.129v19.084l6.02 7.998 20.404 7.047z"/><path d="M67.35 150.021l-16.808-30.605v37.506l16.808-6.901zM95.387 101.727l18.935-7.78 24.809 35.157V83.818l18.57-7.633v73.544l-17.615 7.265-26.424-34.129v44.918l-18.275 7.561v-73.617z"/><path fill="#929496" d="M75.937 93.8l19.45 7.927v73.617l-18.202-7.487-26.643-48.441v37.506L33 149.729V76.185l18.349 7.486 24.588 47.78V93.8z"/><path fill="#6d6e70" d="M75.937 131.451l-24.588-47.78 16.001-6.459 8.587 17.395v36.844z"/><path d="M139.131 83.818v45.286l-24.809-35.157 24.809 35.157V83.818zM25.954 23.487h7.34V43.45h-7.34V23.487zM130.029 23.487c4.336.02 8.256 3.564 8.295 10.128.025 6.053-3.365 9.862-8.148 9.835-3.539.027-7.084.027-10.643 0V23.487c3.514.019 6.992.019 10.496 0zM16.119 23.487h5.652V43.45c-2.675.027-5.384.027-8.074 0L8.486 31.267V43.45H2.834V23.487c2.896.02 5.78.02 8.66 0l4.625 10.715V23.487zM50.835 23.487h5.725V43.45c-2.718.027-5.426.027-8.147 0l-5.137-12.183V43.45h-5.652V23.487c2.854.02 5.737.02 8.588 0l4.623 10.715V23.487zM110.139 23.487h5.652V43.45c-2.695.027-5.404.027-8.072 0l-5.213-12.183V43.45h-5.651V23.487c2.874.02 5.758.02 8.661 0l4.623 10.715V23.487zM71.386 28.624V43.45H64.12V28.624h-5.064v-5.137h17.395v5.137h-5.065zM85.845 38.385h7.78v5.064c-4.993.027-10.035.027-15.046 0V23.487c5.011.02 10.053.02 15.046 0v5.137h-7.78v2.349h7.267v5.064h-7.267v2.348z"/><path d="M150.654 27.743c1.193.013 2.184.52 2.201 5.652-.018 5.172-1.008 5.678-2.201 5.65-1.229.027-2.219-.413-2.201-5.65-.017-5.199.973-5.639 2.201-5.652zM126.875 39.487h1.32c1.545.027 2.846-2.043 2.863-3.597v-4.33c-.018-1.58-1.031-3.98-2.643-3.963h-1.541v11.89h.001zM184.271 25.982v-4.919l-3.23 4.919h3.23zM169.957 25.542c1.246-.01 2.279 1.069 2.275 2.422.004 1.312-1.029 2.391-2.275 2.422-1.264-.032-2.301-1.11-2.275-2.422-.026-1.353 1.011-2.433 2.275-2.422zM166.582 41.762a2.076 2.076 0 0 0-.588-1.394c-.428-.414-.891-.611-1.469-.588a1.706 1.706 0 0 0-1.395.588c-.428.379-.625.842-.66 1.394.035.57.232 1.055.66 1.468.365.379.85.578 1.395.587.578-.01 1.041-.208 1.469-.587.365-.413.563-.898.588-1.468z" fill="#fff"/><path d="M163.719 40.441h.955c.32.02.561.086.734.22.135.13.201.285.219.441-.018.218-.105.395-.293.513-.076.123-.23.189-.441.221a.775.775 0 0 1 .221.146c.012-.002.078.086.146.22a.825.825 0 0 1 .221.294l.221.441h-.367l-.221-.441c-.209-.296-.342-.472-.439-.514-.1-.09-.254-.112-.441-.146h-.221v1.101h-.293v-2.496h-.001z"/><path d="M164.012 40.735v.88h.295a7.07 7.07 0 0 0 .66-.073.353.353 0 0 0 .221-.147c.07-.075.092-.164.072-.221.02-.141-.025-.229-.146-.293-.053-.113-.275-.157-.66-.146h-.442z" fill="#fff"/></g></svg>',
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



// const GetSearch = function () {
//     const search = document.querySelector('.js-search').value;
//     console.log(search)
//     try {
//         const url = new URL(baseUrl);
//         url.search = new URLSearchParams({key: apiKey, search: search}).toString();
//         fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             const searchGames = data.results.map(game => {
//                 return {
//                     title: game.name,
//                     rating: game.rating,
//                     metacritic: game.metacritic,
//                     released: game.released,
//                     background_image: game.background_image
//                 };
//             });
//             showGames(searchGames)
//         })
        

        
// }
// catch (error) {
//     console.log('An error occurred:', error);
// }
// }


const GetSearch = async function () {
    const search = document.querySelector('.js-search').value;
    console.log(search);

    try {
        const allGames = [];
        let url = new URL(baseUrl);
        url.search = new URLSearchParams({ key: apiKey, search: search }).toString();

        while (url && allGames.length < 40) { // Check if we have less than 40 games
            const response = await fetch(url);
            const data = await response.json();

            const searchGames = data.results.map(game => {
                return {
                    title: game.name,
                    slug: game.slug, // Add the slug here
                    rating: game.rating,
                    metacritic: game.metacritic,
                    released: game.released,
                    background_image: game.background_image
                };
            });

            allGames.push(...searchGames.slice(0, 40 - allGames.length));

            url = data.next; 

            if (!url) break;
        }

        console.log(allGames);
        showGames(allGames);

    } catch (error) {
        console.error('Error fetching games:', error);
    }
};





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
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
    modalImage.src = game.background_image;
    modalWebsite.href = game.website;
    let releasedate = game.released;
    europeanDate = releasedate.split('-').reverse().join('-');
    modalReleased.innerHTML = europeanDate;
    console.log(europeanDate)
    modalRating.innerHTML = game.rating;
    modalTitle.innerHTML = game.name;
    modalDescription.innerHTML = game.description;
    modalMetacritic.innerHTML = game.metacritic;
    displayStars(game.rating);
    // Dynamic background color for Metacritic score
    const metacriticScore = game.metacritic;
    if (metacriticScore >= 70) {
        modalMetacritic.style.backgroundColor = 'green';
    } else if (metacriticScore >= 50) {
        modalMetacritic.style.backgroundColor = 'orange';
    } else {
        modalMetacritic.style.backgroundColor = 'red';
    }

    // Generate genres list
    let genresHTML = '';
    game.genres.forEach(genre => {
      genresHTML += `<li>${genre.name}</li>`;
    });
    // Generate platforms list
    let platformsHTML = '';
    game.platforms.forEach(platform => {
      platformsHTML += `<li>${platform.platform.name}</li>`;
    });
    
    // Set the innerHTML of the genres and platforms lists
    modalGenres.innerHTML = genresHTML;    
    modalPlatforms.innerHTML = platformsHTML;
    
    // Display the modal
    modal.style.display = 'flex';
    
    // Call the showchart function
    showchart(game.ratings);


    document.addEventListener('keydown', handleEscapeKey);

    // Add event listener to close modal on background click
    modal.addEventListener('click', handleClickOutside);


        
}



const ShowRating =  function(gamerating) {
    console.log(gamerating)
    console.log("HIIII")
}

const closeModal = function() {
    const modal = document.querySelector('.js-modal');
    modal.style.display = 'none';
    const body = document.querySelector('body');
    body.style.overflow = 'auto';

    // Remove event listeners to avoid multiple bindings
    document.removeEventListener('keydown', handleEscapeKey);
    modal.removeEventListener('click', handleClickOutside);
}

const handleEscapeKey = function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}

const handleClickOutside = function(event) {
    const modalContent = document.querySelector('.js-modal-content'); // Adjust this selector to your modal content element
    if (!modalContent.contains(event.target)) {
        closeModal();
    }
}

const listentoclose = function() {
    const closeButton = document.querySelector('.js-modal-close')
    closeButton.addEventListener('click', closeModal)
}


const init = function(){
    listentoclose()
    createGameButtons()
    listenToClick()
    getGames()
    ListenToSearch()
    listentoPlatformfilter()
    listentoGenreFilter()



}
document.addEventListener('DOMContentLoaded',init);
