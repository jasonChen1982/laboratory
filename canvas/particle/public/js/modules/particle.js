var particleSystem,
	stage,
	PI = Math.PI,
	toRAD = PI/180,
	COLOR = ["#ff636e","#ff8136","#d63939","#42ad94","#ff9400"],
	oMap = {
		h5ico :"./public/images/p/h5ico.png",
		designIco :"./public/images/p/designIco.png",
		cs3 :"./public/images/p/cs3.png",
		youtext :"./public/images/p/youtext.png"
	},
	oSprite;

function init(){
	stage = new Stage("particle","#fdc8af");
	particleSystem = new Particle3D(stage.canvas);
	AmbientSystem = new Particle3D(stage.canvas,COLOR);

	oSprite = new ImagesLoad(oMap);//,"./public/images/p/designIco.png","./public/images/p/cs3.png","./public/images/p/youtext.png"

	oSprite.imagesLoaded = function(){
		particleSystem.getContentParticle(oSprite.sprite.h5ico);
		AmbientSystem.creatAmbientParticle();
		AmbientSystem.putAmbientParticle();




		stage.addChild(AmbientSystem.repertory);
		stage.addChild(particleSystem.repertory);
		stage.render();
		//stage.cz = 100;

		//moveView();
		setTimeout(function (){
			particleSystem.bomb();
		},3e3)
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







function Particle3D(canvas,color){
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.repertory = [];   //每一副场景的粒子的坐标信息的粒子仓库
	this.spacing = 1;
	this.particleRadius = 8;
	this.loaded = false;
	this.vpx = window.innerWidth/2;
	this.vpy = window.innerHeight/2;
	this.ambientNum = 100;
	this.COLOR = color||["#ff9400"];
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

					oUnit.pixel.xpos = padding*(oUnit.pixel.locus.x - w/2);
					oUnit.pixel.ypos = padding*(oUnit.pixel.locus.y - h/2);
					oUnit.pixel.zpos = 0;
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
		unit.xpos = this.randomRange(-window.innerWidth/2,window.innerWidth/2);
		unit.ypos = this.randomRange(-window.innerHeight/2,window.innerHeight/2);
		unit.zpos = this.randomRange(-200,window.innerHeight/2);
		unit.radius = this.particleRadius;
		unit.alpha = 1;
		this.ambientLoop(unit);
		who++;
	}
};
Particle3D.prototype.ambientLoop = function (obj){
	var This = this;
	requestAnimationFrame(animate);

	function animate(){
		var	speedz = -4;
		obj.zpos += speedz;
		if (obj.zpos<-window.innerHeight/2) {
			obj.xpos = This.randomRange(-window.innerWidth/2,window.innerWidth/2);
			obj.ypos = This.randomRange(-window.innerHeight/2,window.innerHeight/2);
			obj.zpos = This.randomRange(window.innerHeight/2,window.innerHeight);
			TweenMax.fromTo( obj, 2, { alpha: 0}, { alpha: 1});
		};
		requestAnimationFrame(animate);
	}
};
Particle3D.prototype.bomb = function (obj){
	var graph = this.repertory,
		This = this,
		who = 0;
	while(who<graph.length){
		var unit = graph[who].pixel;

		TweenMax.to( unit, 1, {
			xpos: This.randomRange(-window.innerWidth/2,window.innerWidth/2),
			ypos: This.randomRange(-window.innerHeight/2,window.innerHeight/2),
			zpos: This.randomRange(-window.innerHeight/2,window.innerHeight/2),
			alpha: 0,
			ease: Power2.easeOut
			})

		who++;
	}
};








function Stage(id,bgColor){
	this.canvas = document.getElementById(id);
	this.ctx = this.canvas.getContext('2d');
	this.stageRepertory = [];
	this.renderBuffer = [];
	this.pause = true;
	this.vpx = window.innerWidth/2;
	this.vpy = window.innerHeight/2;
	this.canvas.style.backgroundColor = bgColor || "transparent";
	this.focalLength = window.innerHeight/2;
	this.cx = 0;
	this.cy = 0;
	this.cz = 0;
};
Stage.prototype.addChild = function (obj){
	this.stageRepertory = this.stageRepertory.concat(obj);
};
Stage.prototype.resize = function (w,h){
    this.canvas.width = w;
    this.canvas.height = h;
	this.vpx = w/2;
	this.vpy = h/2;
};
Stage.prototype.drawShape = function (){
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	var iNow=0;
	while(iNow<this.stageRepertory.length){

		var unit = this.stageRepertory[iNow].pixel,
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

		iNow++;
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
	requestAnimationFrame(renderLoop);
	function renderLoop(){
		if(This.stageRepertory.length){
			This.sortZ();
			This.drawShape();
		}
		if(This.pause)requestAnimationFrame(renderLoop);
	}
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
	this.stageRepertory.sort(function (a, b) { return b.pixel.zpos-a.pixel.zpos });
}

/*
                    // 设定旋转中心
Stage.prototype.setVanishPoint = function (vpx, vpy) {
                        this.vpx = vpx;
                        this.vpy = vpy;
                    };
                    // 设定坐标中心点
Stage.prototype.setCenterPoint = function (x, y, z) {
                        this.cx = x;
                        this.cy = y;
                        this.cz = z;
                    };
                    // 绕x轴旋转
Stage.prototype.rotateX = function (angleX) {
                        var cosx = Math.cos(angleX),
                            sinx = Math.sin(angleX),
                            y1 = this.ypos * cosx - this.zpos * sinx,
                            z1 = this.zpos * cosx + this.ypos * sinx;
                        this.ypos = y1;
                        this.zpos = z1;
                    };
                    // 绕y轴旋转
Stage.prototype.rotateY = function (angleY) {
                        var cosy = Math.cos(angleY),
                            siny = Math.sin(angleY),
                            x1 = this.xpos * cosy - this.zpos * siny,
                            z1 = this.zpos * cosy + this.xpos * siny;
                        this.xpos = x1;
                        this.zpos = z1;
                    };
                    // 绕z轴旋转
Stage.prototype.rotateZ = function (angleZ) {
                        var cosz = Math.cos(angleZ),
                            sinz = Math.sin(angleZ),
                            x1 = this.xpos * cosz - this.ypos * sinz,
                            y1 = this.ypos * cosz + this.xpos * sinz;
                        this.xpos = x1;
                        this.ypos = y1;
                    }
                    // 获取缩放scale
Stage.prototype.getScale = function () {
                        return (this.focalLength / (this.focalLength + this.zpos + _cz));		  
                    };
                    // 获取z轴扁平化的 x，y值
Stage.prototype.getScreenXY = function () {
                        var scale = this.getScale();
                        return {
                            x: _vpx + (_cx + this.xpos) * scale,
                            y: _vpy + (_cy + this.ypos) * scale
                        };
                    }



function Engine3D(vpx,vpy,focalLength){
	this.vpx = vpx;
    this.vpy = vpy;
	this.focalLength = focalLength||1000;
    this.coordinateSys = {
    	x || window.innerWidth/2,
    	y || window.innerHeight/2,
    	z || 0
    };
};
Engine3D.prototype.changeCoordinateSys = function (json){
	this.coordinateSys = json;
};
// 设定旋转中心
Engine3D.prototype.setVanishPoint = function (vpx, vpy) {
    this.vpx = vpx;
    this.vpy = vpy;
};
*/