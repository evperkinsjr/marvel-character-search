$(document).ready(function(){

    var movieAPIKey = "afc05c23c80ea33317e0bfb98d0810ca";
    var genreInput = $('#genre-input');
    var cocktailInput = $('#cocktail-input');
    var submitBtn = $('#submit-btn');
    var movieTitleDisplay = $('#movie-title');
    var movieImageDisplay = $('#movie-image');
    var movieDescDisplay = $('#movie-description');
    var movieReleaseDateDisplay = $('#movie-release-date');
    var movieRatingDisplay = $('#tmdb-user-rating');
    var cocktailTitleDisplay = $('#cocktail-title');
    var cocktailImageDisplay = $('#cocktail-image');
    var cocktailIngredientsDisplay = $('#cocktail-ingredients');
    var cocktailInstructionsDisplay = $('#cocktail-instructions');
    var modalAlert = $('#modal-alert');
    var modalText = $('#modal-text');
    var newMovieBtn = $('#new-movie-btn');
    var newCocktailBtn = $('#new-cocktail-btn');
    var genreId;
    var movieResponse;
    var movieIndex = 0;
    var cocktailType;
    var randomCocktail;
    var randomDetailsArray;
    var cocktailIndex = 0;
    var cocktailArray;
    var saveFavButton = $('#save-favorite-button');


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
                // Sets movieId to be used in Local Storage Function 
                movieId = data.results[0].id;
                savMovieTitle = data.results[0].title
                savMovieDesc = data.results[0].overview
                savMovieRelDate = data.results[0].release_date

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
        movieReleaseDateDisplay.text(data.results[index].release_date);
        movieRatingDisplay.text(data.results[index].vote_average);
    }

    
    // Click event on the 'Next' movie button
    newMovieBtn.on('click', function(event) {
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
        


    //Click event on the 'x' in the modal to close the modal
    modalAlert.on('click', '.modal-close', function(){
        modalAlert.removeClass('is-active');
    })






    //Search cocktail API

    function getCocktail() {
        var drinkRequestUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?" + cocktailType;

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
                cocktailArray = data;
                getRandomDrink(cocktailArray);
            });
           
    }

    function getRandomDrink(data) {

        // generate random number from data array
        var randomNum = [Math.floor(Math.random() * data.drinks.length)];

        console.log(data.drinks[randomNum].idDrink);
    
        //drink id - can use to get ingredients, instructions to make
        randomCocktail = data.drinks[randomNum].idDrink;

        console.log(randomCocktail);

        getDrinkDetails();
    }
    
    // Search cocktail api to get full drink details
    function getDrinkDetails() {
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
            
            savDrinkTitle = data.drinks[0].strDrink;
            savDrinkInstr = data.drinks[0].strInstructions;
            // savDrinkIngr = 

            randomDetailsArray = data;
            //  Sets drinkId to be used in Saving to Local Storage Function
            drinkId = data.drinks[0].idDrink;

            // Log the drink name
            console.log(data.drinks[0].strDrink);

            console.log(randomDetailsArray.drinks[0].strDrink);
            // Log the drink image
            console.log(data.drinks[0].strDrinkThumb);

            // Log the drink instuctions
            console.log(data.drinks[0].strInstructions);

            console.log(randomDetailsArray.drinks[cocktailIndex].strDrink);
            // Log the drink ingredients/measurements
    

            // Attach cocktail info to page
            cocktailTitleDisplay.text(data.drinks[cocktailIndex].strDrink);
            cocktailImageDisplay.attr('src', data.drinks[cocktailIndex].strDrinkThumb);
            cocktailInstructionsDisplay.text(data.drinks[cocktailIndex].strInstructions);

            for(var i=1; i<16; i++) {
                console.log();

                if(data.drinks[0][`strIngredient${i}`] === null || data.drinks[0][`strIngredient${i}`]===""){
                    break;
                }
                
                var ingredientItem = document.createElement('li');

                if (data.drinks[0][`strMeasure${i}`]!== null) {
                    ingredientItem.innerHTML = data.drinks[0][`strMeasure${i}`] + ": " + data.drinks[0][`strIngredient${i}`];
                } else {
                    ingredientItem.innerHTML = data.drinks[0][`strIngredient${i}`];
                }
            

                cocktailIngredientsDisplay.append(ingredientItem);
            }

        });
        
    }
    


    //Click event to initialize movie/cocktail search
    submitBtn.on('click', function(event){
        event.preventDefault();
        event.stopPropagation();

        if ((genreInput.children("option:selected").val() === "") || (cocktailInput.children("option:selected").val() === "")) {
            modalAlert.addClass('is-active');
            modalText.text("Please select a movie genre and drink type.")
            return;
        }

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

        document.getElementById("save-favorite-button").style.visibility = "visible"
    })

     // Click event handler for 'Next' cocktail button
    newCocktailBtn.on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        removeIngredients(cocktailIngredientsDisplay);

        getCocktail();
    })

    function removeIngredients(parent) {
        $(parent).empty();
    }
})


// Saving To Local Storage
var saveButton = document.querySelector(".save-button");
var movieId;
var drinkId;
var savMovieTitle;
var savMovieTitle;
var savMovieDesc;
var savMovieRelDate;
var favComboList = []
      
    // Function to save movieId AND drinkId
function saveCombo() {
    console.log(movieId);
    console.log(drinkId);
    
    var favCombo = {
            movieTitle: savMovieTitle,
            movieDesc: savMovieDesc,
            movieRelDate: savMovieRelDate,
            drinkTitle: savDrinkTitle,
            drinkInstr: savDrinkInstr,
            // drinkIngr: savDrinkIngr,
        } 
    favComboList.push(favCombo);
    localStorage.setItem("favComboList", JSON.stringify(favComboList));
}
    // Function to get saved combos from local storage
function initSavedCombo() {
    var storedCombo = localStorage.getItem('favComboList');
    if (storedCombo) {
        favComboList = JSON.parse(storedCombo);
    }
}

    // Event listener for button to save movie and drink Id's to local storage
saveButton.addEventListener("click", function(event) {
    event.preventDefault();
    saveCombo();

    if (movieId === undefined || drinkId === undefined) {
        return;
    }
});

initSavedCombo();
