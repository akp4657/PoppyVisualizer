"use strict";

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

function drawCircles(ctx)
{
    
}