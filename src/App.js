import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import {
  allCards,
  rndPermute,
  replenishBoard,
  toggleSelect,
  tickStopwatch,
  readStopwatch,
} from './Store.js';


const initState = (juniorMode, showStopwatch) => {  // TODO: deprecated in favor of redux.
  let wantThisCard = c => juniorMode ? allCards[c].filling === 'Solid' : true;
  let state = {
    deck: rndPermute(Array.apply(0, Array(allCards.length)).map((x, y) => y).filter(wantThisCard)),
    board: [],
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


const Card = ({card, svgPath, onClick, selected, isPartOfHint}) => {
  const fileStem =
    allCards[card].shape + "-" +
    allCards[card].color + "-" +
    allCards[card].filling + "-" +
    allCards[card].number

  const filePath = svgPath + "/" + fileStem + ".svg"

  const cls = "board-card"
            + (selected ? " selected" : "")
            + (isPartOfHint ? " highlight" : "");

  return (
    <div className={cls} onClick={onClick}>
      <img height="180" alt={fileStem} src={filePath} />
    </div>
  );
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
                 isPartOfHint={highlight}
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

const storeForApp = (state) => state;
connect(storeForApp)(App);

export {
  App,
  Card,
  readStopwatch
};
