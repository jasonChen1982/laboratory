Object.defineProperty(PIXI.DisplayObject.prototype, 'scaleX', {
 get: function() {
  return  this.scale.x;
 },
 set: function(value) {
  this.scale.x = value;
 }
});

Object.defineProperty(PIXI.DisplayObject.prototype, 'scaleY', {
 get: function() {
  return  this.scale.y;
 },
 set: function(value) {
  this.scale.y = value;
 }
});


var momentGroup;
var momentAce;
var momentAdvantage;
var momentDoubleFault;
var momentDeuce;
var animationTimer;
var toRAD = Math.PI/180;
var matchVizViewConfig = {
    isWebGL: true
	}
	//matchVizViewConfig.isWebGL

function initBeast(){
	momentGroup = new PIXI.DisplayObjectContainer();
	stage.addChild(momentGroup);
	drawBeast();
	WebFontConfig = {
		custom: { families: ['Knockout47'],
			urls: [ 'css/styles.css']},
		active: function() {
			//console.log("FONTS LOADED");
			createDeuce();
			createAdvantage();
			createAce();
			createDoubleFault();
			createBreakPoint();
			createMatchPoint();
			
			createSetPoint();
			
			createGenericPoint();
			createGame();
		}
	  };
	  (function() {
		var wf = document.createElement('script');
		wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
			'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
		wf.type = 'text/javascript';
		wf.async = 'true';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(wf, s);
	})();
}

function hideMoments() {
	clearTimeout(animationTimer);
	momentAce.visible = false;
	momentAdvantage.visible = false;
	momentDoubleFault.visible = false;
	momentDeuce.visible = false;
	momentBreakPoint.visible = false;
	momentMatchPoint.visible = false;
	
	momentSetPoint.visible = false;
	
	momentGenericPoint.visible = false;
	momentGame.visible = false;

	if (__PE)
		__PE.reset();
}

function generateRandomNumber(min, max) {
	var random = Math.floor(Math.random() * (max - min + 1)) + min;   
	return random;
}



var __PE; // reference to active particle engine;

function drawBeast(){
	if (__PE)
		__PE.step();
}

function resizeBeast(){
	if (momentGroup){
		momentGroup.x = renderer.width/2;
		momentGroup.y = renderer.height/2;
	}
}


function passParticlesToRAF(PE) {
	__PE = PE;
}

