let bjGame = {
    'you': {
        'scorespan': '#your-blackjack-result',
        'div': '#your-box',
        'score': 0
    },
    'dealer': {
        'scorespan': '#dealer-blackjack-result',
        'div': '#dealer-box',
        'score': 0
    },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'],
    'cardsMap': {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        'K': 10,  
        'J': 10,
        'Q': 10,
        'A': [1, 11]
    },
    'wins':0,
    'losses':0,
    'draws':0,
    'isStand':false,
    'turnOver':false,
};
const namey=prompt('Enter your name:-').toLowerCase();
const You = bjGame['you']
const Dealer = bjGame['dealer']
const hitsound = new Audio("swish.m4a");
const winsound = new Audio("cash.mp3");
const losesound = new Audio("aww.mp3");
document.querySelector("#bj-hit-btn").addEventListener("click", blackjackhit);
document.querySelector("#bj-stand-btn").addEventListener("click", dealerLogic);
document.querySelector("#bj-deal-btn").addEventListener("click", blackjackdeal);
document.querySelector('#name').textContent=cap(namey);
function cap(str){
    return str.charAt(0).toUpperCase()+ str.slice(1)
} 
function blackjackhit() {
    if(bjGame['isStand']===false){
    let card = randomcard();
    console.log(card);
    showcard(card, You);
    updateScore(card, You);
    showScore(You)
    }
}

function showcard(card, actpl) {
    if (actpl['score'] <= 21) {
        let cardImg = document.createElement('img');
        cardImg.src = `${card}.png`;
        document.querySelector(actpl['div']).appendChild(cardImg);
        hitsound.play();
    }
}

function randomcard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return bjGame['cards'][randomIndex]
}

function updateScore(cards, actpl) {
    if (cards === 'A') {
        if (actpl['score'] + bjGame['cardsMap'][cards][1] <= 21) {
            actpl['score'] += bjGame['cardsMap'][cards][1];
        } else {
            actpl['score'] += bjGame['cardsMap'][cards][0];
        }
    } else {
        actpl['score'] += bjGame['cardsMap'][cards];
    }
}

function showScore(actpl) {
    if (actpl['score'] > 21) {
        document.querySelector(actpl['scorespan']).textContent = 'Bust!';
        document.querySelector(actpl['scorespan']).style.color = 'red';
    } else {
        document.querySelector(actpl['scorespan']).textContent = actpl['score'];
    }
}

function blackjackdeal() {
    if(bjGame['turnOver']===true){
        bjGame['isStand']=false;
    let yourimg = document.querySelector('#your-box').querySelectorAll('img');
    let dealerimg = document.querySelector('#dealer-box').querySelectorAll('img');
    for (i = 0; i < yourimg.length; i++) {
        yourimg[i].remove();
    }
    for (i = 0; i < dealerimg.length; i++) {
        dealerimg[i].remove();
    }
    You['score'] = 0;
    Dealer['score'] = 0;

    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').textContent = 0;
    document.querySelector('#your-blackjack-result').style.color = 'white';
    document.querySelector('#dealer-blackjack-result').style.color = 'white'; 
    document.querySelector('#bj-result').textContent = "Let's Play";
    document.querySelector('#bj-result').style.color = 'white';
    bjGame['turnOver']=false;
}
} 
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}
async function dealerLogic() {
    if(bjGame['turnOver']===false){
    bjGame['isStand']=true; 
    while(Dealer['score']<16 && bjGame['isStand']===true){
    let card = randomcard();
    showcard(card, Dealer);
    updateScore(card, Dealer);
    showScore(Dealer);
    await sleep(500);
    }
   if(Dealer['score']>15){
       bjGame['turnOver']=true;
       let winner=computeWinner();
       showWinner(winner);
   }
}
}

function computeWinner() {
    let winner;
    if (You['score'] <= 21) {
        if (You['score'] > Dealer['score'] || (Dealer['score'] > 21)) {
         bjGame['wins']++;
            winner = You;
        } else if (You['score'] < Dealer['score']) {
            bjGame['losses']++;
            winner = Dealer;
        } else if (You['score'] === Dealer['score']) {
            bjGame['draws']++;
        }
    } else if ((You['score'] > 21) && (Dealer['score']<= 21)) {
        bjGame['losses']++;
        winner = Dealer;
    } else if ((You['score'] > 21) && (Dealer['score']> 21)) {
        bjGame['draws']++;
    }

    return winner;
}

function showWinner(winner) {
    let message, messagecolor;
    if(bjGame['turnOver']===true){
    if (winner === You) {
        document.querySelector('#wins').textContent = bjGame['wins'];
        message = 'You win!';
        messagecolor = "green";
        winsound.play();
    } else if (winner === Dealer) {
        document.querySelector('#losses').textContent = bjGame['losses'];
        message = 'You lose!';
        messagecolor = "red";
        losesound.play();
    }
    else {
        document.querySelector('#draws').textContent = bjGame['draws'];
        message = 'You drew!';
        messagecolor = 'white';
        
    }
    }
    document.querySelector('#bj-result').textContent = message;
    document.querySelector('#bj-result').style.color = messagecolor;
}
