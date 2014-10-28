var TETRIS_ROWS=20;
var TETRIS_COLS=14;
var CELL_SIZE=24;
var tetrisCanvas;
var ctx;
var NO_BLOCK=0;
var tetrisStatus=[];
var currentFall;
var curSpeed=1;
var curScore=0;
var curTimer;
var maxScore=0;
var isPlaying=true;

//打开页面时创建canvas
window.onload=function(){
	createCanvas(TETRIS_ROWS,TETRIS_COLS,CELL_SIZE,CELL_SIZE);
	
	initBlock();
	curTimer=setInterval("moveDown();",500/curSpeed);
	maxScore=localStorage.getItem("maxScore");
	maxScore=maxScore==undefined?0:maxScore;
	document.getElementById("curMaxScore").innerHTML=maxScore;
}

//canvas布局游戏界面
var createCanvas=function(rows,cols,cellWidth,cellHeight){
	tetrisCanvas=document.getElementById("canvas");
	tetrisCanvas.width=cols*cellWidth;
	tetrisCanvas.height=rows*cellHeight;
	ctx=tetrisCanvas.getContext('2d');
	ctx.beginPath();
	for(var i=1;i<rows;i++){
		ctx.moveTo(0,i*cellHeight);
		ctx.lineTo(cellWidth*cols,i*cellHeight);
	}
	for(var i=1;i<cols;i++){
		ctx.moveTo(i*cellWidth,0);
		ctx.lineTo(i*cellWidth,cellHeight*rows);
	}
	ctx.closePath();
	ctx.strokeStyle="#D1EEEE";
	ctx.lineWidth=2;
	ctx.stroke();
}

//初始化游戏状态,定义每个方格为空
for(var i=0;i<TETRIS_ROWS;i++){
	tetrisStatus[i]=[];
	for(var j=0;j<TETRIS_COLS;j++){
		tetrisStatus[i][j]=NO_BLOCK;
	}
}
//画出方块
var drawBlock=function(){
	for(var i=0;i<TETRIS_ROWS;i++){		
		for(var j=0;j<TETRIS_COLS;j++){
			if(tetrisStatus[i][j]!=NO_BLOCK){
				ctx.fillStyle=colors[tetrisStatus[i][j]];
				ctx.fillRect(j*CELL_SIZE+1,i*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
			}
			else{
				ctx.fillStyle='white';
				ctx.fillRect(j*CELL_SIZE+1,i*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
			}
		}
	}
}

//随机正在掉落的方块
var initBlock=function(){
	var rand=Math.floor(Math.random()*block.length);
	currentFall=[
		{x:block[rand][0].x,y:block[rand][0].y,color:block[rand][0].color},
		{x:block[rand][1].x,y:block[rand][1].y,color:block[rand][1].color},
		{x:block[rand][2].x,y:block[rand][2].y,color:block[rand][2].color},
		{x:block[rand][3].x,y:block[rand][3].y,color:block[rand][3].color}
	];
}


//定义颜色
var colors=["#fff","#FF00FF","#FE720E","#FF5C01","#CCA053","81D8D0","#9BAB99","#A76C44"];
//不同的方块组合
var block=[
	//Z
	[
		{x:TETRIS_COLS/2-1,y:0,color:1},
		{x:TETRIS_COLS/2,y:0,color:1},
		{x:TETRIS_COLS/2,y:1,color:1},
		{x:TETRIS_COLS/2+1,y:1,color:1}
	],
	//反Z
	[
		{x:TETRIS_COLS/2+1,y:0,color:2},
		{x:TETRIS_COLS/2,y:0,color:2},
		{x:TETRIS_COLS/2,y:1,color:2},
		{x:TETRIS_COLS/2-1,y:1,color:2}
	],
	//田
	[
		{x:TETRIS_COLS/2-1,y:0,color:3},
		{x:TETRIS_COLS/2,y:0,color:3},
		{x:TETRIS_COLS/2,y:1,color:3},
		{x:TETRIS_COLS/2-1,y:1,color:3}
	],
	//凸
	[
		{x:TETRIS_COLS/2,y:0,color:4},
		{x:TETRIS_COLS/2,y:1,color:4},
		{x:TETRIS_COLS/2-1,y:1,color:4},
		{x:TETRIS_COLS/2+1,y:1,color:4}
	],
	//一
	[
		{x:TETRIS_COLS/2-2,y:0,color:5},
		{x:TETRIS_COLS/2-1,y:0,color:5},
		{x:TETRIS_COLS/2,y:0,color:5},
		{x:TETRIS_COLS/2+1,y:0,color:5}
	],
	//L
	[
		{x:TETRIS_COLS/2,y:0,color:6},
		{x:TETRIS_COLS/2,y:1,color:6},
		{x:TETRIS_COLS/2,y:2,color:6},
		{x:TETRIS_COLS/2+1,y:2,color:6}
	],
	//J
	[
		{x:TETRIS_COLS/2,y:0,color:7},
		{x:TETRIS_COLS/2,y:1,color:7},
		{x:TETRIS_COLS/2,y:2,color:7},
		{x:TETRIS_COLS/2-1,y:2,color:7}
	],
];

//消除满行
var lineFull=function(){
	for(var i=0;i<TETRIS_ROWS;i++){
		//判断当前行是否满了
		var flag=true;
		for(var j=0;j<TETRIS_COLS;j++){
			if(tetrisStatus[i][j]==NO_BLOCK){
				flag=false;
				break;
			}
		}
		//如果满了
		if(flag){
			curScore=curScore+100;
			document.getElementById("curScore").innerHTML=curScore;
			if(curScore>=curSpeed*500){
				curSpeed++;
				document.getElementById("curSpeed").innerHTML=curSpeed;
				clearInterval(curTimer);
				curTimer=setInterval("moveDown()",500/curSpeed);
			}
			if(curScore==1000){
				var img=document.getElementById("surprise");
				document.getElementById("container").style.display="none";
				img.height=screen.height;
				img.width=screen.width;
				img.style.display="block";		
			}
			for(var k=i;k>0;k--){
				for(var l=0;l<TETRIS_COLS;l++){
					tetrisStatus[k][l]=tetrisStatus[k-1][l];
				}	
			}
			drawBlock();
		}
	}	
};

//方块的下落
var moveDown=function(){
	var canDown=true;
	//判断是否可下落
	for(var i=0;i<currentFall.length;i++){
		if(currentFall[i].y>=TETRIS_ROWS-1){
			canDown=false;
			break;
		}	
		if(tetrisStatus[currentFall[i].y+1][currentFall[i].x]!=NO_BLOCK){
			canDown=false;
			break;
		}
	}
	//如果能下落
	if(canDown){
		//原位置涂白,下移一格
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			ctx.fillStyle="white";
			ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
			cur.y++;
		}
		//降下落后的方块涂成应有的颜色
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			ctx.fillStyle=colors[cur.color];
			ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
	}	
	//如果不能下落
	else{
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			if(cur.y<=1){
				if(curScore>maxScore){	
					localStorage.setItem("maxScore",curScore);
				}
				alert("走远了再见");
				isPlaying=false;
				clearInterval(curTimer);
				return;
			}
			else{
				tetrisStatus[cur.y][cur.x]=cur.color;
			}
		}
		lineFull();
		initBlock();
	}
};

//左移
var moveLeft=function(){
	var canLeft=true;
	//判断左边是不是墙或左边有方块
	for(var i=0;i<currentFall.length;i++){
		if(currentFall[i].x<=0){
			canLeft=false;
			break;	
		}
		if(tetrisStatus[currentFall[i].y][currentFall[i].x-1]!=NO_BLOCK){
			canLeft=false;
			break;	
		}
	}
	//如果可以左移
	if(canLeft){
		//将原有的方块涂白,左移一格
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			ctx.fillStyle="white";
			ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);	
			cur.x--;
		}
		//涂成应有颜色
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			ctx.fillStyle=colors[cur.color];
			ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);	
		}
	}
};

var moveRight=function(){
	var canRight=true;
	for(var i=0;i<currentFall.length;i++){
		if(currentFall[i].x>TETRIS_COLS-1){
			canRight=false;
			break;	
		}
		if(tetrisStatus[currentFall[i].y][currentFall[i].x+1]!=NO_BLOCK){
			canRight=false;
			break;	
		}
	}
	if(canRight){
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			ctx.fillStyle="white";
			ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);	
			cur.x++;
		}
		//涂成应有颜色
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			ctx.fillStyle=colors[cur.color];
			ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);	
		}
	}
};

//变形
var rotate=function(){
	var canRotate=true;
	for(var i=0;i<currentFall.length;i++){
		var preX=currentFall[i].x;
		var preY=currentFall[i].y;
		 //中心点为第三块
		if(i!=2){
			//旋转后的方块的坐标
			var afterX=currentFall[2].x+preY-currentFall[2].y;
			var afterY=currentFall[2].y+currentFall[2].x-preX;
			//如果旋转后的地方已经有方块了
			if(tetrisStatus[afterY][afterX]!=NO_BLOCK){
				canRotate=false;
				break;
			}
			//如果已经在最左边了
			if(preX<=0){
				moveRight();
				afterX=currentFall[2].x+preY-currentFall[2].y;
				afterY=currentFall[2].y+currentFall[2].x-preX;
				break;			
			}
			if(preX>=TETRIS_COLS-1){
				moveLeft();
				afterX=currentFall[2].x+preY-currentFall[2].y;
				afterY=currentFall[2].y+currentFall[2].x-preX;
				break;
			}
		}	
	}
	if(canRotate){
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			ctx.fillStyle='white';
			ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
		for(var i=0;i<currentFall.length;i++){
			var preX=currentFall[i].x;
			var preY=currentFall[i].y;
			if(i!=2){
				currentFall[i].x=currentFall[2].x+preY-currentFall[2].y;
				currentFall[i].y=currentFall[2].y+currentFall[2].x-preX;
			}
		}
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			ctx.fillStyle=colors[cur.color];
			ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
	}
};
//监听按键控制上下左右
window.onkeydown=function(evt){
	switch(evt.keyCode){
		case 37:
			if(!isPlaying)
				return;
			moveLeft();
			break;
		case 38:
			if(!isPlaying)
				return;
			rotate();
			break;
		case 39:
			if(!isPlaying)
				return;
			moveRight();
			break;	
		case 40:
			if(!isPlaying)
				return;
			moveDown();
			break;
	}	
}
