// Configure the simulation

const config = {
  runs: 1000000
};

// Define the output object for results

let results = {
  neverSwitch: {},
  coinToss: {},
  alwaysSwitch: {}
};

// Zero out the score for each strategy

Object.keys(results).forEach((n) => {
  results[n].wins = 0;
  results[n].losses = 0;
});

// Returns a random positive integer (including zero) less than total 

const pickANumber = (total) => {
  return Math.floor(Math.random() * total);
};

// Calculate percentage wins

const calculatePercentageWins = (results) => {
  Object.keys(results).forEach((n) => {
    results[n].percentWins = Math.round((results[n].wins / config.runs) * 100);
  });
  return results;
};

/**
 * Main entry point for the simulation
 * expects one of the following strategies
 *   - 'neverSwitch' (stick with your original pick)
 *   - 'coinToss' (randomly pick between remaining options after the door has been opened)
 *   - 'alwaysSwitch' (always switch your pick)
 */

const play = (strategy) => {
  
  // Start with 3 empty choices, '0'

  let board = ['0', '0', '0'];
  
  // Randomly choose one index to hold the winning choice, '1'

  board[pickANumber(3)] = '1';

  // Randomly choose one, winning means choosing the '1'
  
  let myChoice = pickANumber(3);

  let remainingZeroLocations = [];
  let remainingNonXLocations = [];
  let myFinalChoice;

  // Randomly eliminate one of the remaining empty choices, to simulate opening a door
  
  board.forEach((n, i) => {
    if (n === '0' && i !== myChoice) {
      remainingZeroLocations.push(i);
    }
  });
  board[remainingZeroLocations[pickANumber(remainingZeroLocations.length)]] = 'X';

  if (strategy === 'coinToss') {
    board.forEach((n, i) => {
      if (n !== 'X') {
        remainingNonXLocations.push(i);
      }
    });
    myFinalChoice = remainingNonXLocations[pickANumber(2)]
  }

  if (strategy === 'alwaysSwitch') {
    board.forEach((n, i) => {
      if (n !== 'X' && i !== myChoice) {
        myFinalChoice = i;
      }
    });
  }

  // Else we keep our original choice, strategy 'neverSwitch'

  // If my choice hasn't changed, final choice is my original choice

  if (typeof myFinalChoice === 'undefined') {
    myFinalChoice = myChoice;
  }
  
  // Return true if I won

  return board[myFinalChoice] === '1';

};

// Run the simulation the configured number of times for each strategy

for (var i = 0; i < config.runs; i++) {
  Object.keys(results).forEach((n) => {
    let res = play(n);
    if (res) {
      results[n].wins ++;
    } else {
      results[n].losses ++;   
    }
  });
}

console.log(JSON.stringify(calculatePercentageWins(results), null, 2));

// Example output with 1,000,000 runs

/*

{
  "neverSwitch": {
    "wins": 333786,
    "losses": 666214,
    "percentWins": 33
  },
  "coinToss": {
    "wins": 500668,
    "losses": 499332,
    "percentWins": 50
  },
  "alwaysSwitch": {
    "wins": 666809,
    "losses": 333191,
    "percentWins": 67
  }
}

*/
