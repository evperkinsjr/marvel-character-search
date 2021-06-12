$(document).ready(function(){

    var movieAPIKey = "afc05c23c80ea33317e0bfb98d0810ca";
    var genreInput = $('#genre-input');
    var cocktailInput = $('#cocktail-input');
    var submitBtn = $('#submit-btn');
    var movieTitleDisplay = $('#movie-title');
    var movieImageDisplay = $('#movie-image');
    var movieDescDisplay = $('#movie-description');
    var cocktailTitleDisplay = $('#cocktail-title');
    var cocktailImageDisplay = $('#cocktail-image');
    var cocktailIngredientsDisplay = $('#cocktail-ingredients');
    var cocktailInstructionsDisplay = $('#cocktail-instructions');
    var modalAlert = $('modal-alert');
    var prevMovieBtn = $('#prev-movie-btn');
    var nextMovieBtn = $('#next-movie-btn');
    var newCocktailBtn = $('#new-cocktail-btn');
    var genreId;
    var movieResponse;
    var movieIndex = 0;
    var cocktailType;
    var randomCocktail;
    var cocktailIndex = 0;
    var cocktailTypeListLength = 0 
    var ingredientList = document.querySelector('#cocktail-ingredients');
    

    //Search the Movie DB API by genre
    function getMovieByGenre() {
        var requestURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPIKey + 
                        "&language=en-US&include_adult=false&include_video=false&with_original_language=en&primary_release_date.gte=2011-01-01&with_genres=" + genreId;
        
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
                saveMovie(movieResponse);

                console.log(data.results[0].id) //movie Id
                console.log(data.results[0].title) //movie title, there is also an original_title
                console.log(data.results[0].overview)  //movie summary
                console.log(data.results[0].poster_path) //https://image.tmbd.org/t/p/w185 + poster_path gives movie poster image
                console.log(data.results[0].release_date) //release date

                // var title = data.results[0].title;
                // var titleCleaned = title.replace(/\s/g,'+');  //we could fetch from the OMDB API to get rotten tomatoes using titleCleaned
                // console.log(titleCleaned);

                displayMovieDetails(movieResponse,movieIndex);
            })
    }

    //Displays movie details for initial search
    function displayMovieDetails(data, index) {
        movieTitleDisplay.text(data.results[index].title);
        movieDescDisplay.text(data.results[index].overview);
        movieImageDisplay.attr('src',"https://image.tmdb.org/t/p/w185" + data.results[index].poster_path);
    }

    
    // Click event on the 'Next' movie button
    nextMovieBtn.on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        ++movieIndex;
        
        if (movieIndex < 20) {
            displayMovieDetails(movieResponse,movieIndex);
        } else {
            //if want to grab another page of results, need to call getMovieByGenre and pass in page parameter that would be incremented here
            movieIndex=19;
            //Create and append modal message for display - customize depending on where we are calling the modal from
            modalAlert.addClass('is-active');
        
        }
    })
        


    // Click event on the 'Previous' movie button
    prevMovieBtn.on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        --movieIndex;

        if (movieIndex >= 0) {
            displayMovieDetails(movieResponse,movieIndex);
        } else {
            movieIndex=0;
            //Create and append modal message for display - customize depending on where we are calling the modal from
            modalAlert.addClass('is-active');

        }
    })

    //Click event on the 'x' in the modal to close the modal
    modalAlert.on('click', '.modal-close', function(){
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

                // generate random number from data array
                var randomNum = [Math.floor(Math.random() * data.drinks.length)];

                console.log(data.drinks[randomNum].idDrink);
                
                //drink id - can use to get ingredients, instructions to make
                var randomCocktail = data.drinks[randomNum].idDrink;

                console.log(randomCocktail);

                var drinkLookupUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + randomCocktail;
            
                fetch(drinkLookupUrl)
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

                    // Log the drink name
                    console.log(data.drinks[0].strDrink);
                    cocktailTitleDisplay.text(data.drinks[0].strDrink);

                    // Log the drink image
                    console.log(data.drinks[0].strDrinkThumb);
                    cocktailImageDisplay.attr('src', data.drinks[0].strDrinkThumb);

                    // Log the drink instuctions
                    console.log(data.drinks[0].strInstructions);
                    cocktailInstructionsDisplay.text(data.drinks[0].strInstructions);

                    // Log the drink ingredients
                    
                    for(var i=1; i<16; i++) {
                        console.log();

                        if(data.drinks[0][`strIngredient${i}`] == null){
                            break;
                        }
                        
                        var ingredientItem = document.createElement('li');
                        ingredientItem.innerHTML = data.drinks[0][`strMeasure${i}`] + ": " + data.drinks[0][`strIngredient${i}`];

                        ingredientList.appendChild(ingredientItem);
                    }
                })

                cocktailTypeListLength = data.drinks.length; //To set how many drink results we get per cocktail type
                console.log(cocktailTypeListLength);

                displayCocktailDetails(cocktailType, cocktailIndex);
            })
    }


    //Click event to initialize movie/cocktail search
    submitBtn.on('click', function(event){
        event.preventDefault();
        event.stopPropagation();

        // movie
        movieIndex = 0;
        console.log(genreInput.children("option:selected").val());
        genreId = genreInput.children("option:selected").val();

        // cocktail
        cocktailIndex=0;
        console.log(cocktailInput.children("option:selected").val());
        cocktailType = cocktailInput.children("option:selected").val();

        getMovieByGenre();
        getCocktail();
    })
    
    // Click event handler for the'Previous' cocktail button
    newCocktailBtn.on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        removeIngredients(ingredientList);

        getCocktail();
    })

    function removeIngredients(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }
    
// Saving To Local Storage
var saveButton = document.querySelector(".save-button")

function saveMovie(movieResponse) {
    // var movieId = movieResponse.results[movieIndex].id;
    console.log(movieResponse);
};
