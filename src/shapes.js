"use strict";

// Background circles
function drawRectangles(ctx)
{
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,500,600);
    ctx.restore();
    
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(500,0,500,600);
    ctx.restore();
}

function drawCircles(ctx, radius)
{
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,111,111,.34)'; 
    ctx.arc(250,100,radius,0,2*Math.PI, false);
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.fillStyle = 'red'; 
    ctx.arc(750,100,radius,0,2*Math.PI, false);
    ctx.fill();
    ctx.closePath();
                
}

function drawTriangle(ctx, audio, topSpacing, num)
{
    ctx.beginPath();
    //ctx.moveTo(500, topSpacing +256-audio[num]);
    ctx.fillStyle = 'green';
    ctx.arc(500,300-audio[num]/2,3,0,2*Math.PI, false);
    //ctx.lineTo(460, 256 - audio[num]+100);
    //ctx.lineTo(460, 256 - audio[num]+100);
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = 'green';
    ctx.lineWidth = '1';
    ctx.stroke();
    //ctx.clearRect(0,0,1000,600);

}

function drawPoppy(ctx)
{
    
}