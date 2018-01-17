import React from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';

import { expect } from 'chai';
import { shallow, mount, ReactWrapper } from 'enzyme';
import sinon from 'sinon';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { App, Card, readStopwatch } from './App';

Enzyme.configure({ adapter: new Adapter() });


// useful:
// https://github.com/airbnb/enzyme/tree/master/docs/api
// https://github.com/airbnb/enzyme/tree/master/packages/enzyme-test-suite/test


describe('<App />', () => {
  it('renders at least 12 <Card /> components', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find(Card)).to.satisfy(({length: l}) => l >= 12);
  });


  /*
  it('2', () => {
    const wrapper = shallow((
      <div className="foo" />
    ));

    expect(wrapper.find('.foo')).to.have.length(1);
    expect(wrapper.hasClass('foo')).to.equal(true);
  });

  it('3', () => {
    const wrapper = shallow(<Card svgPath="svg" card={{ shape: "Squiggle", color: "Blue", filling: "GrayedOut", number: "Three" }} />);

    expect(wrapper.find('.selected')).to.have.length(1);
    expect(wrapper.hasClass('selected')).to.equal(true);
  });

  it('4', () => {
    const wrapper = mount(<div><Card svgPath="svg" card={{ shape: "Squiggle", color: "Blue", filling: "GrayedOut", number: "Three" }} /></div>);

    expect(wrapper.find('.selected')).to.have.length(1);
    // expect(wrapper.hasClass('selected')).to.equal(true);
  });
  */


  it('selects card on first click', () => {
    const wrapper = mount(<App />);
    let cards = wrapper.find(Card);
    cards.at(0).simulate('click');

    pending();

    // i think the problem is that compontents mounted into enzyme are not refreshing as we expect?  or is it something to do with js "concurrency"?

    expect(cards).to.have.length(12);
    expect(cards.find('.selected')).to.have.length(1);
    expect(cards.at(0).find('.selected')).to.have.length(1);
    expect(cards.at(1).find('.selected')).to.have.length(0);

    // note there is a difference between these two, so we need to find
    // the .selected to make this test work properly:
    // console.log(cards.at(0).getElement());
    // console.log(cards.at(0).find('.selected').getElement());
    // console.log(cards.at(0).hasClass('selected'));  // => false
    // console.log(cards.at(0).find('.selected').hasClass('selected'));  // => true
  });

  it('de-selects card on second click', () => {
    pending();
  });

  it('selects two cards on first click', () => {
    pending();
  });

  it('selects three cards on first click', () => {
    pending();
  });

  it('selects four cards on first click', () => {
    pending();
  });


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



/*
it('... click events', () => {
  const onButtonClick = sinon.spy();
  const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
  wrapper.find('button').simulate('click');
  expect(onButtonClick).to.have.property('callCount', 1);
});
*/
