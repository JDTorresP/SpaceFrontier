import { chai } from "meteor/practicalmeteor:chai";
import React from "react";
import {MultiGame} from "./MultiGame.jsx";
import { mount, shallow } from 'enzyme';
import {sinon} from 'meteor/practicalmeteor:sinon';

sinon.spy(MultiGame.prototype, 'componentDidMount');

describe('<MultiGame /> (MultiPlayer)', () => {
 /**it('calls componentDidMount', () => {
    const wrapper = mount(<MultiGame players = {}
                    cShip={}
                    ships={}
                    uShip={}
                    currentShipID={}
                    cParticle={}
                    particles={}
                    uParticle={}
                    dParticle={}
                    cAsteroid={}
                    asteroids={}
                    uAsteroid={}
                    cBullet={}
                    bullets={}/>);
    chai.expect(MultiGame.prototype.componentDidMount.calledOnce).to.equal(true);
  });**/
});