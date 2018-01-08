import React, { Component } from 'react';
import moment from 'moment';
import './App.css';


const allCards = [
  // (we could have constructed this in four nested loops, but it was easier
  // to generate the rolled-out code in haskell.)
  { shape: "Diamond", color: "Red", filling: "FillingEmpty", number: "One" },
  { shape: "Diamond", color: "Red", filling: "FillingEmpty", number: "Two" },
  { shape: "Diamond", color: "Red", filling: "FillingEmpty", number: "Three" },
  { shape: "Diamond", color: "Red", filling: "Solid", number: "One" },
  { shape: "Diamond", color: "Red", filling: "Solid", number: "Two" },
  { shape: "Diamond", color: "Red", filling: "Solid", number: "Three" },
  { shape: "Diamond", color: "Red", filling: "GrayedOut", number: "One" },
  { shape: "Diamond", color: "Red", filling: "GrayedOut", number: "Two" },
  { shape: "Diamond", color: "Red", filling: "GrayedOut", number: "Three" },
  { shape: "Diamond", color: "Green", filling: "FillingEmpty", number: "One" },
  { shape: "Diamond", color: "Green", filling: "FillingEmpty", number: "Two" },
  { shape: "Diamond", color: "Green", filling: "FillingEmpty", number: "Three" },
  { shape: "Diamond", color: "Green", filling: "Solid", number: "One" },
  { shape: "Diamond", color: "Green", filling: "Solid", number: "Two" },
  { shape: "Diamond", color: "Green", filling: "Solid", number: "Three" },
  { shape: "Diamond", color: "Green", filling: "GrayedOut", number: "One" },
  { shape: "Diamond", color: "Green", filling: "GrayedOut", number: "Two" },
  { shape: "Diamond", color: "Green", filling: "GrayedOut", number: "Three" },
  { shape: "Diamond", color: "Blue", filling: "FillingEmpty", number: "One" },
  { shape: "Diamond", color: "Blue", filling: "FillingEmpty", number: "Two" },
  { shape: "Diamond", color: "Blue", filling: "FillingEmpty", number: "Three" },
  { shape: "Diamond", color: "Blue", filling: "Solid", number: "One" },
  { shape: "Diamond", color: "Blue", filling: "Solid", number: "Two" },
  { shape: "Diamond", color: "Blue", filling: "Solid", number: "Three" },
  { shape: "Diamond", color: "Blue", filling: "GrayedOut", number: "One" },
  { shape: "Diamond", color: "Blue", filling: "GrayedOut", number: "Two" },
  { shape: "Diamond", color: "Blue", filling: "GrayedOut", number: "Three" },
  { shape: "Round", color: "Red", filling: "FillingEmpty", number: "One" },
  { shape: "Round", color: "Red", filling: "FillingEmpty", number: "Two" },
  { shape: "Round", color: "Red", filling: "FillingEmpty", number: "Three" },
  { shape: "Round", color: "Red", filling: "Solid", number: "One" },
  { shape: "Round", color: "Red", filling: "Solid", number: "Two" },
  { shape: "Round", color: "Red", filling: "Solid", number: "Three" },
  { shape: "Round", color: "Red", filling: "GrayedOut", number: "One" },
  { shape: "Round", color: "Red", filling: "GrayedOut", number: "Two" },
  { shape: "Round", color: "Red", filling: "GrayedOut", number: "Three" },
  { shape: "Round", color: "Green", filling: "FillingEmpty", number: "One" },
  { shape: "Round", color: "Green", filling: "FillingEmpty", number: "Two" },
  { shape: "Round", color: "Green", filling: "FillingEmpty", number: "Three" },
  { shape: "Round", color: "Green", filling: "Solid", number: "One" },
  { shape: "Round", color: "Green", filling: "Solid", number: "Two" },
  { shape: "Round", color: "Green", filling: "Solid", number: "Three" },
  { shape: "Round", color: "Green", filling: "GrayedOut", number: "One" },
  { shape: "Round", color: "Green", filling: "GrayedOut", number: "Two" },
  { shape: "Round", color: "Green", filling: "GrayedOut", number: "Three" },
  { shape: "Round", color: "Blue", filling: "FillingEmpty", number: "One" },
  { shape: "Round", color: "Blue", filling: "FillingEmpty", number: "Two" },
  { shape: "Round", color: "Blue", filling: "FillingEmpty", number: "Three" },
  { shape: "Round", color: "Blue", filling: "Solid", number: "One" },
  { shape: "Round", color: "Blue", filling: "Solid", number: "Two" },
  { shape: "Round", color: "Blue", filling: "Solid", number: "Three" },
  { shape: "Round", color: "Blue", filling: "GrayedOut", number: "One" },
  { shape: "Round", color: "Blue", filling: "GrayedOut", number: "Two" },
  { shape: "Round", color: "Blue", filling: "GrayedOut", number: "Three" },
  { shape: "Squiggle", color: "Red", filling: "FillingEmpty", number: "One" },
  { shape: "Squiggle", color: "Red", filling: "FillingEmpty", number: "Two" },
  { shape: "Squiggle", color: "Red", filling: "FillingEmpty", number: "Three" },
  { shape: "Squiggle", color: "Red", filling: "Solid", number: "One" },
  { shape: "Squiggle", color: "Red", filling: "Solid", number: "Two" },
  { shape: "Squiggle", color: "Red", filling: "Solid", number: "Three" },
  { shape: "Squiggle", color: "Red", filling: "GrayedOut", number: "One" },
  { shape: "Squiggle", color: "Red", filling: "GrayedOut", number: "Two" },
  { shape: "Squiggle", color: "Red", filling: "GrayedOut", number: "Three" },
  { shape: "Squiggle", color: "Green", filling: "FillingEmpty", number: "One" },
  { shape: "Squiggle", color: "Green", filling: "FillingEmpty", number: "Two" },
  { shape: "Squiggle", color: "Green", filling: "FillingEmpty", number: "Three" },
  { shape: "Squiggle", color: "Green", filling: "Solid", number: "One" },
  { shape: "Squiggle", color: "Green", filling: "Solid", number: "Two" },
  { shape: "Squiggle", color: "Green", filling: "Solid", number: "Three" },
  { shape: "Squiggle", color: "Green", filling: "GrayedOut", number: "One" },
  { shape: "Squiggle", color: "Green", filling: "GrayedOut", number: "Two" },
  { shape: "Squiggle", color: "Green", filling: "GrayedOut", number: "Three" },
  { shape: "Squiggle", color: "Blue", filling: "FillingEmpty", number: "One" },
  { shape: "Squiggle", color: "Blue", filling: "FillingEmpty", number: "Two" },
  { shape: "Squiggle", color: "Blue", filling: "FillingEmpty", number: "Three" },
  { shape: "Squiggle", color: "Blue", filling: "Solid", number: "One" },
  { shape: "Squiggle", color: "Blue", filling: "Solid", number: "Two" },
  { shape: "Squiggle", color: "Blue", filling: "Solid", number: "Three" },
  { shape: "Squiggle", color: "Blue", filling: "GrayedOut", number: "One" },
  { shape: "Squiggle", color: "Blue", filling: "GrayedOut", number: "Two" },
  { shape: "Squiggle", color: "Blue", filling: "GrayedOut", number: "Three" }
];


class Card extends Component {
  constructor() {
    super();
    this.fileStem = this.fileStem.bind(this);
    this.filePath = this.filePath.bind(this);
  };

  fileStem() {
    return (
      allCards[this.props.card].shape + "-" +
      allCards[this.props.card].color + "-" +
      allCards[this.props.card].filling + "-" +
      allCards[this.props.card].number
    );
  };

  filePath() {
    return (
      this.props.svgPath + "/" + this.fileStem() + ".svg"
    );
  };

  render() {
    const cls = "board-card "
              + (this.props.selected ? "selected" : "")
              + (this.props.isInShowedSolution ? "highlight" : "");
    return (
      <div className={cls} onClick={() => this.props.onClick(this.props.card)}>
        <img height="180"
             alt={this.fileStem()}
             src={this.filePath()}
        />
      </div>
    );
  };
}


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


const replenishBoard = (state_) => {
  let state = {...state_};
  state.solutions = solve(state.board);

  while ((state.board.length < 12 || state.solutions.length === 0) && state.deck.length > 0) {
    state.board.push(state.deck.pop());
    state.solutions = solve(state.board);
  }

  return state;
};


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


const initState = (juniorMode, showStopwatch) => {
  let wantThisCard = c => juniorMode ? allCards[c].filling === 'Solid' : true;
  let state = {
    deck: rndPermute(Array.apply(0, Array(allCards.length)).map((x, y) => y).filter(wantThisCard)),
    board: [],
    selected: [],
    solutions: [],
    showSolution: -1,
    stopwatch: [],
    juniorMode: juniorMode,
    showStopwatch: showStopwatch
  };

  tickStopwatch(state.stopwatch);
  return (replenishBoard(state));
};


const toggleSelect = (state_, crd0) => {
  let state = {...state_};
  let sel = state.selected;

  state.errmsg = '';

  if (state.board.findIndex(crd1 => crd1 === crd0) === -1  // no such card
      || state.solutions.length === 0)                     // game over
    return;

  let kill = sel.findIndex(crd1 => crd1 === crd0);
  if (kill === -1)
    sel.push(crd0)
  else
    sel.splice(kill, 1);

  if (sel.length > 3)
    state.selected = [crd0];

  if (sel.length === 3) {
    let result = checkTriple(sel[0], sel[1], sel[2]);
    if (result.result === 'ok') {
      tickStopwatch(state.stopwatch);
      for (let grab in sel) {
        let ix0 = state.board.findIndex(crd => crd === sel[grab]);
        state.board.splice(ix0, 1);
      }
      state = replenishBoard(state);
    } else {
      state.errmsg = result.msg;
    }
  }

  return state;
}


const handleKeyDown = (getState, setState) => e => {
  let state = getState();
  state = {...state};

  if (e.keyCode === 82) { // r
    setState(initState(state.juniorMode, state.showStopwatch));
    return;
  }

  if (e.keyCode === 67) { // c
    setState({ showSolution: (state.showSolution >= state.solutions.length - 1) ? (-1) : (state.showSolution + 1) });
    return;
  }

  let ix;
  switch(e.keyCode) {
    case  85: ix =  0; break;  // u
    case  73: ix =  1; break;  // i
    case  79: ix =  2; break;  // o
    case  80: ix =  3; break;  // p

    case  74: ix =  4; break;  // j
    case  75: ix =  5; break;  // k
    case  76: ix =  6; break;  // l
    case  59: ix =  7; break;  // ;  on firefox
    case 186: ix =  7; break;  // ;  on chromium

    case  78: ix =  8; break;  // n
    case  77: ix =  9; break;  // m
    case 188: ix = 10; break;  // ,
    case 190: ix = 11; break;  // .

    case  55: ix = 12; break;  // 7
    case  56: ix = 13; break;  // 8
    case  57: ix = 14; break;  // 9
    case  48: ix = 15; break;  // 0

    default: return;
  }

  setState(toggleSelect(state, state.board[ix]));
};


const Board = ({state, setState}) => {
  let reveal = (ix) => {
    let crd = state.board[ix];

    let issel = crd0 =>
      state.selected.findIndex(crd1 => crd1 === crd0) !== -1;

    let onclck = crd0 => {
      setState(toggleSelect(state, crd0));
    };

    let highlight = state.showSolution >= 0
                 && state.solutions.length > state.showSolution
                 && state.solutions[state.showSolution].findIndex(ix0 => ix0 === ix) !== -1;

    return <Card svgPath="svg"
                 card={crd}
                 selected={issel(crd)}
                 isInShowedSolution={highlight}
                 onClick={onclck}
    />
  };

  let row = [];
  let rows = [];
  let i;
  for (i = 0; i < state.board.length; i++) {
    if (i > 0 && i % 4 === 0) {
      rows.push(<div key={i} className="board-row">{row}</div>);
      row = [];
    }
    row.push(<div key={i}>{reveal(i)}</div>);
  }
  if (row.length > 0) {
    rows.push(<div key={i} className="board-row">{row}</div>);
    row = [];
  }

  return <div>{rows}</div>;
};


const Stopwatch = (props) => {
  let { total, avg, best, worst, history } = readStopwatch(props.ticks);

  return (
    <div>
      <div>total: { total }</div>
      <div>per set: { avg }</div>
      <div>best: { best }</div>
      <div>worst: { worst }</div>
      <div>history: { history }</div>
    </div>
  );
}


class App extends Component {
  constructor() {
    super();
    this.state = initState(false, true);
  };

  componentDidMount() {
    window.onkeydown = handleKeyDown(() => this.state, s => { this.setState(s) });
  }

  render() {
    return (
      <div className="App">
        <div className="app-row">
          <div className="app-column">
            <p>{ this.state.deck.length } cards left</p>
            <p>{ this.state.solutions.length } solutions</p>
          </div>
          <div className="app-column">
            <button onClick={() => { this.setState(initState(this.state.juniorMode, this.state.showStopwatch)); }}>
              play again
            </button>
            <button onClick={() => { this.setState(initState(!this.state.juniorMode, this.state.showStopwatch)); }}>
              { this.state.juniorMode ? 'switch to nerd mode' : 'switch to junior mode' }
            </button>
            <button onClick={() => { this.setState({ showStopwatch: !this.state.showStopwatch}); }}>
              { this.state.showStopwatch ? 'hide stop watch' : 'show stop watch' }
            </button>
            <div className="error">
              { this.state.errmsg }
              { this.state.solutions.length === 0 ? 'Game Over!' : '' }
            </div>
          </div>
          <div className="app-column">
            { this.state.showStopwatch ? <Stopwatch ticks={this.state.stopwatch} /> : '' }
          </div>
        </div>
        <Board state={{...this.state}} setState={(s) => this.setState(s)} />
        <a href="https://github.com/fisx/react-set-game">learn more</a>
      </div>
    );
  }
}

export { App, Card, readStopwatch };
