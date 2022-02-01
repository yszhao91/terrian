import { ShaderMaterial } from "three";

const vs = `

`;

const fs = `

`

export const TerrainMaterial = new ShaderMaterial({
    vertexShader: vs,
    fragmentShader: fs,
    defines: {},
    uniforms: {}
})