import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";

export function Globe3D({ 
  className = "", 
  config = {}, 
  markers = [], 
  onMarkerClick, 
  onMarkerHover 
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. إنشاء المشهد والكاميرا
    const scene = new THREE.Scene();
    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.z = 320;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // مسح المكونات القديمة إن وجدت
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // 2. إضاءة المشهد
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(100, 100, 200);
    scene.add(dirLight);

    // 3. بناء مجسم الكرة الأرضية (ThreeGlobe)
    const globe = new ThreeGlobe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .htmlElementsData(markers)
      .htmlElement((d) => {
        const el = document.createElement("div");
        el.className = "group relative cursor-pointer flex items-center justify-center";
        el.style.transform = "translate(-50%, -50%)";

        const img = document.createElement("img");
        img.src = d.src || "https://assets.aceternity.com/avatars/1.webp";
        img.alt = d.label || "";
        img.className = "w-6 h-6 rounded-full border-2 border-white shadow-lg transition-transform group-hover:scale-125";

        const label = document.createElement("span");
        label.innerText = d.label || "";
        label.className = "absolute bottom-full mb-1 hidden group-hover:block text-[10px] bg-black/80 text-white font-bold px-2 py-0.5 rounded shadow whitespace-nowrap";

        el.appendChild(img);
        el.appendChild(label);

        if (onMarkerClick) {
          el.addEventListener("click", () => onMarkerClick(d));
        }
        if (onMarkerHover) {
          el.addEventListener("mouseenter", () => onMarkerHover(d));
          el.addEventListener("mouseleave", () => onMarkerHover(null));
        }

        return el;
      });

    // إعدادات الغلاف الجوي
    globe.showAtmosphere(true);
    globe.atmosphereColor(config.atmosphereColor || "#8A6BBE");
    globe.atmosphereAltitude(0.15);

    scene.add(globe);

    // 4. الدوران التلقائي للكرة الأرضية
    let animationFrameId;
    const animate = () => {
      globe.rotation.y += (config.autoRotateSpeed || 0.3) * 0.01;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // التعامل مع تغيير حجم الشاشة
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [markers, config]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full min-h-[350px] flex items-center justify-center ${className}`} 
    />
  );
}