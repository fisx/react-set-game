import moment from 'moment';

import { expect } from 'chai';
import { shallow, mount, ReactWrapper } from 'enzyme';
import sinon from 'sinon';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import {
  //  allCards,
  readStopwatch,
  //  store,
  //  rndPermute,
  //  checkTriple,
  //  solve,
  //  replenishBoard,
  //  toggleSelect,
  //  tickStopwatch,
  //  clearState,
  initialState,
  reducer
} from './Store';

Enzyme.configure({ adapter: new Adapter() });


describe('pure app logic', () => {
  it('readStopwatch works', () => {
    let ticks = [];
    ticks.unshift(moment(new Date('2017-10-08 12:38:01')));
    ticks.unshift(moment(new Date('2017-10-08 12:38:09')));
    ticks.unshift(moment(new Date('2017-10-08 12:41:14')));

    let result = readStopwatch(ticks);
    expect(result.total).to.equal('3:13s');
    expect(result.avg).to.equal('1:36s');
    expect(result.best).to.equal('0:08s');
    expect(result.worst).to.equal('3:05s');
    expect(result.history).to.equal('3:05s,0:08s');
  });
});


describe('actions', () => {
  describe('CLEAR_STATE', () => {
    it('works', () => {
      let before = {...initialState};
      let have   = reducer(before, { type: 'CLEAR_STATE' });
      let want   = before;
      expect(have).to.be(want);
    });
  });

  describe('TOGGLE_JUNIOR_MODE', () => {
    it('sets to "junior" if it was set to "nerd" before', () => {
      pending();
    });

    it('sets to "nerd" if it was set to "junior" before', () => {
      pending();
    });
  });

  describe('TOGGLE_SHOW_STOPWATCH', () => {
    it('sets to "false" if it was "true"', () => {
      pending();
    });

    it('sets to "true" if it was "false"', () => {
      pending();
    });
  });

  describe('TOGGLE_SELECT', () => {
    it('works', () => {
      pending();
    });
  });

  describe('CYCLE_SHOW_SOLUTION', () => {
    it('works', () => {
      pending();
    });
  });
});
