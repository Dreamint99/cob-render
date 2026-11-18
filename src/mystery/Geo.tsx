// 3D geo scenes for "রহস্যময় বাংলাদেশ": globe → Bangladesh terrain, and the Barisal delta fly-over.
// Rendered locally to MP4 (WebGL) and used as clips in the main edit.
import React, { useEffect, useMemo, useState } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AbsoluteFill, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

const G = (f: string) => staticFile(`mystery/ep1/geo/${f}`);

// ---------- helpers ----------
const sphere = (lon: number, lat: number, r = 1) => {
  const phi = ((lon + 180) * Math.PI) / 180, th = ((90 - lat) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.cos(phi) * Math.sin(th), r * Math.cos(th), r * Math.sin(phi) * Math.sin(th));
};
const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
type Bounds = { lon0: number; lat0: number; lon1: number; lat1: number };
const BD: Bounds = { lon0: 87.1875, lat0: 19.311143355064647, lon1: 94.21875, lat1: 27.05912578437406 };
const DELTA: Bounds = { lon0: 88.59375, lat0: 20.961439614096825, lon1: 91.40625, lat1: 23.563987128451224 };
const PW = 10;
const planeH = (b: Bounds) => (PW * (mercY(b.lat1) - mercY(b.lat0))) / (((b.lon1 - b.lon0) * Math.PI) / 180);
// lon/lat → plane xz (plane centred at origin, north = -z)
const toPlane = (b: Bounds, lon: number, lat: number) => {
  const u = (lon - b.lon0) / (b.lon1 - b.lon0), v = (mercY(lat) - mercY(b.lat0)) / (mercY(b.lat1) - mercY(b.lat0));
  return [(u - 0.5) * PW, (0.5 - v) * planeH(b)] as const;
};

function useAsset<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [v, setV] = useState<T | null>(null);
  const [h] = useState(() => delayRender("asset"));
  useEffect(() => { load().then((x) => { setV(x); continueRender(h); }); }, deps); // eslint-disable-line
  return v;
}
const loadTex = (url: string) => new Promise<THREE.Texture>((res) => new THREE.TextureLoader().load(url, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; res(t); }));
const loadImgData = (url: string) => new Promise<ImageData>((res) => {
  const im = new Image(); im.crossOrigin = "anonymous";
  im.onload = () => { const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const x = c.getContext("2d")!; x.drawImage(im, 0, 0); res(x.getImageData(0, 0, im.width, im.height)); };
  im.src = url;
});
const loadJson = (url: string) => fetch(url).then((r) => r.json());

const CameraRig: React.FC<{ pos: THREE.Vector3; target: THREE.Vector3; fov: number; up?: THREE.Vector3 }> = ({ pos, target, fov, up }) => {
  const { camera } = useThree();
  camera.position.copy(pos);
  if (up) camera.up.copy(up); else camera.up.set(0, 1, 0);
  camera.lookAt(target);
  (camera as THREE.PerspectiveCamera).fov = fov; (camera as THREE.PerspectiveCamera).near = 0.005; (camera as THREE.PerspectiveCamera).far = 200;
  camera.updateProjectionMatrix();
  return null;
};

// seeded stars
const rnd = (s: number) => { const x = Math.sin(s * 12.9898) * 43758.5453; return x - Math.floor(x); };
const Stars: React.FC<{ n?: number }> = ({ n = 2500 }) => {
  const geo = useMemo(() => {
    const p = new Float32Array(n * 3), c = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = rnd(i + 1) * 2 - 1, t = rnd(i + 7.3) * Math.PI * 2, r = 60;
      const s = Math.sqrt(1 - u * u); p.set([r * s * Math.cos(t), r * u, r * s * Math.sin(t)], i * 3);
      const b = 0.35 + 0.65 * Math.pow(rnd(i + 3.1), 3); c.set([b, b, b * 1.05], i * 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3)); g.setAttribute("color", new THREE.BufferAttribute(c, 3)); return g;
  }, [n]);
  return <points geometry={geo}><pointsMaterial size={0.09} vertexColors sizeAttenuation transparent opacity={0.9} /></points>;
};

const atmoMat = () => new THREE.ShaderMaterial({
  side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  vertexShader: `varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vP = mv.xyz; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `varying vec3 vN; varying vec3 vP; void main(){ float f = pow(0.72 - dot(vN, normalize(-vP)*-1.0), 3.0); gl_FragColor = vec4(0.35,0.62,1.0,1.0)*clamp(f,0.,1.)*1.1; }`,
});

const tube = (pts: THREE.Vector3[], r: number) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), Math.min(4000, pts.length * 2), r, 5, true);

// ---------- 1. Globe ----------
export const GLOBE_LEN = 165;
export const MysGlobe: React.FC = () => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const assets = useAsset(async () => ({ earth: await loadTex(G("earth.jpg")), rings: (await loadJson(G("bgd_rings.json"))) as number[][][] }));
  const bdDir = sphere(90.3, 23.7).normalize();
  const t = interpolate(f, [0, GLOBE_LEN - 1], [0, 1], { extrapolateRight: "clamp" });
  const e = Easing.bezier(0.55, 0.0, 0.35, 1)(t);
  // globe spins toward Bangladesh while the camera dives in
  const spin = interpolate(e, [0, 1], [-1.15, 0]);
  const dist = interpolate(e, [0, 1], [4.6, 1.55]);
  const rot = new THREE.Euler(0, spin, 0);
  const dirRot = bdDir.clone().applyEuler(rot);
  const side = new THREE.Vector3(0, 1, 0).cross(dirRot).normalize();
  const camPos = dirRot.clone().multiplyScalar(dist).add(side.multiplyScalar(interpolate(e, [0, 1], [1.1, 0]))).add(new THREE.Vector3(0, interpolate(e, [0, 1], [0.5, 0.06]), 0));
  const target = dirRot.clone().multiplyScalar(interpolate(e, [0, 1], [0, 0.9]));
  const lines = useMemo(() => assets ? assets.rings.map((r) => r.map(([lo, la]) => sphere(lo, la, 1.0015))) : [], [assets]);
  const tubes = useMemo(() => lines.map((l) => [tube(l, 0.0009), tube(l, 0.0028)]), [lines]);
  const atmo = useMemo(atmoMat, []);
  const glow = interpolate(f, [70, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (!assets) return null;
  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true }}>
        <CameraRig pos={camPos} target={target} fov={interpolate(e, [0, 1], [32, 40])} />
        <Stars />
        <ambientLight intensity={0.25} />
        <directionalLight position={camPos.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.55).add(new THREE.Vector3(0, 0.8, 0)).multiplyScalar(3).toArray()} intensity={3.2} />
        <group rotation={rot}>
          <mesh>
            <sphereGeometry args={[1, 192, 192]} />
            <meshStandardMaterial map={assets.earth} roughness={0.95} metalness={0} />
          </mesh>
          <mesh scale={1.07} material={atmo}><sphereGeometry args={[1, 96, 96]} /></mesh>
          {tubes.map(([a, b2], i) => (
            <group key={i}>
              <mesh geometry={a}><meshBasicMaterial color="#ffcf6b" transparent opacity={glow} /></mesh>
              <mesh geometry={b2}><meshBasicMaterial color="#ff8a2a" transparent opacity={glow * 0.28} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
            </group>
          ))}
        </group>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// ---------- terrain mesh ----------
const Terrain: React.FC<{ b: Bounds; tex: THREE.Texture; h: ImageData; scale: number; lo: number; hi: number; seg?: number; tint?: string }> = ({ b, tex, h, scale, lo, hi, seg = 511, tint = "#ffffff" }) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(PW, planeH(b), seg, seg); g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const ix = i % (seg + 1), iy = Math.floor(i / (seg + 1));
      const px = Math.min(h.width - 1, Math.round((ix / seg) * (h.width - 1))), py = Math.min(h.height - 1, Math.round((iy / seg) * (h.height - 1)));
      const v = h.data[(py * h.width + px) * 4] / 255; pos.setY(i, (lo + v * (hi - lo)) * scale);
    }
    g.computeVertexNormals(); return g;
  }, [b, h, scale, lo, hi, seg]);
  return <mesh geometry={geo}><meshBasicMaterial map={tex} color={tint} /></mesh>;
};
const heightAt = (b: Bounds, h: ImageData, lo: number, hi: number, scale: number, lon: number, lat: number) => {
  const u = (lon - b.lon0) / (b.lon1 - b.lon0), v = 1 - (mercY(lat) - mercY(b.lat0)) / (mercY(b.lat1) - mercY(b.lat0));
  const px = Math.max(0, Math.min(h.width - 1, Math.round(u * (h.width - 1)))), py = Math.max(0, Math.min(h.height - 1, Math.round(v * (h.height - 1))));
  return (lo + (h.data[(py * h.width + px) * 4] / 255) * (hi - lo)) * scale;
};

// screen projection for DOM labels
const project = (pos: THREE.Vector3, target: THREE.Vector3, fov: number, aspect: number, p: THREE.Vector3) => {
  const c = new THREE.PerspectiveCamera(fov, aspect, 0.005, 200); c.position.copy(pos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = p.clone().project(c); return { x: (v.x + 1) / 2, y: (1 - v.y) / 2, vis: v.z < 1 };
};

const Label: React.FC<{ x: number; y: number; text: string; sub?: string; o: number; dot?: string; big?: boolean }> = ({ x, y, text, sub, o, dot = "#ffcf6b", big }) => (
  <div style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, opacity: o, transform: `translate(-50%, -100%) translateY(${(1 - o) * 14}px)` }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: "Anek Bangla", fontWeight: 700, fontSize: big ? 64 : 46, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,.9), 0 0 2px #000", whiteSpace: "nowrap" }}>{text}</div>
      {sub ? <div style={{ fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 30, color: "#e9d9b0", marginTop: -4, textShadow: "0 2px 10px #000", whiteSpace: "nowrap" }}>{sub}</div> : null}
      <div style={{ width: 2, height: 46, background: `linear-gradient(${dot}, transparent)`, marginTop: 6 }} />
      <div style={{ width: 16, height: 16, borderRadius: 9, background: dot, boxShadow: `0 0 18px 6px ${dot}88`, marginTop: -2 }} />
    </div>
  </div>
);

// ---------- 2. Bangladesh terrain (follows the globe) ----------
export const BDMAP_LEN = 165;
export const MysBDMap: React.FC = () => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const A = useAsset(async () => ({ tex: await loadTex(G("bd_tex.jpg")), h: await loadImgData(G("bd_h.png")), m: await loadJson(G("bd_h.json")), rings: (await loadJson(G("bgd_rings.json"))) as number[][][] }));
  const S = 0.00009;
  const e = Easing.bezier(0.3, 0, 0.25, 1)(interpolate(f, [0, BDMAP_LEN - 1], [0, 1]));
  const [bx, bz] = toPlane(BD, 90.35, 23.3);
  const [brx, brz] = toPlane(BD, 90.37, 22.70);
  const target = new THREE.Vector3(interpolate(e, [0, 1], [bx, brx]), 0, interpolate(e, [0, 1], [bz, brz]));
  const pos = new THREE.Vector3(target.x + interpolate(e, [0, 1], [0, -0.35]), interpolate(e, [0, 1], [12.5, 2.1]), target.z + interpolate(e, [0, 1], [0.25, 2.6]));
  const lines = useMemo(() => A ? A.rings.map((r) => r.map(([lo, la]) => { const [x, z] = toPlane(BD, lo, la); return new THREE.Vector3(x, Math.max(0, heightAt(BD, A.h, A.m.lo, A.m.hi, S, lo, la)) + 0.012, z); })) : [], [A]);
  if (!A) return null;
  const draw = interpolate(f, [0, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineO = interpolate(f, [85, 125], [1, 0.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outside = 0.42;
  const pr = project(pos, target, 38, width / height, new THREE.Vector3(brx, 0.02, brz));
  const lo = interpolate(f, [95, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#03060c" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true }}>
        <CameraRig pos={pos} target={target} fov={38} />
        <fog attach="fog" args={["#03060c", 6, 16]} />
        <Terrain b={BD} tex={A.tex} h={A.h} scale={S} lo={A.m.lo} hi={A.m.hi} tint={new THREE.Color(1, 1, 1).multiplyScalar(1).getStyle()} />
        {/* darken everything outside Bangladesh a little: a big translucent sheet with the country cut out is costly; dim via fog + vignette instead */}
        {lines.map((l, i) => {
          const n = Math.max(2, Math.floor(l.length * draw));
          const pts = l.slice(0, n);
          return (
            <group key={i}>
              <mesh geometry={new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, draw >= 1), Math.min(3000, pts.length * 2), 0.007, 5, draw >= 1)}><meshBasicMaterial color="#ffd27a" transparent opacity={lineO} /></mesh>
              <mesh geometry={new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, draw >= 1), Math.min(3000, pts.length * 2), 0.022, 6, draw >= 1)}><meshBasicMaterial color="#ff7a1a" transparent opacity={0.22 * lineO} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
            </group>
          );
        })}
      </ThreeCanvas>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(2,4,10,${outside}) 80%)` }} />
      {pr.vis ? <Label x={pr.x} y={pr.y} text="বরিশাল" sub="তৎকালীন বাকেরগঞ্জ জেলা" o={lo} big /> : null}
    </AbsoluteFill>
  );
};

// ---------- 3. Delta fly-over: Barisal → rivers → Bay of Bengal → Swatch of No Ground ----------
export const DELTA_LEN = 300;
export const MysDelta: React.FC = () => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const A = useAsset(async () => ({ tex: await loadTex(G("delta_tex.jpg")), h: await loadImgData(G("delta_h.png")), m: await loadJson(G("delta_h.json")) }));
  const S = 0.0016;
  const t = interpolate(f, [0, DELTA_LEN - 1], [0, 1]);
  const e = Easing.bezier(0.45, 0, 0.4, 1)(t);
  // waypoints (lon, lat): Barisal → Tetulia/Meghna mouth → open sea → Swatch of No Ground
  const path = [[90.37, 22.72], [90.33, 22.25], [90.05, 21.75], [89.75, 21.45]];
  const seg = e * (path.length - 1), k = Math.min(path.length - 2, Math.floor(seg)), w = seg - k;
  const sm = w * w * (3 - 2 * w);
  const lon = path[k][0] + (path[k + 1][0] - path[k][0]) * sm, lat = path[k][1] + (path[k + 1][1] - path[k][1]) * sm;
  const [tx, tz] = toPlane(DELTA, lon, lat);
  const target = new THREE.Vector3(tx, 0, tz);
  const alt = interpolate(e, [0, 0.6, 1], [0.75, 1.1, 2.2]);
  const back = interpolate(e, [0, 0.6, 1], [1.1, 1.5, 2.3]);
  const pos = new THREE.Vector3(tx + interpolate(e, [0, 1], [0.25, -0.5]), alt, tz - back); // camera NORTH of target looking south (toward the sea)
  if (!A) return null;
  const P = (lo: number, la: number) => { const [x, z] = toPlane(DELTA, lo, la); return project(pos, target, 42, width / height, new THREE.Vector3(x, Math.max(0, heightAt(DELTA, A.h, A.m.lo, A.m.hi, S, lo, la)) + 0.01, z)); };
  const L = [
    { p: P(90.37, 22.70), t: "বরিশাল", s: "", a: 10, b: 120 },
    { p: P(90.75, 22.35), t: "মেঘনা মোহনা", s: "", a: 70, b: 190 },
    { p: P(89.45, 21.95), t: "সুন্দরবন", s: "", a: 110, b: 230 },
    { p: P(89.62, 21.35), t: "সোয়াচ অব নো গ্রাউন্ড", s: "সাগরতলের গিরিখাত", a: 200, b: 400 },
  ];
  return (
    <AbsoluteFill style={{ background: "#071019" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true }}>
        <CameraRig pos={pos} target={target} fov={42} />
        <fog attach="fog" args={["#0a1622", 2.2, 6.5]} />
        <Terrain b={DELTA} tex={A.tex} h={A.h} scale={S} lo={A.m.lo} hi={A.m.hi} />
        {[0, 1, 2, 3].map((k) => {
          const [sx, sz] = toPlane(DELTA, 89.62, 21.35);
          const ph = ((f - 170 - k * 22) / 90);
          if (ph < 0 || ph > 1) return null;
          const r = 0.05 + ph * 1.1;
          return <mesh key={k} position={[sx, 0.03, sz]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r, r + 0.012 + ph * 0.01, 128]} /><meshBasicMaterial color="#ff6a3d" transparent opacity={(1 - ph) * 0.85} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>;
        })}
      </ThreeCanvas>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,22,34,.85) 0%, rgba(10,22,34,0) 28%), radial-gradient(ellipse at 50% 60%, transparent 45%, rgba(0,0,0,.55) 100%)" }} />
      {L.map((l, i) => {
        const o = interpolate(f, [l.a, l.a + 18, l.b - 15, l.b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return l.p.vis && o > 0 ? <Label key={i} x={l.p.x} y={l.p.y} text={l.t} sub={l.s} o={o} dot={i === 3 ? "#ff5a3c" : "#ffcf6b"} /> : null;
      })}
    </AbsoluteFill>
  );
};
