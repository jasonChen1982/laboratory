var COLORS = [ '0x694D8B', '0xd83784', '0xd62b2e', '0xe5de3a', '0x74b74a', '0x15a1c5' ];

var renderer,
	stage,
	momentGroup,
	vizGroup;
	momentGroup = new PIXI.DisplayObjectContainer();
var PI = Math.PI;
var toRAD = PI/180;

function init(){
	stage = new PIXI.Stage(0x151515);
	renderer = new PIXI.autoDetectRenderer(800, 600);
	$("#visualizer").append(renderer.view);

	vizGroup = new PIXI.DisplayObjectContainer();
	stage.addChild(vizGroup);

	$( window ).resize(onResize);
	$( window ).scroll(onScroll);
	onResize();
	requestAnimationFrame(animate);
	go();
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

var assetsToLoader,OK,Bubble;

function go(){
	assetsToLoader = [
	"./public/images/symble0.png",
	"./public/images/symble1.png",
	"./public/images/symble2.png",
	"./public/images/symble3.png",
	"./public/images/symble4.png",
	"./public/images/symble5.png",
	"./public/images/symble6.png",
	"./public/images/symble7.png",
	"./public/images/symble8.png",
	"./public/images/symble9.png",
	"./public/images/symble10.png"
	];

	var loader = new PIXI.AssetLoader(assetsToLoader);
	loader.onComplete = function (){
		Bubble = new MusicBubble();
		Bubble.init();
		OK = new MusicMark();
		OK.init();
		var mouseTimer = null;
		var lastX=0,lastY=0;
		$(document).on("mousemove",function (ev){
			var posX,posY;


			posX = ev.pageX;
			posY = ev.pageY;

			if(lastX==posX&&lastY==posY){
				mouseTimer = setTimeout(function (){
					OK.mouseMove = false;
					console.log(111)
					if(!Bubble.visibleBtn)Bubble.mouseStopShow();
				},1e3)
			}else{
				OK.setMousePos({x:posX,y:posY});
				Bubble.setMousePos({x:posX,y:posY});
				clearTimeout(mouseTimer);
				OK.mouseMove = true;
				if(Bubble.visibleBtn)Bubble.mouseMoveHidden();
			}

				if(!mouseTimer){
					
				}
				lastX = posX;
				lastY = posY;
		});
	};
	loader.load();
}


/* 音乐符号向往黑洞 适应鼠标位置 */
function MusicMark(max,interval){
	this.doc = new PIXI.DisplayObjectContainer();
	this.doc.x = 0;
	this.doc.y = 0;
	stage.addChild(this.doc);
	this.mousePos = {
		x : renderer.width/2,
		y : renderer.height/2
	}
	this.mouseMove = false;
	this.max = max||400;
	this.iNow = 0;
	this.musicStart = {};
	this.animateBtn = true;
	this.gravity = 0.1;
	this.bCheck = true;
	this.BufferRadius = 160;
	this.startRadius = renderer.width;
	this.interval = interval||20;
}
MusicMark.prototype.init = function (){
	this.selfRenewal();
}
MusicMark.prototype.addOne = function (){
	var a,c,e;
		c = (Math.PI * (Math.random() * 360)) / 180; //随机产生角度

		a = Math.floor( Math.random() * assetsToLoader.length);
		e = new PIXI.Sprite.fromImage(assetsToLoader[a]);
		e.prevTime = new Date().getTime();
		e.anchor.x = Math.random();
		e.anchor.y = Math.random();
		e.scale = {x:0.8,y:0.8};
		e.targetPoint = {};
		e.position.x = this.mousePos.x + Math.cos(c) * this.startRadius ;
		e.position.y = this.mousePos.y - Math.sin(c) * this.startRadius ;

		
		this.doc.addChild(e);
		this.iNow++;
		this.animation(e);
}
MusicMark.prototype.initOne = function (e){
	var a,c;
		c = (Math.PI * (Math.random() * 360)) / 180; //随机产生角度

		a = Math.floor( Math.random() * assetsToLoader.length);
		e.prevTime = new Date().getTime();
		e.anchor.x = Math.random();
		e.anchor.y = Math.random();
		e.scale = {x:0.8,y:0.8};
		e.targetPoint = {};
		e.position.x = this.mousePos.x + Math.cos(c) * this.startRadius ;
		e.position.y = this.mousePos.y - Math.sin(c) * this.startRadius ;

		this.animation(e);
}
MusicMark.prototype.updata = function (){
	if(this.max>this.iNow)this.addOne();
}
MusicMark.prototype.selfRenewal = function (){
	var This = this;

	requestAnimationFrame(checkTime);
	function checkTime(){
		This.updata();
		if(This.bCheck)requestAnimationFrame(checkTime);
	}
}
MusicMark.prototype.setMousePos = function (json){
	this.mousePos = json;
}

MusicMark.prototype.animation = function (obj){
		obj.lifeTime = Math.random() * 4e3 + 2e3;
	var This = this;
	var randomNum = Math.random();
	var scalePlus = Math.random()>0.8?0.04:0;
	var aa = Math.floor( randomNum*100-50 );
		aa = aa/Math.abs(aa);
	var animationIn =  new TimelineMax({ paused: true });
	var roundArea = 80+40*Math.random();
	animationIn.add(TweenMax.fromTo( obj, 3,{ alpha: 1, rotation: 0}, { alpha: 0.3 + randomNum*0.7 , rotation: PI*2*aa*randomNum, ease: Power1.easeOut }));
	animationIn.add(TweenMax.fromTo( obj.scale, 2+randomNum,{x:0.6,y:0.6}, {x:0.15+scalePlus,y:0.15+scalePlus,ease: Power1.easeOut }), 0);

	animationIn.play();

	requestAnimationFrame(animate);

	function animate(){
		var dx = obj.position.x - This.mousePos.x;
		var dy = obj.position.y - This.mousePos.y;
		var	speedx = -( dx )/50;
		var	speedy = -( dy )/50;
		var iNow = new Date().getTime();


		if(This.mouseMove){
			obj.position.x += speedx;
			obj.position.y += speedy;
		}else{
			if( Math.sqrt( Math.pow(dx,2) + Math.pow(dy,2) ) <= roundArea ){
				TweenMax.to( obj, 6, { alpha: 0, rotation: 0, ease: Power1.easeOut })
			}else{
				obj.position.x += speedx;
				obj.position.y += speedy;
			}
		};
		if(iNow>=(obj.lifeTime+obj.prevTime)){
			TweenMax.to( obj, 2, { alpha: 0,ease: Power1.easeOut,onComplete: function() {
				This.initOne(obj);
			}})
			TweenMax.to( obj.scale, 2, {x: 0.08,y: 0.08, ease: Power1.easeOut})
			return;
		};
		requestAnimationFrame(animate);
	}
}
/* end 音乐符号向往黑洞 适应鼠标位置 */



/* 鼠标悬停时的气泡 适应鼠标位置 */
function MusicBubble(max,interval){
	this.doc = new PIXI.DisplayObjectContainer();
	this.doc.x = 0;
	this.doc.y = 0;
	stage.addChild(this.doc);
	this.mouseMove = false;
	this.max = max||30;
	this.iNow = 0;
	this.mousePos = {
		x : renderer.width/2,
		y : renderer.height/2
	}
	this.visibleBtn = true;
	this.bCheck = true;
	this.interval = interval||300;
}
MusicBubble.prototype.init = function (){
	this.prevTime = new Date().getTime();
	this.selfRenewal();
}
MusicBubble.prototype.addOne = function (){
	var drawTool,e,startX,startY,radius,scale,randomNum;

		drawTool = new PIXI.Graphics();

		randomNum = Math.random()-0.5;
		startX = this.mousePos.x + 80 * randomNum;
		startY = this.mousePos.y + 60;
		radius = 2+6*Math.random();
		scale = 1+Math.random();

		drawTool.beginFill("0xd9182d", Math.random()/2+0.2);

		e = drawTool.drawCircle( 0,0,radius );
		e.position = {x:startX,y:startY};

		e.targetPoint = {x: startX + 200*( Math.random()-0.5 ), y: startY - 300*Math.random()};

		drawTool.endFill();
		this.doc.addChild(e);
		this.iNow++;
		this.animation(e);
}
MusicBubble.prototype.initOne = function (e){
	var drawTool,e,startX,startY,radius,randomNum;

		randomNum = Math.random()-0.5;
		startX = this.mousePos.x + 80 * randomNum;
		startY = this.mousePos.y + 60;
		radius = 4+8*Math.random();

		e.position = {x:startX,y:startY};
		e.scale = {x:1,y:1};
		e.alpha =  Math.random()/2+0.3;

		e.targetPoint = {x: startX + 200*( Math.random()-0.5 ), y: startY - 300*Math.random()};

		this.animation(e);
}
MusicBubble.prototype.updata = function (){
	if(this.max>this.iNow)this.addOne();
}
MusicBubble.prototype.selfRenewal = function (){
	var This = this;

	requestAnimationFrame(checkTime);
	function checkTime(){
		var iNow = new Date().getTime();
		if(iNow-This.prevTime>=This.interval){
			This.updata();
			This.prevTime = iNow;
		};
		if(This.bCheck)requestAnimationFrame(checkTime);
	}
}
MusicBubble.prototype.setMousePos = function (json){
	this.mousePos = json;
}
MusicBubble.prototype.mouseMoveHidden = function (){
	var This = this;
		This.visibleBtn = false;
	TweenMax.to( This.doc, 0.8, {alpha: 0, ease: Power1.easeOut,onComplete: function() {
		This.doc.visible = false;
	}})
}
MusicBubble.prototype.mouseStopShow = function (){
	var This = this;
		This.visibleBtn = true;
		This.doc.visible = true;
	TweenMax.to( This.doc, 2.4, {alpha: 1, ease: Power1.easeOut});
}
MusicBubble.prototype.animation = function (obj){
	var This = this;
	TweenMax.to( obj.position, 3+1*Math.random(), {
		x: obj.targetPoint.x,
		y: obj.targetPoint.y,
		ease: Power1.easeOut,
		onComplete: function() {
			TweenMax.to( obj, 1, {alpha: 0, ease: Power1.easeOut})
			TweenMax.to( obj.scale, 1, {x: 1.4,y: 1.4, ease: Power1.easeOut,onComplete: function() {
				This.initOne(obj);
			}})
		}
	})
}

/* end 鼠标悬停时的气泡 适应鼠标位置 */