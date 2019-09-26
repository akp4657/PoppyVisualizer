"use strict";

// Background circles
function drawRectangles(ctx, canvas)
{
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,canvas.width/2,canvas.height);
    ctx.restore();
    
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(canvas.width/2,0,canvas.width/2,canvas.height);
    ctx.restore();
}

function drawCircles(ctx, canvas, audio, num)
{
    // Get the wave bin (audiodata i )
    // Have the radius bounce off a percentage of that 
    // Make the circle solid 
    var grad = ctx.createRadialGradient((canvas.width*(2/5)),(canvas.height*(2/7)),audio[10]/12, (canvas.width*(2/5)),(canvas.height*(2/7)),audio[14]/2);
    //var grad = ctx.createRadialGradient()
    grad.addColorStop(0,'red');
    grad.addColorStop(1,'orange');
//    var grad1 = ctx.createRadialGradient(canvas.width*(3/5)),(canvas.height*(2/7)),audio[10]/12, (canvas.width*(3/5)),(canvas.height*(2/7)),audio[14]/2);
//    grad1.addColorStop(0,'red');
//    grad1.addColorStop(1,'orange');
    
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = grad; 
    ctx.arc((canvas.width*(2/5)),(canvas.height*(2/7)),audio[14]/2.5,0,2*Math.PI, false);
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.fillStyle = grad; 
    ctx.arc((canvas.width*(3/5)),(canvas.height*(2/7)),audio[14]/2,0,2*Math.PI, false);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
                
}

function drawTriangle(ctx, audio, canvas, num)
{ 
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,111,111,.34)';
    ctx.moveTo(canvas.width/2,canvas.height/2-audio[num]/1.5);
    ctx.lineTo(canvas.width/2-audio[num]/1.5,canvas.height/2+(audio[num]/2.5)); 
    ctx.lineTo(canvas.width/2+audio[num]/1.5,canvas.height/2+(audio[num]/2.5));
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
    ctx.moveTo(canvas.width/2, 0);
    ctx.quadraticCurveTo(-audio[num]*2, canvas.height/2, canvas.width/2, canvas.height);
    ctx.stroke();
    
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height);
    ctx.quadraticCurveTo((canvas.width/(17/18))+(audio[num]*2), canvas.height/2, canvas.width/2, 0);
    ctx.stroke();
    ctx.restore();
    

}

function drawPoppy(ctx)
{
    
}