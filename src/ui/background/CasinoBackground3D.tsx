import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CasinoBackground3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    
    // CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    // Cap pixel ratio for performance on high DPI screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Guarantee no interaction sweeps happen underneath UI layer
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.setAttribute('data-testid', 'casino-bg-canvas');
    containerRef.current.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xd4af37, 0.8); // Gold tint
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xcc00ff, 0.5); // Purple tint
    dirLight2.position.set(-10, -20, 15);
    scene.add(dirLight2);

    // OBJECTS
    const tileCount = 350;

    // 1. Floating Tiles (InstancedMesh)
    const tileGeom = new THREE.BoxGeometry(1.4, 2.0, 0.8); // Mahjong tile aspect ratio
    
    // Low performance material mapping Casino Theme
    const tileMat = new THREE.MeshStandardMaterial({ 
      color: 0x2a114a, // Dark purple base
      roughness: 0.7,
      metalness: 0.3,
      emissive: 0x150524
    });

    const tileMesh = new THREE.InstancedMesh(tileGeom, tileMat, tileCount);
    
    const dummy = new THREE.Object3D();
    const tileData: { speed: number, rotSpeedX: number, rotSpeedY: number, rotSpeedZ: number }[] = [];

    for (let i = 0; i < tileCount; i++) {
      // Random positions in a volume chunk
      dummy.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40 - 10
      );
      
      // Random rotations
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Random scale variation
      const scale = 0.3 + Math.random() * 0.9;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      tileMesh.setMatrixAt(i, dummy.matrix);

      // Store randomized individual animation data
      tileData.push({
        speed: 0.01 + Math.random() * 0.03,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.02
      });
    }
    
    // Add subtle tint colors to some tiles (gold, magenta) overriding standard material
    const color = new THREE.Color();
    for (let i = 0; i < tileCount; i++) {
        const rand = Math.random();
        if (rand < 0.2) color.setHex(0xd4af37); // Gold
        else if (rand < 0.4) color.setHex(0xcc00ff); // Magenta
        else color.setHex(0x3a1b6a); // Purple
        tileMesh.setColorAt(i, color);
    }
    if (tileMesh.instanceColor) tileMesh.instanceColor.needsUpdate = true;

    scene.add(tileMesh);

    // MOUSE PARALLAX
    let mouseX = 0;
    let mouseY = 0;
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
        // Normalize mouse coordinates to [-1, 1]
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Target camera displacement magnitude
        targetCamera.x = mouseX * 2;
        targetCamera.y = mouseY * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // RESIZE HANDLING
    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let animationFrameId: number;
    let lastTime = 0;
    // Target 60fps max, but allow drop to 30 gracefully. Math dictates 16.6ms intervals.
    const fpsInterval = 1000 / 60; 

    const animate = (time: number) => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsed = time - lastTime;
        if (elapsed < fpsInterval) return; // Throttle slightly
        lastTime = time - (elapsed % fpsInterval);

        // Update InstancedMesh Tiles (slow rotation and Y-float)
        for (let i = 0; i < tileCount; i++) {
            tileMesh.getMatrixAt(i, dummy.matrix);
            dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
            
            // Float up slowly vector
            dummy.position.y += tileData[i].speed;
            
            // Wrap around reset bounds
            if (dummy.position.y > 40) {
                dummy.position.y = -40;
                dummy.position.x = (Math.random() - 0.5) * 80;
            }

            // Spin rotations
            dummy.rotation.x += tileData[i].rotSpeedX;
            dummy.rotation.y += tileData[i].rotSpeedY;
            dummy.rotation.z += tileData[i].rotSpeedZ;

            dummy.updateMatrix();
            tileMesh.setMatrixAt(i, dummy.matrix);
        }
        tileMesh.instanceMatrix.needsUpdate = true;

        // Parallax Camera Interpolation (smooth non-linear dampening)
        camera.position.x += (targetCamera.x - camera.position.x) * 0.02;
        camera.position.y += (targetCamera.y - camera.position.y) * 0.02;
        // Keep camera looking dead center
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    // Ignite loop
    animate(performance.now());

    // DESTRUCTOR CLEANUP
    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
        
        // Dispose Three.js memory allocations
        tileGeom.dispose();
        tileMat.dispose();
        
        renderer.dispose();
        if (containerRef.current && renderer.domElement.parentNode) {
            containerRef.current.removeChild(renderer.domElement);
        }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />;
};

export default CasinoBackground3D;
