import { DoubleSide, Float32BufferAttribute, Mesh, MeshPhysicalMaterial, Uint32BufferAttribute, Vector3, Vector4 } from 'three';
import { cornerIndexAFromEdge, cornerIndexBFromEdge, triangulation } from './mc';
import { Perlin } from './perlin';

const _v1 = new Vector3();
const _v2 = new Vector3;

const isoLevel = 0;

export class Chunck extends Mesh {
    spacing: number = 1;
    unitSize: number;
    boundsSize: number = 100; //一块chunk的高宽
    points: any = {};
    vertices: Array<any> = [];
    segment: number = 32; //分段
    origin: Vector3 = new Vector3;
    constructor(origin: Vector3, chunkSize: number) {
        super();
        this.origin.copy(origin);
        this.boundsSize = chunkSize;
        this.unitSize = this.boundsSize / this.segment;

        this.material = new MeshPhysicalMaterial({ color: 0xaaaaaa, wireframe: true, side: DoubleSide });
        this.build();
    }

    density(vec: Vector3, noiseScale: number = 2.99, octaves = 6, persistence = 1,
        lacunarity = 1, floorOffset = 20.19, hardFloor = -2.84, hardFloorWeight = 3.05,
        noiseWeight = 6.09) {
        // const pos = this.position.clone().add(id/* _v1.copy(id).multiplyScalar(this.spacing).subScalar(this.boundsSize / 2) */);

        const origin = this.origin.clone();
        _v1.copy(vec);
        _v1.multiplyScalar(this.unitSize);
        const curPos = origin.add(_v1);

        const offsetNoise = new Vector3;
        let noise = 0;
        let frequency = noiseScale / 140;
        let amplitude = 1;
        let weight = 1;
        const weightMultiplier = 1;
        const params = { x: 1, y: 0.1 };

        for (let j = 0; j < octaves; j++) {
            // float n = snoise((pos+offsetNoise) * frequency + offsets[j] + offset);

            _v2.copy(curPos).add(offsetNoise).multiplyScalar(frequency) /* + offsets[j] + offset */
            const n = Perlin.Noisev3(_v2) / 6.888;
            let v = 1 - Math.abs(n);
            v = v * v;
            v *= weight;
            weight = Math.max(Math.min(v * weightMultiplier, 1), 0);
            noise += v * amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }

        let finalVal = -(curPos.y * 0.8 + floorOffset) + noise * noiseWeight + (curPos.y % params.x) * params.y;

        if (curPos.y < hardFloor) {
            finalVal += hardFloorWeight;
        }

        const closeEdges = false;
        if (closeEdges) {
            // const edgeOffset = abs(pos * 2) - worldSize + spacing / 2;
            // const edgeWeight = saturate(sign(max(max(edgeOffset.x, edgeOffset.y), edgeOffset.z)));
            //     finalVal = finalVal * (1 - edgeWeight) - 100 * edgeWeight;

        }

        var index = this.indexFromCoord(vec.x, vec.y, vec.z);
        this.points[index] = new Vector4(curPos.x, curPos.y, curPos.z, finalVal);
    }

    interpolateVerts = (v1: Vector4, v2: Vector4) => {
        const t: number = (isoLevel - v1.w) / (v2.w - v1.w);
        _v1.set(v1.x, v1.y, v1.z);
        _v2.set(v2.x, v2.y, v2.z);

        return _v1.clone().add(_v2.sub(_v1).multiplyScalar(t));
    }
    build() {
        this.vertices = []
        this.points = [];
        for (let i = 0; i <= this.segment; i++) {
            for (let j = 0; j <= this.segment; j++) {
                for (let k = 0; k <= this.segment; k++) {
                    this.density(new Vector3(i, j, k));
                }
            }
        }

        for (let i = 0; i < this.segment; i++) {
            for (let j = 0; j < this.segment; j++) {
                for (let k = 0; k < this.segment; k++) {
                    this.March(new Vector3(i, j, k));
                }
            }
        }

        const vs = []
        const index = []
        for (let i = 0; i < this.vertices.length; i++) {
            const p = this.vertices[i];
            vs.push(p.x, p.y, p.z);
            index.push(i)
        }

        const vf = new Float32BufferAttribute(vs, 3);
        this.geometry.setAttribute('position', vf);
        this.geometry.setIndex(new Uint32BufferAttribute(index, 1))
        this.geometry.computeVertexNormals();
    }

    indexFromCoord(x: number, y: number, z: number): number {
        const seg = this.segment + 1;
        return z * seg * seg + y * seg + x;
    }

    March(vec: Vector3) {
        if (vec.z === this.segment)
            debugger

        // 8 corners of the current cube
        const cubeCorners = [
            this.points[this.indexFromCoord(vec.x, vec.y, vec.z)],
            this.points[this.indexFromCoord(vec.x + 1, vec.y, vec.z)],
            this.points[this.indexFromCoord(vec.x + 1, vec.y, vec.z + 1)],
            this.points[this.indexFromCoord(vec.x, vec.y, vec.z + 1)],
            this.points[this.indexFromCoord(vec.x, vec.y + 1, vec.z)],
            this.points[this.indexFromCoord(vec.x + 1, vec.y + 1, vec.z)],
            this.points[this.indexFromCoord(vec.x + 1, vec.y + 1, vec.z + 1)],
            this.points[this.indexFromCoord(vec.x, vec.y + 1, vec.z + 1)]
        ];

        // Calculate unique index for each cube configuration.
        // There are 256 possible values
        // A value of 0 means cube is entirely inside surface; 255 entirely outside.
        // The value is used to look up the edge table, which indicates which edges of the cube are cut by the isosurface.
        let cubeIndex: number = 0;
        if (cubeCorners[0].w < isoLevel) cubeIndex |= 1;
        if (cubeCorners[1].w < isoLevel) cubeIndex |= 2;
        if (cubeCorners[2].w < isoLevel) cubeIndex |= 4;
        if (cubeCorners[3].w < isoLevel) cubeIndex |= 8;
        if (cubeCorners[4].w < isoLevel) cubeIndex |= 16;
        if (cubeCorners[5].w < isoLevel) cubeIndex |= 32;
        if (cubeCorners[6].w < isoLevel) cubeIndex |= 64;
        if (cubeCorners[7].w < isoLevel) cubeIndex |= 128;
        if (cubeIndex === 0)
            return;

        // Create triangles for current cube configuration
        for (let i = 0; triangulation[cubeIndex][i] != -1; i += 3) {
            // Get indices of corner points A and B for each of the three edges
            // of the cube that need to be joined to form the triangle.
            const a0 = cornerIndexAFromEdge[triangulation[cubeIndex][i]];
            const b0 = cornerIndexBFromEdge[triangulation[cubeIndex][i]];

            const a1 = cornerIndexAFromEdge[triangulation[cubeIndex][i + 1]];
            const b1 = cornerIndexBFromEdge[triangulation[cubeIndex][i + 1]];

            const a2 = cornerIndexAFromEdge[triangulation[cubeIndex][i + 2]];
            const b2 = cornerIndexBFromEdge[triangulation[cubeIndex][i + 2]];

            const vA = this.interpolateVerts(cubeCorners[a0], cubeCorners[b0]);
            const vB = this.interpolateVerts(cubeCorners[a1], cubeCorners[b1]);
            const vC = this.interpolateVerts(cubeCorners[a2], cubeCorners[b2]);
            this.vertices.push(vA, vB, vC);
        }


    }

}