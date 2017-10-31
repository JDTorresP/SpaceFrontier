import { chai } from "meteor/practicalmeteor:chai";
import React from "react";
import {AloneG} from "./AloneG.jsx";
import { mount, shallow } from 'enzyme';
import {sinon} from 'meteor/practicalmeteor:sinon';
/**import jsdom from 'jsdom';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;**/

sinon.spy(AloneG.prototype, 'componentDidMount');

describe('<AloneG /> (SinglePlayer)', () => {
  it('calls componentDidMount', () => {
    const wrapper = mount(<AloneG />);
    chai.expect(AloneG.prototype.componentDidMount.calledOnce).to.equal(true);
  });
});