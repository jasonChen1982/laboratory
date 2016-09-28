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
var bottlebody = s.paper.path({
	d : data.bottle,
	fill : "#e60012"
});
var bottleLogo = s.paper.path({
	d : data.bottleLogo,
	fill : "#ffffff"
});
var bottle = s.paper.group(bottlebody,bottleLogo).attr({
	"transform" : "matrix(1,0,0,1,0,-400)",
		opacity:0,
		"fill-opacity":0
	}).animate({
		"transform" : "matrix(1,0,0,1,0,-50)",
		opacity:1,
		"fill-opacity":1
	},1000,mina.backout);

var page_title = ["今年5月8日是可口可乐第128个生日，","适逢我们重返中国大陆35年。","每瓶可口可乐是快乐、是感动，","让我们来重温一起分享快乐的那些年。"];

var intro = s.paper.text(320,0,page_title).attr({
		textAnchor:"middle",
		textLength:"200",
		lengthAdjust:"spacing",
		fill:"#858585",
		"class":"intro",
		fontSize:"xx-large",
		fontWeight:"bolder",
		transform:"matrix(1,0,0,1,0,560)",
		id:"intro"
	});

var aPageTspan=intro.selectAll("tspan");
aPageTspan.forEach(function(element,index){
	element.attr({
		x:320,
		y:50*index,
		opacity:0,
		"fill-opacity":0
	});
	setTimeout(function(){
		element.animate({
			opacity:1,
			"fill-opacity":1
		},500,mina.easeout);
	},500*index+1e3);
});




var hand = s.paper.path({
	d : data.hand,
	id : "p0hand",
	fill : "#ffffff",
	stroke : "#e60012",
	transform : "matrix(1,0,0,1,350,750)",
	"stroke-width" : "3px",
	"opacity" : 0
});
var showhand = null;

	setTimeout(function (){
		setInterval(function(){
			hand.animate({
				opacity:1
			},400,function(){});
			setTimeout(function(){
				hand.animate({
					opacity:0
				},600)
			},1e3);
		},2e3);
	},1.8e3);

var e=s.paper.polyline(310,720,330,720,320,730);
var f=s.paper.polyline(300,730,340,730,320,750);
var g=s.paper.polyline(290,750,350,750,320,780);
var down=s.paper.g(e,f,g).attr({
		fill:"#E60012",
		opacity:0,
		transform:"matrix(1,0,0,1,0,30)",
		id:"p0arrow"
	});
var arrow = null;

setTimeout(function (){
	arrow = setInterval(function (){
		down.attr({opacity:1});
		e.animate({opacity:.4},200,mina.easeout,function(){
			f.animate({opacity:.7},200,mina.easeout,function(){
				g.animate({opacity:1},200,mina.easeout,function(){
					setTimeout(function(){
						e.animate({opacity:0},100);
						f.animate({opacity:0},100);
						g.animate({opacity:0},100);
					},200);
				});
			});
		});
	},1200);
	},2.3e3);
var bubble={
	x1:0,
	x2:0,
	y1:0,
	y2:0,
	addOne:function(){
		var a,b,c,d,e;
			centerX=Math.floor(Math.random()*(this.x2-this.x1))+parseInt(this.x1);
			centerY=Math.floor(Math.random()*(this.y2-this.y1))+parseInt(this.y1);
			a=Math.floor(30*Math.random())+10;
			b=Math.random()/2+.5;
			c=Math.floor(90*Math.random())+10;
			d=Math.floor(2e3*Math.random())+2e3;
			e=s.paper.circle(centerX,centerY,a);
			e.attr({fill:"#E50012",opacity:0,"fill-opacity":0}).animate({opacity:b,"fill-opacity":b},200,mina.linear,function(){
					e.animate({cy:e.attr("cy")-c},1e3,mina.easeout,function(){
						setTimeout(function(){
							e.animate({opacity:0,"fill-opacity":0},200,mina.linear,function(){
								e.remove()
							})
						},d);
					});
				});
			return e;
		},
	up:function(a){
		void 0==a[6]&&a.add(this.addOne());
	},
	changeArea:function(a,b,c,d){
		this.x1=a;
		this.x2=b;
		this.y1=c;
		this.y2=d;
	}
}
	



//var bubbleUpL=setInterval("bubble.changeArea(155,230,190,370);bubble.up(bubbleLeft)",100);

//var bubbleUpR=setInterval("bubble.changeArea(400,500,400,520);bubble.up(bubbleRight)",100);


var penhead = s.paper.path(data.penhead);
var p1logo = null;
var y1886 = null;
var y1886slogan = null;

down.click(function (){
	var firstLine = s.paper.path(data.pen);
	var totleLength = firstLine.getTotalLength();
	firstLine.attr({
		fill : "none",
		stroke : "#e50012",
		"stroke-width": "10px",
		"stroke-dasharray": totleLength+" "+totleLength,
		"stroke-dashoffset" : totleLength
	}).animate({"stroke-dashoffset":5e3},3e3,mina.easeout,function(){
		penhead.attr({fill:"none",stroke:"#E50012",strokeWidth:10});
		//data.p1logo
		var a,b,c,d,e;
		a=s.paper.path(data.y1886);
		b=s.paper.rect(37.6,215.1,182.5,6.4);
		c=s.paper.rect(37.6,329.4,182.5,6.4);
		y1886=s.paper.g(a,b,c).attr({opacity:0,fill:"#E50012",id:"p1y1886"});

		//setTimeout("y1886.animate({opacity:1},1000);",1e3);
			//alert(1)

		y1886slogan=s.paper.text(35,370,["111111111111","22222222222222"]).attr({opacity:0,fill:"#aaaaaa",id:"p1y1886slogan",fontSize:"xx-large"});
		y1886slogan.selectAll("tspan").forEach(function(a,b){a.attr({x:35,y:50*b+370})});
		d = s.paper.path(data.p1logo);
		e=s.paper.polyline(data.p1logoPoint);
		p1logo=s.paper.g(d,e).attr({id:"p1logo",transform:"matrix(1,0,0,1,-50,10)",opacity : 0,fill:"#E50012"}).animate({transform:"matrix(1,0,0,1,0,0)",opacity : 1},400,mina.easeout,function (){
			y1886.animate({opacity : 1},400,mina.easeout);
			y1886slogan.animate({opacity : 1},400,mina.easeout);
		});

	});


    bubbleLeft.clearTimer();
    bubbleMain.setArea({
		x1:350,
		x2:430,
		y1:200,
		y2:320
	}).setMax(8);


	bottle.animate({transform:"matrix(1,0,0,1,0,1000)"},2e3,mina.easeout,function (){
        this.remove();
        setTimeout(function (){
            p1logo.animate({transform:"matrix(1,0,0,1,0,500)",opacity : .3},1500,mina.backin,function (){this.remove();})
        },3e3);
        setTimeout(function (){
            y1886slogan.animate({transform:"matrix(1,0,0,1,0,500)",opacity : .3},1500,mina.backin,function (){this.remove();})
        },3.1e3);
        setTimeout(function (){
        	bubbleMain.setArea({
				x1:480,
				x2:580,
				y1:280,
				y2:400
			})
            y1886.animate({transform:"matrix(1,0,0,1,0,500)",opacity : .3},1500,mina.backin,function (){
                this.remove();
                firstLine.animate({transform:"matrix(1,0,0,1,0,2000)","stroke-dashoffset":2900},3000,mina.easeout,function (){
                	gopage2();
                });
            })
            penhead.remove();
        },3.2e3);
    });

	intro.animate({opacity:0},400,mina.easeout,function (){this.remove()});
	down.animate({opacity:0},400,mina.easeout,function (){this.remove()});
	hand.animate({opacity:0},400,mina.easeout,function (){this.remove()});

	firstLine.animate({transform:"matrix(1,0,0,1,0,1000)"},2e3,mina.easeout);

	var page2 = {};
	function gopage2(){
		var dollar = s.paper.path(data.dollar).attr({fill:"#e73828"}),
			dollar1 = s.paper.path(data.dollar1).attr({fill:"none",stroke:"#e73828",strokeWidth:20}),
			rect = s.paper.rect(56, 52, 9, 99).attr({fill: "#e73828"});

		page2.moeny = s.paper.g(dollar,dollar1,rect).attr({
			transform:"matrix(0.5,0,0,0.5,185,185)",
			opacity:1
		}).animate({
			transform:"matrix(1,0,0,1,130,130)"
		},600,mina.elastic);

		var y1899 = s.paper.path(data.y1899),
			polyline1 = s.paper.polyline("200.2,25.2,219.6,44.6,200.2,63.9"),
			polyline2 = s.paper.polyline("19.4,63.9,0,44.6,19.4,25.2");
			page2.year = s.paper.g(y1899,polyline1,polyline2).attr({fill:"#e50012",transform:"matrix(1,0,0,1,800,380)"}).animate({
				transform:"matrix(1,0,0,1,240,380)"
			},1000,mina.backout);

		var rectBg = s.paper.rect(0, 0, 395, 118).attr({fill: "#e50012"}),
			text2 = s.paper.text(20,46,["阿萨▪坎德勒以1美元的价格将瓶装权出售，","瓶装可口可乐从此诞生，畅爽随时随地。"]).attr({
				fill:"#ffffff",
				"font-size": "larger"
			});
			text2.selectAll("tspan").forEach(function(a,b){a.attr({x:20,y:50*b+40})});

			page2.text = s.paper.g(rectBg,text2).attr({fill:"#e50012",transform:"matrix(1,0,0,1,900,480)"});
			setTimeout(function(){
				page2.text.animate({
					transform:"matrix(1,0,0,1,240,480)"
				},1000,mina.backout,function (){
					setTimeout(function(){
		                page2.text.animate({
							transform:"matrix(1,0,0,1,900,480)"
						},600,mina.backin,function (){this.remove()});
						setTimeout(function(){
							page2.year.animate({
								transform:"matrix(1,0,0,1,800,380)"
							},600,mina.backin,function (){this.remove()});
							setTimeout(function(){
								page2.moeny.animate({
									transform:"matrix(0,0,0,0,260,260)",
									opacity:0
								},600,mina.backin,function (){this.remove()});
							},200);
						},200);
					},2e3);
					setTimeout(function(){
						bubbleMain.setArea({
							x1:450,
							x2:550,
							y1:440,
							y2:700
						});
						firstLine.animate({transform:"matrix(1,0,0,1,0,3200)","stroke-dashoffset":0},3000,mina.easeout,function (){
		                	gopage3();
		                });
	                },3e3);
				});
			},200);
	}


	var page3 = {};
	function gopage3(){
		var polygon3 = s.paper.polygon([213.9,126.5,19.4,126.5,1.4,111.8,19.4,16.4,201.9,0,213.9,16.4]).attr("fill","#e73828"),
			rect3 = s.paper.rect(2.1,1.7,194.5,110.1).attr({
				"fill":"#ffffff",
				stroke:"#e50012",
				skrokeWidth:"10"
			}),
			path3 = s.paper.path(data.y1915).attr("fill","#e50012"),
			line1 = s.paper.line(49.5,1.7,49.5,111.8),
			line2 = s.paper.line(95.6,1.7,95.6,111.8),
			line3 = s.paper.line(141.6,1.7,141.6,111.8);
			page3.line = s.paper.g(line1,line2,line3).attr({
				fill:"none",
				stroke:"#e50012",
				"stroke-width": "4px",
				"stroke-miterlimit": 10
			});
			page3.p3y1915 = s.paper.g(polygon3,rect3,path3,page3.line).attr({
				transform:"matrix(1,0,0,1,50,50)",
				opacity: 0
			}).animate({opacity: 1},500,mina.easeout);

		var text3 = s.paper.text(20,46,["亚历山大▪萨米尔森设计了","弧形瓶的原型，造就独特的","传奇线条。"]).attr({
				fill:"#605f5e",
				"font-size": "larger",
				transform:"matrix(1,0,0,1,340,200)"
			});
			text3.selectAll("tspan").forEach(function(a,b){
				var oText = a.attr({x:b%2?-200:200,y:30*b+30,opacity:0});
				setTimeout(function(){
					oText.animate({x: 0,opacity: 1},300,mina.easeout);
				},200*b)
			});

		setTimeout(function(){
			page3.p3y1915.animate({opacity: 0},500,mina.easeout,function(){
				this.remove();
				text3.selectAll("tspan").forEach(function(a,b){
					setTimeout(function(){
						a.animate({x: b%2?-200:200,opacity: 0},300,mina.easeout,function(){this.remove()});
					},200*b);
				});
				setTimeout(function(){
					bubbleMain.clearTimer();
					firstLine.animate({transform:"matrix(1,0,0,1,0,4300)"},3000,mina.easeout,function (){gopage4()});
				},1e3);
			});
		},3e3);

		var page4 = {};
		function gopage4(){
			var rect4 = s.paper.rect(0,0,468,140).attr({"fill":"#e50012"}),
				text4 = s.paper.text(0,0,["阿姆斯特丹奥运会起，可口可乐结缘奥林匹克，","见证一代代运动员的体育传奇。"]).attr({
					fill:"#ffffff",
					"font-size": "21px"
				});
				text4.selectAll("tspan").forEach(function(a,b){
					a.attr({x:20,y:50*b+50});
				});
			page4.rect_text = s.paper.g(rect4,text4).attr({"opacity":1,"transform":"matrix(1,0,0,1,0,630)"});

			var pos = [{cx:130,cy:80},{cx:320,cy:80},{cx:510,cy:80},{cx:225,cy:165},{cx:415,cy:165}],
				circleGroup = s.paper.g().attr({transform:"matrix(1,0,0,1,0,300)"});

				setTimeout(function(){
					for(var i = 0; i<pos.length; i++){
						var oCircle = s.paper.circle(pos[i].cx,pos[i].cy,0).attr({"opacity":0,stroke:"#e50012",fill:"none","stroke-width": "13px"});
						circleGroup.add(oCircle);
						(function (oCircle,i){
							setTimeout(function(){
								oCircle.animate({"opacity":1,r:"85"},800,mina.elastic)
							},100*i);
						})(oCircle,i);
					}
				},300);

			var polygon41 = s.paper.polygon(data.y1928circle).attr("fill","#e50027"),
				path41 = s.paper.path(data.y1928bg).attr("fill","#c6000b"),
				path42 = s.paper.path(data.y1928).attr("fill","#ffffff"),
				polygon42 = s.paper.polygon(data.y1928star0).attr("fill","#c6000b"),
				polygon43 = s.paper.polygon(data.y1928star1).attr("fill","#c6000b");

			page4.mark = s.paper.g(polygon41,path41,path42,polygon42,polygon43).attr({
				transform:"matrix(1,0,0,1,240,-200)"
			});

			setTimeout(function(){
				page4.mark.animate({transform:"matrix(1,0,0,1,240,50)"},600,mina.backout);
			},1300);

			page4.mark.click(function(){
				var This = this;
				Snap.animate(0, 1440, function(deg) {
			        This.attr({
						transform:"t240,50r-"+deg
					})
			    }, 2000);

				circleGroup.selectAll("circle").forEach(function(a,b){
					(function (oCircle,i){
						setTimeout(function(){
							oCircle.animate({"opacity":0,r:"0"},800,mina.backin,function(){this.remove()})
						},100*i);
					})(a,b);
				});
				page4.rect_text.animate({"transform":"matrix(1,0,0,1,-500,630)"},800,mina.backin,function(){this.remove()});
				firstLine.animate({transform:"matrix(1,0,0,1,0,4400)"},800,mina.easeout,function (){
					this.remove();
					setTimeout(function(){
						s.append(bottle);
						bottle.animate({
							"transform" : "matrix(1,0,0,1,0,150)",
							opacity:1,
							"fill-opacity":1
						},1000,mina.backout);
		    			spreadBubble();
					},500);
				});
				

			});
		};

		function spreadBubble(){
			/*
			s.append(bubbleMain.group);
			bubbleMain.setArea({
				x1:0,
				x2:640,
				y1:150,
				y2:980
			}).setMax(100).selfRenewal();
			*/
			var bubbleFountain = new BubbleFountain();

			bubbleFountain.init();
		}

	}
})



/* 泡泡工厂 */
function Bubble(id,max,interval){
	this.group = s.paper.g().attr({id:id});
	this.area = {
		x1:0,
		x2:0,
		y1:0,
		y2:0
	};
	this.interval = interval||100;
	this.max = max||6;
	this.iNow = 0;
	this.timer = null;
}
Bubble.prototype.init = function (areaObj){
	areaObj = areaObj || {
		x1:400,
		x2:500,
		y1:400,
		y2:520
	};
	this.setArea(areaObj);
	this.selfRenewal();
}
Bubble.prototype.addOne = function (){
	var This = this;
	var a,b,c,d,e;
		centerX=Math.floor(Math.random()*(this.area.x2-this.area.x1))+parseInt(this.area.x1);
		centerY=Math.floor(Math.random()*(this.area.y2-this.area.y1))+parseInt(this.area.y1);
		a=Math.floor(30*Math.random())+10;
		b=Math.random()/2+.5;
		c=Math.floor(90*Math.random())+10;
		d=Math.floor(2e3*Math.random())+2e3;
		e=s.paper.circle(centerX,centerY,a);
		this.iNow++;
		e.attr({fill:"#E50012",opacity:0,"fill-opacity":0}).animate({opacity:b,"fill-opacity":b},200,mina.linear,function(){
				e.animate({cy:e.attr("cy")-c},1e3,mina.easeout,function(){
					setTimeout(function(){
						e.animate({opacity:0,"fill-opacity":0},200,mina.linear,function(){
							e.remove();
							This.iNow--;
						})
					},d);
				});
			});
		this.group.add(e);
}
Bubble.prototype.updata = function (){
	if(this.max>this.iNow)this.addOne();
}
Bubble.prototype.selfRenewal = function (){
	var This = this;
	this.clearTimer();
	this.timer = setInterval(function(){
		This.updata();
	},100);
}
Bubble.prototype.clearTimer = function (){
	clearInterval(this.timer);
}
Bubble.prototype.setArea = function (obj){
	this.area = obj;
	return this;
}
Bubble.prototype.setMax = function (num){
	this.max = num;
	return this;
}
/* end 泡泡工厂 */

/* 柱状喷泉式泡泡 */
function BubbleFountain(id,max,interval){
	this.group = s.paper.g().attr({id:id});
	this.interval = interval||30;
	this.max = max||60;
	this.iNow = 0;
	this.timer = null;
	this.baseX=320;
	this.baseY=850;
	this.animateBtn = true;
	this.gravity = 0.18;
}
BubbleFountain.prototype.init = function (){
	this.selfRenewal();
}
BubbleFountain.prototype.addOne = function (){
	var This = this;
	var c,d,e;
		this.centerX=this.baseX + 40*(Math.random()-0.5);
		this.centerY=this.baseY;
		this.speedX= 4*(Math.random()-0.5);
		this.speedY=-13-(4*(Math.random()-0.5));
		this.a=Math.floor(20*Math.random())+10;
		this.b=Math.random()/2+.5; //设置不透明度

		d=Math.floor(2e3*Math.random())+2e3;
		e=s.paper.circle(this.centerX,this.centerY,this.a);
		this.iNow++;
		e.attr({fill:"#E50012",opacity:0,"fill-opacity":0}).animate({opacity:this.b,"fill-opacity":this.b},100,mina.linear);
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
	var opacity = this.b;

	animated();
	function animated(){
		centerX += speedX;
		speedY+=gravity;
		centerY += speedY;
		if(centerY>800&&speedY>0){
			//speedY *= -0.8;  //  反弹效果
		};
		if(speedY>0){
			//opacity-=0.01;  //  下降的泡泡渐渐透明
		}

		e.attr({cy:centerY,cx:centerX,opacity:opacity,"fill-opacity":opacity});

		if((centerX+2*r)<0||(centerX-2*r)>640||((centerY+2*r)>900&&speedY>0||opacity<=0)){
			e.remove();
			This.iNow--;
			return false;
		}
    	requestAnimationFrame(animated);
	}
}
/* 柱状喷泉式泡泡 */


var bubbleLeft=new Bubble("bubbleL");
	bubbleLeft.init({
			x1:155,
			x2:230,
			y1:190,
			y2:370
		});

var bubbleMain=new Bubble("bubbleM");
	bubbleMain.init({
			x1:400,
			x2:500,
			y1:400,
			y2:520
		});
