$(document).ready(initializeApp);

var cardClickOne = null;                                            // hides back of card and shows front class
var cardClickTwo = null;                                            // hides back of card and shows front class /cant be same child as cardClickOne
var uMatched = 0;                                                   // when cardClickOne and cardClickTwo classnames match, this +1
var maxMatched = 9;                                                 // when uMatched = this, game won
var uAttempts = 0;                                                  // cardClickOne / cardClickTwo
var uGamesPlayed = 0;                                               // increment +1 when uMatched = maxMatched
var cardArray = ['1', '2', '3', '4', '1', '2', '3', '4'];           // these are the classes that correlate with the hidden images

function initializeApp() {
    shuffleCards();
}

function cardClickHandler(event) {
    // $(this).find(.back).addClass("hidden");
    // conditionals
}

function shuffleCards() {  // shuffles and renders individual card divs based on cardArray
    for (var i = cardArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cardArray[i];
        cardArray[i] = cardArray[j];
        cardArray[j] = temp;
    }
    for (var arrIndex = 0; arrIndex < cardArray.length; arrIndex++) {
        var cardClass = `<div class='card '` + cardArray[arrIndex] + `></div>`;
        $(cardClass).appendTo(".card-container");
        console.log("single item?:", cardArray[arrIndex]);
    }    
}