export {drawRectangles,drawCircles,drawTriangle,drawCurves,drawPoppy};
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

function drawCircles(ctx, canvas, audio, num, slider)
{
    // Get the wave bin (audiodata i )
    // Have the radius bounce off a percentage of that 
    // Make the circle solid 
    /****The gradient colors are temporary****/
    var grad = ctx.createRadialGradient((canvas.width*(2/5)),(canvas.height*(2/7)),audio[10]/12, (canvas.width*(2/5)),(canvas.height*(2/7)),(audio[14]/2)+slider);
    grad.addColorStop(0,'rgb(190,0,0)');
    grad.addColorStop(1/4,'rgb(178,34,34)');
    grad.addColorStop(2/4,'rgb(139,0,0)');
    grad.addColorStop(3/4,'rgb(128,0,0)');
    grad.addColorStop(1,'rgb(0,0,0)');

    
    var grad2 = ctx.createRadialGradient((canvas.width*(3/5)),(canvas.height*(2/7)),audio[10]/12, (canvas.width*(3/5)),(canvas.height*(2/7)),(audio[14]/2)+slider);
    grad2.addColorStop(0,'rgb(190,0,0)');
    grad2.addColorStop(1/4,'rgb(178,34,34)');
    grad2.addColorStop(2/4,'rgb(139,0,0)');
    grad2.addColorStop(3/4,'rgb(128,0,0)');
    grad2.addColorStop(1,'rgb(0,0,0)');

    ctx.beginPath();
    ctx.fillStyle = grad; 
    ctx.arc((canvas.width*(2/5)),(canvas.height*(2/7)),(audio[14]/2.5)+slider,0,2*Math.PI, false);
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.fillStyle = grad2; 
    ctx.arc((canvas.width*(3/5)),(canvas.height*(2/7)),(audio[14]/2.5)+slider,0,2*Math.PI, false);
    ctx.fill();
    ctx.closePath();
                
}

function drawTriangle(ctx, audio, canvas, num, slider)
{ 
    ctx.beginPath();
    ctx.fillStyle = 'rgba(190,0,0,.34)';
    ctx.moveTo(canvas.width/2,(canvas.height/2-audio[num]/1.5)-slider);
    ctx.lineTo((canvas.width/2-audio[num]/1.5)-slider,(canvas.height/2+(audio[num]/2.5))+(slider/2)); 
    ctx.lineTo((canvas.width/2+audio[num]/1.5)+slider,(canvas.height/2+(audio[num]/2.5))+(slider/2));
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

function drawCurves(ctx, audio, canvas, num, slider)
{
    ctx.save();
    ctx.lineWidth="3";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.quadraticCurveTo((-audio[num]*2)-slider, canvas.height/2, canvas.width/2, canvas.height);
    ctx.stroke();
    
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height);
    ctx.quadraticCurveTo(((canvas.width/(17/18))+(audio[num]*2)+slider), canvas.height/2, canvas.width/2, 0);
    ctx.stroke();
    ctx.restore();
    

}

let alpha = 1;
function drawPoppy(ctx, picture, pause, canvas)
{
    //ctx.clearRect(0,0,picture.width,picture.height);
    //requestAnimationFrame(drawPoppy);

    ctx.save();
    ctx.globalAlpha = alpha;
    picture.width/5;
    picture.height/5;
    ctx.drawImage(picture,canvas.width/2-picture.width/2, canvas.height/2-picture.height/2);
    if(!pause){
        
        alpha += -.01;
        if(alpha <=0 ) {alpha = 0; return;}

    }
    if(pause){
        
        alpha += .01;
        if(alpha >=1 ) {alpha = 1; return;}

    }
    ctx.restore();
}