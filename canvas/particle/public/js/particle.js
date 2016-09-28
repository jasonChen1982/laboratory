var particleSystem,
	stage,
	PI = Math.PI,
	toRAD = PI/180,
	COLOR = ["#ff636e","#ff8136","#d63939","#42ad94","#ff9400"],
	oMap = {
		h5ico :"./imgs/h5ico.png",
		designIco :"./imgs/designIco.png",
		cs3 :"./imgs/cs3.png",
		youtext :"./imgs/youtext.png"
	},
	oSprite;

function init(){
	stage = new Stage("particle","#fdc8af");
	particleSystem = new Particle3D({
		canvas: stage.canvas
	});
	AmbientSystem = new Particle3D({
		canvas: stage.canvas,
		color: COLOR
	});

	oSprite = new ImagesLoad(oMap);//,"./public/images/p/designIco.png","./public/images/p/cs3.png","./public/images/p/youtext.png"

	oSprite.imagesLoaded = function(){
		particleSystem.getContentParticle(oSprite.sprite.designIco);
		AmbientSystem.creatAmbientParticle();
		AmbientSystem.putAmbientParticle();




		stage.addChild(AmbientSystem);
		stage.addChild(particleSystem);
		stage.render();
		//stage.cz = 100;

		//moveView();
		setTimeout(function (){
			//particleSystem.bomb();
		},3e3)



		TweenMax.to( particleSystem, 6, {
			degy: 360,
			ease: Elastic.easeOut.config(1, 0.3),
			onUpdate: function (){
				particleSystem.rotateY();
			}
		})


		document.onmousemove = function(ev){
			var ev = ev||event,
				x = ev.clientX - window.innerWidth/2,
				y = ev.clientY - window.innerHeight/2;
			particleSystem.degy = x/20;
			particleSystem.degx = y/20;
			particleSystem.rotateY();
			//particleSystem.rotateX();
		}
	};
}







function onResize(){
	stage.resize(window.innerWidth,window.innerHeight);
	stage.stop();
	stage.render();
}

$(function(){
	init();
	$( window ).resize(onResize);
	onResize();
});











function ImagesLoad(json){
	this.sprite = {};  //雪碧图
	this.imagesLoad(json);
}
ImagesLoad.prototype.imagesLoad = function (json){
	var This = this,
		OK = 0,
		Total = 0;

	for(var img in json){
		this.sprite[img] = new Image();
		Total++;
		this.sprite[img].onload = function (){
			OK++;
			//alert(This.sprite.img.width)
			if(OK>=Total){
				This.imagesLoaded();
			}
		};
		this.sprite[img].src = json[img];
	}

};
ImagesLoad.prototype.imagesLoaded = function (){};







function Particle3D(json){    //{canvas,color,id}
	this.canvas = json.canvas;
	this.ctx = this.canvas.getContext('2d');
	this.repertory = [];   // 每一副场景的粒子的坐标信息的粒子仓库
	this.spacing = 1;
	this.particleRadius = 8;
	this.loaded = false;
	this.vpx = json.vpx || window.innerWidth/2;
	this.vpy = json.vpy || window.innerHeight/2;
	this.vpz = json.vpz || 300;
	this.degx = json.degx || 0;
	this.degy = json.degy || 0;
	this.degz = json.degz || 0;
	this.ambientNum = 150;
	this.COLOR = json.color||["#ff9400"];
	var now = new Date().getTime(),
		stamp = "id"+now+""+parseInt(Math.random()*10000);
	this._id = json.id || stamp;
}
Particle3D.prototype.setCOLOR = function (color){
	this.COLOR = color;
}
Particle3D.prototype.randomRange = function (LLimit,TLimit){
    return Math.floor(Math.random()*(TLimit-LLimit) + LLimit);
};
Particle3D.prototype.getContentParticle = function (obj){
	var result = [];

	var oImgObj = obj,
		w = oImgObj.width,
		h = oImgObj.height,
		imageData = null,
		spacing = this.spacing,
		radius = this.particleRadius,
		padding = (spacing+radius)*2;
		
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.drawImage(oImgObj, 0, 0, w, h, Math.round(this.canvas.width/2-w/2), Math.round(this.canvas.height/2-h/2), w, h);
		
		imageData = this.ctx.getImageData(Math.round(this.canvas.width/2-w/2), Math.round(this.canvas.height/2-h/2), w, h);
		
		for (var x = 0; x < imageData.width; x++) 
		{
			for (var y = 0; y < imageData.height; y++) 
			{
				var i = 4*(y * imageData.width + x);
	            if (imageData.data[i + 3] > 128) 
				{
					var r = imageData.data[i],
						g = imageData.data[i + 1],
						b = imageData.data[i + 2],
						oUnit = {},
						color = "rgb("+r+","+g+","+b+")",
						locus = {
							x: x,
							y: y
						},
						pointInfor = {
							color: color,
							locus: locus
						};
						oUnit.pixel = {};
						oUnit.size = {
							w: w,
							h: h
						};
					oUnit.pixel = pointInfor;

					oUnit.pixel.xpos = oUnit.pixel.xPos = padding*(oUnit.pixel.locus.x - w/2);
					oUnit.pixel.ypos = oUnit.pixel.yPos = padding*(oUnit.pixel.locus.y - h/2);
					oUnit.pixel.zpos = oUnit.pixel.zPos = 0;
					oUnit.pixel.radius = this.particleRadius;
					oUnit.pixel.alpha = 1;

					this.repertory.push(oUnit);
				}
			}
		}
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

};

Particle3D.prototype.creatAmbientParticle = function (){
	var iNow = 0;

	while(iNow<this.ambientNum){
	var oUnit = {};
		oUnit.pixel = {};
		var particle = {},
			whichColor = this.COLOR[Math.floor(this.COLOR.length*Math.random())];
			particle = {
				color: whichColor
			};
		oUnit.pixel = particle;
		iNow++;
		this.repertory.push(oUnit);
	}
};
Particle3D.prototype.putAmbientParticle = function (){
	var graph = this.repertory,
		who = 0;
	while(who<graph.length){
		var unit = graph[who].pixel;
		unit.xpos = unit.xPos = this.randomRange(-window.innerWidth/2,window.innerWidth/2);
		unit.ypos = unit.yPos = this.randomRange(-window.innerHeight/2,window.innerHeight/2);
		unit.zpos = unit.zPos = this.randomRange(window.innerWidth*3/4,window.innerWidth/2);
		unit.radius = this.particleRadius;
		unit.alpha = 1;
		this.ambientLoop(unit);
		who++;
	}
};
Particle3D.prototype.ambientLoop = function (obj){
	var This = this;

	var TweenMaxTo = TweenMax.to( obj, 4+4*Math.random(), {
			zpos: -window.innerWidth/2,
			ease: Power0.easeNone,
			onComplete: function (){
				This.ambientInit(obj);
			}
		})
};
Particle3D.prototype.ambientInit = function (obj){

		obj.xpos = this.randomRange(-window.innerWidth/2,window.innerWidth/2);
		obj.ypos = this.randomRange(-window.innerHeight/2,window.innerHeight/2);
		obj.zpos = this.randomRange(window.innerWidth*3/4,window.innerWidth);
		TweenMax.fromTo( obj, 2, { alpha: 0}, { alpha: 1});
		this.ambientLoop(obj);

};
Particle3D.prototype.bomb = function (obj){
	var graph = this.repertory,
		This = this,
		who = 0;
	while(who<graph.length){
		var unit = graph[who].pixel;

		TweenMax.to( unit, 3, {
			xpos: This.randomRange(-window.innerWidth/2,window.innerWidth/2),
			ypos: This.randomRange(-window.innerHeight/2,window.innerHeight/2),
			zpos: This.randomRange(-window.innerHeight/2,window.innerHeight/2),
			alpha: 0.4,
			ease: Power2.easeOut
		})

		who++;
	}
};

Particle3D.prototype.rotateY = function (){
	var graph = this.repertory,
		who = 0,
		angleY = this.degy,
    	cosy = Math.cos(Math.PI*angleY/180),
    	siny = Math.sin(Math.PI*angleY/180);
	while(who<graph.length){

		var unit = graph[who].pixel,
            x = unit.xPos * cosy,
            z = this.vpz + unit.xPos * siny;
            unit.xpos = x;
            unit.zpos = z;

		who++;
	}
};
Particle3D.prototype.rotateX = function (){
	var graph = this.repertory,
		who = 0,
		angleX = this.degx;
	while(who<graph.length){

		var unit = graph[who].pixel,
        	cosy = Math.cos(Math.PI*angleX/180),
        	siny = Math.sin(Math.PI*angleX/180),
            y = unit.yPos * cosy,
            z = this.vpz + unit.yPos * siny;
            unit.ypos = y;
            unit.zpos = z;

		who++;
	}
};
Particle3D.prototype.rotateZ = function (){
	var graph = this.repertory,
		who = 0,
		angleX = this.degx;
	while(who<graph.length){

		var unit = graph[who].pixel,
        	cosy = Math.cos(Math.PI*angleX/180),
        	siny = Math.sin(Math.PI*angleX/180),
            y = unit.yPos * cosy,
            x = this.vpz + unit.yPos * siny;
            unit.ypos = y;
            unit.xpos = x;

		who++;
	}
};
Particle3D.prototype.translate = function (x,y,z){
	TweenMax.fromTo(this, 1, {vpz:0}, {vpz:100}).repeat(20).yoyo(true).play();
};





function Stage(id,bgColor){
	this.canvas = document.getElementById(id);
	this.ctx = this.canvas.getContext('2d');
	this.stageRepertory = {};    // 每一个图形或者场景作为一个一个对象存在这里
	this.renderBuffer = [];
	this.renderBag = [];    // 渲染器的口袋
	this.pause = true;
	this.vpx = window.innerWidth/2;
	this.vpy = window.innerHeight/2;
	this.canvas.style.backgroundColor = bgColor || "transparent";
	this.focalLength = window.innerWidth/2;
	this.cx = 0;
	this.cy = 0;
	this.cz = 0;
};
Stage.prototype.addChild = function (obj){
	this.stageRepertory[obj._id] = obj;
	this.updateBag();
};
Stage.prototype.updateBag = function (){
	var depot = this.stageRepertory;
	for(var pair in depot){
		//console.log(depot[pair]);
		this.renderBag = this.renderBag.concat(depot[pair].repertory);
	}
};
Stage.prototype.resize = function (w,h){
    this.canvas.width = w;
    this.canvas.height = h;
	this.vpx = w/2;
	this.vpy = h/2;
};
Stage.prototype.drawShape = function (){
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	var iNow=this.renderBag.length-1;
	while(iNow>0){

		console.log(iNow);
		var unit = this.renderBag[iNow].pixel,
			color = unit.color,
			x = unit.xpos,
			y = unit.ypos,
			w = unit.radius,
			scaleXY = this.getScreenXY(unit);
		if(unit.zpos!==0){
			x = scaleXY.x;
			y = scaleXY.y;
			w = scaleXY.w;
		}
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.arc(this.vpx+x, this.vpy+y, w, 0, Math.PI*2, true);
		this.ctx.closePath();
		this.ctx.globalAlpha = unit.alpha;
		this.ctx.fill();

		iNow--;
	}
};
Stage.prototype.start = function (){
	this.render();
};
Stage.prototype.stop = function (){
	this.pause = false;
};
Stage.prototype.render = function (){
	var This = this;
	this.pause = true;
	function renderLoop(){
		if(This.renderBag.length){
			This.sortZ();
			//console.time("label");
			This.drawShape();
			//console.timeEnd("label");
		}
		if(This.pause)requestAnimationFrame(renderLoop);
	}
	requestAnimationFrame(renderLoop);
};
Stage.prototype.getScale = function (point){
    return (this.focalLength / (this.focalLength + point.zpos + this.cz));
};
Stage.prototype.getScreenXY = function (point){
    var scale = this.getScale(point);
    return {
        x: (this.cx + point.xpos) * scale,
        y: (this.cy + point.ypos) * scale,
        w: scale*point.radius
    };
};
Stage.prototype.sortZ = function () {
	this.renderBag.sort(function (a, b) { return a.pixel.zpos-b.pixel.zpos });
};
