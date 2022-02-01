import { Object3D, Vector3 } from "three";
import { Chunck } from './chunk';

export class Terrain extends Object3D {
    chunks: any = {}
    chunkSize: number = 128;
    maxChunkNum: number = 121;

    constructor() {
        super();
        for (let i = -2; i <= 1; i++) {
            for (let j = -2; j <= 1; j++) {
                const chunck = new Chunck(new Vector3(i * this.chunkSize, 0, j * this.chunkSize), this.chunkSize);
                console.log(chunck.position.toArray())
                this.add(chunck);
            }
        }
        console.log(this.children);
        this.buildLevelBoundChunk(2)
        this.buildLevelBoundChunk(3)
        this.buildLevelBoundChunk(4)
        this.buildLevelBoundChunk(5)
    }


    buildLevelBoundChunk(level: number = 2) {
        const size = this.chunkSize * (2 ** (level - 1));
        const lsize = this.chunkSize * (2 ** level);
        for (let i = -2; i < 2; i++) {
            const chunck1 = new Chunck(new Vector3(size, 0, size * i), size);
            this.add(chunck1);
            const chunck2 = new Chunck(new Vector3(-lsize, 0, size * i), size);
            this.add(chunck2);

        }

        for (let i = -1; i < 1; i++) {
            const chunck1 = new Chunck(
                new Vector3(size * i, 0, size), size);
            this.add(chunck1); 

            const chunck2 = new Chunck(
                new Vector3(size * i, 0, -lsize), size);
            this.add(chunck2); 
        }
    }



    




}