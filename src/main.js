    import {drawCircles,drawRectangles,drawTriangle, drawCurves,drawPoppy} from './shapes.js';
    export {init};
    
   var gui = new dat.GUI();
    //const gui = new dat.GUI();		
		// SCRIPT SCOPED VARIABLES
				
		// 1- here we are faking an enumeration - we'll look at another way to do this soon 
		const SOUND_PATH = Object.freeze({
			sound1: "media/Metal.mp3",
			sound2: "media/Concrete.mp3",
			sound3: "media/Hard Feelings.mp3"
		});
		

        const BAR_WIDTH = 2;
        const MAX_BAR_HEIGHT = 100;
        const PADDING = 1;

        const poppyLogo = new Image();
 		poppyLogo.src = "media/poppyLogo.png";

        const queenPicture = new Image();
        queenPicture.src = "media/queen.png";

		// 2 - elements on the page
		let audioElement,canvasElement,logoCanvasElement;
		
		// UI
		let playButton;
		
		// 3 - our canvas drawing context
		let drawCtx, logoCtx, queenCtx;
		
		// 4 - our WebAudio context
		let audioCtx;
		
		// 5 - nodes that are part of our WebAudio audio routing graph
		let sourceNode, analyserNode, gainNode;
		
		// 6 - a typed array to hold the audio frequency data
		const NUM_SAMPLES = 256;
		// create a new array of 8-bit integers (0-255)
		let audioData = new Uint8Array(NUM_SAMPLES/2); 
        
        // Value for circle radius
        let sliderValue =1;

        let alpha = 1;
        

        let freq = false, waveform = false, noise = false, sepia = false, pause = true;
		

        var controls = function(){
            this.circleRadius =1;
            this.pitch=1;
            this.displayWaveform=false;
            this.displayFrequency=false;
            this.displaySepia=false;
            this.displayNoise=false;
            this.song='Hard Feelings';
            
            this.fullScreen = function()
            {
                requestFullscreen(canvasElement);

            }
        }
		
        let cont = new controls();
		// FUNCTIONS
		function init(){
                        console.log("we in init");

			setupWebaudio();
			setupCanvas();
			setupUI();
			
            canvasElement.height = window.innerHeight;
            canvasElement.width = window.innerWidth;
            logoCanvasElement.height = window.innerHeight;
            logoCanvasElement.width = window.innerWidth;
            
			update();
		}

		
		function setupWebaudio(){
			// 1 - The || is because WebAudio has not been standardized across browsers yet
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			audioCtx = new AudioContext();
			
			// 2 - get a reference to the <audio> element on the page
			audioElement = document.querySelector("audio");
			audioElement.src = SOUND_PATH.sound3;
			
			// 3 - create an a source node that points at the <audio> element
			sourceNode = audioCtx.createMediaElementSource(audioElement);
			
			// 4 - create an analyser node
			analyserNode = audioCtx.createAnalyser();
			
			/*
			We will request NUM_SAMPLES number of samples or "bins" spaced equally 
			across the sound spectrum.
			
			If NUM_SAMPLES (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
			the third is 344Hz. Each bin contains a number between 0-255 representing 
			the amplitude of that frequency.
			*/ 
			
			// fft stands for Fast Fourier Transform
			analyserNode.fftSize = NUM_SAMPLES;
			
			// 5 - create a gain (volume) node
			gainNode = audioCtx.createGain();
			gainNode.gain.value = 1;
			
			// 6 - connect the nodes - we now have an audio graph
			sourceNode.connect(analyserNode);
			analyserNode.connect(gainNode);
			gainNode.connect(audioCtx.destination);
		}
		
		function setupCanvas(){
			canvasElement = document.querySelector('#mainCanvas');
			drawCtx = canvasElement.getContext("2d");
            setupLogo();
		} 

        function setupLogo(){
            logoCanvasElement = document.querySelector('#logoCanvas');
            
            logoCtx = logoCanvasElement.getContext("2d");
            //logoCtx.clearRect(0,0,logoCanvasElement.width,logoCanvasElement.height);
           
            poppyLogo.addEventListener('load', e => {
                logoCtx.drawImage(poppyLogo,logoCanvasElement.width/2-132,logoCanvasElement.height/2-125,264,204);
            });
            
            console.log(poppyLogo);
        }

		

                    

        window.onload = function(){
            gui.add(cont,"circleRadius",0.5,3);
            gui.add(cont,"pitch",-3,3);
            gui.add(cont,"displayWaveform");
            gui.add(cont,"displayFrequency");
            gui.add(cont,"displaySepia");
            gui.add(cont,"displayNoise");
            gui.add(cont,"song",['Hard Feelings', 'Concrete', 'Metal']).onChange(changeSong);
            gui.add(cont,"fullScreen");
        }
            
            
            
            
        

        function changeSong(){
            console.log("changed song\n new audio src= media/"+cont.song+".mp3");
            audioElement.src="media/"+cont.song+".mp3";
        }

		function setupUI()
        {
            console.log("in setup UI");
			playButton = document.querySelector("#playButton");
			playButton.onclick = e => {
				console.log(`audioCtx.state = ${audioCtx.state}`);
				
				// check if context is in suspended state (autoplay policy)
				if (audioCtx.state == "suspended") {
					audioCtx.resume();
				}

				if (e.target.dataset.playing == "no") {
                    pause = false;
					audioElement.play();
					e.target.dataset.playing = "yes";
				// if track is playing pause it
				} else if (e.target.dataset.playing == "yes") {
                    pause = true;
					audioElement.pause();
					e.target.dataset.playing = "no";
				}
                
                
	
			};
            
//            document.querySelector('#sepiaCB').checked = sepia;
//                document.querySelector('#noiseCB').checked = noise;
//                document.querySelector('#freqCB').checked = freq;
//                document.querySelector('#waveformCB').checked = waveform;
//                
//                document.querySelector('#sepiaCB').onchange = e => sepia = e.target.checked; document.querySelector('#noiseCB').onchange = e => noise = e.target.checked;
//                document.querySelector('#freqCB').onchange = e => freq = e.target.checked;
//                document.querySelector('#waveformCB').onchange = e => waveform = e.target.checked;
//			
			
			
//			
//			document.querySelector("#songSelect").onchange = e =>{
//				audioElement.src = e.target.value;
//				// pause the current track if it is playing
//				playButton.dispatchEvent(new MouseEvent("click"));
//			};
//            
            // Radius Slider 
//            let radiusSlider = document.querySelector("#radiusSlider");
//            radiusSlider.oninput = e => 
//            {
//                sliderValue = e.target.value;
//                radiusLabel.innerHTML = sliderValue;
//            }
			
    //			//fullscreen button
    //            let fullscreenButton = document.querySelector("#fullscreen");
    //            console.log(fullscreenButton)
    //            fullscreenButton.onclick = e =>
    //            {
    //                canvasElement.webkitRequestFullscreen();
    //            }
    //            
            
			// if track ends
			audioElement.onended =  _ => {
				playButton.dataset.playing = "no";
			};
			
//			document.querySelector("#fsButton").onclick = _ =>{
//				requestFullscreen(canvasElement);
//			};
			
		}
		
		function update() { 
			// this schedules a call to the update() method in 1/60 seconds
			requestAnimationFrame(update);
			
			/*
				Nyquist Theorem
				http://whatis.techtarget.com/definition/Nyquist-Theorem
				The array of data we get back is 1/2 the size of the sample rate 
			*/
			
			// populate the audioData with the frequency data
			// notice these arrays are passed "by reference" 
			analyserNode.getByteFrequencyData(audioData);
		  
			// OR
			//analyserNode.getByteTimeDomainData(audioData); // waveform data
			
            //check song
//            if(audioElement.src!="media/"+cont.song){
//                audioElement.src="media/"+cont.song;
//            }
            
            

            
			// DRAW!
			//drawCtx.clearRect(0,0,800,600);  
			let barWidth = 4;
			let barSpacing = 1;
			let barHeight = 100;
			let topSpacing = 50;
            drawRectangles(drawCtx, canvasElement);
            drawPoppy(drawCtx,queenPicture,pause, canvasElement);
            
            let sum=0;
            
			// loop through the data and draw!
			for(let i=0; i<audioData.length; i++) 
            { 
                // show frequency
                if(freq)
                {
                    //display frequency
                    drawCtx.save();
                    
                    drawCtx.font = "30px Noto Sans JP";
                    sum/=NUM_SAMPLES;
                    drawCtx.fillText(sum+"Hz",50,50);
                    
                    drawCtx.restore();
                }
                
                // show waveform
                if(cont.displayWaveform)
                {
                    //canvas waveform stuff here
                    
                    let percent = audioData[i]/255;
                    percent = percent < 0.02 ? .02 : percent;
                    //drawCtx.translate(BAR_WIDTH, 0);
                    drawCtx.save();
                    drawCtx.fillRect(barWidth*i+i*PADDING,0,BAR_WIDTH,MAX_BAR_HEIGHT*percent);
                    drawCtx.restore();
                    //drawCtx.translate(PADDING,0);
                }
                
                /* Drawing Circles */ 
                let percent = audioData[i] / 255;
                let maxRadius = 200;
                let circleRadius = percent * maxRadius * sliderValue/2;
                drawCtx.globalAlpha = 1;
                
                if(i%3==0)
                {
                    drawCircles(drawCtx, canvasElement, audioData, i);
                }
                
                if(i%4==    0)
                    drawCurves(drawCtx, audioData, canvasElement, i);

                drawTriangle(drawCtx, audioData,canvasElement, i);
                
            
                sum+=audioData[i];
				
			}
            
            manipulatePixels(drawCtx);
            
            
		} 
		
		

		// HELPER FUNCTIONS
		function makeColor(red, green, blue, alpha){
   			var color='rgba('+red+','+green+','+blue+', '+alpha+')';
   			return color;
		}
        
        function manipulatePixels(ctx)
        {
            // 28 - Get all of the rgba pixel data of the canvas by grabbing the ImageData Object
            let imageData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
            
            // 29 = imageData.data is an 8-bit typed array - calues range from 0-255
            // imageData.data contains 4 values per pixel: 4 x canvas.width x canvas.height = 1,024,000 values 
            // Looping through this 60FPS
            let data = imageData.data;
            let length = data.length;
            let width = imageData.width; 
            
            // 30 - Iterate through each pixel
            // We step by 4 so that we can manipulate 1 pixel per iteration. 
            // data[i] is red
            // data[i+1] is blue
            // data[i+2] is green 
            // data[i+3] is alpha
            
            let i; // i outside of loop is optimization 
            for(i=0; i<length; i+=4)
            {
                
                
                // 33 - Noise 
                if(cont.displayNoise && Math.random() < .10)
                {
                    data[i] = data[i+1] = data[i+2] = 128; // gray noise 
                    //data[i] = data[i+1] = data[i+2] = 255; // white noise 
                    //data[i] = data[i+1] = data[i+2] = 0; // black noise 
                    data[i+3] = 255; // alpha
                }
                
                // 34 - Sepia 
                if(cont.displaySepia)
                {
                    //let red = data[i], green = data[i+1], blue = data[i+2];
                    let outRed, outGreen, outBlue;
                    
                    outRed = ((data[i] * .393) + (data[i+1] * .769) + (data[i+2] * .189));
                    outGreen = ((data[i] * .349) + (data[i+1] * .686) + (data[i+2] * .168));
                    outBlue = ((data[i] * .272) + (data[i+1] * .534) + (data[i+2] * .131));
                    
                    data[i] = outRed < 255 ? outRed : 255;
                    data[i+1] = outGreen < 255 ? outGreen : 255;
                    data[i+2] = outBlue < 255 ? outBlue : 255;
                    
                }
            }
            
            // 32 - Put the modified data back on the canvas 
            ctx.putImageData(imageData, 0, 0);
        }
		
		function requestFullscreen(element) {
			if (element.requestFullscreen) {
			  element.requestFullscreen();
			} else if (element.mozRequestFullscreen) {
			  element.mozRequestFullscreen();
			} else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
			  element.mozRequestFullScreen();
			} else if (element.webkitRequestFullscreen) {
			  element.webkitRequestFullscreen();
			}
			// .. and do nothing if the method is not supported
		};
        