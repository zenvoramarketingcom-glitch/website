import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface ThreeBackdropProps {
  scrollProgress: number;
  activeServiceIndex?: number;
  className?: string;
}

const _targetRot = new THREE.Vector3();

export function ThreeBackdrop({
  scrollProgress,
  activeServiceIndex = 0,
  className = '',
}: ThreeBackdropProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(scrollProgress);
  const serviceIndexRef = useRef(activeServiceIndex);
  const requestRenderRef = useRef<(() => void) | null>(null);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    progressRef.current = scrollProgress;
    serviceIndexRef.current = activeServiceIndex;
    requestRenderRef.current?.();
  }, [scrollProgress, activeServiceIndex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setContextLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    renderer.setClearColor(0xf8fafc, 1);

    const width = container.clientWidth || 1280;
    const height = container.clientHeight || 720;
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    scene.fog = new THREE.Fog(0xf8fafc, 14, 30);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 50);
    camera.position.set(0, 0, 7.6);

    const hemiLight = new THREE.HemisphereLight(0xf0f9ff, 0xe2e8f0, 1.4);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.75);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.15);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    // Composite 7-part architectural spatial sculpture framing the viewport flanks
    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const matteCeramic = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.48,
      metalness: 0.25,
    });
    const brushedCobalt = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      roughness: 0.2,
      metalness: 0.85,
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
    });
    const warmCopper = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      roughness: 0.25,
      metalness: 0.8,
    });
    const frostedSlate = new THREE.MeshPhysicalMaterial({
      color: 0x64748b,
      roughness: 0.22,
      metalness: 0.35,
      transparent: true,
      opacity: isSoftwareGl ? 0.55 : 0.72,
      clearcoat: 0.9,
    });

    // Primary architectural stepped frames positioned cleanly on left & right flanks
    const frameGeo = new THREE.BoxGeometry(1.15, 2.1, 0.22);
    const frameBack = new THREE.Mesh(frameGeo, matteCeramic);
    frameBack.position.set(-3.85, 0.25, -0.2);
    sculpture.add(frameBack);

    const frameMid = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.9, 0.22), frostedSlate);
    frameMid.position.set(3.85, -0.25, 0.0);
    sculpture.add(frameMid);

    // Precision orbital ring
    const ringGeo = new THREE.TorusGeometry(3.25, 0.075, 16, 72);
    const orbitalRing = new THREE.Mesh(ringGeo, brushedCobalt);
    orbitalRing.rotation.x = Math.PI * 0.35;
    orbitalRing.rotation.y = Math.PI * 0.15;
    sculpture.add(orbitalRing);

    // Secondary accent ring
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.75, 0.045, 12, 56),
      warmCopper,
    );
    innerRing.rotation.x = -Math.PI * 0.28;
    sculpture.add(innerRing);

    // Accent geometric pillars
    const pillarGeo = new THREE.CylinderGeometry(0.13, 0.13, 2.8, 20);
    const pillarLeft = new THREE.Mesh(pillarGeo, brushedCobalt);
    pillarLeft.position.set(-4.35, -0.1, 0.35);
    sculpture.add(pillarLeft);

    const pillarRight = new THREE.Mesh(pillarGeo, warmCopper);
    pillarRight.position.set(4.35, 0.15, 0.35);
    sculpture.add(pillarRight);

    // Focal faceted core
    const coreGeo = new THREE.OctahedronGeometry(0.55, 0);
    const coreMesh = new THREE.Mesh(coreGeo, warmCopper);
    coreMesh.position.set(3.55, 1.45, 0.6);
    sculpture.add(coreMesh);

    const disposables = [
      frameGeo,
      frameMid.geometry,
      ringGeo,
      innerRing.geometry,
      pillarGeo,
      coreGeo,
      matteCeramic,
      brushedCobalt,
      warmCopper,
      frostedSlate,
      envTex,
    ];

    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let currentRotX = 0.12;
    let currentRotY = -0.3;
    let currentPosY = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;

      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;

        const p = progressRef.current;
        const sIdx = serviceIndexRef.current;
        _targetRot.set(
          0.14 + p * 0.65,
          -0.35 + p * Math.PI * 1.1 + sIdx * 0.28,
          Math.sin(p * Math.PI) * 0.18,
        );

        const dampFactor = prefersReducedMotion ? 1 : 0.22;
        currentRotX = THREE.MathUtils.lerp(currentRotX, _targetRot.x, dampFactor);
        currentRotY = THREE.MathUtils.lerp(currentRotY, _targetRot.y, dampFactor);
        currentPosY = THREE.MathUtils.lerp(currentPosY, Math.sin(p * Math.PI * 2) * 0.18, dampFactor);

        sculpture.rotation.set(currentRotX, currentRotY, _targetRot.z);
        sculpture.position.y = currentPosY;
        orbitalRing.rotation.z = p * Math.PI * 0.85;
        innerRing.rotation.y = -p * Math.PI * 1.2;
        coreMesh.rotation.y = p * Math.PI * 2;
        coreMesh.rotation.x = p * Math.PI;

        renderer.render(scene, camera);

        const settled =
          Math.abs(currentRotX - _targetRot.x) < 0.004 &&
          Math.abs(currentRotY - _targetRot.y) < 0.004;

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || (!settled && !prefersReducedMotion))) {
            requestRender();
          }
        };

        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    requestRenderRef.current = requestRender;
    requestRender();

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
      requestRender();
    };

    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      for (const item of disposables) {
        item.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (contextLost) {
    return (
      <div
        className={`pointer-events-none rounded-2xl bg-gradient-to-br from-blue-50 via-slate-50 to-orange-50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={mountRef}
      data-testid="three-backdrop"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
