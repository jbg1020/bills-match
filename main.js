$(document).ready(initializeApp);

var cardClickOne = null;                                            // hides back of card and shows front class
var cardClickTwo = null;                                            // hides back of card and shows front class /cant be same child as cardClickOne
var uMatched = 0;                                                   // when cardClickOne and cardClickTwo classnames match, this +1
var maxMatched = 9;                                                 // when uMatched = this, game won
var uAttempts = 0;                                                  // cardClickOne / cardClickTwo
var uGamesPlayed = 0;                                               // increment +1 when uMatched = maxMatched
var cardArray = [                                                   // these are the classes that correlate with the hidden images
    'a','b','c','d','e','f','g','h','i',
    'a','b','c','d','e','f','g','h','i'
];

function initializeApp() {
    shuffleCards();
    $('.card').on("click", cardClickHandler);
}

function cardClickHandler(event) {
    $(this).find('.back').addClass('hidden');
    console.log('click registered:', event);
    // conditionals
}

function shuffleCards() {  // shuffles cardArray order
    for (var i = cardArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cardArray[i];
        cardArray[i] = cardArray[j];
        cardArray[j] = temp;
    }
    renderCardDivs();
}

function renderCardDivs() { // creates divs in random order from shuffleCards function
    for (var arrIndex = 0; arrIndex < cardArray.length; arrIndex++) {
        var cardDiv = `<div class="card"><div class="back face"></div><div class="front face ${cardArray[arrIndex]}"></div></div>`;
        // var cardClass = `<div class="card cardArray[arrIndex]   `
        $(cardDiv).appendTo(".card-container");
        console.log("single item?:", cardArray[arrIndex]);
    }
}