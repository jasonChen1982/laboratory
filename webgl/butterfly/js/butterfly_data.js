   // ctx.strokeStyle = 'rgba(255,255,255,.02)';
    // ctx.fillStyle = 'hsl(265,66%,9%)';

	// var points = [
	// 	{
	// 		x: -1,
	// 		y: -1,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -8,
	// 		y: -31,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -146,
	// 		y: -135,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -150,
	// 		y: -122,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -198,
	// 		y: -52,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -173,
	// 		y: 58,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -329,
	// 		y: -126,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -1,
	// 		y: 0,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -131,
	// 		y: 53,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -89,
	// 		y: 122,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -23,
	// 		y: 135,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -58,
	// 		y: 58,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -63,
	// 		y: 87,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -74,
	// 		y: 86,
	// 		z: 0
	// 	},
	// 	{
	// 		x: -70,
	// 		y: 96,
	// 		z: 0
	// 	}
	// ];
	// var pointsR = [
	// 	{
	// 		x: 1,
	// 		y: -1,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 8,
	// 		y: -31,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 146,
	// 		y: -135,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 150,
	// 		y: -122,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 198,
	// 		y: -52,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 173,
	// 		y: 58,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 329,
	// 		y: -126,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 1,
	// 		y: 0,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 131,
	// 		y: 53,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 89,
	// 		y: 122,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 23,
	// 		y: 135,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 58,
	// 		y: 58,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 63,
	// 		y: 87,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 74,
	// 		y: 86,
	// 		z: 0
	// 	},
	// 	{
	// 		x: 70,
	// 		y: 96,
	// 		z: 0
	// 	}
	// ];
	// var index = [[0,1,5],[1,2,3],[1,3,4],[1,4,5],[2,6,3],[3,6,4],[4,6,5]  ,[7,8,9],[7,9,10],[7,8,11],[12,13,14]];
	// var color = ['#30201d','#3b2d28','#fb913c','#423c32','#3b2d28','#e46e39','#3b2d28'   ,'#ee8548','#ca6532','#efba6b','#232626'];



 //    ctx.translate(W/2,H/2);
	// for(var i=0;i<index.length;i++){
	// 	var pp = index[i];
	// 	ctx.fillStyle = color[i];
	// 	ctx.beginPath();
	// 	for(var j=0;j<pp.length;j++){
	//         if(j==0){
	//             ctx.moveTo(points[pp[j]].x,points[pp[j]].y);//,1,1
	//         }else{
	//             ctx.lineTo(points[pp[j]].x,points[pp[j]].y);//,1,1
	//         }
	//     }
	//     ctx.fill();
	// }
	// for(var i=0;i<index.length;i++){
	// 	var pp = index[i];
	// 	ctx.fillStyle = color[i];
	// 	ctx.beginPath();
	// 	for(var j=0;j<pp.length;j++){
	//         if(j==0){
	//             ctx.moveTo(pointsR[pp[j]].x,pointsR[pp[j]].y);//,1,1
	//         }else{
	//             ctx.lineTo(pointsR[pp[j]].x,pointsR[pp[j]].y);//,1,1
	//         }
	//     }
	//     ctx.fill();
	// }




	var xu = [
		{
			x: -4,
			y: -65,
			z: 0
		},
		{
			x: -8,
			y: -61,
			z: 0
		},
		{
			x: -87,
			y: -150,
			z: 0
		},
		{
			x: 4,
			y: -65,
			z: 0
		},
		{
			x: 8,
			y: -61,
			z: 0
		},
		{
			x: 87,
			y: -150,
			z: 0
		}
	]
	var indexxu = [[0,1,2],[3,4,5]];
	var colorxu = ['#070401','#070401'];

	for(var i=0;i<indexxu.length;i++){
		var pp = indexxu[i];
		ctx.fillStyle = colorxu[i];
		ctx.beginPath();
		for(var j=0;j<pp.length;j++){
	        if(j==0){
	            ctx.moveTo(xu[pp[j]].x,xu[pp[j]].y);//,1,1
	        }else{
	            ctx.lineTo(xu[pp[j]].x,xu[pp[j]].y);//,1,1
	        }
	    }
	    ctx.fill();
	}





	var body = [
		{
			x: 0,
			y: -67,
			z: 0
		},
		{
			x: -16,
			y: -56,
			z: 0
		},
		{
			x: -10,
			y: -49,
			z: 0
		},
		{
			x: 16,
			y: -56,
			z: 0
		},
		{
			x: 10,
			y: -49,
			z: 0
		},
		{
			x: -15,
			y: -43,
			z: 0
		},
		{
			x: -8,
			y: 25,
			z: 0
		},
		{
			x: 0,
			y: 25,
			z: 0
		},
		{
			x: 0,
			y: 25,
			z: 0
		},
		{
			x: 8,
			y: 25,
			z: 0
		},
		{
			x: 15,
			y: -43,
			z: 0
		},
		{
			x: -18,
			y: 148,
			z: 0
		},
		{
			x: 24,
			y: 148,
			z: 0
		},
		{
			x: 0,
			y: 170,
			z: 0
		}
	]
	var indexBody = [[0,1,2],[0,3,4],   [0,5,6,7],[0,8,9,10],  [6,11,9],[9,11,12],[11,13,12]];
	var colorBody = ['#62564d','#62564d',  '#3b2d28','#23120c',   '#fccc67','#e6a15b','#3b2d28'];

	for(var i=0;i<indexBody.length;i++){
		var pp = indexBody[i];
		ctx.fillStyle = colorBody[i];
		ctx.beginPath();
		for(var j=0;j<pp.length;j++){
	        if(j==0){
	            ctx.moveTo(body[pp[j]].x,body[pp[j]].y);//,1,1
	        }else{
	            ctx.lineTo(body[pp[j]].x,body[pp[j]].y);//,1,1
	        }
	    }
	    ctx.fill();
	}