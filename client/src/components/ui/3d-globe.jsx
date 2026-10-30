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
    const container = containerRef.current;
    if (!container) return undefined;

    // 1. إنشاء المشهد والكاميرا
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.z = 320;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // مسح المكونات القديمة إن وجدت
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

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

        const marker = d.src ? document.createElement("img") : document.createElement("span");
        if (d.src) {
          marker.src = d.src;
          marker.alt = d.label || "";
        }
        marker.className = d.src
          ? "w-6 h-6 rounded-full border-2 border-white shadow-lg transition-transform group-hover:scale-125"
          : "block h-2.5 w-2.5 rounded-full border-2 border-white bg-[#F59E42] shadow-lg transition-transform group-hover:scale-125";

        const label = document.createElement("span");
        label.innerText = d.label || "";
        label.className = "absolute bottom-full mb-1 hidden group-hover:block text-[10px] bg-black/80 text-white font-bold px-2 py-0.5 rounded shadow whitespace-nowrap";

        el.appendChild(marker);
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
    globe.atmosphereColor(config.atmosphereColor || "#F59E42");
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
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container.innerHTML = "";
    };
  }, [markers, config]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full min-h-[350px] flex items-center justify-center ${className}`} 
    />
  );
}