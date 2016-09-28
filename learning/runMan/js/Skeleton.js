
// everything connects to coccyx
// coccyx
// shoulderLength
// leftShoulderOffset
// rightShoulderOffset
// leftHipOffset
// rightHipOffset
// armLength
// legLength
// footLength
// position
// hipRunAmplitude
// shoulderRunAmplitude

var PI = Math.PI;
var TAU = PI * 2;


function Skeleton( props ) {
  extend( this, props );
  this.coccyx = new Vector();
  this.neck = new Vector();
  this.resetRunCycle();
  this.idleCycleTheta = 0;
  this.frame = 0;
  this.state = {
    // runningRight: 1,
    // runningLeft: 1,
    idleRight: 1,
    // neutral: 1
  };
  this.animationFrames = {};
}

Skeleton.prototype.update = function() {
  this.frame++;
  for ( var aniName in this.animationFrames ) {
    this.animationFrames[ aniName ]++;
  }
  // this.runCycleTheta += this.state == 'running' ? 0.07 : 0;
  // this.runCycleSpeed = Math.min( 0.15, this.runCycleSpeed + 0.0003 );
  this.runCycleTheta += this.runCycleSpeed;
  this.idleCycleTheta += 0.05;
  // console.log(this.position);
  this.coccyx.set( this.position );
  // get and set correct rig

  this.updateTransitionState();
  var completeRig = {};
  var rigs = {};
  for ( var rigName in this.state ) {
    var rig = extend( {}, neutralRig );
    var rigMethod = 'get' + capitalize( rigName ) + 'Rig';
    extend( rig, this[ rigMethod ]() );
    rigs[ rigName ] = rig;
  }

  for ( var prop in neutralRig ) {
    var value = 0;
    for ( rigName in rigs ) {
      value += rigs[ rigName ][ prop ] * this.state[ rigName ];
    }
    completeRig[ prop ] = value;
  }

  this.setRig( completeRig );
};

Skeleton.prototype.getRig = function( rigName ) {
  var rigMethod = 'get' + capitalize( rigName ) + 'Rig';
  var rig = extend( {}, neutralRig );
  return extend( rig, this[ rigMethod ]() );
};

function capitalize( str ) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

Skeleton.prototype.resetRunCycle = function() {
  this.runCycleSpeed = 0.15;
  this.runCycleTheta = TAU * 1/16;
};

// --------------------------  -------------------------- //

Skeleton.prototype.startAnimation = function( aniName ) {
  this.animationFrames[ aniName ] = 0;
};




// --------------------------  -------------------------- //


var zeroPoint = new Vector();

var neutralRig = {
  offsetX: 0,
  offsetY: 0,
  offset: zeroPoint,
  headRotateY: 0,
  shouldersRotateY: 0,
  shouldersY: 0,
  hipsRotateY: 0,
  hipsY: 0,
  leftElbowAngle: 0,
  leftWristAngle: 0,
  leftKneeAngle: 0,
  leftAnkleAngle: 0,
  leftToeAngle: 0,
  leftFootRotateY: 0,
  rightElbowAngle: 0,
  rightWristAngle: 0,
  rightKneeAngle: 0,
  rightAnkleAngle: 0,
  rightToeAngle: 0,
  rightFootRotateY: 0
};

Skeleton.prototype.getNeutralRig = function() {
  return neutralRig;
};

// get positions and angles for rig, not vectors
Skeleton.prototype.getRunningRightRig = function() {
  var rig = {};
  var quadFactor = 1.5;

  var sin = Math.sin( this.runCycleTheta );
  var cos = Math.cos( this.runCycleTheta );
  var quadSine = quadWave( sin, quadFactor );
  var leftQuadSine = cos < 0 ? quadSine : sin;
  var rightQuadSine = cos > 0 ? quadSine : sin;

  var lift = Math.abs( Math.cos( this.runCycleTheta - 1 ) ) * -40 + 20;
  rig.offsetY = lift;
  //
  rig.headRotateY = 0.2;

  // shoulder
  rig.shouldersRotateY = ( sin + 1 ) * 0.6;
  // elbow
  rig.leftElbowAngle = -rightQuadSine * 1.2 + 0.4;
  rig.rightElbowAngle = leftQuadSine * 1.2 + 0.4;
  // wrist
  rig.leftWristAngle = -leftQuadSine * 0.4 - TAU/4;
  rig.rightWristAngle = rightQuadSine * 0.4 - TAU/4;
  // hip
  rig.hipsRotateY = ( -sin + 1 ) * 0.6;
  // knee
  rig.leftKneeAngle = leftQuadSine * 1.1 - 0.07;
  rig.rightKneeAngle = -rightQuadSine * 1.1 - 0.07;

  var ankleTheta = this.runCycleTheta - TAU/8;
  var normAnkleTheta = normalizeAngle( ankleTheta );
  var ankleAngle = Math.max( 0, Math.sin( normAnkleTheta * 2/3 ) );
  rig.leftAnkleAngle = ankleAngle * 1.7;

  ankleTheta = this.runCycleTheta - TAU/8 + TAU/2;
  normAnkleTheta = normalizeAngle( ankleTheta );
  ankleAngle = Math.max( 0, Math.sin( normAnkleTheta * 2/3 ) );
  rig.rightAnkleAngle = ankleAngle * 1.7;

  rig.leftFootRotateY = TAU/4;
  rig.rightFootRotateY = TAU/4;

  return rig;
};


// get positions and angles for rig, not vectors

// /*
Skeleton.prototype.getRunningLeftRig = function() {
  var rig = {};
  var quadFactor = 1.5;

  var sin = Math.sin( this.runCycleTheta + TAU/2 );
  var cos = Math.cos( this.runCycleTheta + TAU/2 );
  var quadSine = quadWave( sin, quadFactor );
  var quadSineA = cos < 0 ? quadSine : sin;
  var quadSineB = cos > 0 ? quadSine : sin;

  var lift = Math.abs( Math.cos( this.runCycleTheta - 1 ) ) * -40 + 20;
  rig.offsetY = lift;
  //
  rig.headRotateY = -0.2;

  // shoulder
  rig.shouldersRotateY = ( sin + 1 ) * -0.6;
  // elbow
  rig.leftElbowAngle = -quadSineA * 1.2 - 0.4;
  rig.rightElbowAngle = quadSineB * 1.2 - 0.4;
  // wrist
  rig.leftWristAngle = -quadSineA * 0.4 + TAU/4;
  rig.rightWristAngle = quadSineB * 0.4 + TAU/4;
  // hip
  rig.hipsRotateY = ( -sin + 1 ) * -0.6;
  // knee
  rig.leftKneeAngle = quadSineB * 1.1 + 0.07;
  rig.rightKneeAngle = -quadSineA * 1.1 + 0.07;

  var ankleTheta = this.runCycleTheta - TAU/8;
  var normAnkleTheta = normalizeAngle( ankleTheta );
  var ankleAngle = Math.max( 0, Math.sin( normAnkleTheta * 2/3 ) );
  rig.leftAnkleAngle = ankleAngle * -1.7;

  ankleTheta = this.runCycleTheta - TAU/8 + TAU/2;
  normAnkleTheta = normalizeAngle( ankleTheta );
  ankleAngle = Math.max( 0, Math.sin( normAnkleTheta * 2/3 ) );
  rig.rightAnkleAngle = ankleAngle * -1.7;

  rig.leftFootRotateY = -TAU/4;
  rig.rightFootRotateY = -TAU/4;

  return rig;
};
/**/

// i: sin or cos
// b: square factor
function quadWave( i, b ) {
  return Math.sqrt( ( 1 + b * b ) / ( 1 + b * b * i * i ) ) * i;
}

Skeleton.prototype.getIdleRightRig = function() {
  var sin = quadWave( Math.sin( this.idleCycleTheta ), 1 );
  var rig = {
    headRotateY: 0.2,
    shouldersRotateY: sin * -0.2 + 0.4,
    hipsRotateY: 0.6,
    leftFootRotateY: TAU/4,
    rightFootRotateY: TAU/4
  };

  rig.shouldersY = sin * -5 - 5;
  var elbowAngle = sin * 0.1 + 0.1;
  rig.leftElbowAngle = elbowAngle;
  rig.rightElbowAngle = -elbowAngle;
  var wristAngle = sin * -0.1 - 0.1;
  rig.leftWristAngle = wristAngle;
  rig.rightWristAngle = -wristAngle;
  return rig;
};

Skeleton.prototype.getIdleLeftRig = function() {
  var sin = quadWave( Math.sin( this.idleCycleTheta ), 1 );
  var rig = {
    headRotateY: -0.2,
    shouldersRotateY: sin * 0.2 - 0.4,
    hipsRotateY: -0.6,
    leftFootRotateY: -TAU/4,
    rightFootRotateY: -TAU/4
  };

  rig.shouldersY = sin * -5 - 5;
  var elbowAngle = sin * 0.1 + 0.1;
  rig.leftElbowAngle = elbowAngle;
  rig.rightElbowAngle = -elbowAngle;
  var wristAngle = sin * -0.1 - 0.1;
  rig.leftWristAngle = wristAngle;
  rig.rightWristAngle = -wristAngle;
  return rig;
};


Skeleton.prototype.setRig = function( rig ) {
  // save rig
  this.rig = rig;
  // coccyx
  this.coccyx.add({ x: rig.offsetX, y: rig.offsetY });

  this.setRigSide( rig, 'left', -1 );
  this.setRigSide( rig, 'right', 1 );
};

Skeleton.prototype.setRigSide = function( rig, side, direction ) {
  // shoulder
  this[ side + 'Shoulder' ] = Vector.copy( this.coccyx );
  var shoulderCosine = Math.cos( rig.shouldersRotateY ) * direction;
  this[ side + 'Shoulder' ] = Vector.add( this.coccyx, {
    x: shoulderCosine * this.shoulderLength,
    y: -this.torsoLength + rig.shouldersY
  });
  // neck
  this.neck.set( this.coccyx );
  this.neck.y = this[ side + 'Shoulder' ].y;
  // chest
  this[ side + 'Chest' ] = Vector.add( this.neck, {
    x: this.chestPosition.x * shoulderCosine,
    y: this.chestPosition.y
  });
  this[ side + 'Chest' ].x += Math.sin( rig.shouldersRotateY ) * this.chestPosition.z;
  // elbow
  var elbowAngle = rig[ side + 'ElbowAngle' ] + TAU/4;
  this[ side + 'Elbow' ] = Vector.addDistance( this[ side + 'Shoulder' ], this.armLength,
    elbowAngle );
  // wrist
  var wristAngle = rig[ side + 'WristAngle' ] + elbowAngle;
  this[ side + 'Wrist' ] = Vector.addDistance( this[ side + 'Elbow' ], this.armLength,
    wristAngle );
  // hip
  var hipCosine = Math.cos( rig.hipsRotateY ) * direction;
  var hipX = this.hipLength * hipCosine;
  this[ side + 'Hip' ] = Vector.add( this.coccyx, { x: hipX, y: 0 } );
  // butt
  this[ side + 'Butt' ] = Vector.add( this.coccyx, {
    x: this.buttPosition.x * hipCosine,
    y: this.buttPosition.y
  } );
  this[ side + 'Butt' ].x += Math.sin( rig.hipsRotateY ) * this.buttPosition.z;
  // knee
  var kneeAngle = rig[ side + 'KneeAngle' ] + TAU/4;
  this[ side + 'Knee' ] = Vector.addDistance( this[ side + 'Hip' ], this.legLength,
    kneeAngle );
  // ankle
  var ankleAngle = rig[ side + 'AnkleAngle' ] + kneeAngle;
  this[ side + 'Ankle' ] = Vector.addDistance( this[ side + 'Knee' ], this.legLength,
    ankleAngle );
  // toe
  var toeAngle = rig[ side + 'ToeAngle' ] + ankleAngle - TAU/4;
  var footLength = this.footLength * Math.sin( rig[ side + 'FootRotateY' ] );
  this[ side + 'Toe' ] = Vector.addDistance( this[ side + 'Ankle' ], footLength,
    toeAngle );

};

// --------------------------  -------------------------- //

Skeleton.prototype.transition = function( rigName, frameCount ) {
  this.transitionFrame = this.frame;
  this.transitionFrameCount = frameCount;
  this.previousState = extend( {}, this.state );
  this.transitionEndRig = rigName;
  this.isTransitioning = true;
  // console.log('start transition', rigName );
};

Skeleton.prototype.updateTransitionState = function() {
  if ( !this.isTransitioning ) {
    return;
  }

  this.state = {};
  var i = ( this.frame - this.transitionFrame ) / this.transitionFrameCount;
  if ( i >= 1 ) {
    // end transition
    this.state[ this.transitionEndRig ] = 1;
    this.isTransitioning = false;
    // console.log('end transition', this.transitionEndRig );
    return;
  }
  for ( var rigName in this.previousState ) {
    this.state[ rigName ] = this.previousState[ rigName ] * ( 1 - i );
  }
  this.state[ this.transitionEndRig ] = ( this.state[ this.transitionEndRig ] || 0 ) + i;
  // this.state[ this.transitionEndRig ] = i;
};


// -------------------------- render -------------------------- //

Skeleton.prototype.render = function( ctx ) {
  ctx.fillStyle = 'hsla(200, 100%, 35%, 0.8)';
  ctx.strokeStyle = 'hsla(200, 100%, 50%, 0.8)';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';

  // line( ctx, this.torso, this.head );

  line( ctx, this.leftShoulder, this.leftElbow );
  line( ctx, this.leftElbow, this.leftWrist );
  line( ctx, this.leftHip, this.leftKnee );
  line( ctx, this.leftKnee, this.leftAnkle );
  line( ctx, this.leftAnkle, this.leftToe );

  line( ctx, this.rightShoulder, this.rightElbow );
  line( ctx, this.rightElbow, this.rightWrist );
  line( ctx, this.rightHip, this.rightKnee );
  line( ctx, this.rightKnee, this.rightAnkle );
  line( ctx, this.rightAnkle, this.rightToe );

  line( ctx, this.leftShoulder, this.rightShoulder );
  line( ctx, this.leftShoulder, this.coccyx );
  line( ctx, this.rightShoulder, this.coccyx );
  line( ctx, this.leftHip, this.rightHip );

  dot( ctx, this.leftShoulder );
  dot( ctx, this.leftChest );
  dot( ctx, this.leftElbow );
  dot( ctx, this.leftWrist );
  dot( ctx, this.leftHip );
  dot( ctx, this.leftButt );
  dot( ctx, this.leftKnee );
  dot( ctx, this.leftAnkle );
  dot( ctx, this.leftToe );

  dot( ctx, this.rightShoulder );
  dot( ctx, this.rightChest );
  dot( ctx, this.rightElbow );
  dot( ctx, this.rightWrist );
  dot( ctx, this.rightHip );
  dot( ctx, this.rightButt );
  dot( ctx, this.rightKnee );
  dot( ctx, this.rightAnkle );
  dot( ctx, this.rightToe );

  // dot( ctx, this.torso );
  dot( ctx, this.coccyx );
  dot( ctx, this.neck );
  // dot( ctx, this.head );
};

// --------------------------  -------------------------- //
