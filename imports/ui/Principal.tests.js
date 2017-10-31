
import { chai } from "meteor/practicalmeteor:chai";
import React from "react";
import {Principal} from "./Principal.jsx";
import { mount, shallow } from 'enzyme';
import {sinon} from 'meteor/practicalmeteor:sinon';

sinon.spy(Principal.prototype, 'componentDidMount');

describe('<Principal />', () => {
  it('calls componentDidMount', () => {
    const wrapper = mount(<Principal />);
    chai.expect(Principal.prototype.componentDidMount.calledOnce).to.equal(true);
  });
});