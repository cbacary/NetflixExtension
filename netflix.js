// Firefox extension 

// apikey: 7177a536
// request format: http://www.omdbapi.com/?apikey={apikey}&t={movie}
// movieClassname =  class='previewModal--player-titleTreatment-logo title={movie}

// Dictionary with alreadyt queried movies (key) and their respective IMDB rating (value)

function onError(error) {
    console.log(`Error: ${error}`);
}

function onGot(item) {
    console.log(item)
    if (item.APIKey) {
        APIKey = item.APIKey;
    }
    console.log(APIKey);
}

let getting = browser.storage.sync.get("APIKey");
getting.then(onGot, onError);

var movieDict = {};

var hovering = false
var moviePageOpen = false;

var checkExist = setInterval(function () {
    if (document.getElementsByClassName("previewModal--player-titleTreatment").length > 0 && document.getElementsByClassName("detail-modal-container").length === 0) {
        var movie = document.getElementsByClassName("previewModal--player-titleTreatment-logo");
        var movieName = movie[0].getAttribute("title");
        // replace every occurence of ' ' with '+' in movieName
        movieName = movieName.replace(/ /g, '+');
        var movieUrl = "https://www.omdbapi.com/?apikey=" + APIKey + "&t=" + movieName;
        var request = new XMLHttpRequest();
        if (movieName in movieDict) {
            if (!hovering) {
                hovering = true;
                displayRating(movieDict[movieName]);
            }
        }
        else {
            console.log("test2");
            hovering = true;
            fetch(movieUrl)
                .then(response => response.json())
                .then(data => {
                    movieDict[movieName] = data.imdbRating;


                    displayRating(data['imdbRating']);

                }).catch(err => { console.log(err) });
        }
    }
    else {
        hovering = false;
    }
}, 800);

// When user opens a show page, this will grab the year to make the query more accurate. Only way to get the year is to do this. 
var checkYearExist = setInterval(function () {
    if (document.getElementsByClassName("detail-modal-container").length > 0) {
        var year = document.querySelector(".detail-modal-container").querySelector(".year").innerText;
        var movieName = document.getElementsByClassName("previewModal--player-titleTreatment-logo")[0].getAttribute("title");
        movieName = movieName.replace(/ /g, '+');
        var movieUrl = "https://www.omdbapi.com/?apikey=" + APIKey + "&t=" + movieName;
        var request = new XMLHttpRequest();
        if (movieName in movieDict) {
            if (!moviePageOpen) {
                moviePageOpen = true;
                displayRatingMoviePage(movieDict[movieName]);
            }
        }
        else {
            moviePageOpen = true;
            fetch(movieUrl)
                .then(response => response.json())
                .then(data => {
                    movieDict[movieName] = data.imdbRating;
                    displayRatingMoviePage(data['imdbRating']);
                });
        }
    } else moviePageOpen = false;
}, 1000);

// buttonControls--container
/* Display the rating of the movie on hover */
function displayRating(rating) {
    var moviePreviewElement = document.querySelector(".buttonControls--container");
    var div_temp = document.createElement("div");
    div_temp.className = "ltr-79elbk";
    div_temp.innerText = "IMDb: " + rating;
    var div = moviePreviewElement.insertBefore(div_temp, moviePreviewElement.lastChild);
}

function displayRatingMoviePage(rating) {
    var movieMetadata = document.querySelector(".previewModal--detailsMetadata-left");
    var displayBar = movieMetadata.querySelector(".videoMetadata--second-line");
    var div_temp = document.createElement("span");
    div_temp.className = "duration";
    div_temp.innerText = "IMDb: " + rating;
    var div = displayBar.appendChild(div_temp);
}

// function onError(error) {
//     console.log(`Error: ${error}`);
// }

// function onGot(item) {
//     let APIKey = "color";
//     console.log(item)
//     if (item.color) {
//         color = item.color;
//     }
//     document.body.style.border = "10px solid " + color;
// }

// let getting = browser.storage.sync.get("color");
// getting.then(onGot, onError);