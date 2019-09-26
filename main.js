$(document).ready(initializeApp);

var cardClickOne = null;                // hides back of card and shows front class
var cardClickTwo = null;                // hides back of card and shows front class /cant be same child as cardClickOne
var uMatched = 0;                       // when cardClickOne and cardClickTwo classnames match, this +1
var maxMatched = 9;                     // when uMatched = this, game won
var uAttempts = 0;                      // increments after every 2nd click
var uGamesPlayed = 0;                   // increment +1 when uMatched = maxMatched
var cardArray = [                       // these are the classes that correlate with the hidden images
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'
];
var canClickMouse = true;

function initializeApp() {
    shuffleCards();
    $('.card').on("click", cardClickHandler);
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
        $(cardDiv).appendTo(".card-container");
        // console.log("single item?:", cardArray[arrIndex]);
    }
}

function cardClickHandler(event) {
    if ($(event.target).hasClass('front'))
        return;
    if (!canClickMouse)
        return;
    else {
        $(this).find('.face:nth-child(1)').addClass("hidden");
        if (cardClickOne === null) {
            cardClickOne = $(this).find('.face:nth-child(2)');
            // debugger;
            console.log('card1::', cardClickOne.css('background-image'))
        }
        else if (cardClickTwo === null) {
            cardClickTwo = $(this).find('.face:nth-child(2)');
            if (cardClickOne.css('background-image') === cardClickTwo.css('background-image')) {
                uMatched++;
                cardClickOne = null;
                cardClickTwo = null;
                console.log('Matched! uMatched:', uMatched);
                if (uMatched === maxMatched) {
                    uGamesPlayed++
                    console.log("You Won!");
                }
            } else {
                canClickMouse = false;
                console.log('card2::', cardClickTwo.css('background-image'))
                setTimeout(flipBackMismatch, 1000);
            }
            uAttempts++
            displayStats();
            console.log('attempts #:', uAttempts);
            console.log('accuracy:', calculateAccuracy()+'%');
            console.log('event.delegateTarget:', event.delegateTarget)
        }
    }
}

function flipBackMismatch() {
    cardClickOne.prev().removeClass("hidden");
    cardClickTwo.prev().removeClass("hidden");
    console.log("No match!");
    cardClickOne = null;
    cardClickTwo = null;
    canClickMouse = true;
}

function calculateAccuracy () {
    return Math.round(uMatched/uAttempts*100);
}

function displayStats () {
    $('#num-games-played').text(uGamesPlayed);
    $('#num-attempts').text(uAttempts);
    $('#pct-accurate').text(calculateAccuracy() +"%");
}