import React, { Component } from 'react';
import moment from 'moment';
import './App.css';


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
  if (a === -1 || b === -1 || c === -1)
    return { result: 'error', msg: 'not a set: contains holes.' };

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

  for (let a = 0; a < cards.length; a++)
    for (let b = a + 1; b < cards.length; b++)
      for (let c = b + 1; c < cards.length; c++)
        if (checkTriple(cards[a], cards[b], cards[c]).result === 'ok')
          solutions.push([a, b, c]);

  return solutions;
};


const replenishBoard = (state_) => {
  let state = {...state_};
  state.showSolution = -1;

  while (state.board.length < 12) {
    state.unshift(-1);
  }

  while (state.board.length > 12 && state.board[state.board.length - 1] === -1) {
    state.board.pop();
  }

  for (let i = 0; i < 12; i++) {
    if (state.board[i] === -1 && state.deck.length > 0)
      state.board[i] = state.deck.pop();
  }

  state.solutions = solve(state.board);

  while (state.solutions.length === 0 && state.deck.length > 0) {
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
    board: Array.apply(0, Array(12)).map((x, y) => -1),
    setsfound: [],
    selected: [],
    solutions: [],
    showSolution: -1,
    stopwatch: [],
    juniorMode: juniorMode,
    showStopwatch: showStopwatch,
    errmsg: 'select 3 cards'
  };

  tickStopwatch(state.stopwatch);
  return (replenishBoard(state));
};


const toggleSelect = (state_, crd0) => {
  let state = {...state_};
  let sel = state.selected;

  if (state.board.findIndex(crd1 => crd1 === crd0) === -1  // no such card (internal error: wrong call to toggleSelect)
      || state.solutions.length === 0)                     // game over
    return;

  // if card is not in sel, add it; otherwise, remove it.
  let pos_in_sel = sel.findIndex(crd1 => crd1 === crd0);
  if (pos_in_sel === -1)
    sel.push(crd0)
  else
    sel.splice(pos_in_sel, 1);

  // remove a selected set if applicable.
  if (sel.length === 3) {
    let result = checkTriple(sel[0], sel[1], sel[2]);
    if (result.result === 'ok') {
      tickStopwatch(state.stopwatch);
      let s = [];

      for (let grab in sel) {
        let ix0 = state.board.findIndex(crd => crd === sel[grab]);
        s.push(state.board[ix0]);
        state.board[ix0] = -1;
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


const Card = ({card, svgPath, onClick, selected, isInShowedSolution}) => {
  const cls = "board-card"
            + (selected ? " selected" : "")
            + (isInShowedSolution ? " highlight" : "");

  if (card === -1) {
    return (
      <div className={cls}>
        <img height="180" width="180" alt="" src="empty.svg" />
      </div>
    );
  } else {
    const fileStem =
      allCards[card].shape + "-" +
      allCards[card].color + "-" +
      allCards[card].filling + "-" +
      allCards[card].number

    const filePath = svgPath + "/" + fileStem + ".svg"

    return (
      <div className={cls} onClick={onClick}>
        <img height="180" alt={fileStem} src={filePath} />
      </div>
    );
  }
}


const Board = ({state, setState}) => {
  let reveal = (ix) => {
    let crd = state.board[ix];

    let issel = crd0 =>
      state.selected.findIndex(crd1 => crd1 === crd0) !== -1;

    let onclck = () => {
      setState(toggleSelect(state, crd));
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


const SetsFound = ({sets}) => {
  let rows = [];
  for (let s = 0; s < 3 && s < sets.length; s++) {
    rows.push(
      <div key={s} className="app-row">
        <Card key="1" svgPath="svg" card={sets[s].val[0]} />
        <Card key="2" svgPath="svg" card={sets[s].val[1]} />
        <Card key="3" svgPath="svg" card={sets[s].val[2]} />
        {sets[s].thencount}
      </div>
    );
  }
  return (<div className="app-column">last found: {rows}</div>);
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
              { this.state.solutions.length === 0 ? 'Game Over!' : this.state.errmsg }
            </div>
          </div>
          <div className="app-column">
            { this.state.showStopwatch ? <Stopwatch ticks={this.state.stopwatch} /> : '' }
          </div>
        </div>
        <div className="app-row">
          <Board state={{...this.state}} setState={(s) => this.setState(s)} />
          <SetsFound sets={this.state.setsfound} />
        </div>
        <a href="https://github.com/fisx/react-set-game">learn more</a>
      </div>
    );
  }
}

export { App, Card, readStopwatch };
