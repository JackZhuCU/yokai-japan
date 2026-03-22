/* 3d render */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('yokai-3d-canvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  const GLB_URL = 'https://raw.githubusercontent.com/JackZhuCU/jack/791eeb800f9e3e5e0419c2ad1a32fd66ca3ce9f5/bleu_de_chanel_perfume..glb';

  const scene = new THREE.Scene();
  scene.background = null;
  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envMap = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envMap;
  pmremGenerator.dispose();

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);
  const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
  keyLight.position.set(3, 4, 2);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xe6f0ff, 1.5);
  fillLight.position.set(-3, 2, -1);
  scene.add(fillLight);
  const rimLight = new THREE.DirectionalLight(0xffffff, 1.0);
  rimLight.position.set(0, 3, -3);
  scene.add(rimLight);

  let model = null;
  let modelGroup = new THREE.Group();
  scene.add(modelGroup);

  const loader = new GLTFLoader();
  let rotationProgress = { value: 0 };
  let entranceProgress = { value: 0 };

  loader.load(GLB_URL, (gltf) => {
    model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        if (mat.transmission !== undefined && mat.transmission > 0.3) {
          mat.transmission = Math.min(mat.transmission, 0.3);
          mat.roughness = Math.max(mat.roughness, 0.15);
          mat.thickness = Math.min(mat.thickness || 0, 0.5);
        }
        if (mat.transparent && mat.opacity < 0.8) {
          mat.opacity = Math.max(mat.opacity, 0.85);
        }
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    model.position.x = -center.x;
    model.position.y = -center.y;
    model.position.z = -center.z;
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    model.scale.setScalar(scale);
    modelGroup.add(model);

    const newBox = new THREE.Box3().setFromObject(model);
    const newCenter = newBox.getCenter(new THREE.Vector3());
    camera.position.set(0, newCenter.y, 5);
    camera.lookAt(newCenter);

    modelGroup.position.y = -5;
    gsap.to(entranceProgress, {
      value: 1, ease: 'none',
      scrollTrigger: { trigger: '._3d-scene', start: 'top bottom', end: '20% top', scrub: 3 },
    });
    gsap.to(rotationProgress, {
      value: 1, ease: 'none',
      scrollTrigger: { trigger: '._3d-scene', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });
  }, undefined, (error) => {
    console.error('YOKAI 3D: Failed to load model', error);
  });

  function animate() {
    requestAnimationFrame(animate);
    if (model) {
      model.rotation.y = rotationProgress.value * Math.PI * 2;
      const eased = 1 - Math.pow(1 - entranceProgress.value, 4);
      modelGroup.position.y = -5 * (1 - eased);
    }
    renderer.render(scene, camera);
  }
  animate();

  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);
});
