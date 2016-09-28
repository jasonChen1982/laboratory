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

function BubbleFountain(id,max,interval){
	this.group = s.paper.g().attr({id:id});
	this.interval = interval||30;
	this.max = max||300;
	this.iNow = 0;
	this.timer = null;
	this.baseX=320;
	this.baseY=500;
	this.rad_offset = 0;
	this.iNowAngle = 0;
	this.loading = true;
}
BubbleFountain.prototype.init = function (){
	this.selfRenewal();
}
BubbleFountain.prototype.addOne = function (){
	var This = this;
	var b,c,d,e;
		this.centerX=this.baseX + 60*(Math.random()-0.5);
		this.centerY=this.baseY + 60*(Math.random()-0.5);
		this.a=Math.floor(25*Math.random())+5;
		b=Math.random()/2+.5; //设置不透明度

		c = (Math.PI * ((Math.random() * 120 -30 + this.iNowAngle)%360) / 180); //随机产生角度

		targetX = this.centerX+ Math.cos(c)*120;
		targetY = this.centerY- Math.sin(c)*120;

		d=Math.floor(800*Math.random())+1e3;
		e=s.paper.circle(this.centerX,this.centerY,this.a);
		this.iNow++;
		e.attr({fill:"#E50012",opacity:b,"fill-opacity":b}).animate({cy:targetY,cx:targetX,opacity:0,"fill-opacity":0.4,r:this.a*2.5},d,mina.easeout,function(){
				e.remove();
				This.iNow--;
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
		for(var i=0;i<2;i++){
			This.updata();
		}
	},this.interval);
}
BubbleFountain.prototype.clearTimer = function (){
	clearInterval(this.timer);
}
BubbleFountain.prototype.setMax = function (num){
	this.max = num;
	return this;
}
BubbleFountain.prototype.circleLoading = function (){
	var This = this;

	animated();
	function animated(){

		This.iNowAngle -= 10;
		This.iNowAngle = This.iNowAngle%360;


		This.rad_offset = Math.PI * This.iNowAngle/180;

		This.baseX=320 + Math.cos(This.rad_offset)*200;
		This.baseY=400 - Math.sin(This.rad_offset)*200;

		if(This.loading){
			requestAnimationFrame(animated);
		}
    	
    }
}

/* 中心喷泉式泡泡 */


var bubbleMain=new BubbleFountain("bubbleM");
	bubbleMain.init();
	bubbleMain.circleLoading();

var big = s.paper.circle(320,400,190).attr("fill","#E50012");