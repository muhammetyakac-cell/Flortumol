import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ============================================================
   1. AURORA NEON WAVE SHADER — Full-screen liquid glass effect
   Organic pulsing aurora with neon waves, liquid blur morphing,
   and brand color light transitions rendered entirely on the GPU.
   ============================================================ */
function AuroraNeonWave() {
  const mat = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame(({ clock, pointer }) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = clock.getElapsedTime();
    // Smooth mouse tracking
    mouseRef.current.x += (pointer.x - mouseRef.current.x) * 0.03;
    mouseRef.current.y += (pointer.y - mouseRef.current.y) * 0.03;
    mat.current.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  return (
    <mesh position={[0, 0, -3]}>
      <planeGeometry args={[24, 18]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;
          uniform float uTime;
          uniform vec2 uMouse;
          varying vec2 vUv;

          // Simplex-inspired noise for organic turbulence
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }

          void main() {
            vec2 uv = vUv;
            float t = uTime * 0.15;

            // --- Coordinate warping with mouse influence ---
            vec2 p = (uv - 0.5) * 2.0;
            p += uMouse * 0.08;

            // Organic turbulent distortion using layered noise
            float n1 = snoise(vec3(p * 1.4, t * 0.8));
            float n2 = snoise(vec3(p * 2.6 + 3.0, t * 0.5));
            float n3 = snoise(vec3(p * 0.8 - 5.0, t * 0.3));

            p.x += n1 * 0.45 + sin(p.y * 2.5 + t * 1.1) * 0.25;
            p.y += n2 * 0.35 + cos(p.x * 2.2 - t * 0.8) * 0.25;

            float dist = length(p);

            // --- Aurora layers ---
            float aurora1 = smoothstep(0.0, 1.0, sin(p.x * 3.0 + n1 * 4.0 + t) * 0.5 + 0.5);
            float aurora2 = smoothstep(0.0, 1.0, cos(p.y * 2.5 + n2 * 3.5 - t * 0.7) * 0.5 + 0.5);
            float aurora3 = smoothstep(0.0, 1.0, sin((p.x + p.y) * 2.0 + n3 * 3.0 + t * 0.5) * 0.5 + 0.5);

            // --- Neon wave pulse bands ---
            float wave1 = smoothstep(0.42, 0.44, abs(sin(dist * 6.0 - t * 1.5 + n1 * 2.0)));
            float wave2 = smoothstep(0.44, 0.46, abs(sin(dist * 4.5 + t * 1.2 + n2 * 1.5)));
            float neonPulse = (wave1 + wave2) * 0.6;

            // --- Brand palette ---
            vec3 hotOrange = vec3(1.0, 0.478, 0.27);    // #ff7a45
            vec3 coralPink = vec3(1.0, 0.302, 0.427);   // #ff4d6d
            vec3 neonBlue  = vec3(0.231, 0.51, 0.965);  // #3b82f6
            vec3 deepViolet = vec3(0.545, 0.196, 0.878); // #8b32e0
            vec3 warmWhite = vec3(1.0, 0.92, 0.85);

            // --- Organic color composition ---
            vec3 col = mix(hotOrange, coralPink, aurora1);
            col = mix(col, neonBlue, aurora2 * 0.65);
            col = mix(col, deepViolet, aurora3 * 0.35);

            // Neon wave highlight
            col += warmWhite * neonPulse * 0.3;

            // Bright center glow (magnetic heart)
            float centerGlow = exp(-dist * dist * 1.2) * 0.5;
            col += warmWhite * centerGlow;

            // Mouse proximity glow
            vec2 mp = (uv - 0.5) * 2.0 - uMouse * 0.5;
            float mouseGlow = exp(-dot(mp, mp) * 3.0) * 0.3;
            col += coralPink * mouseGlow;

            // --- Vignette ---
            float vignette = smoothstep(1.8, 0.3, dist);

            // --- Final compositing ---
            float alpha = vignette * (0.42 + centerGlow * 0.5 + neonPulse * 0.15);
            col *= 1.15; // Slight boost for vibrancy

            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  );
}

/* ============================================================
   2. FLOATING SPARKLE PARTICLES — Bokeh-like glowing dots
   ============================================================ */
function FloatingParticles({ count = 220 }) {
  const mesh = useRef();

  const [positions, velocities, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const szs = new Float32Array(count);

    const palette = [
      new THREE.Color('#ff7a45'),
      new THREE.Color('#ff4d6d'),
      new THREE.Color('#3b82f6'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      vels[i * 3]     = (Math.random() - 0.5) * 0.003;
      vels[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.001;

      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3]     = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;

      szs[i] = Math.random() * 0.08 + 0.03;
    }
    return [pos, vels, cols, szs];
  }, [count]);

  useFrame(({ pointer, clock }) => {
    if (!mesh.current) return;
    const arr = mesh.current.geometry.attributes.position.array;
    const time = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      arr[i * 3]     += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];

      // Breathing movement
      arr[i * 3 + 1] += Math.sin(time * 0.5 + i * 0.3) * 0.0005;

      if (Math.abs(arr[i * 3]) > 8)     velocities[i * 3] *= -1;
      if (Math.abs(arr[i * 3 + 1]) > 6) velocities[i * 3 + 1] *= -1;
      if (Math.abs(arr[i * 3 + 2]) > 4) velocities[i * 3 + 2] *= -1;

      arr[i * 3]     += pointer.x * 0.0003;
      arr[i * 3 + 1] += pointer.y * 0.0003;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y += 0.0003;
    mesh.current.rotation.z += 0.00015;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        transparent
        opacity={0.75}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ============================================================
   3. ORBITING GLOW RINGS — Neon orbital halos
   ============================================================ */
function GlowRing({ radius, color, speed, tilt }) {
  const ringRef = useRef();

  const points = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius,
        0
      ));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime() * speed;
    ringRef.current.rotation.z = t;
    ringRef.current.rotation.x = tilt;
    ringRef.current.rotation.y = t * 0.3;
  });

  return (
    <line ref={ringRef} geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        linewidth={1}
      />
    </line>
  );
}

/* ============================================================
   4. MOUSE-REACTIVE DYNAMIC LIGHT
   ============================================================ */
function MouseLight() {
  const lightRef = useRef();

  useFrame(({ pointer, viewport }) => {
    if (!lightRef.current) return;
    const x = (pointer.x * viewport.width) / 2;
    const y = (pointer.y * viewport.height) / 2;
    lightRef.current.position.set(x, y, 2);
  });

  return <pointLight ref={lightRef} intensity={4} distance={14} color="#ff4d6d" decay={2} />;
}

/* ============================================================
   MAIN CANVAS — Composites all visual layers
   ============================================================ */
export default function HeroCanvas() {
  return (
    <div
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{ 
        zIndex: 0,
        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 65 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
      >
        {/* Ambient fill */}
        <ambientLight intensity={0.3} />

        {/* Accent lights */}
        <pointLight position={[8, 6, 4]}  intensity={2}   color="#ff7a45" />
        <pointLight position={[-8, -5, 3]} intensity={1.5} color="#3b82f6" />
        <pointLight position={[0, 8, 3]}  intensity={1}   color="#a855f7" />

        {/* Mouse-reactive light */}
        <MouseLight />

        {/* Layer 1: Aurora neon wave shader (farthest back) */}
        <AuroraNeonWave />

        {/* Layer 2: Orbital glow rings */}
        <GlowRing radius={3.2} color="#ff7a45" speed={0.08} tilt={1.1} />
        <GlowRing radius={4.0} color="#ff4d6d" speed={-0.06} tilt={0.7} />
        <GlowRing radius={2.5} color="#3b82f6" speed={0.1} tilt={1.5} />

        {/* Layer 3: Sparkle particles (foreground) */}
        <FloatingParticles count={220} />
      </Canvas>
    </div>
  );
}
