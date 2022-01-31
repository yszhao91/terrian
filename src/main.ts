import { AxesHelper, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import './style.css'
import { Chunck } from './chunk';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const app = document.querySelector<HTMLDivElement>('#app')!


const renderer = new WebGLRenderer({ antialias: true });
const scene = new Scene();
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
new OrbitControls(camera, renderer.domElement)

function init() {
  camera.position.y = 10.1;
  camera.position.z = 10.1;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff)
  window.addEventListener('resize', (ev) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  })
  app.append(renderer.domElement);
  const chunk = new Chunck();
  scene.add(chunk)

  scene.add(new AxesHelper(10000));
}

function loop() {
  renderer.render(scene, camera)
  requestAnimationFrame(loop);
}

init();
loop();


