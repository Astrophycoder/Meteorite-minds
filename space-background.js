import * as THREE from 'three';

// A reusable function to create the animated space background
export function createSpaceBackground(canvasId) {
    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById(canvasId),
        antialias: true,
        alpha: true // Make canvas transparent to show background color from CSS
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 10;

    // --- Starfield ---
    const starVertices = [];
    for (let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 1) * 1000;
        starVertices.push(x, y, z);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        opacity: 0.8
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // --- Asteroids ---
    const asteroidGeometry = new THREE.DodecahedronGeometry(1, 0);
    const asteroidMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        roughness: 0.8,
        metalness: 0.5
    });
    for (let i = 0; i < 50; i++) {
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        const z = (Math.random() - 1) * 500;
        asteroid.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, z);
        asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        const scale = Math.random() * 0.5 + 0.2;
        asteroid.scale.set(scale, scale, scale);
        scene.add(asteroid);
    }

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // --- Animation Control ---
    // We expose cameraSpeed so it can be controlled from the main HTML file
    const animationControls = {
        cameraSpeed: 0.005,
        baseSpeed: 0.005,
        boostSpeed: 0.15
    };

    function animate() {
        requestAnimationFrame(animate);
        camera.position.z -= animationControls.cameraSpeed;
        if (camera.position.z < -200) camera.position.z = 200;
        stars.position.z = camera.position.z * 0.01; // Parallax effect
        renderer.render(scene, camera);
    }
    animate();

    // --- Resize Listener ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Return the controls so the main script can change the speed
    return animationControls;
}