var renderer,
	stage,
	loadingGroup,
	vizGroup;
	loadingGroup = new PIXI.DisplayObjectContainer();
var PI = Math.PI;
var toRAD = PI/180;

function init(){
	stage = new PIXI.Stage(0x65a496);
	renderer = new PIXI.autoDetectRenderer(400, 400,null,false,true);
	$("#visualizer").append(renderer.view);

	vizGroup = new PIXI.DisplayObjectContainer();
	stage.addChild(vizGroup);

	$( window ).resize(onResize);
	$( window ).scroll(onScroll);
	onResize();
	requestAnimationFrame(animate);
	setTimeout(function (){
		goLoading();
	},1e3);
}

function onScroll(){
	//stage.updateViewportRect();
}

function animate() {
	renderer.render(stage);
	requestAnimationFrame( animate );
}

function onResize(){
	renderer.resize(window.innerWidth,window.innerHeight);
	vizGroup.x = renderer.width/2;
	vizGroup.y = renderer.height/2;
}

$(function(){
	init();
}); 


var oLoading,oParticle;
function goLoading(){
	oLoading = new CicleLoading();
	oLoading.drawArc();
	oLoading.imitateLoading();
	oParticle = new Particle();
	oParticle.particleEngine();
}


/* 带粒子的圆形加载进度条 */

function CicleLoading(radius,color,startAngle,endAngle ){
	this.doc = new PIXI.DisplayObjectContainer();
	this.doc.x = renderer.width/2;
	this.doc.y = renderer.height/2;
	stage.addChild(this.doc);
	this.color = color||0xf26d44;
	this.radius = radius||130;
	this.cx = 0;
	this.cy = 0;
	this.startAngle = 270;
	this.iNowAngle = this.startAngle;
	this.drawTool = new PIXI.Graphics();
}

	//this.hueEnd = 120;
	//this.hue = 0;
	//'hsla('+this.hue+', 100%, 40%, 1)';

CicleLoading.prototype.drawArc = function(first_argument) {
	var e;
		this.drawTool.lineStyle(10,this.color,1);

		e = this.drawTool.arc ( this.cx, this.cy, this.radius, this.startAngle*toRAD, this.iNowAngle*toRAD ) ;
		this.drawTool.endFill();
		this.doc.addChild(e);
};
CicleLoading.prototype.imitateLoading = function (){
	var This = this;
	requestAnimationFrame(checkTime);
	function checkTime(){
		This.iNowAngle += 2;
		This.drawArc();
		if((This.iNowAngle-This.startAngle)<=360)requestAnimationFrame(checkTime);
	}
}


function Particle(){
	this.doc = new PIXI.DisplayObjectContainer();
	this.doc.x = renderer.width/2;
	this.doc.y = renderer.height/2;
	stage.addChild(this.doc);
	this.gravity = -0.022;
}
Particle.prototype.creatParticle = function(iNowAngle){

	var e,particleX,particleY,rad,drawTool;
	drawTool = new PIXI.Graphics();
	rad = (iNowAngle-1)*toRAD;
	particleX = Math.floor( 135+5* Math.random() ) * Math.cos(rad);
	particleY = Math.floor( 135+5* Math.random() ) * Math.sin(rad);
	drawTool.beginFill(0xf26d44,Math.random());
	e = drawTool.drawCircle( 0,0,10 );
	e.position.x = particleX;
	e.position.y = particleY;
	e.iNowRad = rad;
	drawTool.endFill();
	this.doc.addChild(e);

	this.animate(e,particleX,particleY);
}
Particle.prototype.particleEngine = function (){
	var This = this;
	
	requestAnimationFrame(checkTime);
	function checkTime(){
		for (var i = 0; i <= 2; i++) {
			This.creatParticle(oLoading.iNowAngle);
		};
		if((oLoading.iNowAngle-oLoading.startAngle)<=360)requestAnimationFrame(checkTime);
	}
}
Particle.prototype.animate = function(obj,particleX,particleY){
	var This = this;
	var relativeX,relativeY,changeX,changeY;
	relativeX = 0.2 + 0.25*Math.random();
	relativeY = 0.6 + 1.6*Math.random();

	requestAnimationFrame(animation);
	function animation(){
		relativeY += This.gravity;
		particleX += relativeX*Math.cos( obj.iNowRad-PI/2 ) + relativeY*Math.cos(obj.iNowRad);
		particleY += relativeX*Math.sin( obj.iNowRad-PI/2 ) + relativeY*Math.sin(obj.iNowRad);
		obj.position.x = particleX;
		obj.position.y = particleY;
		var boundary = Math.sqrt( Math.pow(particleX,2) + Math.pow(particleY,2) );
		if ( (boundary<=136&&relativeY<0) ) {
			TweenMax.to( obj, 0.4, {alpha: 0, ease: Power1.easeOut,onComplete: function() {
				This.doc.removeChild(obj);
			}})
			return;
		};
		requestAnimationFrame(animation);
	}
}
/* end 带粒子的圆形加载进度条 */