
// FUNCTIONS
function print(name,vaue){
	console.log(name)
	console.log(vaue)
}

function buildFramebuffer(texture){
	const framebuffer = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer)
	gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0)
	return framebuffer
}

function updateTexture(texture,pixels){
	gl.bindTexture(gl.TEXTURE_2D,texture)
	gl.texImage2D(gl.TEXTURE_2D,0,format,width,height,0,format,texType,pixels)
}

function buildTexture(pixels){
	const texture = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D,texture)
	gl.texImage2D(gl.TEXTURE_2D,0,format,width,height,0,format,texType,pixels)
	
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)

	return texture
}


function createSrcData(){
	const data = new Uint8Array(size)		//!@#!@#!@#
	for(let i=0;i<size;i++){
		data[i] = i%256
	}
	return data
}

function buildShader(type,source){
	const shader = gl.createShader(type)
	gl.shaderSource(shader,source)
	gl.compileShader(shader)

	if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
		throw new Error('ERROR: compiling shader of type '+type+' Info: '+gl.getShaderInfoLog(shader))
	}
	return shader
}

function buildProgram(){
	const program = gl.createProgram()
	gl.attachShader(program,buildShader(gl.VERTEX_SHADER,vsSource))
	gl.attachShader(program,buildShader(gl.FRAGMENT_SHADER,fsSource))
	gl.linkProgram(program)
	gl.validateProgram(program)

	if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
		throw new Error('ERROR: linking program. Info: '+gl.getProgramInfoLog(program))
	}
	if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS)){
		throw new Error('ERROR: validating program. Info: '+gl.getProgramInfoLog(program))
	}
	return program
}
