console.log('loaded webgl.js')

const vsSource = document.getElementById('vsSource').innerText
const fsSource = document.getElementById('fsSource').innerText

const size = 16
const width = Math.sqrt(size/4)
const height = width
console.log('width,height',width,height)

const canvas = document.createElement('canvas')
canvas.width = width
canvas.height = height
document.body.append(canvas)

const gl = canvas.getContext('webgl')

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



// texture
// src
const srcData = createSrcData()
print('srcData',srcData)

const textures = []
const framebuffers = []



for (let i=0;i<2;i++){
	textures[i] = buildTexture(null)
	framebuffers[i] = buildFramebuffer(textures[i])
}
textures[0] = updateTexture(textures[0],srcData)


// gl.uniform1i(uniformLocations.u_Tex,0)  // !@#!@#!@#

// render
// gl.viewport(0,0,width,height)  // !@#!@#!@#
// gl.bindTexture(gl.TEXTURE_2D,srcTex)//!@#!@#!@# 
gl.drawArrays(gl.TRIANGLES,0,data.length/4)

gl.bindTexture(gl.TEXTURE_2D,textures[1])
gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffers[0])
gl.drawArrays(gl.TRIANGLES,0,data.length/4)
// gl.bindTexture(gl.TEXTURE_2D,textures[0])
// gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffers[1])
// gl.drawArrays(gl.TRIANGLES,0,data.length/4)

dstTex = new Uint8Array(size) 
gl.readPixels(0,0,width,height,format,texType,dstTex)
print('dstTex',dstTex)
// !@#!@# what's the number of bytes in a float in glsl
