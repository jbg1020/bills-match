$(document).ready(initializeApp);

var cardClickOne = null;                // hides back of card and shows front class
var cardClickTwo = null;                // hides back of card and shows front class /cant be same child as cardClickOne
var uMatched = 0;                       // when cardClickOne and cardClickTwo classnames match, this +1
var maxMatched = 9;                     // when uMatched = this, game won // 2(test), 6(Q1), 9(Q2), 12(Q3), 15(Q4)
var uAttempts = 0;                      // increments after every 2nd click
var uGamesPlayed = 0;                   // increment +1 when uMatched = maxMatched
var numDowns = 1;
// var cardArray = [                       // these are the classes that correlate with the hidden images
//     'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
//     'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'
// ];

// var cardArray = ['a','b','a', 'b']; // small size for testing

// var cardArray = ['a','b','c','d','e','f','a','b','c','d','e','f']; // Q1 a-f (12)

// var cardArray = ['a','b','c','d','e','f','g','h','i',
//                     'a','b','c','d','e','f','g','h','i']; // Q2 a-i (18)

// var cardArray = ['a','b','c','d','e','f','g','h','i','j','k','l',
//                     'a','b','c','d','e','f','g','h','i','j','k','l']; // Q3 a-l (24)

var cardArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o',
                    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o']; // Q4 a-o (30)


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
    displayStats();
}

function renderCardDivs() { // creates divs in random order from shuffleCards function
    $( ".card-wrapper" ).remove();
    for (var arrIndex = 0; arrIndex < cardArray.length; arrIndex++) {
        var cardDiv = `<div class="card-wrapper"><div class="card"><div class="back face"></div><div class="front face ${cardArray[arrIndex]}"></div></div></div>`;
        $(cardDiv).appendTo(".card-container");
        // console.log("single item?:", cardArray[arrIndex]);
    }
}

function winModal() {
    var wooHoo = `<div class="modal-content win-modal">
                    <h2>YOU WON</h2>
                    <div class = "replay">PLAY AGAIN?</div>
                    <div class="quit">QUIT</div>
                </div>`;
                $(wooHoo).appendTo(".modal");
                $('.modal').show();

    var playAgain = $('.replay')[0];
    var resetQuit = $('.quit')[0];

    playAgain.onclick = function() {
        continueGame();
    }    
    resetQuit.onclick = function() {
        resetGame();
    }
}

function loseModal() {
    var wompWomp = `<div class="modal-content">
                    <img src="./images/you-lose.gif"/>
                    <div class="lost-modal">
                        <h2>You Lost :(</h2>
                        <div class = "replay">PLAY AGAIN?</div>
                        <div class="quit">QUIT</div>
                    </div>
                </div>`;
                $(wompWomp).appendTo(".modal");
                $('.modal').show();

                //lay out divs similart for winmodal

    var playAgain = $('.replay')[0];
    var resetQuit = $('.quit')[0];

    playAgain.onclick = function() {
        resetGame();
    }    
    resetQuit.onclick = function() {
        resetGame();
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
                numDowns = 1;
                cardClickOne = null;
                cardClickTwo = null;
                console.log('Matched! uMatched:', uMatched);
                if (uMatched === maxMatched) {
                    uGamesPlayed++
                    console.log("You Won!");
                    winModal();
                }
            } else {
                canClickMouse = false;
                numDowns++;
                if (numDowns === 5) {
                    loseModal();
                    // show lose modal
                }
                // console.log('card2::', cardClickTwo.css('background-image'))
                setTimeout(flipBackMismatch, 1000);
            }
            uAttempts++;
            displayStats();
            console.log('attempts #:', uAttempts);
            console.log('accuracy:', calculateAccuracy() + '%');
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

function calculateAccuracy() {
    if (uAttempts === 0) {
        return 0;
    }
    return Math.round(uMatched / uAttempts * 100);
}

function displayStats() {
    switch (numDowns) {
        case 1:
            $('#down').text('first down');
            break;
        case 2:
            $('#down').text('second down');
            break;
        case 3:
            $('#down').text('third down');
            break;
        case 4:
            $('#down').text('fourth down');
            break;
    }
    $('#num-games-played').text(uGamesPlayed);
    $('#num-attempts').text(uAttempts);
    $('#pct-accurate').text(calculateAccuracy() + "%");
}

function resetGame() {
    cardClickOne = null;
    cardClickTwo = null;
    uMatched = 0;
    maxMatched = 9; // 2(test), 6(Q1), 9(Q2), 12(Q3), 15(Q4)
    uAttempts = 0;
    uGamesPlayed = 0;
    numDowns = 1;
    $('.modal').hide();
    $(".modal-content").remove();
    initializeApp();
    displayStats();
}

function continueGame() {
    cardClickOne = null;
    cardClickTwo = null;
    maxMatched += 9; // 2(test), 6(Q1), 9(Q2), 12(Q3), 15(Q4)
    $('.modal').hide();
    $(".modal-content").remove();
    initializeApp();
}