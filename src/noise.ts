// // Noise Shader Library for Unity - https://github.com/keijiro/NoiseShader
// //
// // Original work (webgl-noise) Copyright (C) 2011 Ashima Arts.
// // Translation and modification was made by Keijiro Takahashi.
// //
// // This shader is based on the webgl-noise GLSL shader. For further details
// // of the original shader, please see the following description from the
// // original source code.
// //

// //
// // Description : Array and textureless GLSL 2D/3D/4D simplex
// //               noise functions.
// //      Author : Ian McEwan, Ashima Arts.
// //  Maintainer : ijm
// //     Lastmod : 20110822 (ijm)
// //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
// //               Distributed under the MIT License. See LICENSE file.
// //               https://github.com/ashima/webgl-noise
// //

// function mod289n1(x: number) {
//     return x - Math.floor(x / 289.0) * 289.0;
// }

// function mod289n3(x: number, y: number, z: number) {
//     x = mod289n1(x);
//     y = mod289n1(y);
//     z = mod289n1(z);
//     return [x, y, z]
// }

// function mod289n4(x: number, y: number, z: number, w: number) {
//     x = mod289n1(x);
//     y = mod289n1(y);
//     z = mod289n1(z);
//     w = mod289n1(w);
//     return [x, y, z, w]
// }

// function permute(x: number, y: number, z: number, w: number) {
//     x = mod289n1((x * 34.0 + 1.0) * x);
//     y = mod289n1((y * 34.0 + 1.0) * y);
//     z = mod289n1((z * 34.0 + 1.0) * z);
//     z = mod289n1((w * 34.0 + 1.0) * w);
//     return [x, y, z, w]
// }

// function taylorInvSqrt(x: number, y: number, z: number, w: number) {
//     x = 1.79284291400159 - x * 0.85373472095314;
//     y = 1.79284291400159 - y * 0.85373472095314;
//     z = 1.79284291400159 - z * 0.85373472095314;
//     w = 1.79284291400159 - w * 0.85373472095314;
//     return [x, y, z, w]
// }
// function dot(a: number[], b: number[]) {
//     return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
// }
// function floor(a: number[]) {
//     const res = []
//     for (let i = 0; i < a.length; i++) {
//         res[i] = Math.floor(a[i]);
//     }
//     return res;
// }

// function add(a: number[], b: number[]) {
//     const res = []
//     for (let i = 0; i < a.length; i++) {
//         res[i] = a[i] + b[i];
//     }
//     return res;
// }
// function sub(a: number[], b: number[]) {
//     const res = []
//     for (let i = 0; i < a.length; i++) {
//         res[i] = a[i] - b[i];
//     }
//     return res;
// }
// step()

// function snoise(x: number, y: number, z: number) {
//     const C: number[] = [1.0 / 6.0, 1.0 / 3.0];
//     const v: number[] = [x, y, z];

//     // First corner
//     const dotv = dot(v, [C[1], C[1], C[1]])
//     var i = floor(add(v, [dotv, dotv, dotv]));
//     const doti = dot(i, [C[0], C[0], C[0]])
//     var x0 = add(sub(v, i), [doti, doti, doti]);

//     // Other corners
//     var g = step(x0.yzx, x0.xyz);
//     var l = 1.0 - g;
//     var i1 = min(g.xyz, l.zxy);
//     var i2 = max(g.xyz, l.zxy);

//     // x1 = x0 - i1  + 1.0 * C.xxx;
//     // x2 = x0 - i2  + 2.0 * C.xxx;
//     // x3 = x0 - 1.0 + 3.0 * C.xxx;
//     var x1 = x0 - i1 + C.xxx;
//     var x2 = x0 - i2 + C.yyy;
//     var x3 = x0 - 0.5;

//     // Permutations
//     i = mod289(i); // Avoid truncation effects in permutation
//     var p =
//         permute(permute(permute(i.z + [0.0, i1.z, i2.z, 1.0])
//             + i.y + var(0.0, i1.y, i2.y, 1.0))
//             + i.x + var(0.0, i1.x, i2.x, 1.0));

//     // Gradients: 7x7 points over a square, mapped onto an octahedron.
//     // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
//     var j = p - 49.0 * floor(p / 49.0);  // mod(p,7*7)

//     var x_ = floor(j / 7.0);
//     var y_ = floor(j - 7.0 * x_);  // mod(j,N)

//     var x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
//     var y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;

//     var h = 1.0 - abs(x) - abs(y);

//     var b0 = var(x.xy, y.xy);
//     var b1 = var(x.zw, y.zw);

//     //var s0 = var(lessThan(b0, 0.0)) * 2.0 - 1.0;
//     //var s1 = var(lessThan(b1, 0.0)) * 2.0 - 1.0;
//     var s0 = floor(b0) * 2.0 + 1.0;
//     var s1 = floor(b1) * 2.0 + 1.0;
//     var sh = -step(h, 0.0);

//     var a0 = b0.xzyw + s0.xzyw * sh.xxyy;
//     var a1 = b1.xzyw + s1.xzyw * sh.zzww;

//     var g0 = var(a0.xy, h.x);
//     var g1 = var(a0.zw, h.y);
//     var g2 = var(a1.xy, h.z);
//     var g3 = var(a1.zw, h.w);

//     // Normalise gradients
//     var norm = taylorInvSqrt(var(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3)));
//     g0 *= norm.x;
//     g1 *= norm.y;
//     g2 *= norm.z;
//     g3 *= norm.w;

//     // Mix final noise value
//     var m = max(0.6 - var(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
//     m = m * m;
//     m = m * m;

//     var px = var(dot(x0, g0), dot(x1, g1), dot(x2, g2), dot(x3, g3));
//     return 42.0 * dot(m, px);
// }
