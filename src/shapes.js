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
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,111,111,.34)'; 
    ctx.arc(250,100,radius,0,2*Math.PI, false);
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,111,111,.34)'; 
    ctx.arc(750,100,radius,0,2*Math.PI, false);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
                
}

function drawTriangle(ctx, audio, topSpacing, num)
{ 
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,111,111,.34)';
    ctx.moveTo(500,300-audio[num]/1.5);
    ctx.lineTo(500-audio[num]/1.5,300+(audio[num]/2.5)); 
    ctx.lineTo(500+audio[num]/1.5,300+(audio[num]/2.5));
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

}

function drawCurves(ctx, audio, canvas, num)
{
    ctx.save();
    ctx.lineWidth="3";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(500, 0);
    ctx.quadraticCurveTo(-audio[num], canvas.height/2, canvas.width/2, canvas.height);
    ctx.stroke();
    
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(500, 600);
    ctx.quadraticCurveTo(1000+audio[num], 300, 500, 0);
    ctx.stroke();
    ctx.restore();
    

}

function drawPoppy(ctx)
{
    
}