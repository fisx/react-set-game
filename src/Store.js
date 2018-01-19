import moment from 'moment';
import { createStore } from 'redux';
import './App.css';


//////////////////////////////////////////////////////////////////////
// set game mechanics

const allCards = (() => {
  let shapes   = ["Diamond", "Round", "Squiggle"];
  let colors   = ["Red", "Green", "Blue"];
  let fillings = ["FillingEmpty", "Solid", "GrayedOut"];
  let numbers  = ["One", "Two", "Three"];

  let r = [];
  for (var shape in shapes)
    for (var color in colors)
      for (var filling in fillings)
        for (var number in numbers)
          r.push({
            shape: shapes[shape],
            color: colors[color],
            filling: fillings[filling],
            number: numbers[number]
          });
  return r;
})();


const rndPermute = (v_) => {
  let v = v_.slice();
  let r = [];
  while (v.length > 0) {
    let i = Math.floor(Math.random() * v.length);
    if (i < v.length - 1) {
      r.push(v[i]);
      v[i] = v.pop();
    } else {
      r.push(v.pop());
    }
  };
  return r;
};


const checkTriple = (a, b, c) => {
  let alleq = k => (
    allCards[a][k] === allCards[b][k] &&
    allCards[b][k] === allCards[c][k]
  );
  let alldiff = k => (
    allCards[a][k] !== allCards[b][k] &&
    allCards[a][k] !== allCards[c][k] &&
    allCards[b][k] !== allCards[c][k]
  );

  for (let k in allCards[a])
    if (!(alleq(k) || alldiff(k)))
      return { result: 'error', msg: 'not a set: ' + k.toString() };

  return { result: 'ok' };
};


const solve = (cards) => {
  let solutions = [];

  for (let a = 0; a < cards.length; a++) {
    for (let b = a + 1; b < cards.length; b++) {
      for (let c = b + 1; c < cards.length; c++) {
        if (checkTriple(cards[a], cards[b], cards[c]).result === 'ok')
          solutions.push([a, b, c]);
      }
    }
  }

  return solutions;
};


const clearState = (state_) => {
  let newstate = {...state_};
  let wantThisCard = c => newstate.juniorMode ? allCards[c].filling === 'Solid' : true;
  newstate.game.deck = rndPermute(newstate.deck
                                          .map((x, y) => y)
                                          .filter(wantThisCard));
  tickStopwatch(newstate.stopwatch);
  return replenishBoard(newstate);
};


const replenishBoard = (state_) => {  // TODO: refactor.
  let state = {...state_};
  state.solutions = solve(state.board);

  while ((state.board.length < 12 || state.solutions.length === 0) && state.deck.length > 0) {
    state.board.push(state.deck.pop());
    state.solutions = solve(state.board);
  }

  return state;
};


const toggleSelect = (state_, crd0) => {  // TODO: refactor?
  let state = {...state_};
  let sel = state.selected;

  if (state.board.findIndex(crd1 => crd1 === crd0) === -1  // no such card
      || state.solutions.length === 0)                     // game over
    return;

  let kill = sel.findIndex(crd1 => crd1 === crd0);
  if (kill === -1)
    sel.push(crd0)
  else
    sel.splice(kill, 1);

  if (sel.length === 3) {
    let result = checkTriple(sel[0], sel[1], sel[2]);
    if (result.result === 'ok') {
      tickStopwatch(state.stopwatch);
      let s = [];

      for (let grab in sel) {
        let ix0 = state.board.findIndex(crd => crd === sel[grab]);
        s.push(state.board[ix0]);
        state.board.splice(ix0, 1);
      }
      state.selected = [];
      state.setsfound.unshift({val: s, thencount: state.solutions.length});
      state = replenishBoard(state);
    } else {
      state.errmsg = result.msg;
    }
  } else {
    state.errmsg = 'select 3 cards';
  }

  return state;
}


//////////////////////////////////////////////////////////////////////
// timer

const tickStopwatch = (ticks) => {
  ticks.unshift(moment());
};

const readStopwatch = (ticks) => {
  if (ticks.length < 2)
    return { total: 'n/a', avg: 'n/a', best: 'n/a', worst: 'n/a', history: 'n/a' };

  let diffs = [];

  for (let i = 0; i < ticks.length - 1 /* sic! */; i++) {
    diffs.push(ticks[i].diff(ticks[i + 1]));
  }

  let total   = diffs.reduce((a, b) => a + b, 0);
  let avg     = total / diffs.length;
  let best    = Math.min.apply(Math, diffs);
  let worst   = Math.max.apply(Math, diffs);
  let history = diffs.slice(0, 5);

  let format = (t) => {
    let m = Math.floor((t / 1000) / 60).toString();
    let s = Math.floor((t / 1000) % 60).toString();
    if (s.length === 1) s = '0'+s;
    return (m + ':' + s + 's');
  };

  return {
    total: format(total),
    avg: format(avg),
    best: format(best),
    worst: format(worst),
    history: history.map(format).toString()
  }
};


//////////////////////////////////////////////////////////////////////
// store construction and reducer

const initialState = {
  config: {
    juniorMode: false,
    showSolution: -1
  },
  stopwatch: {
    timestamps: [],
    showStopwatch: true
  },
  game: {
    deck: Array.apply(0, Array(allCards.length)),
    setsfound: [],
    board: [],
    selected: [],
    errmsg: 'select 3 cards',
    solutions: []
  }
};


const reducer = (state = {...initialState}, action) => {
  switch (action.type) {
    case 'CLEAR_STATE':
      return clearState({...initialState});

    case 'TOGGLE_JUNIOR_MODE':
      return clearState([...initialState, { config: { juniorMode: !state.config.juniorMode } } ]);

    case 'TOGGLE_SHOW_STOPWATCH':
      return [...state, { stopwatch : { showStopwatch: !state.stopwatch.showStopwatch } } ];

    case 'CYCLE_SHOW_SOLUTION':
      let newShowSolution = (state.showSolution >= state.solutions.length - 1)
                          ? (-1)
                          : (state.showSolution + 1);
      return [...state, { config: { showSolution: newShowSolution } }];

    case 'TOGGLE_SELECT':
      return toggleSelect(state, state.board[action.pos]);

    default:
      return state;
  }
};

const store = createStore(reducer);


//////////////////////////////////////////////////////////////////////
// exports

export {
  allCards,
  rndPermute,
  checkTriple,
  solve,
  replenishBoard,
  toggleSelect,

  tickStopwatch,
  readStopwatch,

  store
};
