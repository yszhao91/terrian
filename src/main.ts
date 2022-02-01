import { AxesHelper, PerspectiveCamera, Scene, WebGLRenderer, Mesh, BufferGeometry, BoxBufferGeometry, MeshPhongMaterial, MeshBasicMaterial, HemisphereLight, DirectionalLight } from 'three';
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Terrain } from './terrain';

const app = document.querySelector<HTMLDivElement>('#app')!


const renderer = new WebGLRenderer({ antialias: true });
const scene = new Scene();
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
const controls = new OrbitControls(camera, renderer.domElement)

function init() {
  camera.position.y = 100.1;
  camera.position.z = 10.1;
  controls.update();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff)
  window.addEventListener('resize', (ev) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
  })
  app.append(renderer.domElement);
  const terrain = new Terrain();
  scene.add(terrain)
  scene.add(new Mesh(new BoxBufferGeometry(5, 100, 5), new MeshBasicMaterial({ color: 0xafaf00 })))
  scene.add(new AxesHelper(10000));

  const dirLight = new DirectionalLight(0xcfcfcf);
  dirLight.position.set(100, 70, 100)
  scene.add(dirLight);
  scene.add(new HemisphereLight(0xafafaf, 0x555555));
}

function loop() {
  renderer.render(scene, camera)
  requestAnimationFrame(loop);
}

init();
loop();


