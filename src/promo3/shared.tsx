// Promo3 — shared bits for the three course promos (cfe kinetic · gds departure board · ielts phone/split).
// Spec src/promo3/<id>.json (scenes with `vo`), scene lengths src/promo3/<id>.durs.json (scripts/promo3_make.py),
// VO public/promo3/<id>/vo/NN.mp3, lesson clips public/promo3/<id>/clips/<name>.mp4,
// screen recordings public/promo3/<id>/rec/<name>.mp4 (listed in spec.recs; until then the designed fallback shows).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { icons } from "lucide-react";

export const FPS = 30;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const BN = "Anek", EN = "Montserrat", HIND = "Hind", MONO = "Consolas, 'Courier New', monospace";

if (typeof document !== "undefined") {
  for (const [n, u] of [["Anek", "fonts/AnekBangla.ttf"], ["Montserrat", "fonts/Montserrat.ttf"], ["Hind", "fonts/HindSiliguri-Bold.ttf"], ["Bebas", "fonts/BebasNeue-Regular.ttf"]]) {
    const f = new FontFace(n, `url(${staticFile(u)})`, { weight: "100 900" });
    f.load().then(() => document.fonts.add(f)).catch(() => {});
  }
}

export type Scene = { k: string; vo: string; rec?: string; [x: string]: any };
export type Spec = { id: string; course: string; title: string; scenes: Scene[]; recs?: string[] };

const LEAD = 8, TAIL = 16; // frames of air before / after each VO line
export const timeline = (durs: number[]) => {
  let at = 0;
  return durs.map((d) => {
    const len = Math.round(d * FPS) + LEAD + TAIL;
    const s = { from: at, len };
    at += len;
    return s;
  });
};
export const totalLen = (durs: number[], outro = 60) => timeline(durs).reduce((n, s) => n + s.len, 0) + outro;

// enter animation helper: 0→1 from frame `at` (spring-ish, eased)
export const enter = (f: number, at = 0, dur = 18) => interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: ease });
export const pop = (f: number, fps: number, at = 0, damping = 12) => spring({ frame: f - at, fps, config: { damping, stiffness: 160 } });

export const Icon: React.FC<{ name: string; size?: number; color?: string; stroke?: number }> = ({ name, size = 40, color = "currentColor", stroke = 2 }) => {
  const key = name.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("") as keyof typeof icons;
  const I = icons[key] || icons.Circle;
  return <I size={size} color={color} strokeWidth={stroke} />;
};

export const Logo: React.FC<{ dark?: boolean; w?: number }> = ({ dark, w = 360 }) => (
  <Img src={staticFile(dark ? "brand/logo-dark.png" : "brand/logo.png")} style={{ width: w }} />
);

export const Clip: React.FC<{ pid: string; name: string; style?: React.CSSProperties; start?: number }> = ({ pid, name, style, start = 0 }) => (
  <OffthreadVideo src={staticFile(`promo3/${pid}/clips/${name}.mp4`)} muted startFrom={start} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
);

// App window with NO address bar — only the brand name in the tab (never show the demo domain).
export const AppWindow: React.FC<{ w: number; h: number; dark?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, dark, children, style }) => (
  <div style={{ width: w, height: h, borderRadius: 18, overflow: "hidden", background: dark ? "#0B1220" : "#fff", boxShadow: "0 40px 90px rgba(0,0,0,.35)", display: "flex", flexDirection: "column", ...style }}>
    <div style={{ height: 44, flex: "none", display: "flex", alignItems: "center", gap: 9, padding: "0 18px", background: dark ? "#111A2E" : "#EEF1F7" }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />)}
      <div style={{ marginLeft: 16, padding: "6px 18px", borderRadius: 9, background: dark ? "#0B1220" : "#fff", fontFamily: BN, fontSize: 17, fontWeight: 600, color: dark ? "#C9D3EA" : "#334" }}>এআই ইউনিভার্সিটি</div>
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);

// screen recording if present (spec.recs), otherwise the fallback
// rec name may carry timing: "guru-gds@4x2" = start at 4 s, play at 2x
export const hasRec = (spec: Spec, name?: string) => !!name && !!spec.recs?.includes(name.split("@")[0]);
export const Rec: React.FC<{ spec: Spec; name?: string; fallback: React.ReactNode }> = ({ spec, name, fallback }) => {
  if (!name || !hasRec(spec, name)) return <>{fallback}</>;
  const [n, t = "0x1"] = name.split("@");
  const [st, rate] = t.split("x").map(Number);
  return <OffthreadVideo src={staticFile(`promo3/${spec.id}/rec/${n}.mp4`)} muted startFrom={Math.round(st * 30)} playbackRate={rate || 1} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />;
};

// VO + music bed + whooshes, laid on the timeline
export const Soundtrack: React.FC<{ pid: string; durs: number[]; total: number; music: string; vol?: number }> = ({ pid, durs, total, music, vol = 0.13 }) => {
  const tl = timeline(durs);
  return (
    <>
      <Audio src={staticFile(music)} volume={(f) => interpolate(f, [0, 20, total - 50, total], [0, vol, vol, 0], clamp)} />
      {tl.map((s, i) => (
        <Sequence key={i} from={s.from + LEAD} durationInFrames={s.len}>
          <Audio src={staticFile(`promo3/${pid}/vo/${String(i + 1).padStart(2, "0")}.mp3`)} />
        </Sequence>
      ))}
      {tl.slice(1).map((s, i) => (
        <Sequence key={"w" + i} from={Math.max(0, s.from - 6)} durationInFrames={30}>
          <Audio src={staticFile("aiu2/whoosh.mp3")} volume={0.22} />
        </Sequence>
      ))}
    </>
  );
};

// runs each scene in its own Sequence and hands it (scene, local frame, length)
export const Scenes: React.FC<{ spec: Spec; durs: number[]; render: (s: Scene, f: number, len: number, i: number) => React.ReactNode }> = ({ spec, durs, render }) => {
  const tl = timeline(durs);
  return (
    <>
      {spec.scenes.map((s, i) => (
        <Sequence key={i} from={tl[i].from} durationInFrames={tl[i].len + (i === spec.scenes.length - 1 ? 60 : 0)}>
          <SceneWrap render={(f) => render(s, f, tl[i].len, i)} />
        </Sequence>
      ))}
    </>
  );
};
const SceneWrap: React.FC<{ render: (f: number) => React.ReactNode }> = ({ render }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill>{render(f)}</AbsoluteFill>;
};

export const useFps = () => useVideoConfig().fps;
