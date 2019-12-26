var board = new Array();
var score = 0;  //分数
var hasAddscore = new Array();//是否发生碰撞




var json = {}
if(JSON.parse(localStorage.getItem('content'))) {
	json = JSON.parse(localStorage.getItem('content'));
}else {
	json = {
	"grid":{"size":4,
			"cells":[[0,0,0,0],[0,0,0,0],
			 [0,0,0,0],[0,0,0,0]]},
	"score":0,
	"over":false,
	"won":false,
	} 
}
var jsonText = JSON.stringify(json);  //json序列化
// localStorage.setItem('content',jsonText);
//存储localStorage
function setItem(i,j) {
	json.grid.cells[i][j] = board[i][j];
	json.score = score;
	jsonText = JSON.stringify(json);
	localStorage.setItem('content',jsonText);
}
$(document).ready(function(){
	if(localStorage.getItem('content')) {
		init();
		for (var i=0; i<4; i++) {
			for (var j=0; j<4; j++) {
				board[i][j] = JSON.parse(localStorage.getItem('content')).grid.cells[i][j]; //给board赋初始值0
			}
		}
		score = JSON.parse(localStorage.getItem('content')).score;
		updateScore(score);
		updateBoardView();
	}else {
		newgame();
	}
	
});
function newgame() {
	//初始化棋盘格
	init();
	json = {
	"grid":{"size":4,
			"cells":[[0,0,0,0],[0,0,0,0],
			 [0,0,0,0],[0,0,0,0]]},
	"score":0,
	"over":false,
	"won":false,
	} 
	jsonText = JSON.stringify(json);
	localStorage.setItem('content',jsonText);
	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();

	//移动端
	mobile();		
}

//初始化
function init() {
	for (var i=0; i<4; i++) {
		for (var j=0; j<4; j++) {
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top',setPosTop(i,j));
			gridCell.css('left',setPosLeft(i,j));
		}
	}
	//使board变为二维数组，存储数字
	for (var i=0; i<4; i++) {
		board[i] = new Array();
		hasAddscore[i] = new Array();
		for (var j=0; j<4; j++) {
			board[i][j] = 0; //给board赋初始值0
			hasAddscore[i][j] = false;
		}
	}

	//生成存储数字的div,以及数字更改时的变化
	updateBoardView();
	score = 0;
	updateScore(score);
	$('#best').text(localStorage.getItem('bestscore') || 0);
}
function updateBoardView() {
	$(".number-cell").remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $('#number-cell-'+i+'-'+j);
			theNumberCell.css('top',setPosTop(i,j));
			theNumberCell.css('left',setPosLeft(i,j));

			if(board[i][j] == 0) {
				theNumberCell.css({
					'width': 0,
					'height': 0
				});
			}else {
				theNumberCell.css({
					'width': '125px',
					'height': '125px',
					'background-color':setNumberBackgroundColor(board[i][j]),
					'color':setNumberColor(board[i][j])
				});
				theNumberCell.text(board[i][j]);
			}
			hasAddscore[i][j]=false;
		}
	}
}
//生成随机数字
function generateOneNumber() {
	if(nospace(board)){
		return false;
	}
	//随机一个位置
	var randx = Math.floor(Math.random()*4); //x轴
	var randy = Math.floor(Math.random()*4);//y轴

	var times = 0;
	//判断此位置是否可用
	while (times<50) {
		if(board[randx][randy] == 0)
			break;
		randx = Math.floor(Math.random()*4);
		randy = Math.floor(Math.random()*4);
		times++;
	}
	//如果循环50次还没找到，则自己生成
	if(times == 50) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if(board[i][j]==0) {
					randx = i;
					randy = j;
				}
			}
		}
	}
	//随机一个数字
	var randNumber = Math.random()<0.8?2:4;
	//在随机位置显示随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	setItem(randx,randy);
	return true;
}
//键盘事件
$(document).keydown(function(event) {
	switch (event.keyCode) {
		case 37: //left
			if(moveLeft()) {
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 38: //up
			if(moveUp()) {
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 39: //right
			if(moveRight()) {
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 40: //down
			if (moveDown()) {
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		default:
			break;
	}
});

//移动端函数
function mobile() {
	var startX = 0;
	var startY = 0;
	var container = document.getElementById('grid-container');

	//移动端
	container.addEventListener('touchstart',function(ev){
		startX = ev.targetTouches[0].pageX;
		startY = ev.targetTouches[0].pageY;
	},false);
	container.addEventListener('touchend',function(ev){
		var disX = ev.changedTouches[0].pageX - startX; 
		var disY = ev.changedTouches[0].pageY - startY;
		if(Math.abs(disX)>30 || Math.abs(disY)>30) {
			if(Math.abs(disX)>Math.abs(disY)){
			    if(disX>0){
			        if(moveRight()){
			            setTimeout("generateOneNumber()",210);
			            setTimeout("isgameover()",300);
			        }
				}else {
		            if(moveLeft()){
		                setTimeout("generateOneNumber()",210);
		                setTimeout("isgameover()",300);
		            }
				}
		    }else {
		        if(disY>0){
		            if(moveDown()){
		                setTimeout("generateOneNumber()",210);
		                setTimeout("isgameover()",300);
		            }
				}else{
					if(moveUp()){
		                setTimeout("generateOneNumber()",210);
		                setTimeout("isgameover()",300);
		            }
				}
			} 
		} else {
			return false;
		}		
	},false);
}
//判断游戏是否结束
function isgameover() {
	if(nospace(board) && nomove(board)){
		$('.gameover').css('display','block');
		$('#try').click(function(){
			$('.gameover').css('display','none');
		})
	}
}
//左移
function moveLeft(){
	if(!canMoveLeft(board)) {
		return false;
	}
	//moveLeft
	for (var i = 0; i < 4; i++) {
		for (var j=1; j < 4; j++) {
			if(board[i][j] != 0) {
				for(var k=0; k<j;k++) {
					if(board[i][k]==0 && noBlock(i, k, j, board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						setItem(i,j);
						setItem(i,k);
						continue;
					}else if (board[i][k]==board[i][j] && noBlock(i, k, j, board) && !hasAddscore[i][k]){
						//move add
						showMoveAnimation(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						setItem(i,j);
						setItem(i,k);
						//add score
						score += board[i][k];
						updateScore(score);
						bestscore();
						hasAddscore[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	//因为执行速度太快，看不到动画，所以设置定时器，使动画执行完，再更新
	setTimeout("updateBoardView()",200);
	return true;
}
//右移
function moveRight(){
	if(!canMoveRight(board)) {
		return false;
	}
	//moveRight
	for(var i=0; i<4; i++) {
		for(var j=2; j>=0; j--) {
			if(board[i][j]!=0) {
				for(var k=3; k >j; k--) {
					if(board[i][k]==0 && noBlock(i,j,k,board)) {
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						setItem(i,j);
						setItem(i,k);
						continue;
					}else if (board[i][k]==board[i][j] && noBlock(i,j,k,board) && !hasAddscore[i][k]){
						//move add
						showMoveAnimation(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						setItem(i,j);
						setItem(i,k);
						//add score
						score += board[i][k];
						updateScore(score);
						bestscore();
						hasAddscore[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	//因为执行速度太快，看不到动画，所以设置定时器，使动画执行完，再更新
	setTimeout("updateBoardView()",200);
	return true;
}
//上移
function moveUp() {
	if(!canMoveUp(board))
		return false;
	//moveUp
	for(var j=0; j<4; j++){
		for(var i=1; i<4; i++){
			if(board[i][j]!=0){
				for(var k=0; k<i;k++){
					if(board[k][j]==0 && noBlock2(j, k, i, board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						setItem(i,j);
						setItem(k,j);
						continue;
					}else if (board[k][j]==board[i][j] && noBlock2(j, k, i, board) && !hasAddscore[k][j]){
						//move add
						showMoveAnimation(i,j,k,j);
						board[k][j] *=2;
						board[i][j] = 0;
						setItem(i,j);
						setItem(k,j);
						//add score
						score += board[k][j];
						updateScore(score);
						bestscore();
						hasAddscore[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	//因为执行速度太快，看不到动画，所以设置定时器，使动画执行完，再更新
	setTimeout("updateBoardView()",200);
	return true;
}
//下移
function moveDown() {
	if(!canMoveDown(board))
		return false;
	//moveDown
	for(var j=0; j<4; j++){
		for(var i=2; i>=0; i--){
			if(board[i][j]!=0){
				for(var k=3; k>i;k--){
					if(board[k][j]==0 && noBlock2(j, i, k, board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						setItem(k,j);
						setItem(i,j);
						continue;
					}else if (board[k][j]==board[i][j] && noBlock2(j, i, k, board) && !hasAddscore[k][j]) {
						//move add
						showMoveAnimation(i,j,k,j);
						board[k][j] *=2;
						board[i][j] = 0;
						setItem(i,j);
						setItem(k,j);
						//add score
						score += board[k][j];
						updateScore(score);
						bestscore();
						hasAddscore[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	//因为执行速度太快，看不到动画，所以设置定时器，使动画执行完，再更新
	setTimeout("updateBoardView()",200);
	return true;
}
//判断是否可以左移
function canMoveLeft( board) {
	for(var i=0; i<4; i++) {
		for(var j=1; j<4; j++) {
			if (board[i][j] != 0) {
				if(board[i][j-1]==0 || board[i][j-1]==board[i][j])
					return true;
			}
		}
	}
	return false;
}
//判断是否可以右移
function canMoveRight(board) {
	for(var i=0; i<4; i++) {
		for(var j=2; j>=0; j--) {
			if (board[i][j] !=0 ){
				if(board[i][j+1] == 0 || board[i][j+1] == board[i][j])
					return true;
			}
		}
	}
	return false;
}
//判断是否可以上移
function canMoveUp(board) {
	for(var j=0; j<4; j++) {
		for(var i=1; i<4; i++) {
			if (board[i][j] !=0 ){
				if(board[i-1][j] == 0 || board[i-1][j] == board[i][j])
					return true;
			}
		}
	}
	return false;
}
//判断是否可以下移
function canMoveDown(board) {
	for(var j=0; j<4; j++) {
		for(var i=2; i>=0; i--) {
			if (board[i][j] !=0 ){
				if(board[i+1][j] == 0 || board[i+1][j] == board[i][j])
					return true;
			}
		}
	}
	return false;
}
//判断起始位置到移动到的位置之间是否有不为零的块
function noBlock(row, col1, col2, board){
	for(var i=col1+1; i<col2; i++) {
		if(board[row][i] != 0)
			return false;
	}
	return true;
}
function noBlock2(col, row1, row2, board){
	for(var i=row1+1; i<row2; i++) {
		if(board[i][col] != 0)
			return false;
	}
	return true;
}

//设置格子的定位：距离顶部
function setPosTop(i, j) {
	return 15 + i*135;
}
//设置格子的定位：距离左边
function setPosLeft(i, j) {
	return 15 + j*135;
}


//设置number-cell背景颜色
function setNumberBackgroundColor(number) {
	switch(number) {
		case 2:return "#eee4da"; break;
		case 4:return "#eddfc5"; break;
		case 8:return "#f2b179"; break;
		case 16:return "#f59563"; break;
		case 32:return "#f67c5f"; break;
		case 64:return "#f65e3b"; break;
		case 128:return "#edcf72"; break;
		case 256:return "#edcc61"; break;
		case 512:return "#9c0"; break;
		case 1024:return "#33b5e5"; break;
		case 2048:return "#09c"; break;
		case 4096:return "#a6c"; break;
		case 8192:return "#93c"; break;
		default: return;
	}

	// return "black";
}
//设置number-cell文字颜色
function setNumberColor(number) {
	if(number <=4) {
		return "#776e65";
	}
	return "white";
}
//判断board是否有空格
function nospace(board) {
	for (var i=0; i<4; i++) {
		for (var j=0; j<4; j++) {
			if(board[i][j]==0) {
				return false;  //有空格
			}
		}
	}
	return true; //无空格
}
//判断能否移动
function nomove (board) {
	if(canMoveLeft(board) || 
	   canMoveRight(board) ||
	   canMoveUp(board) ||
	   canMoveDown(board)) {
		return false;
	}
	return true;
}
//生成数字动画
function showNumberWithAnimation(i,j,randNumber) {
	var numberCell = $('#number-cell-'+i+'-'+j);

	numberCell.css({
		'background-color':setNumberBackgroundColor(randNumber),
		'color':setNumberColor(randNumber)
	});
	numberCell.text(randNumber);

	numberCell.animate({
		width:"125px",
		height:"125px",
	},50);
}

//移动动画
function showMoveAnimation(fromx, fromy, tox, toy) {
	var numberCell = $('#number-cell-'+fromx+'-'+fromy);
	numberCell.animate({
		top: setPosTop(tox, toy),
		left: setPosLeft(tox,toy)
	},200);
}

//分数
function updateScore(score) {
	$('#score').text(score);
}

//设置bestscore
function bestscore() {
	if( score > localStorage.getItem('bestscore')){
		localStorage.setItem('bestscore',score);
	}
	$('#best').text(localStorage.getItem('bestscore'));
}