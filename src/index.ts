import * as dat from 'dat.gui';
import * as twgl from 'twgl.js';

import createContext from './util/createContext';
import createUnitQuad2D from './util/createUnitQuad2D';

const basicVertShader = require('./shaders/basic.vert');
const marbleShader = require('./shaders/marble.frag');

/**
 * Initialize WebGL, buffer, and shader
 */
const gl: WebGLRenderingContext = createContext();
console.log('canvas dimensions:', gl.canvas.width, gl.canvas.height);
const programInfo = twgl.createProgramInfo(gl, [basicVertShader, marbleShader]);
const bufferInfo = createUnitQuad2D(gl);

const state = {
    animate: true,
    color1: [255, 0, 0],
    color2: [255, 255, 255],
    color3: [255, 255, 255],
    color4: [0, 0, 255],
};

const gui = new dat.GUI();
gui.add(state, 'animate');
gui.addColor(state, 'color1');
gui.addColor(state, 'color2');
gui.addColor(state, 'color3');
gui.addColor(state, 'color4');

function render(time: number) {
    twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
        animate: state.animate,
        color1: state.color1.map(c => c / 255),
        color2: state.color2.map(c => c / 255),
        color3: state.color3.map(c => c / 255),
        color4: state.color4.map(c => c / 255),
        resolution: [gl.canvas.width, gl.canvas.height],
        time: time * 0.001,
    };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);
