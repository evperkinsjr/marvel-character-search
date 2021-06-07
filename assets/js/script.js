$(document).ready(function(){

    var movieAPIKey = "afc05c23c80ea33317e0bfb98d0810ca";
    var genreInput = $('#genre-input');
    var cocktailInput = $('#cocktail-input');
    var fetchBtn = $('#fetch-btn');
    var movieResultDiv = $('#movie-container');
    var cocktailResultDiv = $('#cocktail-container');
    var genreName;
    var genreId;
    var cocktailType;


    //Search the Movie DB API by genre
    function getMovieByGenre(movieAPIKey,genre) {
        var requestURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPIKey + "&language=en-US&include_adult=false&include_video=false&with_original_language=en&with_genres=" + genre;
        
        fetch(requestURL)
            .then(function(response) {
                if (response.status===200) {
                    return response.json();
                }
                alert ('Issue with API search')  //modal?
            })
            .then(function(data) {
                console.log(data);

                console.log(data.results[0].id) //movie Id
                console.log(data.results[0].title) //movie title, there is also an original_title
                console.log(data.results[0].overview)  //movie summary
                console.log(data.results[0].poster_path) //https://image.tmbd.org/t/p/w185 + poster_path gives movie poster image
                console.log(data.results[0].release_date) //release date

                var movieTitle = $('<h2>').text(data.results[0].title);
                var movieDesc = $('<p>').text(data.results[0].overview);
                var moviePoster = $('<img>').attr('src',"https://image.tmdb.org/t/p/w185" + data.results[0].poster_path);
                movieResultDiv.append(movieTitle);
                movieResultDiv.append(movieDesc);
                movieResultDiv.append(moviePoster);
            })
    }

    getMovieByGenre('afc05c23c80ea33317e0bfb98d0810ca', 16);


    //Search alcoholic cocktail API
    function getCocktail(type) {
        var requestURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=" + type;

        fetch(requestURL)
            .then(function(response) {
                if(response.status===200) {
                    return response.json();
                }
                alert('Issue with API search')  //modal?
            })
            .then (function(data) {
                console.log(data);

                console.log(data.drinks[0].strDrink);  //drink name
                console.log(data.drinks[0].strDrinkThumb); //drink image
                console.log(data.drinks[0].idDrink);  //drink id - can use to get ingredients, instructions to make
            })
    }

    getCocktail('Alcoholic');
    getCocktail('Non_Alcoholic');
    


    //Click event to initialize movie/cocktail search
    fetchBtn.on('click', function(event){
        event.preventDefault();

        genreName = genreInput.val();
        console.log(genreName);
        mapGenreNametoID(genreName);
        console.log(genreId);
        //getMovieByGenre(genreId);

        cocktailType = cocktailInput.val();
        //getCocktail(cocktailType);
    })

    function mapGenreNametoID (genreName) {
        switch (genreName) {
            case 'Action':
                genreId=28;
                break;
            case 'Adventure':
                genreId=12;
                break;
            case 'Animation':
                genreId=16;
                break;
            case 'Comedy':
                genreId=35;
                break;
            case 'Crime':
                genreId=80;
                break;
            case 'Documentary':
                genreId=99;
                break;
            case 'Drama':
                genreId=18;
                break;
            case 'Family':
                genreId=10751;
                break;
            case 'Fantasy':
                genreId=14;
                break;
            case 'History':
                genreId=36;
                break;
            case 'Horror':
                genreId=27;
                break;
            case 'Music':
                genreId=10402;
                break;
            case 'Mystery':
                genreId=9648;
                break;
            case 'Romance':
                genreId=10749;
                break;
            case 'Science Fiction':
                genreId=878;
                break;
            case 'TV Movie':
                genreId=10770;
                break;
            case 'Thriller':
                genreId=53;
                break;
            case 'War':
                genreId=10752;
                break;
            case 'Western':
                genreId=37;
                break;
            default:
                console.log('No match found.')
        }
        return genreId;
    }


})