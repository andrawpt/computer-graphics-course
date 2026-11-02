import * as THREE from "three";
import "./style.css";

const app = document.getElementById("app");
const info = document.getElementById("info");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const perspectiveCamera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  100
);
perspectiveCamera.position.set(4, 3, 6);
perspectiveCamera.lookAt(0, 0.5, 0);
scene.add(perspectiveCamera);

const frustumSize = 7;
const aspect = sizes.width / sizes.height;
const orthoCamera = new THREE.OrthographicCamera(
  (-frustumSize * aspect) / 2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  100
);
orthoCamera.position.set(4, 3, 6);
orthoCamera.lookAt(0, 0.5, 0);
scene.add(orthoCamera);

let activeCamera = perspectiveCamera;
let isOrthographic = false;

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0x22d3ee
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-1.2, 0.6, 0);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 16);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x4488ff,
  shininess: 70
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(1.4, 0.75, 0);
sphere.castShadow = true;
scene.add(sphere);

const groundGeometry = new THREE.PlaneGeometry(12, 12);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshLambertMaterial({
  color: 0x1e293b
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

const torusGeometry = new THREE.TorusGeometry(0.45, 0.16, 16, 48);
const torusMaterial = new THREE.MeshPhongMaterial({
  color: 0xf59e0b,
  shininess: 90
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(-2.8, 0.75, 1.2);
torus.castShadow = true;
scene.add(torus);

const coneGeometry = new THREE.ConeGeometry(0.5, 1.2, 24);
const coneMaterial = new THREE.MeshNormalMaterial();
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(0, 0.6, -2.2);
cone.castShadow = true;
scene.add(cone);

const lightMarkerGeometry = new THREE.SphereGeometry(0.12, 16, 8);
const lightMarkerMaterial = new THREE.MeshBasicMaterial({
  color: 0xfef08a
});
const lightMarker = new THREE.Mesh(lightMarkerGeometry, lightMarkerMaterial);
scene.add(lightMarker);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(3, 5, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.left = -6;
directionalLight.shadow.camera.right = 6;
directionalLight.shadow.camera.top = 6;
directionalLight.shadow.camera.bottom = -6;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 25;
scene.add(directionalLight);

lightMarker.position.copy(directionalLight.position);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  const currentAspect = sizes.width / sizes.height;

  perspectiveCamera.aspect = currentAspect;
  perspectiveCamera.updateProjectionMatrix();

  orthoCamera.left = (-frustumSize * currentAspect) / 2;
  orthoCamera.right = (frustumSize * currentAspect) / 2;
  orthoCamera.top = frustumSize / 2;
  orthoCamera.bottom = -frustumSize / 2;
  orthoCamera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("keydown", (event) => {
  if (event.code === "KeyP") {
    isOrthographic = !isOrthographic;
    activeCamera = isOrthographic ? orthoCamera : perspectiveCamera;
  }
});

const clock = new THREE.Clock();
let elapsed = 0;
let frameCount = 0;
let lastFpsUpdate = 0;
let currentFps = 0;

function animate(currentTime) {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  frameCount++;
  if (currentTime - lastFpsUpdate >= 1000) {
    currentFps = frameCount;
    frameCount = 0;
    lastFpsUpdate = currentTime;
  }

  elapsed += delta;

  cube.rotation.x += 0.35 * delta;
  cube.rotation.y += 0.8 * delta;

  sphere.rotation.y += 0.5 * delta;
  sphere.position.y = 0.75 + Math.sin(elapsed * 2.0) * 0.15;

  torus.rotation.x += 0.6 * delta;
  torus.rotation.y += 0.8 * delta;

  cone.rotation.y += 0.4 * delta;

  const lightRadius = 4.5;
  const lightSpeed = 0.8;
  directionalLight.position.x = Math.cos(elapsed * lightSpeed) * lightRadius;
  directionalLight.position.z = Math.sin(elapsed * lightSpeed) * lightRadius;
  directionalLight.position.y = 5.0 + Math.sin(elapsed * 0.5) * 0.5;
  lightMarker.position.copy(directionalLight.position);

  if (info) {
    info.innerHTML = `
      <div>Kamera: <b>${isOrthographic ? "Orthographic" : "Perspective"}</b></div>
      <div>Posisi Kamera: (${activeCamera.position.x.toFixed(1)}, ${activeCamera.position.y.toFixed(1)}, ${activeCamera.position.z.toFixed(1)})</div>
      <div>Objek di Scene: <b>${scene.children.length}</b> | Segitiga: <b>${renderer.info.render.triangles}</b></div>
      <div>FPS: <b>${currentFps || "--"}</b></div>
    `;
  }

  renderer.render(scene, activeCamera);
}

animate(0);
