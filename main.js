$(document).ready(initializeApp);
$(document).ready(soundModal);

var cardClickOne = null;
var cardClickTwo = null;
var uMatched = 0;
var maxMatched = 33;
var quarterMatched = 0;
var uAttempts = 0;
var numDowns = 1;
var whichQuarter = 1;
var cardArray = null;

var cardArray1 = ['a','b','c','d','e','f','a','b','c','d','e','f'];
var cardArray2 = ['a','b','c','d','e','f','g','h',
                  'a','b','c','d','e','f','g','h'];
var cardArray3 = ['a','b','c','d','e','f','g','h','i',
                  'a','b','c','d','e','f','g','h','i'];
var cardArray4 = ['a','b','c','d','e','f','g','h','i','j',
                  'a','b','c','d','e','f','g','h','i','j'];

var canClickMouse = true;
var soundOn = null;
var musicOn = null;
var gamePlayMusic = null;

function initializeApp() {
    shuffleCards();
    $('.card').on("click", cardClickHandler);
}

function shuffleCards() {  // shuffles cardArray order

    switch (whichQuarter) {
        case 1:
            cardArray = cardArray1;
            break;
        case 2:
            cardArray = cardArray2;
            break;
        case 3:
            cardArray = cardArray3;
            break;
        case 4:
            cardArray = cardArray4;
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
        var cardDiv = `<div class="card-wrapper q${whichQuarter}"><div class="card"><div class="back face"></div><div class="front face ${cardArray[arrIndex]}"></div></div></div>`;
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
            console.log('card1::', cardClickOne.css('background-image'))
        }
        else if (cardClickTwo === null) {
            cardClickTwo = $(this).find('.face:nth-child(2)');
            if (cardClickOne.css('background-image') === cardClickTwo.css('background-image')) {
                var gotFirstDown = `first-down${Math.floor(Math.random() * 7) + 1}`;
                if (quarterMatched===5 || quarterMatched===13 || quarterMatched===22) {
                    playSounds('beat-quarter');
                } else if (numDowns < 4) {
                    playSounds(gotFirstDown);
                } else {
                    playSounds('made-on-4th1')
                }
                // if (numDowns < 4) {
                //     playSounds(gotFirstDown);
                // } else {
                //     playSounds('made-on-4th1');
                // }
                uMatched++;
                quarterMatched++;
                numDowns = 1;
                cardClickOne = null;
                cardClickTwo = null;
                console.log('Matched! uMatched:', uMatched);
                switch (quarterMatched) {
                    case 6:
                    case 14:
                    case 23:
                        whichQuarter++         
                        theModal('quarter-modal');
                        break;
                    case maxMatched:
                        whichQuarter++
                        theModal('won-modal');
                        break;
                }

            } else {
                canClickMouse = false;
                numDowns++;
                if (numDowns === 4) {
                    playSounds('fourth-down');
                }
                if (numDowns > 4) {
                    theModal('lost-modal');
                    // play 'losing' sound here // it's being played in the swtch statement for greetings in modal function
                    switch (whichQuarter) {
                        case 1:
                            quarterMatched = 0;
                            break;
                        case 2:
                            quarterMatched = 6;
                            break;
                        case 3:
                            quarterMatched = 14;
                            break;
                        case 4:
                            quarterMatched = 23;
                            break;
                    }
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
    if (!cardClickOne || !cardClickTwo) {
        return;
    }
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

function addSuffix () {
    switch (whichQuarter) {
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        case 4:
            return 'th';
    }
}

function theModal(whichModal) {
    var greeting = null;
    playMusic(whichQuarter.toString());
    switch (whichModal) {
        case 'lost-modal':
            greeting = 'You Missed 4th Down! Try again?';
            playSounds('missed-4th');
            break;
        case 'won-modal':
            greeting = 'You Won!!!';
            playSounds('win-sound');
            playMusic('win-song');
            break;
        case 'quarter-modal':
            greeting = `Ready for the ${whichQuarter+addSuffix()} quarter?`;
            break;
    }

    var htmlModal = `<div class="modal-content">
                    <img src="./images/${whichModal}.gif"/> 
                    <div class= ${whichModal}>
                        <h2>${greeting}</h2>
                        <div class = "options-container">
                            <button class = "options-buttons continue">Continue?</button>
                            <button class = "options-buttons start-over">Start Over</button>
                            <button class = "options-buttons quit">Quit</button>
                        </div>
                    </div>
                </div>`
// maybe do above var like $('<.modal-content>').appendTo('.modal')
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
        canClickMouse = false;
    });
}

function resetGame() {
    cardClickOne = null;
    cardClickTwo = null;
    uMatched = 0;
    quarterMatched = 0;
    uAttempts = 0;
    whichQuarter = 1;
    playMusic(whichQuarter.toString());
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
    playMusic(whichQuarter.toString());
    numDowns = 1
    quarterMatched = 0;
    $('.modal').hide();
    $(".modal-content").remove();
    initializeApp();
    displayStats();
}

function continueGame() {
    cardClickOne = null;
    cardClickTwo = null;
    numDowns = 1;
    playMusic(whichQuarter.toString());
    $('.modal').hide();
    $(".modal-content").remove();
    initializeApp();
}

function welcomeModal() {
    var openModal = `<div class="modal-content">
                        <img src="./images/helmet.png"/>
                        <div class= "welcome-modal">
                            <h2 class = "welcome">Welcome to the Buffalo Bills Matching Game</h2>
                            <div class = "instr-heading"> Instructions:</div>
                            <div class = "instruction-container">
                                <li class = "instructions">Begin on 1st Down.</li>
                                <li class = "instructions">Make a match for 1st Down.</li>
                                <li class = "instructions">If you miss 4th down, you can replay the quarter.</li>
                                <li class = "instructions">Make it through 4 quarters to win!!</li>
                            </div>
                            <button id = "play-button">Let's Play!</button>
                        </div>
                    </div>`

    $(openModal).appendTo('.modal');
    $('.modal').show();
    var welcomeSong = new Audio(`./sounds/gameplay-0.mp3`);
    welcomeSong.play();
    $('#play-button').on('click', function () {
        $('.modal').hide();
        $(".modal-content").remove();
        var letsPlaySounds = ['lets-play1','lets-play2']; 
        var clickLetsPlay = letsPlaySounds[Math.floor(Math.random()*letsPlaySounds.length)];
        welcomeSong.pause();
        playMusic(whichQuarter.toString());
        playSounds(clickLetsPlay);
    });

}

function soundModal() {
    var doYouWantSound = `<div class="modal-content">
                            <div class='sound-modal'>
                                <h2>Choose your sound preferences:</h2>
                                    <div class = "sound-pref">
                                        <input type="checkbox" id="sfx" checked> Sound F/X<br>
                                    </div>
                                    <div class = "sound-pref">
                                        <input type="checkbox" id="music" checked> Music
                                    </div>

                                    <input type = "submit" id = "sounds-go" value = "Go">
                            </div>
                        </div>`


    $(doYouWantSound).appendTo('.modal');
    $('.modal').show();
    $('#sounds-go').on('click', function () {
        soundValidate();
    });

}

function soundValidate () {
    var sFxToggle = document.getElementById("sfx").checked;
    var musicToggle = document.getElementById("music").checked;

    if (sFxToggle) {
        soundOn = true;
    } else {
        soundOn = false;
    }

    if (musicToggle) {
        musicOn = true;
    } else {
        musicOn = false;
    }    
        $(".modal-content").remove();
        welcomeModal();
}

function playSounds(soundFile) {
    var soundFX = new Audio(`./sounds/${soundFile}.mp3`);
    if (!soundOn) {
        return;
    }
    soundFX.play();
}

function playMusic(gameMusicQuarter) {
    if (!musicOn) {
        return;
    }

    if (gamePlayMusic) {  //make a !file.paused here
        gamePlayMusic.pause();
        gamePlayMusic = null;
    } else {
    gamePlayMusic = new Audio(`./sounds/gameplay-${gameMusicQuarter}.mp3`);  //name files gameplay-1, gameplay-2 etc call by playMusic(whichQuarter)

    gamePlayMusic.loop = true;
    return gamePlayMusic.play();
    }
    
}