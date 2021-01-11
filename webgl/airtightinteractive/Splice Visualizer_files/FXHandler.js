//UberViz FXHandler
//Handles Post-Proc Shaders

var FXHandler = function() {

	var fxParams = {	
		brightness:-1,
		audioLevels:false,
		strobe:false,
		strobePeriod: 6,
		shakeAmount: 0.5,
		barrelAmount:0.01,
	};

	var shaderTime = 0;
	var superPass;
	var rgbPass;
	var huePass;
	var FXAAPass;
	var composer;

	function init(){


		//EVENT HANDLERS
		events.on("update", update);
		events.on("onResize", resize);
		
		//CREATE FX PASSES
		composer = new THREE.EffectComposer( SpliceMain.getRenderer() );
		renderPass = new THREE.RenderPass( SpliceMain.getScene(), SpliceMain.getCamera() );
		composer.addPass( renderPass);

		if (SpliceMain.getIsMobile()){

			//no effects for mobile
			copyPass = new THREE.ShaderPass( THREE.CopyShader );
			composer.addPass( copyPass );
			copyPass.renderToScreen = true;

		}else{

			shakePass = new THREE.ShaderPass( THREE.ShakeShader );
			composer.addPass( shakePass );


			FXAAPass = new THREE.ShaderPass( THREE.FXAAShader );
			composer.addPass( FXAAPass );


			rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader);
			rgbPass.uniforms.angle.value = Math.PI/2;
			rgbPass.uniforms.amount.value = 0.0025;
			composer.addPass( rgbPass );

			superPass = new THREE.ShaderPass(THREE.SuperShader);
			
			superPass.uniforms.vigDarkness.value = 1;
			superPass.uniforms.vigOffset.value =  1.3;

			superPass.uniforms.glowSize.value = 2;
			superPass.uniforms.glowAmount.value = 1;		

			composer.addPass( superPass );

			superPass.renderToScreen = true;

			// huePass = new THREE.ShaderPass(THREE.HueSaturationShader);
			// composer.addPass( huePass );
			// huePass.renderToScreen = true;


			// barrelPass = new THREE.ShaderPass( THREE.BarrelBlurShader );
			// barrelPass.uniforms.amount.value = 0;
			// composer.addPass( barrelPass );
			// barrelPass.renderToScreen = true;


			// linesPass = new THREE.ShaderPass( THREE.LinesShader );
			// linesPass.uniforms.lineStrength.value = 0.1;
			// linesPass.uniforms.lineSize.value = 3000;
			// linesPass.uniforms.lineTilt.value = 0.5;

			// composer.addPass( linesPass );
			// linesPass.renderToScreen = true;

		}

		resize();

	}

	function update( t ) {

		if (!SpliceMain.getIsMobile()){

			shaderTime += 1;

			shakePass.uniforms.time.value =  shaderTime/100;

			//dont shakke when paused
			//if (AudioHandler.getSmoothedVolume() < 1){
				//shakePass.uniforms.amount.value = AudioHandler.getVolume()*AudioHandler.getVolume()*AudioHandler.getVolume()*0.12 ;
				shakePass.uniforms.amount.value = Math.pow(AudioHandler.getSmoothedVolume(),8) * 0.5 ;

			//}else{
			//	shakePass.uniforms.amount.value = 0;
			//}
			

			//SpliceMain.trace(shakePass.uniforms.amount.value);

			rgbPass.uniforms.angle.value = shaderTime/30 * Math.PI/2;

			//barrelPass.uniforms.amount.value = Math.pow(AudioHandler.getSmoothedVolume(),8) * 1 ;

			//calculate master brightness from Strobe + AudioLevels + Brightness
			var brightness = fxParams.brightness;

			if (fxParams.audioLevels){

				//don't go to black when paused
				if (AudioHandler.getVolume() > 0){
			 		brightness += Math.min(AudioHandler.getVolume()*2 - 0.9,0); //-1 -> 0 based on Vol
			 	}
			}

			if (AudioHandler.getAudioTime() > 226){
				brightness = -1;
			}

			if (fxParams.strobe){
				brightness -= (shaderTime %  fxParams.strobePeriod)/fxParams.strobePeriod;

			}

			superPass.uniforms.brightness.value =  brightness;


			//huePass.uniforms.hue.value =  (shaderTime/100) % 2 - 1;

		}


		composer.render( 0.1 );
	}



	function resize(){

		if (!composer) return;
		
		if (!SpliceMain.getIsMobile()){
			superPass.uniforms.resolution.value =  new THREE.Vector2(window.innerWidth,window.innerHeight);
			FXAAPass.uniforms.resolution.value =  new THREE.Vector2(1/window.innerWidth,1/window.innerHeight);
		}

		composer.setSize(window.innerWidth,window.innerHeight);

	}

	return {
		init:init,	
		fxParams:fxParams,
	};

}();