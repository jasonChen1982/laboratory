window.onerror = function(msg,url,line){
	alert(msg+":::::"+url+":::::"+line)
}


/* 对requestAnimation做兼容 */
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
        window[vendors[x] + 'CancelRequestAnimationFrame'];
}
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}
window.requestAnimFrame = window.requestAnimationFrame;
/* 结束 对requestAnimation做兼容 */




	
var Polygon,
	Stage,
	PI = Math.PI,
	toRAD = PI/180,
	COLOR = ["#df494a","#efc94c","#45b29d","#334d5c","#e0773d"],
	oSprite;

function init(){
	Stage = new Stage("polygon","#cccccc");
	onResize();
	// console.log(Polygon._dots);
	// console.log(Polygon.dots);

		var aPolygons = [];
		for (var i = 300 - 1; i >= 0; i--) {
			aPolygons[i] = new Polygon3D({
				posX: Stage.canvas.width/2,//+window.innerWidth*(Math.random()-0.5)
				posY: 0 //window.innerHeight/2+window.innerHeight*(Math.random()-0.5)
			});
			
		};
		//Polygon = new Polygon3D();

		
var one = true;
$(document).on("click",function(){
	if(one){
		one = false;
		for (var i = aPolygons.length - 1; i >= 0; i--) {
			
			
			console.log(111)
			!(function(i){
				
				setTimeout(function(){
					var deg = {
						degX:0,
						degY:0,
						degZ:0
					}
					TweenMax.to( deg, 3, {
						degX: 3600*(Math.random()-0.5),
						degY: 3600*(Math.random()-0.5),
						degZ: 3600*(Math.random()-0.5),
						ease: Power0.easeNone,
						onUpdate: function (){
							aPolygons[i].rotateX(deg.degX);
							aPolygons[i].rotateY(deg.degY);
							//aPolygons[i].rotateZ(deg.degZ);
						}
					});
					TweenMax.to( aPolygons[i].pos, 4, {y: Stage.canvas.height,ease: Bounce.easeOut});
					TweenMax.to( aPolygons[i].pos, 4, {x: Stage.canvas.width/2+Stage.canvas.width*(Math.random()-0.5),ease: Power1.easeOut});
				},50*i)
				
			})(i)
		};
	}
})
		
		
		Stage.addChilds(aPolygons);
		Stage.start();

}







function onResize(){
	Stage.resize(window.innerWidth*2,window.innerHeight*2);
	Stage.canvas.style.width = window.innerWidth+'px';
	Stage.canvas.style.height = window.innerHeight+'px';
	Stage.stop();
	Stage.start();
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
			if(OK>=Total){
				This.imagesLoaded();
			}
		};
		this.sprite[img].src = json[img];
	}

};
ImagesLoad.prototype.imagesLoaded = function (){};







function Polygon3D(json){
	this.pos = {
		x: json.posX||window.innerWidth/2,
		y: json.posY||-80,
		z: json.posZ||0
	};

	this.degX = 0;
	this.degY = 0;
	this.degZ = 0;
	this.dots = this.creatDots();
	this._dots = JSON.parse(JSON.stringify(this.dots));
	this.COLOR = ["#ff636e","#ff8136","#d63939","#42ad94","#ff9400","#df494a","#efc94c","#45b29d","#334d5c","#e0773d"];
	this.color = this.COLOR[Math.floor(this.COLOR.length*Math.random())];
	this.focalLength = window.innerWidth/2;
	this.cx = 0;
	this.cy = 0;
	this.cz = 0;

}
Polygon3D.prototype.setPos = function (json){
	this.pos = {
		x: json.posX,
		y: json.posY,
		z: json.posZ
	};
}
Polygon3D.prototype.creatDots = function (){
	var radius = this.randomRange(36,50),
		result = [],
		dotNumber = 3;
	for(var i=0;i<dotNumber;i++){
		var degX = this.randomRange(0,360),
		degY = this.randomRange(0,360),
		PI = Math.PI,
		toRAD = PI/180;

		result[i] = {
			x: radius*Math.sin(toRAD*degX)*Math.cos(toRAD*degY),
			y: radius*Math.sin(toRAD*degX)*Math.sin(toRAD*degY),
			z: radius*Math.cos(toRAD*degX)
		}
	}
	return result;
}
Polygon3D.prototype.randomRange = function (LLimit,TLimit){
    return Math.floor(Math.random()*(TLimit-LLimit) + LLimit);
};
Polygon3D.prototype.rotateZ = function (deg){
	var PI = Math.PI,
		toRAD = PI/180,
		cos = Math.cos(deg*toRAD),
		sin = Math.sin(deg*toRAD);
	for(var i=0;i<this._dots.length;i++){
		this.dots[i].x = this._dots[i].x*cos-this._dots[i].y*sin;
		this.dots[i].y = this._dots[i].x*sin+this._dots[i].y*cos;
		// this.projection(this.dots[i]);
	}
};
Polygon3D.prototype.rotateY = function (deg){
	var PI = Math.PI,
		toRAD = PI/180,
		cos = Math.cos(deg*toRAD),
		sin = Math.sin(deg*toRAD);
	for(var i=0;i<this._dots.length;i++){
		this.dots[i].x = this._dots[i].x*cos+this._dots[i].z*sin;
		this.dots[i].z = this._dots[i].x*sin+this._dots[i].z*cos;
		// this.projection(this.dots[i]);
	}
};
Polygon3D.prototype.rotateX = function (deg){
	var PI = Math.PI,
		toRAD = PI/180,
		cos = Math.cos(deg*toRAD),
		sin = Math.sin(deg*toRAD);

	for(var i=0;i<this._dots.length;i++){
		this.dots[i].y = this._dots[i].y*cos-this._dots[i].z*sin;
		this.dots[i].z = this._dots[i].y*sin+this._dots[i].z*cos;
		// this.projection(this.dots[i]);
	}
};
Polygon3D.prototype.getScale = function (point){
    return (this.focalLength / (this.focalLength + point.z + this.cz));
};
Polygon3D.prototype.getScreenXY = function (point){
    var scale = this.getScale(point);
    return {
        x: point.x * scale,
        y: point.y * scale
    };
};
Polygon3D.prototype.projection = function (point){
		var scaleXY;
		scaleXY = this.getScreenXY(point);
		point.x = scaleXY.x;
		point.y = scaleXY.y;

}
Polygon3D.prototype.fallingDown = function (){
	var PI = 0.001,
		toRAD = PI/180,
		cos = Math.cos(deg*toRAD),
		sin = Math.sin(deg*toRAD);

	for(var i=0;i<this._dots.length;i++){
		this.dots[i].y = this._dots[i].y*cos-this._dots[i].z*sin;
		this.dots[i].z = this._dots[i].y*sin+this._dots[i].z*cos;
	}
};






function Stage(id,bgColor){
	this.canvas = document.getElementById(id);
	this.ctx = this.canvas.getContext('2d');
	this.renderBuffer = [];
	this.renderBag = [];    // 渲染器的口袋
	this.pause = true;
	this.vpx = window.innerWidth/2;
	this.vpy = window.innerHeight/2;
	this.canvas.style.backgroundColor = bgColor || "transparent";
};
Stage.prototype.addChild = function (obj){
	this.renderBag.push(obj);
	//this.updateBag();
};
Stage.prototype.addChilds = function (arr){
	this.renderBag = arr;
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
	
	while(iNow>=0){

		var polygon = this.renderBag[iNow],
			dots = polygon.dots,
			color = polygon.color;

		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.moveTo(polygon.pos.x+dots[0].x,polygon.pos.y+dots[0].y);
		this.ctx.lineTo(polygon.pos.x+dots[1].x,polygon.pos.y+dots[1].y);
		this.ctx.lineTo(polygon.pos.x+dots[2].x,polygon.pos.y+dots[2].y);
		this.ctx.closePath();
		this.ctx.fill();

		iNow--;
	}
};
Stage.prototype.start = function (){
	if (!this.pause){
		this.pause = true;
		this.render();
	};
};
Stage.prototype.stop = function (){
	this.pause = false;
};
Stage.prototype.render = function (){
	var This = this;
	function renderLoop(){
		if(This.renderBag.length){
			//This.sortZ();
			//console.time("label");
			This.drawShape();
			//console.timeEnd("label");
		}
		if(This.pause)requestAnimationFrame(renderLoop);
	}
	requestAnimationFrame(renderLoop);
};


/* 运动时间函数 */
function Tween(){

}
Tween.prototype.play = function(attr,from,to,time,fx,cb){
	var This = this,
		startTime = (new Date()).getTime();
	function letGo() {
		var nowTime = (new Date()).getTime(),
			progress = nowTime - startTime,
			tmp = 0,
			stop = progress>=time;
		for(var i in from){
			if (!stop) {
				attr[i] = This.tween[fx]( progress , from[i] , to[i] - from[i] , time );
			}else{
				attr[i] = to[i];
				if(cb)cb();
			};
		}
        if (!stop)requestAnimationFrame(letGo);
    }
    requestAnimationFrame(letGo);
}
Tween.prototype.tween = {
	linear: function (t, b, c, d){
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	paraCurve: function(t, b, c, d){
		var a = Math.sqrt(c),
			b = b+c;
		return -(t*t)+(2*t)-(a*a)+b;
	}
}
var FromTo = new Tween();
/* 结束 运动时间函数 */
