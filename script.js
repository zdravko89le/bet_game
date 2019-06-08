// variables for bot
var gameStop            = false;
var baseBetAmount       = 0.00000001;
var bigBetBasicAmount   = 0.00000100;
var bigBetAmount        = 0.00000100;
var betStrike           = [];
var numberOfLoseInRow   = 3;
var BigLoseCyclesInRow  = 8;
var BigWinsStop         = 10;
var startingBalance     = 0;

// variables for game
var betDirection   = '';
var lastBetAmount  = 0;

function init(betDirection) {
  baseBetAmount = parseFloat(document.getElementById('BaseBetAmount').value) || baseBetAmount;
  bigBetAmount = parseFloat(document.getElementById('BigBetAmount').value) || bigBetAmount;
  bigBetBasicAmount = parseFloat(document.getElementById('BigBetAmount').value) || bigBetBasicAmount;
  numberOfLoseInRow = parseFloat(document.getElementById('loosingStrike').value) || numberOfLoseInRow;
  BigLoseCyclesInRow = parseFloat(document.getElementById('BigLoseCyclesInRow').value) || BigLoseCyclesInRow;
  BigWinsStop = parseFloat(document.getElementById('BigWinsStop').value) || BigWinsStop;
  // startingBalance = parseFloat(document.getElementById('balance').innerHTML);

  BetStart(betDirection, baseBetAmount);
}


// test functions //
window.onload = function() {
  console.log('start');
  // document.getElementById('message_win').addEventListener('DOMSubtreeModified', function(e) {
  //  console.log('aaaaaaa', e);
  // }, false);

  $('#message_win').bind("DOMSubtreeModified",function(e){

      if( $(event.currentTarget).is(':contains("win")') ){ 
        console.log('call WIN FUNCION');
        updateStats('w');
      }
  });

  $('#message_lose').bind("DOMSubtreeModified",function(e){

      if( $(event.currentTarget).is(':contains("lose")') ){ 
        console.log('call LOSE FUNCION');
        updateStats('l');
      }

      // if (e.target.innerHTML.includes('win')){
      //   console.log('POBEDAAA');
      // }
  });
}

function updateStats(status) {
  // console.log('updateStats');
  // check bet amount

  // bigBet W/L  baseBet w/l
  if (lastBetAmount == baseBetAmount) {
    status = status.toLowerCase();
  } else {
    status = status.toUpperCase();
  }

  // update betting strike
  betStrike.push(status);
  console.log('betStrike', betStrike);

  // get betting stats for previous games
  var betStats = checkBetStrike(status);

  if (betStats.bigBetWin >= BigWinsStop) {
    gameStop = true;
  }

  // if (betStats.bigBetLose >= BigLoseCyclesInRow) {
  //   gameStop = true;
  // }
  if (betStats.bigBetLosingStrike >= BigLoseCyclesInRow) {
    gameStop = true;
  }

  var nextBet;

  if (betStats.smallBetStrike == numberOfLoseInRow) {
    nextBet = bigBetAmount;
  } else {
    nextBet = baseBetAmount;
  }

  // check if is big WIN/LOSE
  if (lastBetAmount >= bigBetBasicAmount) {
    if (status == 'W') {
      bigBetAmount = bigBetBasicAmount;
      nextBet = baseBetAmount;
    }

    if (status == 'L') {
      bigBetAmount = 2 * bigBetAmount;

      if (betStrike[betStrike.length-1] == 'L' && betStrike[betStrike.length-2] != 'L') {
        nextBet = bigBetAmount;
      } else {
        nextBet = baseBetAmount;
      }
    }
  }

  if (status == 'L' || status == 'l') {
    var finalStatus = parseFloat(document.getElementById('diference').innerHTML) - lastBetAmount;
  } else {
    var finalStatus = parseFloat(document.getElementById('diference').innerHTML) + lastBetAmount;
  }
  console.log('FINALSTATUS', finalStatus)
  document.getElementById('diference').innerHTML = finalStatus.toFixed(8);


  BetStart(betDirection, nextBet)
}

function checkBetStrike(status) {
  // console.log('checkBetStrike');
  var stats = {
    'smallBetStrike': 0,
    'bigBetWin': 0,
    'bigBetLose': 0,
    'bigBetLosingStrike': 0
  }

  betStrike.reverse();

  if (betStrike.length>=numberOfLoseInRow) {
    for (var i=0; i<numberOfLoseInRow; i++) {
      if (betStrike[i]=='l') {
        stats.smallBetStrike += 1;
      } else {
        break;
      }
    }
  }

  // TODO -> loosing strike
  betStrike.forEach(function(val) {
    if (val == 'W') {
      stats.bigBetWin += 1;
    }

    if (val == 'L') {
      stats.bigBetLose +=1;
    }

    if (val == 'L') {
      if (stats.bigBetWin == 0) {
        stats.bigBetLosingStrike += 1;
      }
    }
  });

  betStrike.reverse();

  console.log('stats --> bw, bl, strike', stats)
  return stats;
}


// hi/lo bet logic
function BetStart(direction, betAmount) {
  // console.log('BetStart');
  // console.log('betStrike', betStrike);
  console.log('bigBetAmount', bigBetAmount);
  document.getElementById('big_bet_ammount').innerHTML = bigBetAmount.toFixed(8);
  if (gameStop) return;

  betDirection = direction;
  lastBetAmount = betAmount;

  // if (betAmount == 0) {
  //   betAmount     = baseBetAmount;
  //   lastBetAmount = baseBetAmount;
  // } else {
  //   lastBetAmount = betAmount;
  // }

  // set bet amount
  // document.getElementById('double_your_btc_stake').value = betAmount.toString()
  console.log('betAmount', betAmount)
  document.getElementById('bet_ammount').innerHTML = betAmount.toFixed(8);
  setTimeout(function(){ bet(betDirection); }, 2000);
  
}

// function for stoping bet
function stopBet() {
  gameStop = true;
}

function bet(bet_direction) {
  // console.log('bet');
  randNum = Math.floor(Math.random() * 10000);
  document.getElementById('number').innerHTML = randNum;

  if (bet_direction == 'HI') {
    if (randNum > 5250) {
      document.getElementById('message_win').innerHTML = 'You win';
      document.getElementById('message_win').style.display = 'block';
      document.getElementById('message_lose').innerHTML = '';
      document.getElementById('message_lose').style.display = 'none';
      return 'WIN';
    } else {
      document.getElementById('message_win').innerHTML = '';
      document.getElementById('message_win').style.display = 'none';
      document.getElementById('message_lose').innerHTML = 'You lose';
      document.getElementById('message_lose').style.display = 'block';
      return 'LOSE'
    }
  }

  if (bet_direction == 'LO') {
    if (randNum < 4750) {
      document.getElementById('message_win').innerHTML = 'You win';
      document.getElementById('message_win').style.display = 'block';
      document.getElementById('message_lose').innerHTML = '';
      document.getElementById('message_lose').style.display = 'none';
      return 'WIN';
    } else {
      document.getElementById('message_win').innerHTML = '';
      document.getElementById('message_win').style.display = 'none';
      document.getElementById('message_lose').innerHTML = 'You lose';
      document.getElementById('message_lose').style.display = 'block';
      return 'LOSE';
    }
  }
}