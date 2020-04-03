console.log('loaded webgl.js')

const vsSource = document.getElementById('vsSource').innerText
const fsSource = document.getElementById('fsSource').innerText

const size = 100
const width = Math.sqrt(size/4)
const height = width
console.log('width,height',width,height)

const canvas = document.createElement('canvas')
canvas.width = width
canvas.height = height
if(canvas.width !== width)
	console.warn('ERROR: inefficient')
document.body.append(canvas)

const gl = canvas.getContext('webgl',{ antialias: false})

const format = gl.RGBA
const type = gl.FLOAT
const texType = gl.UNSIGNED_BYTE

// program
const program = buildProgram()
gl.useProgram(program)

// locations
// attrib
const attribLocations = []
for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES);i++){
	const attribName = gl.getActiveAttrib(program,i).name
	attribLocations[attribName] = gl.getAttribLocation(program,attribName)
}
// uniform
const uniformLocations = []
for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);i++){
	const uniformName = gl.getActiveUniform(program,i).name
	uniformLocations[uniformName] = gl.getUniformLocation(program,uniformName)
}

// data
let data = [
//	x	y	
	-1, -1, 0, 0,
	1, -1, 1, 0,
	-1,1, 0,1,
	-1,1,0,1,
	1,-1,1,0,
	1,1,1,1
]

// buffer
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW)

// pointer
gl.vertexAttribPointer(
	attribLocations.a_Position,
	2,
	type,
	0,
	4*Float32Array.BYTES_PER_ELEMENT,
	0*Float32Array.BYTES_PER_ELEMENT,
)
gl.enableVertexAttribArray(attribLocations.a_Position)

gl.vertexAttribPointer(
	attribLocations.a_TexCoord,
	2,
	type,
	0,
	4*Float32Array.BYTES_PER_ELEMENT,
	2*Float32Array.BYTES_PER_ELEMENT
)
gl.enableVertexAttribArray(attribLocations.a_TexCoord)

// uniform
gl.uniform1f(uniformLocations.u_DiaInv,1/width)


// texture
// src
const textures = []
const framebuffers = []



for (let i=0;i<3;i++){
	textures[i] = buildTexture(null)
	framebuffers[i] = buildFramebuffer(textures[i])
}
updateTexture(textures[1],createSrcData(2))
let tex0 = createEmptyData()
tex0[0+4*0]=255
tex0[3+4*0]=255
updateTexture(textures[0],tex0)

// gl.uniform1i(uniformLocations.u_Tex,0)  // !@#!@#!@#


// render
// gl.viewport(0,0,width,height)  // !@#!@#!@#
// TEXTURE 0. Bind tex[1]

// texture[0] = 1,2
// bind texture[0] => (TEXTURE 0) => u_Tex0
gl.activeTexture(gl.TEXTURE0) // TEXTURE 1. Bind 0. 
// gl.bindTexture(gl.TEXTURE_2D,textures[0])
// gl.uniform1i(uniformLocations.u_Tex0,0) // u_Tex0 => text[1]

// // texture[1] = 2,3
// // bind texture[1] => (TEXTURE 1) => u_Tex1
// gl.activeTexture(gl.TEXTURE1)
// gl.bindTexture(gl.TEXTURE_2D,textures[1])//!@#!@#!@# 
// gl.uniform1i(uniformLocations.u_Tex1,1)



dstTex = new Uint8Array(size)

gl.readPixels(0,0,width,height,format,texType,dstTex)
print('dstTex',dstTex)

// !@#!@# what's the number of bytes in a float in glsl


// gl.viewport(0,0,canvas.width,canvas.height)
// gl.clearColor(.8,0.8,0.8,1)
// gl.clear(gl.COLOR_BUFFER_BIT)
function pingDraw(i){
	gl.bindTexture(gl.TEXTURE_2D,textures[i])
	gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffers[(i+1)%2])
	gl.drawArrays(gl.TRIANGLES,0,data.length/4)
}

function drawToFinalTex(){
	// draw to dst texture
	gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffers[2])
	gl.drawArrays(gl.TRIANGLES,0,data.length/4)
}

function drawToCanvas(){
	// draw
	gl.bindFramebuffer(gl.FRAMEBUFFER,null)
	gl.drawArrays(gl.TRIANGLES,0,data.length/4)
}

function perFrame(){
	pingDraw(currentTex)
	drawToFinalTex()
	dstTex = new Uint8Array(size)
	
	gl.readPixels(0,0,width,height,format,texType,dstTex)
	print('dstTex',dstTex)
	drawToCanvas()
	currentTex++
	currentTex=currentTex%2
}

let currentTex = 0
let time = new Date()
const fps = 1
const interval = 1000
looper()

function looper(){

	if(new Date()-time > interval/fps){
		perFrame()
		time = new Date()
	}
	requestAnimationFrame(looper)
}