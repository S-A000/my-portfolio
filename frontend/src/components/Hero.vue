<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

const canvasContainer = ref(null);
let animationId = null;

onMounted(() => {
  // Setup Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  if(canvasContainer.value) {
      canvasContainer.value.appendChild(renderer.domElement);
  }

  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1000;
  
  const posArray = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    // Spread particles throughout the space
    posArray[i] = (Math.random() - 0.5) * 15;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  // Custom glowing material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);
  
  camera.position.z = 5;

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
  }

  document.addEventListener('mousemove', onDocumentMouseMove);

  // Resize handler
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onWindowResize);

  // Animation loop
  const clock = new THREE.Clock();

  const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Gentle floating
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;
    
    // Wave effect
    const positions = particlesMesh.geometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        positions[i3 + 2] += Math.sin(elapsedTime + x) * 0.01;
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;
    
    // Mouse wobble
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate();

  onBeforeUnmount(() => {
     window.removeEventListener('resize', onWindowResize);
     document.removeEventListener('mousemove', onDocumentMouseMove);
     cancelAnimationFrame(animationId);
     if(canvasContainer.value && renderer.domElement && canvasContainer.value.contains(renderer.domElement)){
         canvasContainer.value.removeChild(renderer.domElement);
     }
     particlesGeometry.dispose();
     particlesMaterial.dispose();
     renderer.dispose();
  });
});
</script>

<template>
  <div class="relative min-h-screen flex items-center overflow-hidden">
    <!-- 3D Canvas Background -->
    <div ref="canvasContainer" class="absolute inset-0 z-0 pointer-events-none opacity-60"></div>
    
    <!-- Content Foreground -->
    <section class="relative z-10 w-full pt-32 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div class="inline-block px-4 py-1.5 mb-6 glass rounded-full text-xs font-medium text-blue-400 uppercase tracking-widest animate-pulse shadow-[0_0_15px_rgba(96,165,250,0.5)]">
            Available for Projects
        </div>
        
        <h2 class="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
            Building the future with <br>
            <span class="gradient-text animate-text bg-[length:200%_auto]">AI & Data Intelligence</span>
        </h2>
        
        <p class="text-gray-300 text-lg max-w-2xl mx-auto mb-10 drop-shadow-md">
            Computer Science student specializing in LLMs, Deep Learning, and End-to-End ML Pipelines. Currently developing enterprise-grade AI detection systems.
        </p>
        
        <div class="flex justify-center space-x-6 text-2xl mb-12">
            <a href="https://github.com/S-A000" class="text-gray-400 hover:text-white hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"><i class="fa-brands fa-github"></i></a>
            <a href="https://www.linkedin.com/in/abdullah-bin-masood-0b25103b4/" class="text-gray-400 hover:text-blue-400 hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]"><i class="fa-brands fa-linkedin"></i></a>
            <a href="mailto:abinemasood814@gmail.com" class="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(244,114,182,0.3)]"><i class="fa-solid fa-envelope"></i></a>
            <a href="https://pypi.org/project/sam_eda/" target="_blank" class="text-gray-400 hover:text-yellow-400 hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]" title="View SAM_EDA on PyPI">
                <i class="fa-solid fa-cube"></i>
            </a>
        </div>
    </section>

    <!-- Scroll down indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10 text-gray-500">
        <i class="fa-solid fa-chevron-down"></i>
    </div>
  </div>
</template>

<style scoped>
@keyframes text-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-text {
  animation: text-gradient 8s linear infinite;
}
</style>
