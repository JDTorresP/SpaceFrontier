// Felipe Iregui: Me parece que estan utilizando los componentes de react muy bien, muchas jerarquias y orden, hace que sea mas facil de entender y para ustedes de cambiar
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';
//Componentes
import InputPlayer from './InputPlayer.jsx'
import Board from './Board.jsx'
import Controls from './Controls.jsx'
import OwnShip from '../sketches/OwnShip.js';
import {AloneG} from './AloneG.jsx';
import {MultiGame} from './MultiGame.jsx';
import {Principal} from './Principal.jsx';

//Collections players
import {Players} from '../api/players.js';
import {Shipsdb} from '../api/shipsdb.js';
import {ParticlesDB} from '../api/particles.js';
import {AsteroidsDB} from '../api/asteroids.js';
import {BulletsDB} from '../api//bullets.js';


// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            enConstruccion:false,
            alone:false,
            multiplayer:false,
            players: [
                {
                    name: 'Joan',
                    x: 300,
                    y: 300,
                    r: 10
                }
            ],
            currentID:'',
            ks:"",
            defaultC:true
        }
        this.width = 900;
        this.height = 654;
        this.onEnterPlayer = this.onEnterPlayer.bind(this);
        this.movePlayer = this.movePlayer.bind(this);
        this.crearShip = this.crearShip.bind(this);
        this.crearParticula = this.crearParticula.bind(this);
        this.updateShip = this.updateShip.bind(this);
        this.deleteShip = this.deleteShip.bind(this);
        this.selectionSingle = this.selectionSingle.bind(this);
        this.selectionMultiplayer = this.selectionMultiplayer.bind(this);
        this.deleteParticle = this.deleteParticle.bind(this);
        this.crearAsteroide = this.crearAsteroide.bind(this);
        this.crearBullet = this.crearBullet.bind(this);
        this.updateBullet = this.updateBullet.bind(this);
        this.deleteBullet = this.deleteBullet.bind(this);
        this.deletePlayer = this.deletePlayer.bind(this);
        this.selectionMultiplayer2=this.selectionMultiplayer2.bind(this);
        this.changeDefaults=this.changeDefaults.bind(this);
 
    }
    
    crearShip(item){
        item._id=Shipsdb.insert(item);
        this.setState({
            currentID:item._id
        })
    }
    crearParticula(item){
        ParticlesDB.insert(item);
    }
    crearAsteroide(item){
        AsteroidsDB.insert(item);
    }
    crearBullet(item){
        BulletsDB.insert(item);
    }
    selectionSingle(){
        this.setState({
            alone:!this.state.alone
        })
    }
    selectionMultiplayer(){
        this.setState({
            multiplayer:!this.state.multiplayer
        })
    }
    selectionMultiplayer2(keys){
        this.setState({
            multiplayer:!this.state.multiplayer
        })
        this.setState({
            ks:keys
        })
    }

    logOut(){
        this.setState({
            currentPlayer:''
        })
    }
    updateShip(Nx,Ny,Nr,idN,rad){
        Shipsdb.update(this.state.currentID, {
        x: Nx,
        y: Ny,
        r: Nr,
        id:idN,
        radius:rad
        });
    }
    updateParticle(life,sz,p,v,id){
        ParticlesDB.update(id,
            {
            lifeSpan: life,
            size: sz,
            position: p,
            velocity: v
        });
    }
    updateAsteroid(a,id){
        AsteroidsDB.update(id,{
        owner:a.owner,
        position: a.position,
        velocity : a.velocity,
          rotation : a.rotation,
          rotationSpeed : a.rotationSpeed,
          radius : a.radius,
          score : a.score,
          vertices : a.vertices
        });
    }
    updateBullet(b,id){
        BulletsDB.update(id,{
            position:b.position,
            rotation:b.rotation,
            velocity:b.velocity,
            radius:b.radius,
            ownerID:b.ownerID
        });
    }
    deletePlayer(id){
        Players.remove(id);
    }
    deleteShip(id){
        Shipsdb.remove(id);
    }
    deleteBullet(id){
        BulletsDB.remove(id);
    }
    deleteParticle(id){
        ParticlesDB.remove(id);
    }
    changeDefaults(){
        this.setState({
            defaultC:!this.state.defaultC
        })
    }
    
    onEnterPlayer(name,pass) {
        //Deberiamos validar un monton de cosas
        console.log(name);
        let player = {
            name: name,
            pass: pass,
            score: 0
            
        }
        //console.log('Jugador antes de insertar',player)
        player._id = Players.insert(player);

        this.setState({currentPlayer: player});
     
        //console.log('Players registrados',this.state.players)
    }
    
    movePlayer(state) {

         let player = Players.findOne(this.state.currentPlayer._id),
            xActual = player.x,
            yActual = player.y,
            rActual = player.r;
        
        let own = new OwnShip({
         position: {
            x: xActual,
            y: yActual
        },r:rActual
         });
        // Controls
        if(state.keys.up){
        console.log("se movio arriba")
        own.accelerate(1,state);
        console.log('posicion antigua',xActual)
        console.log('posicion nueva',own.position.x)
        }
        if(state.keys.left){
        own.rotate('LEFT');
        }
        if(state.keys.right){
        own.rotate('RIGHT');
        }

        Players.update(this.state.currentPlayer._id, {
            name: player.name,
            x: own.position.x,
            y: own.position.y,
            r: own.rotation
        });
    }

    render() {

        let menu;
         if(!this.state.currentPlayer){
      menu = (
          <div>
              <Principal onClick = {this.onEnterPlayer}  
              single = {this.selectionSingle}
              multi ={this.selectionMultiplayer}
              multi2 ={this.selectionMultiplayer2}
              changeDefaults = {this.changeDefaults}
              under={this.state.multi}/>
          </div>
      )
    }
    else if(this.state.currentPlayer && this.state.alone){
        menu = (
            <div>
              <AloneG
              />
          </div>
        )
    }else if(this.state.currentPlayer && this.state.multiplayer){
        if(this.state.enConstruccion)
            {
                    menu = (
                            <div>
                            <Principal onClick = {this.onEnterPlayer}
                             single = {this.selectionSingle} 
                            under={this.state.enConstruccion}/>
                        </div>
                            )
            }
            else{
                menu = (
                <div>
                    <MultiGame
                    currentPlayer = {this.state.currentPlayer}
                    players = {this.props.players}
                    dplayer = {this.deletePlayer}
                    cShip={this.crearShip}
                    ships={this.props.shiplist}
                    uShip={this.updateShip}
                    dShip={this.deleteShip}
                    currentShipID={this.state.currentID}
                    cParticle={this.crearParticula}
                    particles={this.props.particlesList}
                    uParticle={this.updateParticle}
                    dParticle={this.deleteParticle}
                    cAsteroid={this.crearAsteroide}
                    asteroids={this.props.asteroidsList}
                    uAsteroid={this.updateAsteroid}
                    cBullet={this.crearBullet}
                    bullets={this.props.bullets}
                    uBullet={this.updateBullet}
                    dBullet={this.deleteBullet}
                    keys = {this.state.ks}
                    defaultC ={this.state.defaultC}
                    />
            </div>
                )
            }
        
    }
        return (

            <div>
               {menu}
            </div>
        );
    }
}
App.propTypes = {
    players: PropTypes.array.isRequired
};

export default createContainer(() => {
    return {
        //variable reactiva que se actualiza con cada cambio
        shiplist:Shipsdb.find({}).fetch(),
        particlesList:ParticlesDB.find({}).fetch(),
        asteroidsList:AsteroidsDB.find({}).fetch(),
        players:Players.find( {}, {sort: {score: -1} , limit:10} ).fetch(),
        bullets:BulletsDB.find({}).fetch()
    };
}, App);
