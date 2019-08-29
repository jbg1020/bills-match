$(document).ready(initializeApp);

var cardClickOne = null;
var cardClickTwo = null;
var uMatched = 0;
var maxMatched = 9;
var uAttempts = 0;
var uGamesPlayed = 0;
// var cardArray = ['1', '2', '3', '4'];
// var cardArray = [1,2,3,4];
// var cardDiv = $('.card');

function initializeApp() {
    displayShuffledCards();
}

function cardClickHandler(event) {
    // $(this).find(.back).addClass("hidden");
    // conditionals
}

function displayShuffledCards() {
    var cardArray = ['1', '2', '3', '4', '1', '2', '3', '4'];
    for (var i = cardArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cardArray[i];
        cardArray[i] = cardArray[j];
        cardArray[j] = temp;
    }
    singleClassFromShuffle(cardArray);
}

function singleClassFromShuffle(array) {
    var cardDiv = $('.card');
    for (var arrIndex = 0; arrIndex < array.length; arrIndex++) {
        cardDiv.addClass(array[arrIndex]);
        console.log("single item?:", array[arrIndex]);
    }
}