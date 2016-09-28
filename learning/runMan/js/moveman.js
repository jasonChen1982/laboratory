
var Cole = {};

Cole.init = function() {

  // ----- skeleton ----- //

  this.skeleton = new Skeleton({
    position: new Vector( 2000, 500 ),
    shoulderLength: 50,
    torsoLength: 48,
    hipLength: 35,
    buttPosition: { x: 20, y: -10, z: -10 }, // relative to coccyx, x is reversed for left
    chestPosition: { x: 25, y: 5, z: 8 }, // offset from neck, x is reversed for left
    armLength: 32,
    legLength: 30,
    footLength: 25,
    runningShoulderAmplitude: 15,
    runningHipAmplitude: 10
  });

  // ----- hair ----- //

  this.follicles = [];

  var hairProps = {
    friction: 0.85,
    gravity: new Vector( 0, 0.4 ),
    springStrength: 0.3,
    movementStrength: new Vector( 0.95, 0.01 )
  };

  // position are relative to skeleton.position
  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 -28,
    y: -180,
    segmentLength: 49,
    angle: -1.75,
    curl: 1.17
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 + 0,
    y: -190,
    segmentLength: 58,
    angle: -1.33,
    curl: 1.15
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 + 25,
    y: -185,
    segmentLength: 49,
    angle: -1.05,
    curl: 1.15
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 + 38,
    y: -177,
    segmentLength: 47,
    angle: -0.63,
    curl: 1.15
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 + 45,
    y: -160,
    segmentLength: 41,
    angle: -0.29,
    curl: 1.15
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 + 40,
    y: -138,
    segmentLength: 35,
    angle: 0.05,
    curl: 1.15
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 + 20,
    y: -124,
    segmentLength: 25,
    angle: 0.45,
    curl: 0.8
  })));
  // middle bottom
  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 + 5,
    y: -124,
    segmentLength: 21,
    angle: Math.PI / 2,
    curl: 0
  })));
  // compare to 7
  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 + -10,
    y: -124,
    segmentLength: 25,
    angle: 2.7,
    curl: -0.8
  })));
  // compare to 6
  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 + -22,
    y: -138,
    segmentLength: 41,
    angle: 3.20,
    curl: -1.15
  })));
  // compare to 5
  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 + -35,
    y: -160,
    segmentLength: 41,
    angle: -2.8,
    curl: -1.15
  })));
  // compare to 4
  this.follicles.push( new Follicle( extend( hairProps, {
    x: 2000 + -20,
    y: -185,
    segmentLength: 47,
    angle: -2.5,
    curl: -1.15
  })));

  // ----- ribbons ----- //

  this.ribbonA = new Ribbon({
    controlPoint: new Vector( 2000, -110 ),
    sections: 10,
    width: 40,
    sectionLength: 27,
    friction: 0.95,
    gravity: new Vector( 0, 0.2 ),
    chainLinkShiftEase: 0.9
  });

  this.ribbonB = new Ribbon({
    controlPoint: new Vector( 2000, -110 ),
    sections: 10,
    width: 40,
    sectionLength: 27,
    friction: 0.9,
    gravity: new Vector( 0, 0.25 ),
    chainLinkShiftEase: 0.9
  });



};


var headImg = new Image();
var isHeadImgLoaded;
headImg.onload = function() {
  isHeadImgLoaded = true;
};
headImg.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/cole-face-repeat.png';

Cole.update = function() {

  this.previousNeck = Vector.copy( this.skeleton.neck || new Vector() );

  this.skeleton.update();

  var neckMovement = this.previousNeck.y === 0 ? new Vector() :
    Vector.subtract( this.skeleton.neck, this.previousNeck );

  this.ribbonA.controlPoint.add( neckMovement );
  this.ribbonB.controlPoint.add( neckMovement );
  this.ribbonA.update();
  this.ribbonB.update();
  var i, len;

  for ( i=0, len = this.follicles.length; i < len; i++ ) {
    var follicle = this.follicles[i];
    follicle.move( neckMovement );
    follicle.update();
  }

};

// var scale = 1;
var brownSkin = '#963';
var black = '#433';
var magenta = '#B19';

Cole.render = function( ctx ) {
  ctx.save();
  ctx.translate( 0, this.skeleton.position.y );
  this.ribbonA.render( ctx );
  this.ribbonB.render( ctx );

  for ( var i=0, len = this.follicles.length; i < len; i++ ) {
    this.follicles[i].render( ctx );
  }

  ctx.restore();
  Cole.renderBody( ctx );
};

Cole.renderBody = function( ctx ) {

  var skeleton = this.skeleton;

  // arm in back
  if ( Math.sin( this.skeleton.rig.shouldersRotateY ) >= 0 ) {
    Cole.renderRightIlloArm( ctx );
  } else {
    Cole.renderLeftIlloArm( ctx );
  }
  // legs
  ctx.fillStyle = black;
  ctx.fillRect( skeleton.leftButt.x, skeleton.leftButt.y,
    skeleton.rightButt.x - skeleton.leftButt.x, 42 );
  if ( Math.sin( skeleton.rig.hipsRotateY ) >= 0 ) {
    Cole.renderIlloLeg( ctx, 'right' );
    Cole.renderIlloLeg( ctx, 'left' );
  } else {
    Cole.renderIlloLeg( ctx, 'left' );
    Cole.renderIlloLeg( ctx, 'right' );
  }

  ctx.fillStyle = black;
  // chest
  fillCircle( ctx, skeleton.leftChest, 25 );
  fillCircle( ctx, skeleton.rightChest, 25 );
  // head

  ctx.save();
  ctx.translate( skeleton.neck.x - 135/2, skeleton.neck.y - 145 );
  Cole.renderHead( ctx );
  ctx.restore();

  // arm in front
  if ( Math.sin( skeleton.rig.shouldersRotateY ) >= 0 ) {
    Cole.renderLeftIlloArm( ctx );
  } else {
    Cole.renderRightIlloArm( ctx );
  }
  // inspect skeleton
  ctx.save();
  ctx.translate( 250, 0 );
  skeleton.render( ctx );
  ctx.restore();
};

Cole.renderLeftIlloArm = function( ctx ) {
  var skeleton = this.skeleton;
  renderIlloArm( ctx, skeleton.leftShoulder, skeleton.leftElbow, skeleton.leftWrist );
};

Cole.renderRightIlloArm = function( ctx ) {
  var skeleton = this.skeleton;
  renderIlloArm( ctx, skeleton.rightShoulder, skeleton.rightElbow, skeleton.rightWrist, true );
};

function renderIlloArm( ctx, shoulder, elbow, wrist, hasBand ) {
  ctx.strokeStyle = brownSkin;
  ctx.lineWidth = 45;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  line( ctx, shoulder, elbow );
  ctx.strokeStyle = hasBand ? magenta : brownSkin;
  line( ctx, elbow, wrist );
  ctx.fillStyle = brownSkin;
  fillCircle( ctx, wrist, 28 );
}


Cole.renderIlloLeg = function( ctx, side ) {
  var hip = this.skeleton[ side + 'Hip' ];
  var butt = this.skeleton[ side + 'Butt' ];
  var knee = this.skeleton[ side + 'Knee' ];
  var ankle = this.skeleton[ side + 'Ankle' ];
  var toe = this.skeleton[ side + 'Toe' ];
  var footRotateY = this.skeleton.rig[ side + 'FootRotateY' ];

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 55;
  // boot
  ctx.strokeStyle = magenta;
  line( ctx, knee, ankle );
  line( ctx, ankle, toe );
  // thigh
  ctx.strokeStyle = black;
  line( ctx, hip, knee );
  // butt
  ctx.fillStyle = black;
  fillCircle( ctx, butt, 42 );
  // toe circle
  ctx.fillStyle = magenta;
  fillCircle( ctx, toe, Math.max( 0, Math.cos( footRotateY ) ) * 55/2  );
};


// var faceCanvas = document.createElement('canvas');
// var faceCtx = faceCanvas.getContext('2d');
// faceCanvas.width = 400;
// faceCanvas.height = 200;
// faceCtx.fillStyle = magenta;
// faceCtx.fillRect( 0, 0, 400, 200 );
// faceCtx.fillStyle = brownSkin;
// faceCtx.beginPath();
// faceCtx.arc( 200, 260, 160, TAU/2, TAU );
// faceCtx.fill();
// faceCtx.closePath();

var headCanvas = document.createElement('canvas');
var headCtx = headCanvas.getContext('2d');
headCanvas.width = 135;
headCanvas.height = 135;



Cole.renderHead = function( ctx ) {
  // console.log(211212);
  headCtx.clearRect( 0, 0, 135, 135 );
  headCtx.beginPath();
  headCtx.arc( 135/2, 135/2, 135/2, 0, TAU );
  headCtx.fill();
  headCtx.closePath();
  headCtx.globalCompositeOperation = 'source-in';
  var headX = -135 * 4 + ( this.skeleton.rig.headRotateY / TAU ) * 135 * 3;
  headCtx.drawImage( headImg, headX, -40 );
  headCtx.globalCompositeOperation = 'source-over';
  ctx.drawImage( headCanvas, 0, 0 );
};


// --------------------------  -------------------------- //



function KeyboardController(opts) {
  // hashes of keys that are down or up
  this.keysDown = {};
  this.onceKeysDown = {};
  this.keysUp = {};
  // hashes of things to do when key goes down/up/repeat down
  this.onceKeyDownActions = {};
  this.repeatKeyDownActions = {};
  this.keyUpActions = {};
  // bind events
  document.addEventListener( 'keydown', this, false );
  document.addEventListener( 'keyup', this, false );

  // this.touchArea = opts.touchArea;
  // bind touch events

  document.addEventListener( 'touchstart', this, false );
  document.addEventListener( 'touchend', this, false );
}

// -------------------------- events -------------------------- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
KeyboardController.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

KeyboardController.prototype.onkeydown = function( event ) {
  var keyCode = event.keyCode;
  // dismiss keyboard auto-repeats
  if ( !this.keysDown[ keyCode ] ) {
    // keep track of keys that are down
    this.keysDown[ keyCode ] = true;
    this.onceKeysDown[ keyCode ] = true;
  }

  if ( this.onceKeyDownActions[ keyCode] || this.repeatKeyDownActions[ keyCode ] ) {
    event.preventDefault();
  }
};

KeyboardController.prototype.onkeyup = function( event ) {
  var keyCode = event.keyCode;
  this.keysUp[ keyCode ] = true;
  delete this.keysDown[ keyCode ];
  delete this.onceKeysDown[ keyCode ];
  if ( this.keyUpActions[ keyCode] ) {
    event.preventDefault();
  }
};

// -------------------------- update -------------------------- //

KeyboardController.prototype.update = function() {
  var keyCode;
  for ( keyCode in this.keysDown ) {
    this.triggerAction( keyCode, this.repeatKeyDownActions );
    if ( this.onceKeysDown[ keyCode ] ) {
      this.triggerAction( keyCode, this.onceKeyDownActions );
      // reset flag, only trigger update once, keydown event might repeat
      delete this.onceKeysDown[ keyCode ];
    }
  }

  for ( keyCode in this.keysUp ) {
    this.triggerAction( keyCode, this.keyUpActions );
  }
  // reset keyup hash
  this.keysUp = {};
};

KeyboardController.prototype.triggerAction = function( keyCode, actions ) {
  var action = actions[ keyCode ];
  if ( action ) {
    action();
  }
};


// --------------------------  -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;
var TAU = Math.PI * 2;

// var logger1 = document.querySelector('.logger1 code');
// var logger2 = document.querySelector('.logger2 code');

// --------------------------  -------------------------- //

Cole.init();
Cole.skeleton.position.x = 2000;

var coleVelocityX = 0;

// --------------------------  -------------------------- //

var keyboard = new KeyboardController();

// left
keyboard.onceKeyDownActions[37] = function() {
  Cole.skeleton.transition( 'runningLeft', 16 );
};
// right
keyboard.onceKeyDownActions[39] = function() {
  Cole.skeleton.transition( 'runningRight', 16 );
};
// left
keyboard.repeatKeyDownActions[37] = function() {
  coleVelocityX -= 4;
};
// right
keyboard.repeatKeyDownActions[39] = function() {
  coleVelocityX += 4;
};

// left
keyboard.keyUpActions[37] = function() {
  Cole.skeleton.transition( 'idleLeft', 16 );
};
// right
keyboard.keyUpActions[39] = function() {
  Cole.skeleton.transition( 'idleRight', 16 );
};

// --------------------------  -------------------------- //

function update() {
  coleVelocityX *= 0.85;
  Cole.skeleton.position.x += coleVelocityX;
  Cole.skeleton.position.x = Math.max( 100, Math.min( 3900, Cole.skeleton.position.x ) );

  keyboard.update();
  Cole.update();

}


var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

function render() {
  // ctx.clearRect( 0, 0, w, h );

  ctx.save();
  ctx.transform( 0.25, 0, 0, 0.25, 0, 100 );
  Cole.render( ctx );
  ctx.restore();
}

var isAnimating = false;

function animate() {
  ctx.clearRect( 0, 0, w, h );
  update();
  render();

  stats.update();

  if ( isAnimating ) {
    requestAnimationFrame( animate );
  }
}

function stop() {
  isAnimating = false;
}

function start() {
  isAnimating = true;
  animate();
}

// --------------------------  -------------------------- //


start();
