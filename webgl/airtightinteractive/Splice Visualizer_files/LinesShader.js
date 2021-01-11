/**
 * @author felixturner / http://airtight.cc/
 *
 * Simple overlay Lines with rotation. Adapted from http://uglyhack.appspot.com/videofx/
 *
 */

THREE.LinesShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"lineStrength":     { type: "f", value: 10 }, 
		"lineSize":     { type: "f", value: 10 } ,
		"lineTilt":     { type: "f", value: 10 } 

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
		"uniform float lineStrength;",
		"uniform float lineSize;",
		"uniform float lineTilt;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 col = texture2D(tDiffuse, vUv);",
			"col += sin(vUv.x*lineSize*(1.0-lineTilt)+vUv.y*lineSize*lineTilt)*lineStrength;",
			"gl_FragColor = col;",

		"}"

	].join("\n")

};
