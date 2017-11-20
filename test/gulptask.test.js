import Muter, {captured} from 'muter';
import {expect} from 'chai';
import Gulptask from '../src/gulptask';

describe('Testing Gulptask', function () {
  const muter = Muter(console, 'log'); // eslint-disable-line new-cap

  it(`Class Gulptask says 'Hello world!'`, captured(muter, function () {
    new Gulptask();
    expect(muter.getLogs()).to.equal('Hello world!\n');
  }));
});
