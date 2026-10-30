import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const FirstAidKit3D = ({ isDark, reduceMotion }) => {
  // ALL hook declarations at top level - called in same order on every render
  const containerRef = useRef(null);
  const clock = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (reduceMotion) return;

    const container = containerRef.current;
    if (!container) return;

    // === Color scheme ===
    const ambientColor = isDark ? '#173D35' : '#24483F';
    const keyLightColor = isDark ? '#E88736' : '#F59E42';

    // === Three.js setup ===
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    camera.position.set(0, 1.8, 3.2);
    camera.lookAt(0, 0, 0);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(ambientColor, 0.5);
    scene.add(ambientLight);

    // Key light (warm orange)
    const keyLight = new THREE.DirectionalLight(keyLightColor, 1);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight('#FFFFFF', 0.3);
    fillLight.position.set(-3, -3, -3);
    scene.add(fillLight);

    // === First-Aid Kit Body ===
    const kitBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 1.1, 0.7),
      new THREE.MeshStandardMaterial({
        color: isDark ? '#0A1712' : '#173D35',
        roughness: 0.35,
        metalness: 0.02,
      })
    );
    kitBody.position.y = 0.12;
    kitBody.castShadow = true;
    kitBody.receiveShadow = true;
    scene.add(kitBody);

    // === Lid ===
    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.08, 0.7),
      new THREE.MeshStandardMaterial({
        color: '#24483F',
        roughness: 0.5,
        metalness: 0.02,
      })
    );
    lid.position.y = 0.6;
    lid.castShadow = true;
    scene.add(lid);

    // === Medical Cross ===
    const crossGroup = new THREE.Group();
    const crossBarThickness = 0.16;
    const crossTotalHeight = 0.85;

    const verticalBar = new THREE.Mesh(
      new THREE.BoxGeometry(crossBarThickness, crossTotalHeight, 0.05),
      new THREE.MeshStandardMaterial({ color: keyLightColor, roughness: 0.9, metalness: 0.0 })
    );
    verticalBar.position.z = 0.22;
    verticalBar.position.y = crossTotalHeight * 0.18;
    verticalBar.castShadow = true;
    crossGroup.add(verticalBar);

    const horizontalBar = new THREE.Mesh(
      new THREE.BoxGeometry(crossTotalHeight, crossBarThickness, 0.05),
      new THREE.MeshStandardMaterial({ color: keyLightColor, roughness: 0.9, metalness: 0.0 })
    );
    horizontalBar.position.z = 0.22;
    horizontalBar.position.y = -crossBarThickness * 0.5;
    horizontalBar.castShadow = true;
    crossGroup.add(horizontalBar);

    crossGroup.position.y = 0.15;
    crossGroup.rotation.z = 0.12;
    scene.add(crossGroup);

    // === Bandages (3 rolling bandages) ===
    for (let i = 0; i < 3; i++) {
      const bandage = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03 + i * 0.02, 0.05 + i * 0.02, 0.45 + i * 0.08, 6),
        new THREE.MeshStandardMaterial({ color: '#FF6B6B', roughness: 0.95, metalness: 0.0 })
      );
      bandage.position.set((i - 1) * 0.35, -0.1 + i * 0.03, 0.1);
      bandage.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.25;
      bandage.castShadow = true;
      scene.add(bandage);
    }

    // === Medical Glove ===
    const glove = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 14, 14),
      new THREE.MeshStandardMaterial({ color: '#FFD09A', roughness: 0.75, metalness: 0.15 })
    );
    glove.position.set(0.55, 0.08, -0.05);
    glove.castShadow = true;
    scene.add(glove);

    // === Gauze Pads ===
    const gauzeMaterial = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      opacity: 0.82,
      transparent: true,
      roughness: 0.6,
      depthWrite: false,
    });

    const gauze1 = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.16),
      gauzeMaterial.clone()
    );
    gauze1.position.set(-0.55, 0.25, 0.02);
    gauze1.rotation.x = 0.15;
    gauze1.castShadow = true;
    scene.add(gauze1);

    const gauze2 = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.13),
      gauzeMaterial.clone()
    );
    gauze2.position.set(0.6, 0.15, 0.01);
    gauze2.rotation.y = 0.08;
    gauze2.castShadow = true;
    scene.add(gauze2);

    // === Animation Loop ===
    const animate = (time) => {
      clock.current = time;
      const delta = Math.min(0.016, (time - (clock.current - 0.016 || 0)));

      // Gentle rotation of cross and subtle float of bandages
      crossGroup.rotation.z = Math.sin(time * 0.12) * 0.07;
      crossGroup.rotation.x = Math.cos(time * 0.07) * 0.035;

      if (renderer && container.parentElement) {
        renderer.render(scene, camera);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // === Resize Handler ===
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // === Cleanup on unmount ===
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reduceMotion, isDark]);

  return null;
};

export default FirstAidKit3D;