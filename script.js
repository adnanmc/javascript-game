var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
var computerPaddleHeight = 100;

function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollLeft;
    
    return {
        x:mouseX,
        y:mouseY
    };
    
}

//reseting player scores and restarting game after someone wins
function handleMouseClick(){
    if(showingWinScreen = true){
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}



//make the game easy
$("#btnEasy").click(function(){
    computerPaddleHeight = 100;
});

//make the game hard
$("#btnHard").click(function(){
    computerPaddleHeight = 200;
});


window.onload = function(){
    
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    
    var framesPerSecond = 30;
    
    setInterval(callBoth, 1000/framesPerSecond);
    
    //handle click to continue action
    canvas.addEventListener("mousedown", handleMouseClick);
    

    
    canvas.addEventListener('mousemove', function(evt){
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
    });
    
    
    function ballReset(){
        
        if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
//            player1Score = 0;
//            player2Score = 0;
            showingWinScreen = true;
        }
        
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width/2;
        ballY = canvas.height/2;
    }
    
    
    function callBoth (){
        
        moveEverything();
        drawEverything();
    }
    
    function computerMovement(){
        
        var paddle2YCenter = paddle2Y + (computerPaddleHeight/2);
        
        //move paddle based on ball location
        if(paddle2YCenter < ballY-35){
            paddle2Y += 6;
        }else if(paddle2YCenter > ballY+35){
            paddle2Y -= 6;
        }
    }
    
    function moveEverything(){
        
        //if anyone wins pause th game
        if(showingWinScreen == true){
            return;
        }
        
        computerMovement();
        
        ballX = ballX + ballSpeedX;
        ballY = ballY + ballSpeedY;
        
        //sudden speed boost
        //ballSpeedX = ballSpeedX + 1;
        
        //make the ball bounce back fron left/right
//        if(ballX > canvas.width){
//            ballSpeedX = -ballSpeedX;
//        } else if(ballX < 0){
//            //ballSpeedX = -ballSpeedX;
//            
//            if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT){
//                ballSpeedX = -ballSpeedX;
//            }
//            
//            ballReset();
//        }
//        
//        
//        //make the ball bounce back virtically
//         if(ballY > canvas.height){
//            ballSpeedY = -ballSpeedY;
//        } else if(ballY < 0){
//            ballSpeedY = -ballSpeedY;
//        }
        
        
        if(ballX < 0) {
            if(ballY > paddle1Y &&
                ballY < paddle1Y+PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
                
                
                //controlling the angle of the ball when it hits paddle
                
                var deltaY = ballY - (paddle1Y+(PADDLE_HEIGHT/2));
                ballSpeedY = deltaY * 0.35;
                
            } else {
                
                player2Score += 1;// must be before ball reset
                ballReset();
            }
        }
        if(ballX > canvas.width) {
            if(ballY > paddle2Y &&
                ballY < paddle2Y+computerPaddleHeight) {
                ballSpeedX = -ballSpeedX;
                
                var deltaY = ballY - (paddle2Y+(computerPaddleHeight/2));
                ballSpeedY = deltaY * 0.35;
            } else {
                player1Score += 1; //must be before ball reset
                ballReset();
            }
        }
        if(ballY < 0) {
            ballSpeedY = -ballSpeedY;
        }
        if(ballY > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }
        
    }
    
    
//    function drawNet(){
//        for(var i=0; i<canvas.height; i+=40){
//            
//            colorRect(canvas.width/2 -1, i, 2, 20, "white");
//        }
//    }
    
    
    function drawEverything(){
        
        //if anyone wins pause the game
        if(showingWinScreen == true){
            canvasContext.fillStyle = "white";
            canvasContext.font = "20px Arial";
            
            if(player1Score >= WINNING_SCORE){
                 $("#win").text("Player Wins!");
                
            }else if(player2Score >= WINNING_SCORE){
                $("#win").text("Computer Wins!");
            }
            
            canvasContext.fillText("Click to Continue!", 100, 300);
            
            return;
        }
        
        
        //fill the canvas with background
        colorRect(0,0,canvas.width,canvas.height,"lightblue");
        
        //draw net
        //drawNet();
        
        
        //left stick paddle for player
        colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'red');
        
        
        // this is right computer paddle
	   colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,computerPaddleHeight,'orange');
        
        
        //round ball
        
        colorCircle(ballX, ballY, 10, "blue");
        
        
        //player score
        
        $("#player").text("Player Score: " + player1Score);
        
        //computer score
         $("#computer").text("Computer Score: " + player2Score);
    }
    
    
    //draw the ball
    function colorCircle(centerX, centerY, radius, drawColor){
        
        canvasContext.fillStyle = drawColor;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY , radius, 0, Math.PI*2);
        canvasContext.fill();
    }
    
    //draw rectangle
    function colorRect(leftX,topY,width,height,drawColor){
        canvasContext.fillStyle = drawColor;
        canvasContext.fillRect(leftX,topY,width,height);
    }
    
}