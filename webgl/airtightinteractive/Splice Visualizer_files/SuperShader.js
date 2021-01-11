 /**
 * Uberviz Super shader doing color manipulation
 * Combines:
 * - Glow
 * - Vignette
 * - brightness: -1 to 1 (-1 is solid black, 0 is no change, and 1 is solid white)
 */

THREE.SuperShader = {

	uniforms: {

		//Glow
		"tDiffuse": 	{ type: "t", value: null },
		"glowAmount":   { type: "f", value: 0.5 },
		"glowSize":     { type: "f", value: 4.0 },
		"resolution":   { type: "v2", value: new THREE.Vector2( 800.0, 600.0 )  },

		//Vignette
		"vigOffset":   { type: "f", value: 1.0 },
		"vigDarkness": { type: "f", value: 1.0 },

		//BrightnessContrast
		 "brightness": { type: "f", value: 0 },

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		
		"uniform float glowSize;",
		"uniform float glowAmount;",
		"uniform vec2 resolution;",

		"uniform float vigOffset;",
		"uniform float vigDarkness;",

		"uniform float brightness;",
		"uniform float contrast;",

		"varying vec2 vUv;",

		"void main() {",

			"float h = glowSize / resolution.x;",
			"float v = glowSize / resolution.y;",

			"vec4 sum = vec4( 0.0 );",

			//H Blur
			"sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;",

			
			//V Blur
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;",

			//orig color
			"vec4 col = texture2D( tDiffuse, vUv );",
			
			//Add Glow
			"col = min(col + sum * glowAmount, 1.0);",

			//vignette
			"vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( vigOffset );",
			"col = vec4( mix( col.rgb, vec3( 1.0 - vigDarkness ), dot( uv, uv ) ), col.a );",

			//BrightnessContrast
			"col.rgb += brightness;",

			"gl_FragColor = col;",

		"}"

	].join("\n")

};
