import React, { Component } from 'react';
import Ship from '../sketches/Ship.js';
import Asteroid from '../sketches/Asteroids.js';
import { randomNumBetweenExcluding } from '../sketches/helpers.js'

var KEY = {
  LEFT:  37,
  RIGHT: 39,
  UP: 38,
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32,
  BACKSPACE: 8,
  TAB:9,
  CLEAR:12,
  ENTER:13,
  SHIFT_L:16,
  CONTROL_L:17,
  ALT_l:18,
  PAUSE:19,
  CAPS_LOCK:20,
  ESCAPE:27,
  PRIOR:33,
  NEXT:34,
  END:35,
  HOME:36,
  DOWN:40,
  SELECT:41,
  PRINT:42,
  EXECUTE:43,
  INSERT:45,
  DELETE:46,
  HELP:47,
  B:66,
  C:67,
  D:68,
  E:69,
  F:70,
  G:71,
  H:72,
  I:73,
  J:75,
  K:75,
  L:76,
  M:77,
  N:78,
  O:79,
  P:80,
  Q:81,
  R:82,
  S:83,
  T:84,
  U:85,
  V:86,
  W:87,
  X:88,
  Y:89,
  Z:90,
  KP_0:96,
  KP_1:97,
  KP_2:98,
  KP_3:99,
  KP_4:100,
  KP_5:101,
  KP_6:102,
  KP_7:103,
  KP_8:104,
  KP_9:105,
  F1:112,
  F2:113,
  F3:114,
  F4:115,
  F5:116,
  F6:117,
  F7:118,
  F8:119,
  F9:120,
  F10:121,
  F11:122,
  F12:123,
  F13:124,
  F14:125,
  F15:126,
  F16:127,
  F17:128,
  F18:129,
  F19:130,
  F20:131,
  F21:132,
  F22:133,
  F23:134,
  F24:135,
  MODE_SWITCH:254
};

export class Principal extends Component {
  constructor() {
    super();
    this.state = {
        selection:false,
        name:"",
        pass:"",
        up:"W",
        down:"S",
        left:"a",
        right:"d",
        shoot:"space",
        upN:0,
        downN:0,
        leftN:0,
        rightN:0,
        shootN:0,
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      asteroidCount: 6,
      currentScore: 0,
      topScore: localStorage['topscore'] || 0,
      inGame: false,
      getAccount:false,
      onTutorial:false,
      controlsUpdate:false,
      upC:false,
      downC:false,
      leftC:false,
      rightC:false,
      shootC:false
    }
    this.ship = [];
    this.asteroids = [];
    this.bullets = [];
    this.particles = [];
  }

  handleResize(value, e){
    this.setState({
      screen : {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize',  this.handleResize.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));


    const context = this.refs.canvas.getContext('2d');
    this.setState({ context: context });
    this.startGame();
    requestAnimationFrame(() => {this.update()});
  }

  handleKeys(value, e){
    if (Object.values(KEY).indexOf(e.keyCode) && this.state.upC) {
      this.setState({
          up:Object.keys(KEY)[Object.values(KEY).indexOf(e.keyCode)],
          upN:e.keyCode
      })
      this.finishUpChange();
    } 
   else if (Object.values(KEY).indexOf(e.keyCode) && this.state.downC) {
      this.setState({
          down:Object.keys(KEY)[Object.values(KEY).indexOf(e.keyCode)],
          downN:e.keyCode
      })
      this.finishDownChange();
    } 
    else if (Object.values(KEY).indexOf(e.keyCode) && this.state.leftC) {
      this.setState({
          left:Object.keys(KEY)[Object.values(KEY).indexOf(e.keyCode)],
          leftN:e.keyCode
      })
      this.finishLeftChange();
    } 
    else if (Object.values(KEY).indexOf(e.keyCode) && this.state.rightC) {
      this.setState({
          right:Object.keys(KEY)[Object.values(KEY).indexOf(e.keyCode)],
          rightN:e.keyCode
      })
      this.finishRightChange();
    }
    else if (Object.values(KEY).indexOf(e.keyCode) && this.state.shootC) {
      this.setState({
          shoot:Object.keys(KEY)[Object.values(KEY).indexOf(e.keyCode)],
          shootN:e.keyCode
      })
      this.finishShootChange();
    }  
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  update() {
    const context = this.state.context;

    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Motion trail
    context.fillStyle = '#000';
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;

    // Next set of asteroids
    if(!this.asteroids.length){
      let count = this.state.asteroidCount + 1;
      this.setState({ asteroidCount: count });
      this.generateAsteroids(count)
    }

    // Remove or render
    this.updateObjects(this.particles, 'particles')
    this.updateObjects(this.asteroids, 'asteroids')

    context.restore();

    // Next frame
    requestAnimationFrame(() => {this.update()});
  }

  addScore(points){
    if(this.state.inGame){
      this.setState({
        currentScore: this.state.currentScore + points,
      });
    }
  }

  startGame(){
    this.setState({
      inGame: false,
      currentScore: 0,
    });

    // Make asteroids
    this.asteroids = [];
    this.generateAsteroids(this.state.asteroidCount)
  }


  generateAsteroids(howMany){
    let asteroids = [];
    let ship = this.ship[0];
    for (let i = 0; i < howMany; i++) {
      let asteroid = new Asteroid({
        size: 80,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, 240, 360),
          y: randomNumBetweenExcluding(0, this.state.screen.height, 500, 600)
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this)
      });
      this.createObject(asteroid, 'asteroids');
    }
  }

  createObject(item, group){
    this[group].push(item);
  }

  updateObjects(items, group){
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      }else{
        items[index].render(this.state);
      }
      index++;
    }
  }
introTutorial(){
    this.setState({
        onTutorial:!this.state.onTutorial
    })
}

makeSelection(){
    this.setState({
        selection:!this.state.selection
    })
}
onClickSingle(){
        this.props.single();
        this.props.onClick(this.state.name,this.state.pass);
    }
onClickMulti2(){
  let k;
  k={
    up:this.state.upN,
    down:this.state.downN,
    left:this.state.leftN,
    right:this.state.rightN,
    shoot:this.state.shootN
  };
    this.props.multi2(k);
    this.props.onClick(this.state.name,this.state.pass);
    this.props.changeDefaults();
}
onClickMulti(){
    this.props.multi();
    this.props.onClick(this.state.name,this.state.pass);
}
  changeControls(){
    this.setState({
        controlsUpdate:!this.state.controlsUpdate
    })
  }

getAccount(){
    this.setState({
        getAccount:!this.state.getAccount
    });
}
    handleUser(e){
        this.setState({
            name : e.target.value
        })
    }
    handlePass(e){
         this.setState({
            pass : e.target.value
        })
    }
       
  handleUpChange(){
    this.upButton.innerText="Please press a Key";
    this.setState({
            upC : !this.state.upC
        })
  }
  handleDownChange(){
    this.downButton.innerText="Please press a Key";
    this.setState({
            downC : !this.state.downC
        })
  }
  handleLeftChange(){
    this.leftButton.innerText="Please press a Key";
    this.setState({
            leftC : !this.state.leftC
        })
  }
  handleRightChange(){
    this.rightButton.innerText="Please press a Key";
    this.setState({
            rightC : !this.state.rightC
        })
  }
  handleShootChange(){
    this.shootButton.innerText="Please press a Key";
    this.setState({
          shootC : !this.state.shootC
        })
  }
  finishUpChange(){
      this.setState({
            upC : !this.state.upC
        })
      this.upButton.innerText=this.state.up;
  }
    finishDownChange(){
      this.setState({
            downC : !this.state.downC
        })
      this.downButton.innerText=this.state.down;
  }
    finishLeftChange(){
      this.setState({
            leftC : !this.state.leftC
        })
      this.leftButton.innerText=this.state.left;
  }
    finishRightChange(){
      this.setState({
            rightC : !this.state.rightC
        })
      this.rightButton.innerText=this.state.right;
  }
    finishShootChange(){
      this.setState({
            shootC : !this.state.shootC
        })
      this.shootButton.innerText=this.state.shoot;
  }
  
 

  render() {
    let endgame,title;
    if(this.props.under)
        {
            endgame = (
               <div>
                     <div className="wrapper">
                    <div className="container">
                        <div className="form under">
                            Sorry Man, this part is under Construction<br/>
                             <button  onClick={this.onClickSingle.bind(this)}>Try Single Player</button>
                        </div>
                    </div>      
	                  </div> 
               </div> 
            )
        }
     else if(this.state.controlsUpdate)
        {
            endgame = (
               <div>
                  <div className="container2 welcome2">
              <ul>
                <li>
                  <label>
                      <button ref={(button) => { this.upButton = button; }} onClick={this.handleUpChange.bind(this)}>↑</button>
                    <span className="sequential">Up Button</span>
                  </label>
                  <span className="description2">Click to change Up movement Button</span>
                  <span className="icon-keyboard"></span>
                </li>
                <li>
                  <label>
                    <button ref={(button) => { this.downButton = button; }} onClick={this.handleDownChange.bind(this)}>↓</button>
                    <span className="sequential">Down Button</span>
                  </label>
                  <span className="description2">Click to change Down movement Button</span>
                  <span className="icon-keyboard"></span>
                </li>
                <li>
                  <label>
                    <button ref={(button) => { this.leftButton = button; }} onClick={this.handleLeftChange.bind(this)}>←</button>
                    <span className="sequential">Left Command</span>
                  </label>
                  <span className="description2">Click to change Left movement Button</span>
                  <span className="icon-keyboard"></span>
                </li>
                <li>
                  <label>
                    <button ref={(button) => { this.rightButton = button; }} onClick={this.handleRightChange.bind(this)}>→</button>
                    <span className="sequential">Right Command </span>
                  </label>
                  <span className="description2">Click to change Right movement Button</span>
                  <span className="icon-keyboard"></span>
                </li>
                <li>
                  <label>
                    <button ref={(button) => { this.shootButton = button; }} onClick={this.handleShootChange.bind(this)}>space</button>
                    <span className="sequential">Shoot Command </span>
                  </label>
                  <span className="description2">Click to change Shoot Button</span>
                  <span className="icon-keyboard"></span>
                </li>
              </ul>
              <div className="container">
                <p className="description3">Please Confirm your changes</p>
                  <div className="form">
                      <button >Cancel</button>
                      <button  onClick={this.onClickMulti2.bind(this)}>Save</button>
                  </div>
              </div>
              
          </div> 
                     
               </div> 
            )
        }
      else if(this.state.onTutorial){
      endgame = (
       <div>
          <div className="container2 welcome2">
              <ul>
                <li>
                  <label>
                    <a href="#" className="key">↑</a>
                    <span className="sequential">  </span>
                    <a href="#" className="key">↓</a>
                  </label>
                  <span className="description">Move Up And Down</span>
                  <span className="icon-keyboard"></span>
                </li>
                <li>
                  <label>
                    <a href="#" className="key">←</a>
                    <span className="sequential"> </span>
                    <a href="#" className="key">→</a>
                  </label>
                  <span className="description">Move left and Right</span>
                  <span className="icon-keyboard"></span>
                </li>
                <li>
                  <label>
                    <a href="#" className="key2">Space</a>
                  </label>
                  <span className="description">Shoot Like A Maniac!</span>
                  <span className="icon-keyboard"></span>
                </li>
              </ul>
              <div className="container">
                <p className="description">Agreed if you understand</p>
                  <div className="form">
                      <button  onClick={this.onClickMulti.bind(this)}>Got it!</button>
                      <button  onClick={this.changeControls.bind(this)}>Change Controls</button>
                  </div>
              </div>
              
          </div> 
       </div>
      )
    }
      else if(this.state.selection){
            endgame = (
          <div>
              <div className="wrapper">
                    <div className="container">
                       <p className="form">Please select one Game Mode</p>
                        <div className="form">
                            <button  onClick={this.onClickSingle.bind(this)}>SinglePlayer</button>
                            <button  onClick={this.introTutorial.bind(this)}>MultiPlayer</button>
                        </div>
                  </div>
	            </div>
          </div>
            )
        }
      else if(!this.state.inGame && !this.state.getAccount){
      endgame = (
          <div>
              <div className="wrapper">
                    <div className="container">
                        <div className="form">
                            <input type="text" placeholder="Username" onChange={this.handleUser.bind(this)}/>
                            <input type="password" placeholder="Password" onChange ={this.handlePass.bind(this)}/>
                            <button  onClick={this.makeSelection.bind(this)}>Login</button>
                        </div>
                        <a className="getAn" href="#"onClick={this.getAccount.bind(this)}> Create An Account </a>
                 </div>
	        </div>
          </div>
      )
    }else if(!this.state.inGame && this.state.getAccount){
        endgame = (
          <div>
              <div className="wrapper">
                    <div className="container">
                        <form className="form">
                            <input type="text" onChange={this.handleUser.bind(this)} placeholder="Username"/>
                            <input type="password" onChange ={this.handlePass.bind(this)} id = "password" placeholder="Password"/>
                            <input type="password" id = "repassword" placeholder="ReTypePassword"/>
                            <button type="submit" id="login-button" onSubmit={this.props.onClick()}>Create Account</button>
                        </form>
                        <a className="getAn" href="#"onClick={this.getAccount.bind(this)}> Already have an account ? </a>
                </div>
	        </div>
          </div>
      )
    }
    if(!this.state.onTutorial)
      {
        title = (
          <div>
              <span className="welcome" >
                Space Battle
              </span>
          </div>
        )
      }
    

    return (
      <div>
        { endgame }
        {title}
        <canvas ref="canvas"
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    );
  }
}
