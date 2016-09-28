function fit(){
        $("#coke").height($(window).height()-5);
    };
$(function(){
    fit();
    $(window).resize(function(){
        fit();
    });
});


var s = Snap("#coke");

/* 中心喷泉式泡泡 */
/*
function BubbleFountain(id,max,interval){
	this.group = s.paper.g().attr({id:id});
	this.interval = interval||100;
	this.max = max||50;
	this.iNow = 0;
	this.timer = null;
	this.baseX=320;
	this.baseY=500;
}
BubbleFountain.prototype.init = function (){
	this.selfRenewal();
}
BubbleFountain.prototype.addOne = function (){
	var This = this;
	var b,c,d,e;
		this.centerX=this.baseX + 60*(Math.random()-0.5);
		this.centerY=this.baseY + 60*(Math.random()-0.5);
		this.a=Math.floor(30*Math.random())+10;
		b=Math.random()/2+.5; //设置不透明度

		c = Math.PI * Math.floor(360*Math.random())/180; //随机产生角度

		targetX = this.centerX+ Math.cos(c)*300;
		targetY = this.centerY- Math.sin(c)*300;

		d=Math.floor(2e3*Math.random())+2e3;
		e=s.paper.circle(this.centerX,this.centerY,this.a);
		this.iNow++;
		e.attr({fill:"#E50012",opacity:0,"fill-opacity":0}).animate({opacity:b,"fill-opacity":b},100,mina.linear,function(){
				e.animate({cy:targetY,cx:targetX,opacity:0,"fill-opacity":0},d,mina.easeout,function(){
					e.remove();
					This.iNow--;
				});
			});
		this.group.add(e);
}
BubbleFountain.prototype.updata = function (){
	if(this.max>this.iNow)this.addOne();
}
BubbleFountain.prototype.selfRenewal = function (){
	var This = this;
	this.clearTimer();
	this.timer = setInterval(function(){
		This.updata();
	},this.interval);
}
BubbleFountain.prototype.clearTimer = function (){
	clearInterval(this.timer);
}
BubbleFountain.prototype.setMax = function (num){
	this.max = num;
	return this;
}
*/

/* 中心喷泉式泡泡 */

/* 柱状喷泉式泡泡 */
function BubbleFountain(id,max,interval){
	this.group = s.paper.g().attr({id:id});
	this.interval = interval||30;
	this.max = max||80;
	this.iNow = 0;
	this.timer = null;
	this.baseX=320;
	this.baseY=850;
	this.animateBtn = true;
	this.gravity = 0.1;
}
BubbleFountain.prototype.init = function (){
	this.selfRenewal();
}
BubbleFountain.prototype.addOne = function (){
	var This = this;
	var b,c,d,e;
		this.centerX=this.baseX + 40*(Math.random()-0.5);
		this.centerY=this.baseY;
		this.speedX= 4*(Math.random()-0.5);
		console.log(this.speedX);
		this.speedY=-6*(Math.random()+1);
		this.a=Math.floor(30*Math.random())+10;
		b=Math.random()/2+.5; //设置不透明度

		d=Math.floor(2e3*Math.random())+2e3;
		e=s.paper.circle(this.centerX,this.centerY,this.a);
		this.iNow++;
		e.attr({fill:"#E50012",opacity:0,"fill-opacity":0}).animate({opacity:b,"fill-opacity":b},100,mina.linear);
		this.group.add(e);
		this.animation(e,this.a);
}
BubbleFountain.prototype.updata = function (){
	if(this.max>this.iNow)this.addOne();
}
BubbleFountain.prototype.selfRenewal = function (){
	var This = this;
	this.clearTimer();
	this.timer = setInterval(function(){
		This.updata();
	},this.interval);
}
BubbleFountain.prototype.clearTimer = function (){
	clearInterval(this.timer);
}
BubbleFountain.prototype.setMax = function (num){
	this.max = num;
	return this;
}
BubbleFountain.prototype.animation = function (obj,r){
	var This = this;
	var e = obj;
	var centerX = this.centerX;
	var centerY = this.centerY;
	var speedX = this.speedX;
	var speedY = this.speedY;
	var gravity = this.gravity;

	animated();
	function animated(){
		centerX += speedX;
		speedY+=gravity;
		centerY += speedY;
		if(centerY>800&&speedY>0){
			speedY *= -0.8;
		}

		e.attr({cy:centerY,cx:centerX});

		if((centerX+2*r)<0||(centerX-2*r)>640||((centerY+2*r)>880&&speedY>0)){
			e.remove();
			This.iNow--;
			return false;
		}
    	requestAnimationFrame(animated);
	}
}
/* 柱状喷泉式泡泡 */





var bubbleMain=new BubbleFountain("bubbleM");
	bubbleMain.init();

