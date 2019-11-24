$(document).ready(initializeApp);

var cardClickOne = null;                // hides back of card and shows front class
var cardClickTwo = null;                // hides back of card and shows front class /cant be same child as cardClickOne
var uMatched = 0;                       // when cardClickOne and cardClickTwo classnames match, this +1
var maxMatched = 14;                    // total matches for all 4 quarters                     
var uAttempts = 0;                      // increments after every 2nd click
var numDowns = 1;
var whichQuarter = 1;


var cardArray = null;
var cardArray1 = ['a','b','a','b'];
var cardArray2 = ['a','b','c','a','b','c'];
var cardArray3 = ['a','b','c','d','a','b','c','d'];
var cardArray4 = ['a','b','c','d','e','a','b','c','d','e'];

// var cardArray3 = ['a','b','c','d','e','f','g','h','i',
//                     'a','b','c','d','e','f','g','h','i']; // Q2 a-i (18)

// var cardArray4 = ['a','b','c','d','e','f','g','h','i','j','k','l',
//                     'a','b','c','d','e','f','g','h','i','j','k','l']; // Q3 a-l (24)

// var cardArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o',
//                     'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o']; // Q4 a-o (30)

var whichModal = null;
var canClickMouse = true;

function initializeApp() {
    shuffleCards();
    $('.card').on("click", cardClickHandler);
}

function shuffleCards() {  // shuffles cardArray order

    switch (whichQuarter) {
        case 1:
            cardArray=cardArray1;
            break;
        case 2:
            cardArray=cardArray2;
            break;
        case 3:
            cardArray=cardArray3;
            break;
        case 4:
            cardArray=cardArray4;
            break;
    }

    for (var i = cardArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cardArray[i];
        cardArray[i] = cardArray[j];
        cardArray[j] = temp;
    }
    renderCardDivs();
}

function renderCardDivs() { // creates divs in random order from shuffleCards function
    $(".card-wrapper").remove();
    for (var arrIndex = 0; arrIndex < cardArray.length; arrIndex++) {
        var cardDiv = `<div class="card-wrapper"><div class="card"><div class="back face"></div><div class="front face ${cardArray[arrIndex]}"></div></div></div>`;
        $(cardDiv).appendTo(".card-container");
        // console.log("single item?:", cardArray[arrIndex]);
    }
    displayStats();
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
                switch (uMatched) {
                    case 2:
                    case 5:
                    case 9:
                        whichQuarter++
                        theModal('quarter-modal');
                        break;
                    case maxMatched:
                        theModal('won-modal');
                        break;
                }
                
            } else {
                canClickMouse = false;
                numDowns++;
                if (numDowns > 4) {
                    theModal('lost-modal');
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

    switch (whichQuarter) {
        case 1:
            $('#quarter').text('1st qtr');
            break;
        case 2:
            $('#quarter').text('2nd qtr');
            break;
        case 3:
            $('#quarter').text('3rd qtr');
            break;
        case 4:
            $('#quarter').text('4th qtr');
            break;
    }

    $('#num-attempts').text(uAttempts);
    $('#pct-accurate').text(calculateAccuracy() + "%");
}


function theModal(whichModal) {
    var greeting = null;

    switch(whichModal){
    case 'lost-modal':
        greeting = 'You Lost :(';
        break;
    case 'won-modal':
        greeting = 'You Won!!!';
        break;
    case 'quarter-modal':
        greeting = 'Ready for next quarter?';
        break;
    }

    var htmlModal = `<div class="modal-content">
                    <img src="./images/${whichModal}.gif"/> 
                    <div class= ${whichModal}>
                        <h2>${greeting}</h2>
                        <div class = "continue">Continue?</div>
                        <div class = "start-over">Start Over</div>
                        <div class = "quit">Quit</div>
                    </div>
                </div>`

    $(htmlModal).appendTo('.modal');
    $('.modal').show();

    var aCont = $('.continue');
    var bRedo = $('.start-over');
    var cQuit = $('.quit');

    $(aCont).on('click', function () {
        whichQuarter > 4 ? replayWithStats() : continueGame();
    });

    $(bRedo).on('click', function () {
        resetGame();
    });

    $(cQuit).on('click', function () {
        $('.modal').hide();
        $(".modal-content").remove();
    });


}

function resetGame() {
    cardClickOne = null;
    cardClickTwo = null;
    uMatched = 0;
    uAttempts = 0;
    whichQuarter = 1
    numDowns = 1;
    $('.modal').hide();
    $(".modal-content").remove();
    initializeApp();
    displayStats();  // **what happens when removing this and quit/reset game
}

function replayWithStats() {
    cardClickOne = null;
    cardClickTwo = null;
    whichQuarter = 1;
    numDowns = 1
    $('.modal').hide();
    $(".modal-content").remove();
    initializeApp();
}

function continueGame() {  
    cardClickOne = null;
    cardClickTwo = null;
    numDowns = 1;
    $('.modal').hide();
    $(".modal-content").remove();
    initializeApp();
}