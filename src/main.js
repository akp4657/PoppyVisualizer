    import {drawCircles,drawRectangles,drawTriangle, drawCurves,drawPoppy} from './shapes.js';
    export {init};
    
    var gui = new dat.GUI();

    //Setting up our folder heirarchy
    var folder1 = gui.addFolder('Visuals');
    var folder3 = gui.addFolder('Audio Effects')
    var folder2 = gui.addFolder('Song Choice');
    var folder4 = folder2.addFolder('Singles');
    var folder5 = folder2.addFolder('Choke');
    var folder6 = folder2.addFolder('Poppy.Computer');
    var folder7 = folder2.addFolder('Am I a Girl?');

    //const gui = new dat.GUI();		
		// SCRIPT SCOPED VARIABLES
				
		
		

        const BAR_WIDTH = 1;
        const MAX_BAR_HEIGHT = 100;
        const PADDING = 1;

        const poppyLogo = new Image();
 		poppyLogo.src = "media/poppyLogo.png";

        const queenPicture = new Image();
        queenPicture.src = "media/queen.png";

		// 2 - elements on the page
		let audioElement,canvasElement,logoCanvasElement,audioControlsElement;
		
		// UI
		let playButton;
		
		// 3 - our canvas drawing context
		let drawCtx, logoCtx, queenCtx;
		
		// 4 - our WebAudio context
		let audioCtx;
        let biquadFilter
		
		// 5 - nodes that are part of our WebAudio audio routing graph
		let sourceNode, analyserNode, gainNode;
		
		// 6 - a typed array to hold the audio frequency data
		const NUM_SAMPLES = 256;
		// create a new array of 8-bit integers (0-255)
		let audioData = new Uint8Array(NUM_SAMPLES/2); 
        
        // Values for sliders and the alpha value
        let circleSlider =0;
        let triSlider = 1;
        let ctrlSlider = 0;
        let volumeSlider = .5;
        let alpha = 1;

        // Progress bar values
        var progressBar = document.querySelector("#progressBar");
        var progress = document.querySelector("#progress");
        var value = 0;
        

        let freq = false, waveform = false, noise = false, sepia = false, pause = true;
		

        let songs = {
            Metal:true,
            Choke:false,
            Concrete:false,
            HardFeelings:false,
            InAMinute:false,
            Interweb:false,
            MyMicrophone:false,
            MyStyle:false,
            PlayDestroy:false,
            ScaryMask:false,
            Voicemail:false,
        }

        var controls = function(){
            this.circleRadius =0;
//            this.frequency=350;
            this.triSize = 1;
            this.detune=0;
            this.ctrlSlider = 0;
            this.volumeSlider = .5;
            this.displayProgress = false;
            this.displayWaveform=true;
            this.displayFrequency=false;
            this.displaySepia=false;
            this.displayNoise=false;
            this.invertColors=false;
            this.Metal=true;
            this.Choke=false;
            this.Concrete=false;
            this.HardFeelings=false;
            this.InAMinute=false;
            this.Interweb=false;
            this.MyMicrophone=false;
            this.MyStyle=false;
            this.PlayDestroy=false;
            this.ScaryMask=false;
            this.Voicemail=false;
            this.song='Hard Feelings';
            
            this.fullScreen = function()
            {
                // For some reason, only if the audioElement is full screen, the entire thing goes with it
                requestFullscreen(audioElement);
            }
            
            // Logic for drawing the logo and pausing with datGui
            // Very similar to the HW code, but is refactored for the library
            this.play = function(){
                console.log(`audioCtx.state = ${audioCtx.state}`);
				
				// check if context is in suspended state (autoplay policy)
				if (pause && audioCtx.state == "suspended") {
					audioCtx.resume();
                    drawLogo();
				}

				if (pause) {
                    drawLogo();
                    pause = false;
					audioElement.play();
				// if track is playing pause it
				} 
                else if (!pause) {
                    pause = true;
					audioElement.pause();
                    clearLogo();
				}
                
                audioElement.onended =  _ => {
				pause = true;
                }
            }
        }
		
        // Controls for the gui, this allows us to add things to it
        let cont = new controls();
		// FUNCTIONS
		function init(){
                        console.log("we in init");

			setupWebaudio();
			setupCanvas();
			//setupUI();
            
            
            
            
			update();
		}

		
		function setupWebaudio(){
			// 1 - The || is because WebAudio has not been standardized across browsers yet
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			audioCtx = new AudioContext();
  
			// 2 - get a reference to the <audio> element on the page
			audioElement = document.querySelector("audio");
			audioElement.src = "media/Metal.mp3";
			
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
			
            
            //setup the biquad
            
            biquadFilter = audioCtx.createBiquadFilter();
            biquadFilter.type = "highpass";
            
            
            
			// 6 - connect the nodes - we now have an audio graph
			sourceNode.connect(analyserNode);
			analyserNode.connect(biquadFilter);
            biquadFilter.connect(gainNode);
			gainNode.connect(audioCtx.destination);
            
            
            
		}
		
		function setupCanvas(){
			canvasElement = document.querySelector('#mainCanvas');
			drawCtx = canvasElement.getContext("2d");
            setupLogo();
            
            // Set the height and width to be relative to the screen.
            // "Responsive"
            canvasElement.height = window.innerHeight;
            canvasElement.width = window.innerWidth;
            logoCanvasElement.height = window.innerHeight;
            logoCanvasElement.width = window.innerWidth;
		} 

        function setupLogo(){
            logoCanvasElement = document.querySelector('#logoCanvas');
            
            logoCtx = logoCanvasElement.getContext("2d");
            //logoCtx.clearRect(0,0,logoCanvasElement.width,logoCanvasElement.height);
           
            poppyLogo.addEventListener('load', e => {
                
            });
            
            
        }

		
        function drawLogo(){
            logoCtx.drawImage(poppyLogo,logoCanvasElement.width/2-132,logoCanvasElement.height/2-125,264,204);
        }
                    

        function clearLogo(){
            logoCtx.clearRect(0,0,logoCanvasElement.width,logoCanvasElement.height);
        }

        window.onload = function(){
            // This adds the sliders and boxes to the datGui itself
            folder1.add(cont,"circleRadius",0,100);
            folder1.add(cont,"triSize", 1, 100);
            folder1.add(cont,"ctrlSlider",0,200);
            folder1.add(cont,"displayWaveform");
            folder1.add(cont,"displayFrequency");
            folder1.add(cont,"displaySepia");
            folder1.add(cont,"displayNoise");
            folder1.add(cont,"invertColors");
            folder1.add(cont,"displayProgress");
            
            folder3.add(cont,"detune",0,3000);
            folder3.add(cont,"volumeSlider", 0,1);
            
            folder4.add(songs,"Metal").listen().onChange(function(){setChecked("Metal")});
            folder4.add(songs,"Concrete").listen().onChange(function(){setChecked("Concrete")});
            
            folder5.add(songs,"Choke").listen().onChange(function(){setChecked("Choke")});
            folder5.add(songs,"ScaryMask").listen().onChange(function(){setChecked("ScaryMask")});
            folder5.add(songs,"Voicemail").listen().onChange(function(){setChecked("Voicemail")});
            
            folder6.add(songs,"MyStyle").listen().onChange(function(){setChecked("MyStyle")});
            folder6.add(songs,"MyMicrophone").listen().onChange(function(){setChecked("MyMicrophone")});
            folder6.add(songs,"Interweb").listen().onChange(function(){setChecked("Interweb")});
            
            folder7.add(songs,"PlayDestroy").listen().onChange(function(){setChecked("PlayDestroy")});
            folder7.add(songs,"HardFeelings").listen().onChange(function(){setChecked("HardFeelings")});
            folder7.add(songs,"InAMinute").listen().onChange(function(){setChecked("InAMinute")});

            
            gui.add(cont,"fullScreen");
            gui.add(cont,"play");
        }
    
        
        function setChecked( prop ){
            for (let param in songs){
                songs[param] = false;
            }
            songs[prop] = true;
            audioElement.src="media/"+prop+".mp3";
            pause=true;
        }    
		
		function update() { 
			// this schedules a call to the update() method in 1/60 seconds
			requestAnimationFrame(update);
			
            
            biquadFilter.detune.value=cont.detune;
            
            // Set the slider values and update the progress bar
            triSlider = cont.triSize;
            circleSlider = cont.circleRadius;
            ctrlSlider = cont.ctrlSlider;
            audioElement.volume = cont.volumeSlider;
            audioElement.addEventListener("timeupdate",updateProgress, false);
            
            if(!cont.displayProgress){
                progressBar.style.opacity = 0;
            }
            else if(cont.displayProgress){
                progressBar.style.opacity = 1;
            }
            
            
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
			
          
			// DRAW!
			drawCtx.clearRect(0,0,800,600);  
			logoCtx.clearRect(0,0,canvasElement.width,canvasElement.height);
            if(!pause)
                drawLogo();
			let barWidth = 3;
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
                if(cont.displayWaveform&&!pause)
                {
                    //canvas waveform stuff here
                    let percent = audioData[i]/255;
                    percent = percent < 0.02 ? .02 : percent;
                    //drawCtx.translate(BAR_WIDTH, 0);
                    drawCtx.fillStyle = 'red';
                    
                    //first waveform
                    drawCtx.save();
                    drawCtx.translate(canvasElement.width/2,canvasElement.height/3);
                    drawCtx.translate(0,50-cont.triSize);
                    drawCtx.rotate(60*Math.PI/180);
                    drawCtx.translate(-30,-15);
                    drawCtx.scale(((100+cont.triSize)/215),-1);
                    drawCtx.fillRect(barWidth*i+i*PADDING,0,BAR_WIDTH,MAX_BAR_HEIGHT*percent);
                    drawCtx.restore();
                    //drawCtx.translate(PADDING,0);
                    
                    //second waveform
                    drawCtx.save();
                    drawCtx.translate(canvasElement.width/2-cont.triSize*0.9,canvasElement.height/3+cont.triSize*0.3);
                    drawCtx.scale(1,-1);
                    drawCtx.rotate(-302*Math.PI/180);
                    drawCtx.translate(-325-(cont.triSize/20),-12);
                    drawCtx.scale(((100+cont.triSize)/215),1);
                    drawCtx.fillRect(barWidth*i+i*(PADDING),0,BAR_WIDTH*(1+cont.triSize*0.01),MAX_BAR_HEIGHT*percent);
                    drawCtx.restore();
                    
                    //third waveform
                    drawCtx.save();
                    drawCtx.translate(canvasElement.width/2,canvasElement.height/2);
                    drawCtx.rotate(Math.PI);
                    drawCtx.translate(-160-cont.triSize,-95-cont.triSize*0.5);
                    drawCtx.scale(((100+cont.triSize)/210),-1);
                    
                    drawCtx.fillRect(barWidth*i+i*PADDING,0,BAR_WIDTH,MAX_BAR_HEIGHT*percent);
                    drawCtx.restore();
                }
                
                /* Drawing Circles */ 
                drawCtx.globalAlpha = 1;
                
                // Drawing the circles
                drawCircles(drawCtx, canvasElement, audioData, i, circleSlider);
                
                // Drawing the curves, but not on every i
                // This allows us to limit the curves
                if(i%10==0){
                    drawCurves(drawCtx, audioData, canvasElement, i, ctrlSlider);
                }

                drawTriangle(drawCtx, audioData,canvasElement, i, triSlider);

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
            
            let logoImgData;
            let logoData;
            
            if(!pause)
            {
                logoImgData = logoCtx.getImageData(0,0,logoCtx.canvas.width,logoCtx.canvas.height);
                logoData = logoImgData.data;
            }
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
                
                // 32 - Invert colors
                if(cont.invertColors)
                {
                    let red = data[i], green = data[i+1], blue = data[i+2];
                    data[i] = 255 - red;
                    data[i+1] = 255 - green;
                    data[i+2] = 255 - blue;
                    
                    if(!pause)
                        {
                            let lRed = logoData[i], lGreen = logoData[i+1], lBlue = logoData[i+2];

                            
                            logoData[i] = 255- lRed;
                            logoData[i+1] = 255-lGreen;
                            logoData[i+2] = 255 - lBlue;
                        }
                }
                
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
                    
                    
                    //FOR THE LOGO LAYER
                    if(!pause)
                    {
                        let lOutRed, lOutGreen, lOutBlue;
                        
                        lOutRed = ((logoData[i] * .393) + (logoData[i+1] * .769) + (logoData[i+2] * .189));
                        lOutGreen = ((logoData[i] * .349) + (logoData[i+1] * .686) + (logoData[i+2] * .168));
                        lOutBlue = ((logoData[i] * .272) + (logoData[i+1] * .534) + (logoData[i+2] * .131));
                        
                        logoData[i] = lOutRed < 255 ? lOutRed : 255;
                        logoData[i+1] = lOutGreen < 255 ? lOutGreen : 255;
                        logoData[i+2] = lOutBlue < 255 ? lOutBlue : 255;
                    }
                }
            }
            
            // 32 - Put the modified data back on the canvas 
            ctx.putImageData(imageData, 0, 0);
            if(!pause)
                logoCtx.putImageData(logoImgData,0,0);
        }

        // Progress bar logic
        // https://www.adobe.com/devnet/archive/html5/articles/html5-multimedia-pt3.html
        function updateProgress() {
            if (audioElement.currentTime > 0) {
                value = Math.floor((100 / audioElement.duration) * audioElement.currentTime);
            }
            
            progress.style.width = value + "%";
            
            // The new thing we did was adding the colors for the progress bar to match 
            // what is happening on screen. The original color is red, so just adjusting 
            // the values gave us the effect we wanted.
            progress.style.backgroundColor = 'rgb(190,0,0,.75)';
            if(cont.invertColors){
                progress.style.backgroundColor = 'rgb(65,255,255,.75)';
            }
            if(cont.displaySepia){
                progress.style.backgroundColor = 'rgb(112,66,20,.75)';
            }
            if(cont.displaySepia && cont.invertColors){
                progress.style.backgroundColor = 'rgb(72,56,37,.75)';
            }
            }
		
        //update logo layer
        function updateLogo() {
            
            if(cont.invertColors){
                                
            }
            if(cont.displaySepia){
                
            }
            if(cont.displaySepia && cont.invertColors){
                
            }
            
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
        