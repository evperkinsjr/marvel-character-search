$(document).ready(function(){

    var movieAPIKey = "afc05c23c80ea33317e0bfb98d0810ca";
    var genreInput = $('#genre-input');
    var cocktailInput = $('#cocktail-input');
    var submitBtn = $('#submit-btn');
    var movieTitleDisplay = $('#movie-title');
    var movieImageDisplay = $('#movie-image');
    var movieDescDisplay = $('#movie-description');
    var modalAlert = $('#modal-alert');
    var genreName;
    var genreId;
    var movieResponse;
    var movieIndex = 0;
    var movieTitle;
    var movieDesc;
    var moviePoster;
    var cocktailType;


    //Search the Movie DB API by genre
    function getMovieByGenre() {
        var requestURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPIKey + "&language=en-US&include_adult=false&include_video=false&with_original_language=en&with_genres=" + genreId;
        
        fetch(requestURL)
            .then(function(response) {
                if (response.status===200) {
                    return response.json();
                } else {
                        //Create and append modal message for display - customize depending on where we are calling the modal from
                        modalAlert.addClass('is-active');
                    }
            })
            .then(function(data) {
                console.log(data);

                movieResponse = data;
                console.log(movieResponse);

                console.log(data.results[0].id) //movie Id
                console.log(data.results[0].title) //movie title, there is also an original_title
                console.log(data.results[0].overview)  //movie summary
                console.log(data.results[0].poster_path) //https://image.tmbd.org/t/p/w185 + poster_path gives movie poster image
                console.log(data.results[0].release_date) //release date

                var title = data.results[0].title;
                var titleCleaned = title.replace(/\s/g,'+');  //we could fetch from the OMDB API to get rotten tomatoes using titleCleaned
                console.log(titleCleaned);

                displayMovieDetails(movieResponse);
            })
    }

    //Displays movie details for initial search
    function displayMovieDetails(data) {
        movieTitleDisplay.text(data.results[0].title);
        movieDescDisplay.text(data.results[0].overview);
        movieImageDisplay.attr('src',"https://image.tmdb.org/t/p/w185" + data.results[0].poster_path);
    }

    //populates movie details when 'Next' is clicked
    function displayNextMovie(data, index) {
        movieTitle.text(data.results[index].title);
        movieDesc.text(data.results[index].overview);
        moviePoster.attr('src', "https://image.tmdb.org/t/p/w185" + data.results[index].poster_path)
    }

    //Click event on the 'Next' movie button
    // movieResultDiv.on('click', '#next-btn', function(event) {
    //     event.preventDefault();
    //     event.stopPropagation();

    //     ++movieIndex;
        
    //     if (movieIndex < 20) {
    //         displayNextMovie(movieResponse,movieIndex);
    //     } else {
    //         //if want to grab another page of results, need to call getMovieByGenre and pass in page parameter that would be incremented here
    //         movieIndex=19;
    //         //Create and append modal message for display - customize depending on where we are calling the modal from
    //         modalAlert.addClass('is-active');
    //     }
    // })

    //Click event on the 'Previous' movie button
    // movieResultDiv.on('click', '#prev-btn', function(event) {
    //     event.preventDefault();
    //     event.stopPropagation();

    //     --movieIndex;

    //     if (movieIndex >= 0) {
    //         displayNextMovie(movieResponse,movieIndex);
    //     } else {
    //         movieIndex=0;
    //         //Create and append modal message for display - customize depending on where we are calling the modal from
    //         modalAlert.addClass('is-active');
    //     }
    // })

    //Click event on the 'x' in the modal to close the modal
    modalAlert.on('click', '.modal-close', function(event){
        modalAlert.removeClass('is-active');
    })


    //Search cocktail API
    function getCocktail() {
        var drinkRequestUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=" + cocktailType;

        fetch(drinkRequestUrl)
            .then(function(response) {
                if(response.status===200) {
                    console.log(response);
                    return response.json();
                } else {
                        //Create and append modal message for display - customize depending on where we are calling the modal from
                        modalAlert.addClass('is-active');
                    }
            })
            .then(function(data) {
                console.log(data);

                cocktailType = data;
                console.log(cocktailType);

                console.log(data.drinks[0].strDrink);  //drink name
                console.log(data.drinks[0].strDrinkThumb); //drink image
                console.log(data.drinks[0].idDrink);  //drink id - can use to get ingredients, instructions to make
            })
    }

    // getCocktail('Alcoholic');
    // getCocktail('Non_Alcoholic');
    


    //Click event to initialize movie/cocktail search
    submitBtn.on('click', function(event){
        event.preventDefault();
        event.stopPropagation();

        // movie
        console.log(genreInput.children("option:selected").val());
        genreId = genreInput.children("option:selected").val();

        // cocktail
        console.log(cocktailInput.children("option:selected").val());
        cocktailType = cocktailInput.children("option:selected").val();

        getMovieByGenre();
        getCocktail();
        // cocktailType = cocktailInput.val();
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