// 3D shots for "লিবিয়া হয়ে ইউরোপ" (sample). Rendered to MP4 on their own (WebGL), then cut into the main edit.
// LibyaGlobe: Chuadanga → Dhaka → Dubai → Cairo → Benghazi → Tripoli on a Blue Marble globe.
// LibyaMed:   Libyan coast → Lampedusa on Sentinel-2 terrain with a moving boat light.
// LibyaSea:   night sea, a small crowded wooden boat (silhouettes only), moon glitter.
import "./fonts";
import React, { useEffect, useMemo, useState } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const A = (f: string) => staticFile(`libya/ep0/${f}`);
export const bn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
export const bnInt = (n: number) => bn(Math.round(n).toLocaleString("en-IN"));

// ---------- shared helpers ----------
const sphere = (lon: number, lat: number, r = 1) => {
  const phi = ((lon + 180) * Math.PI) / 180, th = ((90 - lat) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.cos(phi) * Math.sin(th), r * Math.cos(th), r * Math.sin(phi) * Math.sin(th));
};
export const km = (a: [number, number], b: [number, number]) => {
  const R = 6371, t = Math.PI / 180, dla = (b[1] - a[1]) * t, dlo = (b[0] - a[0]) * t;
  const h = Math.sin(dla / 2) ** 2 + Math.cos(a[1] * t) * Math.cos(b[1] * t) * Math.sin(dlo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
function useAsset<T>(load: () => Promise<T>) {
  const [v, setV] = useState<T | null>(null);
  const [h] = useState(() => delayRender("libya asset"));
  useEffect(() => { load().then((x) => { setV(x); continueRender(h); }); }, []); // eslint-disable-line
  return v;
}
const loadTex = (url: string) => new Promise<THREE.Texture>((res) => new THREE.TextureLoader().load(url, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; res(t); }));
const loadImgData = (url: string) => new Promise<ImageData>((res) => {
  const im = new Image(); im.crossOrigin = "anonymous";
  im.onload = () => { const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const x = c.getContext("2d")!; x.drawImage(im, 0, 0); res(x.getImageData(0, 0, im.width, im.height)); };
  im.src = url;
});
const CameraRig: React.FC<{ pos: THREE.Vector3; target: THREE.Vector3; fov: number; up?: THREE.Vector3 }> = ({ pos, target, fov, up }) => {
  const { camera } = useThree();
  camera.position.copy(pos); camera.up.copy(up ?? new THREE.Vector3(0, 1, 0)); camera.lookAt(target);
  const c = camera as THREE.PerspectiveCamera; c.fov = fov; c.near = 0.002; c.far = 400; c.updateProjectionMatrix();
  return null;
};
const project = (pos: THREE.Vector3, target: THREE.Vector3, up: THREE.Vector3, fov: number, aspect: number, p: THREE.Vector3) => {
  const c = new THREE.PerspectiveCamera(fov, aspect, 0.002, 400); c.position.copy(pos); c.up.copy(up); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = p.clone().project(c); return { x: (v.x + 1) / 2, y: (1 - v.y) / 2, vis: v.z < 1 };
};
const rnd = (s: number) => { const x = Math.sin(s * 12.9898) * 43758.5453; return x - Math.floor(x); };
const Stars: React.FC<{ n?: number; r?: number; size?: number }> = ({ n = 2600, r = 60, size = 0.09 }) => {
  const geo = useMemo(() => {
    const p = new Float32Array(n * 3), c = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = rnd(i + 1) * 2 - 1, t = rnd(i + 7.3) * Math.PI * 2, s = Math.sqrt(1 - u * u);
      p.set([r * s * Math.cos(t), r * Math.abs(u), r * s * Math.sin(t)], i * 3);
      const b = 0.3 + 0.7 * Math.pow(rnd(i + 3.1), 3); c.set([b, b, b * 1.06], i * 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3)); g.setAttribute("color", new THREE.BufferAttribute(c, 3)); return g;
  }, [n, r]);
  return <points geometry={geo}><pointsMaterial size={size} vertexColors sizeAttenuation transparent opacity={0.85} depthWrite={false} /></points>;
};
const smooth = (x: number) => x * x * (3 - 2 * x);
type Key = { t: number; [k: string]: number };
const keyed = (keys: Key[], t: number, k: string) => {
  if (t <= keys[0].t) return keys[0][k];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) return a[k] + (b[k] - a[k]) * smooth((t - a.t) / (b.t - a.t));
  }
  return keys[keys.length - 1][k];
};
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

// DOM label with a stem and a dot. side: c (above), l (to the left), r (to the right)
export const Pin: React.FC<{ x: number; y: number; text: string; sub?: string; o: number; color?: string; side?: "c" | "l" | "r" }> = ({ x, y, text, sub, o, color = "#ffcf6b", side = "c" }) => {
  if (o <= 0.001) return null;
  const tr = side === "c" ? "translate(-50%, -100%)" : side === "l" ? "translate(calc(-100% + 9px), -100%)" : "translate(-9px, -100%)";
  const align = side === "c" ? "center" : side === "l" ? "flex-end" : "flex-start";
  return (
    <div style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, opacity: o, transform: `${tr} translateY(${(1 - o) * 16}px)` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: align }}>
        <div style={{ fontFamily: "Anek Bangla", fontWeight: 800, fontSize: 60, lineHeight: 1.15, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,.95), 0 0 3px #000", whiteSpace: "nowrap" }}>{text}</div>
        {sub ? <div style={{ fontFamily: "Hind Siliguri", fontWeight: 600, fontSize: 34, color: "#ead9b4", marginTop: 0, textShadow: "0 2px 10px #000, 0 0 2px #000", whiteSpace: "nowrap" }}>{sub}</div> : null}
        <div style={{ width: 2, height: 52, background: `linear-gradient(${color}, ${color}00)`, marginTop: 8, marginLeft: side === "r" ? 7 : 0, marginRight: side === "l" ? 7 : 0 }} />
        <div style={{ width: 16, height: 16, borderRadius: 9, background: color, boxShadow: `0 0 20px 7px ${color}88`, marginTop: -2 }} />
      </div>
    </div>
  );
};
const Grade: React.FC<{ v?: number }> = ({ v = 0.55 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 50% 48%, transparent 45%, rgba(2,4,10,${v}) 100%)` }} />
);

const atmoMat = () => new THREE.ShaderMaterial({
  side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  vertexShader: `varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vP = mv.xyz; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `varying vec3 vN; varying vec3 vP; void main(){ float f = pow(clamp(0.74 - dot(vN, normalize(vP)), 0., 1.), 3.0); gl_FragColor = vec4(0.32,0.55,1.0,1.0)*f*1.15; }`,
});

// ---------- 1. Globe route ----------
export const P = {
  chua: [88.95, 23.76] as [number, number], dac: [90.40, 23.84] as [number, number], dxb: [55.36, 25.25] as [number, number],
  cai: [31.41, 30.12] as [number, number], ben: [20.27, 32.10] as [number, number], tip: [13.19, 32.89] as [number, number],
};
const ROAD: [number, number][] = [P.ben, [20.07, 31.2], [20.22, 30.76], [19.2, 30.4], [17.9, 30.9], [16.59, 31.21], [15.6, 31.6], [15.09, 32.38], [14.3, 32.6], [13.6, 32.8], P.tip];
export const GLOBE_LEN = 861;
const GK: Key[] = [
  { t: 0, lon: 70, lat: 21, d: 3.3, tilt: 0.25, fov: 34 },
  { t: 4.6, lon: 89.7, lat: 23.6, d: 1.3, tilt: 0.3, fov: 34 },
  { t: 11.6, lon: 89.9, lat: 23.6, d: 1.24, tilt: 0.36, fov: 34 },
  { t: 15.0, lon: 76, lat: 24.5, d: 1.95, tilt: 0.3, fov: 34 },
  { t: 17.0, lon: 57, lat: 26.5, d: 1.75, tilt: 0.3, fov: 34 },
  { t: 18.6, lon: 40, lat: 29.5, d: 1.75, tilt: 0.3, fov: 34 },
  { t: 20.4, lon: 22, lat: 31.2, d: 1.5, tilt: 0.33, fov: 34 },
  { t: 24.6, lon: 20.4, lat: 31.6, d: 1.4, tilt: 0.35, fov: 34 },
  { t: 28.7, lon: 16.4, lat: 31.9, d: 1.27, tilt: 0.38, fov: 34 },
];
const arcPts = (a: [number, number], b: [number, number], lift: number, n = 160) => {
  const va = sphere(...a).normalize(), vb = sphere(...b).normalize(); const ang = va.angleTo(vb);
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n; const v = new THREE.Vector3().copy(va).multiplyScalar(Math.sin((1 - t) * ang) / Math.sin(ang)).add(vb.clone().multiplyScalar(Math.sin(t * ang) / Math.sin(ang)));
    return v.normalize().multiplyScalar(1.002 + lift * ang * Math.sin(Math.PI * t));
  });
};
const roadPts = (pts: [number, number][]) => {
  const c = new THREE.CatmullRomCurve3(pts.map((p) => sphere(...p, 1.0025))); return c.getPoints(200);
};
const Trail: React.FC<{ pts: THREE.Vector3[]; p: number; color: string; r: number; glow?: string }> = ({ pts, p, color, r, glow }) => {
  const geo = useMemo(() => {
    if (p <= 0.002) return null;
    const n = Math.max(2, Math.round(pts.length * p)); const sub = pts.slice(0, n);
    if (sub.length < 2) return null;
    const c = new THREE.CatmullRomCurve3(sub);
    return [new THREE.TubeGeometry(c, Math.max(8, n * 2), r, 6, false), new THREE.TubeGeometry(c, Math.max(8, n * 2), r * 2.5, 8, false)];
  }, [pts, p, r]);
  if (!geo) return null;
  const head = pts[Math.min(pts.length - 1, Math.max(0, Math.round(pts.length * p) - 1))];
  return (
    <group>
      <mesh geometry={geo[0]}><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      <mesh geometry={geo[1]}><meshBasicMaterial color={glow ?? color} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      {p < 0.999 ? <mesh position={head}><sphereGeometry args={[r * 3.2, 16, 16]} /><meshBasicMaterial color="#fff6dc" toneMapped={false} /></mesh> : null}
    </group>
  );
};
export const LibyaGlobe: React.FC = () => {
  const f = useCurrentFrame(); const { width, height, fps } = useVideoConfig(); const t = f / fps;
  const tex = useAsset(() => loadTex(A("geo/earth.jpg")));
  const atmo = useMemo(atmoMat, []);
  const arcs = useMemo(() => ({
    land: arcPts(P.chua, P.dac, 0.02, 60), dxb: arcPts(P.dac, P.dxb, 0.16), cai: arcPts(P.dxb, P.cai, 0.16), ben: arcPts(P.cai, P.ben, 0.16), road: roadPts(ROAD),
  }), []);
  const lon = keyed(GK, t, "lon"), lat = keyed(GK, t, "lat"), d = keyed(GK, t, "d"), tilt = keyed(GK, t, "tilt"), fov = keyed(GK, t, "fov");
  const n = sphere(lon, lat).normalize(); const up0 = new THREE.Vector3(0, 1, 0);
  const north = up0.clone().sub(n.clone().multiplyScalar(up0.dot(n))).normalize();
  const pos = n.clone().multiplyScalar(d).sub(north.clone().multiplyScalar(tilt * (d - 1) * 1.6));
  const target = n.clone().add(north.clone().multiplyScalar(0.02 * (d - 1)));
  const sun = n.clone().multiplyScalar(3).add(north.clone().multiplyScalar(2)).add(new THREE.Vector3().crossVectors(north, n).multiplyScalar(-2.5));
  if (!tex) return null;
  const pr = (p: [number, number]) => project(pos, target, north, fov, width / height, sphere(...p, 1.003));
  const pins: { p: [number, number]; text: string; sub?: string; at: number; side?: "c" | "l" | "r"; color?: string }[] = [
    { p: P.chua, text: "চুয়াডাঙ্গা", sub: "আলমডাঙ্গা", at: 2.6, side: "l" },
    { p: P.dac, text: "ঢাকা বিমানবন্দর", at: 13.6, side: "r" },
    { p: P.dxb, text: "দুবাই", sub: `ঢাকা থেকে ~${bnInt(Math.round(km(P.dac, P.dxb) / 50) * 50)} কিমি`, at: 17.0 },
    { p: P.cai, text: "কায়রো, মিশর", at: 18.6 },
    { p: P.ben, text: "বেনগাজি", sub: "পূর্ব লিবিয়া", at: 20.0, side: "r" },
    { p: P.tip, text: "ত্রিপোলি", sub: "পশ্চিম লিবিয়া", at: 27.6, side: "l", color: "#ff5a4e" },
  ];
  // pins fade out once the camera has moved far on
  const fadeOut: Record<string, number> = { "চুয়াডাঙ্গা": 12.9, "ঢাকা বিমানবন্দর": 17.4, "দুবাই": 19.6, "কায়রো, মিশর": 21.5 };
  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true }}>
        <CameraRig pos={pos} target={target} fov={fov} up={north} />
        <Stars />
        <ambientLight intensity={0.32} />
        <directionalLight position={sun.toArray()} intensity={2.6} />
        <mesh><sphereGeometry args={[1, 256, 256]} /><meshStandardMaterial map={tex} roughness={0.95} metalness={0} /></mesh>
        <mesh scale={1.06} material={atmo}><sphereGeometry args={[1, 96, 96]} /></mesh>
        <Trail pts={arcs.land} p={ramp(t, 12.0, 13.6)} color="#ffd27a" r={0.0016} glow="#ff9a2a" />
        <Trail pts={arcs.dxb} p={ramp(t, 15.0, 17.0)} color="#ffd27a" r={0.0022} glow="#ff9a2a" />
        <Trail pts={arcs.cai} p={ramp(t, 17.1, 18.6)} color="#ffd27a" r={0.0022} glow="#ff9a2a" />
        <Trail pts={arcs.ben} p={ramp(t, 18.7, 20.1)} color="#ffb067" r={0.0022} glow="#ff7a2a" />
        <Trail pts={arcs.road} p={ramp(t, 24.9, 27.6)} color="#ff5a4e" r={0.0016} glow="#ff2a1a" />
      </ThreeCanvas>
      <Grade />
      {pins.map((q) => {
        const o = ramp(t, q.at, q.at + 0.5) * (1 - ramp(t, fadeOut[q.text] ?? 99, (fadeOut[q.text] ?? 99) + 0.6));
        const s = pr(q.p); return s.vis ? <Pin key={q.text} x={s.x} y={s.y} text={q.text} sub={q.sub} o={o} side={q.side} color={q.color} /> : null;
      })}
    </AbsoluteFill>
  );
};

// ---------- 2. Mediterranean crossing ----------
export const MED_LEN = 240;
const MB = { lon0: 8.4375, lat0: 30.751277776257798, lon1: 16.875, lat1: 38.82259097617712 };
const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const PW = 10;
const PH = (PW * (mercY(MB.lat1) - mercY(MB.lat0))) / (((MB.lon1 - MB.lon0) * Math.PI) / 180);
const toPlane = (lon: number, lat: number) => {
  const u = (lon - MB.lon0) / (MB.lon1 - MB.lon0), v = (mercY(lat) - mercY(MB.lat0)) / (mercY(MB.lat1) - mercY(MB.lat0));
  return [(u - 0.5) * PW, (0.5 - v) * PH] as const;
};
export const ZUW: [number, number] = [12.08, 32.93];
export const LMP: [number, number] = [12.61, 35.50];
const seaMat = (h: THREE.Texture, lo: number, hi: number) => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { uT: { value: 0 }, uH: { value: h }, uSea: { value: -lo / (hi - lo) } },
  vertexShader: `varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
  fragmentShader: `precision highp float; uniform float uT; uniform sampler2D uH; uniform float uSea; varying vec2 vUv; varying vec3 vW;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
    void main(){
      float hv = texture2D(uH, vUv).r; float sea = smoothstep(uSea + 0.004, uSea - 0.002, hv);
      vec2 p = vW.xz*34.0; float n = noise(p + vec2(uT*0.5, uT*0.2))*0.6 + noise(p*2.3 - vec2(uT*0.35, -uT*0.45))*0.4;
      float glint = smoothstep(0.62, 0.95, n);
      gl_FragColor = vec4(vec3(0.42,0.58,0.75)*glint*sea*0.09, 1.0);
    }`,
});
export const LibyaMed: React.FC = () => {
  const f = useCurrentFrame(); const { width, height, fps } = useVideoConfig(); const t = f / fps;
  const D = useAsset(async () => ({ tex: await loadTex(A("geo/med_tex.jpg")), hd: await loadImgData(A("geo/med_h.png")), ht: await new Promise<THREE.Texture>((r) => new THREE.TextureLoader().load(A("geo/med_h.png"), r)), m: await fetch(A("geo/med.json")).then((r) => r.json()) }));
  const S = 0.00005;
  const geo = useMemo(() => {
    if (!D) return null; const seg = 400;
    const g = new THREE.PlaneGeometry(PW, PH, seg, seg); g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute; const h = D.hd;
    for (let i = 0; i < pos.count; i++) {
      const ix = i % (seg + 1), iy = Math.floor(i / (seg + 1));
      const px = Math.min(h.width - 1, Math.round((ix / seg) * (h.width - 1))), py = Math.min(h.height - 1, Math.round((iy / seg) * (h.height - 1)));
      pos.setY(i, (D.m.lo + (h.data[(py * h.width + px) * 4] / 255) * (D.m.hi - D.m.lo)) * S);
    }
    g.computeVertexNormals(); return g;
  }, [D]);
  const sea = useMemo(() => (D ? seaMat(D.ht, D.m.lo, D.m.hi) : null), [D]);
  if (!D || !geo || !sea) return null;
  sea.uniforms.uT.value = t;
  const [zx, zz] = toPlane(...ZUW), [lx, lz] = toPlane(...LMP);
  const p = Easing.inOut(Easing.cubic)(ramp(t, 0.8, 6.6));
  const bx = zx + (lx - zx) * p, bz = zz + (lz - zz) * p;
  // camera: starts low behind the coast looking north, rises and follows the boat light
  const camT = smooth(ramp(t, 0, 9));
  const target = new THREE.Vector3(zx + (lx - zx) * (0.15 + 0.75 * camT), 0, zz + (lz - zz) * (0.15 + 0.75 * camT));
  const pos = new THREE.Vector3(target.x - 1.1 + 0.6 * camT, 2.3 + 0.4 * camT, target.z + 3.0 - 0.4 * camT);
  const pathPts = Array.from({ length: 80 }, (_, i) => new THREE.Vector3(zx + (lx - zx) * (i / 79), 0.006, zz + (lz - zz) * (i / 79)));
  const dist = Math.round(km(ZUW, LMP));
  const up = new THREE.Vector3(0, 1, 0);
  const sZ = project(pos, target, up, 40, width / height, new THREE.Vector3(zx, 0.02, zz));
  const sL = project(pos, target, up, 40, width / height, new THREE.Vector3(lx, 0.02, lz));
  const sB = project(pos, target, up, 40, width / height, new THREE.Vector3(bx, 0.02, bz));
  return (
    <AbsoluteFill style={{ background: "#03060c" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true }}>
        <CameraRig pos={pos} target={target} fov={40} />
        <fog attach="fog" args={["#05080f", 4.5, 11]} />
        <mesh geometry={geo}><meshBasicMaterial map={D.tex} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} material={sea}><planeGeometry args={[PW, PH]} /></mesh>
        {pathPts.map((q, i) => (i % 2 === 0 && i / 79 <= p + 0.001 ? <mesh key={i} position={q}><sphereGeometry args={[0.0075, 10, 10]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh> : null))}
        <mesh position={[bx, 0.01, bz]}><sphereGeometry args={[0.018, 16, 16]} /><meshBasicMaterial color="#fff2d0" toneMapped={false} /></mesh>
        <mesh position={[bx, 0.01, bz]}><sphereGeometry args={[0.06 + 0.012 * Math.sin(t * 5), 20, 20]} /><meshBasicMaterial color="#ffb34a" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      </ThreeCanvas>
      <Grade v={0.7} />
      {sZ.vis ? <Pin x={sZ.x} y={sZ.y} text="লিবিয়ার উপকূল" sub="পশ্চিমাঞ্চল" o={ramp(t, 0.3, 0.9) * (1 - ramp(t, 6.4, 7))} side="r" color="#ff5a4e" /> : null}
      {sL.vis ? <Pin x={sL.x} y={sL.y} text="লাম্পেদুসা" sub="ইতালি" o={ramp(t, 2.0, 2.6)} side="r" /> : null}
      {sB.vis && p > 0.02 && p < 0.98 ? (
        <div style={{ position: "absolute", left: `${sB.x * 100}%`, top: `${sB.y * 100}%`, transform: "translate(-110%, -50%)", fontFamily: "Anek Bangla", fontWeight: 800, fontSize: 52, color: "#fff", textShadow: "0 2px 14px #000, 0 0 3px #000", whiteSpace: "nowrap" }}>
          {bnInt(dist * p)} <span style={{ fontSize: 34, fontWeight: 600, color: "#ead9b4" }}>কিমি</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 3. Night sea with a boat ----------
export const SEA_LEN = 420;
const WAVES = [[0.9, 0.22, 0.10, 1.1], [0.35, 0.95, 0.07, 1.6], [-0.6, 0.5, 0.045, 2.3], [0.15, -0.8, 0.03, 3.1]]; // dirx, dirz, amp, k
const waveY = (x: number, z: number, t: number) => WAVES.reduce((s, [dx, dz, a, k]) => { const l = Math.hypot(dx, dz); return s + a * Math.sin(k * ((dx / l) * x + (dz / l) * z) + t * Math.sqrt(9.8 * k) * 0.55); }, 0);
const oceanMat = () => new THREE.ShaderMaterial({
  uniforms: { uT: { value: 0 }, uMoon: { value: new THREE.Vector3(0.0, 0.16, -1).normalize() }, uCam: { value: new THREE.Vector3() }, uFog: { value: new THREE.Color("#060b16") } },
  vertexShader: `uniform float uT; varying vec3 vW; varying vec3 vN;
        vec4 W[4];
    void main(){
      W[0]=vec4(0.9,0.22,0.10,1.1); W[1]=vec4(0.35,0.95,0.07,1.6); W[2]=vec4(-0.6,0.5,0.045,2.3); W[3]=vec4(0.15,-0.8,0.03,3.1);
      vec3 p = vec3(position.x, 0.0, -position.y); float y = 0.; vec2 g = vec2(0.);
      for(int i=0;i<4;i++){ vec2 d = normalize(W[i].xy); float k=W[i].w, a=W[i].z; float ph = k*dot(d,p.xz) + uT*sqrt(9.8*k)*0.55; y += a*sin(ph); g += a*k*d*cos(ph); }
      p.y = y; vN = normalize(vec3(-g.x, 1.0, -g.y)); vec4 w = vec4(p + vec3(0.0, 0.0, -40.0), 1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
  fragmentShader: `precision highp float; uniform float uT; uniform vec3 uMoon; uniform vec3 uCam; uniform vec3 uFog; varying vec3 vW; varying vec3 vN;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
    void main(){
      vec3 n = normalize(vN + vec3(noise(vW.xz*1.7+uT*0.5)-0.5, 0., noise(vW.zx*1.7-uT*0.45+7.3)-0.5)*0.14);
      vec3 v = normalize(uCam - vW); float fr = pow(1.0 - max(dot(n, v), 0.0), 4.0);
      vec3 r = reflect(-v, n); float spec = pow(max(dot(r, uMoon), 0.0), 260.0) * 1.6 + pow(max(dot(r, uMoon), 0.0), 24.0) * 0.05;
      vec3 deep = vec3(0.010, 0.022, 0.045), sky = vec3(0.06, 0.09, 0.15);
      vec3 col = mix(deep, sky, fr) + vec3(0.85,0.88,0.95)*spec;
      float d = length(uCam - vW); float fg = 1.0 - exp(-d*0.018);
      gl_FragColor = vec4(mix(col, uFog, fg), 1.0);
    }`,
});
const hullGeo = () => {
  // a long narrow open wooden boat: tapered box (bow at -z), slightly raised bow
  const g = new THREE.BoxGeometry(1.25, 0.42, 4.6, 8, 2, 24); const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const zn = (z + 2.3) / 4.6; // 0 bow .. 1 stern
    const w = zn < 0.35 ? 0.15 + 0.85 * Math.sin((zn / 0.35) * Math.PI / 2) : 1 - 0.12 * (zn - 0.35);
    const bottom = y < 0 ? 0.55 + 0.45 * (1 - Math.abs(x) / 0.63) : 1;
    p.setX(i, x * w * (y < 0 ? 0.75 : 1)); p.setY(i, y * bottom + (zn < 0.2 ? (0.2 - zn) * 0.9 : 0));
  }
  g.computeVertexNormals(); return g;
};
export const LibyaSea: React.FC<{ variant?: "open" | "boat" }> = ({ variant = "open" }) => {
  const f = useCurrentFrame(); const { width, height, fps } = useVideoConfig(); const t = f / fps + (variant === "boat" ? 30 : 0);
  const ocean = useMemo(oceanMat, []); const hull = useMemo(hullGeo, []);
  const halo = useMemo(() => { const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d")!; const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, "rgba(200,215,240,0.9)"); g.addColorStop(0.12, "rgba(160,180,215,0.35)"); g.addColorStop(0.4, "rgba(110,130,170,0.08)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, 256, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }, []);
  const people = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ x: (rnd(i + 1) - 0.5) * 0.8, z: -1.4 + (i / 29) * 3.2 + (rnd(i + 9) - 0.5) * 0.12, h: 0.26 + rnd(i + 4) * 0.1, r: 0.085 + rnd(i + 2) * 0.02 })), []);
  // boat drifts slowly away; camera low at sea level
  const bz = variant === "open" ? -9 - t * 0.12 : -6.5 - (t - 30) * 0.18; const bxp = variant === "open" ? 0.8 : -0.4;
  const by = waveY(bxp, bz, t) + 0.1; const rollA = (waveY(bxp + 0.6, bz, t) - waveY(bxp - 0.6, bz, t)) * 0.5, pitchA = (waveY(bxp, bz - 1.8, t) - waveY(bxp, bz + 1.8, t)) * 0.18;
  const camY = 0.75 + waveY(0, 2, t) * 0.6; const cam = new THREE.Vector3(Math.sin(t * 0.13) * 0.4, camY, 2 + (variant === "boat" ? -1.5 : 0));
  const target = new THREE.Vector3(bxp * 0.6, 0.35 + waveY(0, 2, t - 0.4) * 0.25, bz);
  ocean.uniforms.uT.value = t; ocean.uniforms.uCam.value.copy(cam);
  const moonDir = new THREE.Vector3(-0.25, 0.16, -1).normalize(); ocean.uniforms.uMoon.value.copy(moonDir);
  const lamp = 0.65 + 0.35 * Math.sin(t * 2.3) * Math.sin(t * 3.7 + 1);
  return (
    <AbsoluteFill style={{ background: "#03060c" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true }}>
        <CameraRig pos={cam} target={target} fov={variant === "open" ? 36 : 30} />
        <fog attach="fog" args={["#060b16", 20, 90]} />
        <color attach="background" args={["#060b16"]} />
        <Stars n={1800} r={150} size={0.22} />
        <mesh position={moonDir.clone().multiplyScalar(140).toArray()}><sphereGeometry args={[2.2, 32, 32]} /><meshBasicMaterial color="#f2efe2" toneMapped={false} fog={false} /></mesh>
        <sprite position={moonDir.clone().multiplyScalar(139).toArray()} scale={[34, 34, 1]}><spriteMaterial map={halo} transparent blending={THREE.AdditiveBlending} depthWrite={false} fog={false} opacity={0.55} /></sprite>
        <mesh material={ocean} frustumCulled={false}><planeGeometry args={[220, 160, 360, 260]} /></mesh>
        <ambientLight intensity={0.12} color="#7f93c0" />
        <directionalLight position={moonDir.clone().multiplyScalar(10).toArray()} intensity={0.9} color="#b9c6e6" />
        <group position={[bxp, by, bz]} rotation={[pitchA, 0.35, rollA]}>
          <mesh geometry={hull}><meshStandardMaterial color="#2a1d14" roughness={0.9} /></mesh>
          <mesh position={[0, 0.2, 0]} scale={[1.02, 0.03, 1.0]}><boxGeometry args={[1.2, 1, 4.4]} /><meshStandardMaterial color="#5a4532" roughness={0.8} /></mesh>
          {people.map((q, i) => (
            <group key={i} position={[q.x, 0.1, q.z]}>
              <mesh position={[0, q.h * 0.5, 0]}><capsuleGeometry args={[q.r, q.h * 0.6, 4, 8]} /><meshStandardMaterial color="#0d0f14" roughness={1} /></mesh>
              <mesh position={[0, q.h + 0.08, 0]}><sphereGeometry args={[q.r * 0.75, 10, 10]} /><meshStandardMaterial color="#0d0f14" roughness={1} /></mesh>
            </group>
          ))}
          <mesh position={[0.1, 0.25, 2.25]}><boxGeometry args={[0.22, 0.42, 0.25]} /><meshStandardMaterial color="#1a1c20" /></mesh>
          <mesh position={[-0.3, 0.75, 1.6]}><sphereGeometry args={[0.05, 10, 10]} /><meshBasicMaterial color="#ffd9a0" toneMapped={false} /></mesh>
          <pointLight position={[-0.3, 0.8, 1.6]} intensity={1.6 * lamp} distance={4} color="#ffb870" />
        </group>
      </ThreeCanvas>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};
