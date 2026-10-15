// AI University course-lesson video engine (classroom style, light theme).
// One JSON spec per lesson (src/lessons/<id>.json, timed by scripts/lesson_make.py). Scene types:
// title · myth · overview · focus · units · note · recap · quizQ · quizA · outro
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, delayRender, continueRender } from "remotion";
import {
  GraduationCap, Route, Brain, PlugZap, Binary, Type, Film, HardDrive, TriangleAlert, Timer, CircleCheck, Image as ImageIcon, FileText, BookOpen, Clapperboard, X, Target, ArrowRight, Check,
  Keyboard, Cpu, MemoryStick, Monitor, Printer, Speaker, BatteryCharging, Usb, Webcam, Mouse, Hand, Eye, Archive, Power, Wrench, ScanLine,
  Globe, Search, Mail, Lock, ShieldCheck, Wifi, Folder, FolderOpen, Download, Settings, Smartphone, Laptop, Users, Lightbulb, Briefcase, School, HeartPulse, Calculator, MessageCircle, Video, Music, Clock, Star, KeyRound, Bug, Link, Cable, Server, Cloud, PenLine, Gamepad2, Building2, Landmark, ShoppingCart, Banknote, Hospital, Sprout, History, Rocket, MousePointerClick, Command, Copy, ClipboardPaste, Undo2, Save, Trash2, AppWindow, LayoutGrid, PanelBottom, Package, Fingerprint, Paperclip, Send, Inbox, AtSign, Router, Plug, Bluetooth, Network, CircleAlert, ShieldAlert, Code, Calendar, Camera, Mic, Headphones, Tv, House, Zap, Sparkles, Puzzle, Layers, Car, Factory,
} from "lucide-react";

const C = { bg: "#F4F6FB", card: "#FFFFFF", ink: "#0B1430", txt: "#1C2440", mute: "#5B6382", faint: "#8B92AD", line: "#E4E8F1", brand: "#4F46E5", brand2: "#0E9FC6", soft: "#EEF0FF", green: "#12936A", gsoft: "#E7F8F0", amber: "#F59E0B", asoft: "#FDF3E1", red: "#D63C3C", rsoft: "#FDECEC" };
const GRAD = `linear-gradient(95deg, ${C.brand}, ${C.brand2})`;
const BN = "Anek", EN = "Montserrat";
if (typeof document !== "undefined") {
  for (const [n, u] of [["Anek", "fonts/AnekBangla.ttf"], ["Montserrat", "fonts/Montserrat.ttf"]]) {
    // hold the render until the font is in: cloud runners don't have Anek Bangla installed, so frames rendered before it loads fall back to another font
    const h = delayRender(`font ${n}`);
    const f = new FontFace(n, `url(${staticFile(u)})`, { weight: "100 900" });
    f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
  }
}
const ICONS: Record<string, React.FC<any>> = { route: Route, brain: Brain, "plug-zap": PlugZap, binary: Binary, type: Type, film: Film, "hard-drive": HardDrive, image: ImageIcon, "file-text": FileText, "book-open": BookOpen, clapperboard: Clapperboard, keyboard: Keyboard, cpu: Cpu, "memory-stick": MemoryStick, monitor: Monitor, printer: Printer, speaker: Speaker, "battery-charging": BatteryCharging, usb: Usb, webcam: Webcam, mouse: Mouse, hand: Hand, eye: Eye, archive: Archive, power: Power, wrench: Wrench, "scan-line": ScanLine, "globe": Globe, "search": Search, "mail": Mail, "lock": Lock, "shield-check": ShieldCheck, "wifi": Wifi, "folder": Folder, "folder-open": FolderOpen, "download": Download, "settings": Settings, "smartphone": Smartphone, "laptop": Laptop, "users": Users, "lightbulb": Lightbulb, "briefcase": Briefcase, "school": School, "heart-pulse": HeartPulse, "calculator": Calculator, "message-circle": MessageCircle, "video": Video, "music": Music, "clock": Clock, "star": Star, "key-round": KeyRound, "bug": Bug, "link": Link, "cable": Cable, "server": Server, "cloud": Cloud, "pen-line": PenLine, "gamepad-2": Gamepad2, "building-2": Building2, "landmark": Landmark, "shopping-cart": ShoppingCart, "banknote": Banknote, "hospital": Hospital, "sprout": Sprout, "history": History, "rocket": Rocket, "mouse-pointer-click": MousePointerClick, "command": Command, "copy": Copy, "clipboard-paste": ClipboardPaste, "undo-2": Undo2, "save": Save, "trash-2": Trash2, "app-window": AppWindow, "layout-grid": LayoutGrid, "panel-bottom": PanelBottom, "package": Package, "fingerprint": Fingerprint, "paperclip": Paperclip, "send": Send, "inbox": Inbox, "at-sign": AtSign, "router": Router, "plug": Plug, "bluetooth": Bluetooth, "network": Network, "circle-alert": CircleAlert, "shield-alert": ShieldAlert, "code": Code, "calendar": Calendar, "camera": Camera, "mic": Mic, "headphones": Headphones, "tv": Tv, "house": House, "zap": Zap, "sparkles": Sparkles, "puzzle": Puzzle, "layers": Layers, "car": Car, "factory": Factory };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const bn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const ent = (f: number, fps: number, d: number, dur = 24) => spring({ frame: f - d, fps, config: { damping: 200 }, durationInFrames: dur });
const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 12, mass: 0.6 } });

export type Point = { n: number; label: string; en: string; x: number; y: number };
export type Scene = { type: string; vo: string; frames: number; [k: string]: any };
export type Spec = { id: string; course: string; module: string; lessonNo: string; title: string; next: string; figure?: { src: string; w: number; h: number; points: Point[] }; scenes: Scene[] };

const LEAD = 12, TAIL = 16;
const sceneLen = (s: Scene) => LEAD + s.frames + (s.hold || 0) + TAIL;
export const lessonLen = (spec: Spec) => spec.scenes.reduce((n, s) => n + sceneLen(s), 0) + 30;
type P = { s: Scene; spec: Spec; vo: number };
const at = (p: P, x: number) => LEAD + p.vo * x;

/* ---------- primitives ---------- */
const Rise: React.FC<{ d: number; children: React.ReactNode; style?: React.CSSProperties; y?: number }> = ({ d, children, style, y = 40 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = ent(f, fps, d);
  return <div style={{ opacity: s, transform: `translateY(${(1 - s) * y}px)`, ...style }}>{children}</div>;
};
const H: React.FC<{ d: number; size: number; children: React.ReactNode; color?: string; weight?: number }> = ({ d, size, children, color = C.ink, weight = 800 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = ent(f, fps, d, 28);
  return <div style={{ overflow: "hidden", paddingTop: size * 0.16, paddingBottom: size * 0.22, marginTop: -size * 0.16, marginBottom: -size * 0.22 }}><div style={{ fontFamily: BN, fontSize: size, fontWeight: weight, color, lineHeight: 1.25, transform: `translateY(${(1 - s) * 110}%)` }}>{children}</div></div>;
};
const Pin: React.FC<{ n: number; on?: boolean; dim?: boolean; size?: number; scale?: number }> = ({ n, on, dim, size = 46, scale = 1 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, transform: `translate(-50%,-50%) scale(${scale})`, background: on ? C.amber : C.brand, border: `${size * 0.08}px solid #fff`, color: "#fff", display: "grid", placeItems: "center", fontFamily: BN, fontWeight: 800, fontSize: size * 0.48, opacity: dim ? 0.35 : 1, boxShadow: on ? `0 0 0 ${size * 0.18 + Math.sin(f / 5) * size * 0.12}px ${C.amber}55, 0 8px 22px rgba(0,0,0,.35)` : "0 6px 16px rgba(0,0,0,.3)" }}>{bn(n)}</div>
  );
};
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.card, borderRadius: 26, border: `1px solid ${C.line}`, boxShadow: "0 24px 60px rgba(16,24,64,.10)", ...style }}>{children}</div>
);

/* ---------- figure with camera ---------- */
const Figure: React.FC<{ spec: Spec; W: number; focus?: number; zoom?: number; zoomAt?: number; reveal?: number[] }> = ({ spec, W, focus, zoom = 1, zoomAt = 0, reveal }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const { w, h, points, src } = spec.figure!;
  const Hh = Math.round((W * h) / w);
  const pt = points.find((q) => q.n === focus);
  const z = pt ? interpolate(ent(f, fps, zoomAt, 40), [0, 1], [1, zoom]) : 1;
  const cx = pt ? pt.x : 0.5, cy = pt ? pt.y : 0.5;
  // keep the focused point centred while zooming, clamped so the image edge never shows
  const tx = Math.max(Math.min((0.5 - cx) * W * z, (W * (z - 1)) / 2), (-W * (z - 1)) / 2);
  const ty = Math.max(Math.min((0.5 - cy) * Hh * z, (Hh * (z - 1)) / 2), (-Hh * (z - 1)) / 2);
  return (
    <div style={{ position: "relative", width: W, height: Hh, borderRadius: 24, overflow: "hidden", background: "#E9ECF2", boxShadow: "0 30px 80px rgba(16,24,64,.18)" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {points.map((q, i) => {
          const s = reveal ? pop(f, fps, reveal[i] ?? 0) : 1;
          return <div key={q.n} style={{ position: "absolute", left: q.x * W, top: q.y * Hh, opacity: s }}><Pin n={q.n} on={q.n === focus} dim={!!focus && q.n !== focus} size={46 / z} scale={s} /></div>;
        })}
      </div>
    </div>
  );
};

/* ---------- scenes ---------- */
const STitle: React.FC<P> = (p) => {
  const { s, spec } = p;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 230, width: 840 }}>
        <Rise d={4}><span style={{ display: "inline-flex", gap: 10, alignItems: "center", padding: "10px 22px", borderRadius: 40, background: C.soft, color: C.brand, fontFamily: BN, fontSize: 30, fontWeight: 700 }}>{spec.module} · {spec.lessonNo}</span></Rise>
        <div style={{ marginTop: 30 }}><H d={10} size={96}>{spec.title}</H></div>
        <Rise d={24} style={{ marginTop: 26 }}><span style={{ fontFamily: BN, fontSize: 34, color: C.mute }}>{spec.course}</span></Rise>
      </div>
      <Card style={{ position: "absolute", right: 130, top: 230, width: 760, padding: "40px 44px" }}>
        <Rise d={at(p, 0.3)}><div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: BN, fontSize: 36, fontWeight: 800, color: C.ink }}><Target size={40} color={C.brand} /> এই পাঠে যা শিখবেন</div></Rise>
        {s.goals.map((g: string, i: number) => (
          <Rise key={i} d={at(p, 0.42 + i * 0.16)} y={24} style={{ display: "flex", gap: 18, alignItems: "flex-start", marginTop: 26 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: C.gsoft, display: "grid", placeItems: "center", flex: "none" }}><Check size={26} color={C.green} strokeWidth={3} /></div>
            <span style={{ fontFamily: BN, fontSize: 34, color: C.txt, lineHeight: 1.35 }}>{g}</span>
          </Rise>
        ))}
      </Card>
    </AbsoluteFill>
  );
};

const SMyth: React.FC<P> = (p) => {
  const { s, spec } = p; const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const strike = interpolate(f, [at(p, 0.32), at(p, 0.4)], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 210 }}><Rise d={4}><span style={{ fontFamily: EN, fontSize: 22, fontWeight: 800, letterSpacing: "0.28em", color: C.red }}>MYTH vs FACT</span></Rise></div>
      <Rise d={at(p, 0.1)} style={{ position: "absolute", left: 130, top: 290, width: 860 }}>
        <Card style={{ padding: "36px 40px", background: C.rsoft, border: `1px solid ${C.red}33`, boxShadow: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ width: 56, height: 56, borderRadius: 28, background: C.red, display: "grid", placeItems: "center" }}><X size={34} color="#fff" strokeWidth={3} /></div><span style={{ fontFamily: BN, fontSize: 30, color: C.red, fontWeight: 700 }}>ভুল ধারণা</span></div>
          <div style={{ position: "relative", display: "inline-block", marginTop: 18 }}><span style={{ fontFamily: BN, fontSize: 58, fontWeight: 800, color: C.ink }}>{s.wrong}</span><div style={{ position: "absolute", left: 0, top: "55%", height: 6, borderRadius: 3, width: `${strike * 100}%`, background: C.red }} /></div>
        </Card>
      </Rise>
      <Rise d={at(p, 0.45)} style={{ position: "absolute", left: 130, top: 580, width: 860 }}>
        <Card style={{ padding: "36px 40px", background: C.gsoft, border: `1px solid ${C.green}33`, boxShadow: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ width: 56, height: 56, borderRadius: 28, background: C.green, display: "grid", placeItems: "center" }}><Check size={34} color="#fff" strokeWidth={3} /></div><span style={{ fontFamily: BN, fontSize: 30, color: C.green, fontWeight: 700 }}>সঠিক তথ্য</span></div>
          <div style={{ fontFamily: BN, fontSize: 50, fontWeight: 800, color: C.ink, marginTop: 14 }}>{s.right}</div>
          <div style={{ fontFamily: BN, fontSize: 32, color: C.mute, marginTop: 8 }}>{s.sub}</div>
        </Card>
      </Rise>
      {spec.figure ? <div style={{ position: "absolute", right: 130, top: 250, opacity: ent(f, fps, 10, 40), transform: `scale(${0.94 + 0.06 * ent(f, fps, 10, 40)})` }}><Figure spec={spec} W={720} reveal={spec.figure.points.map(() => 99999)} /></div> : null}
    </AbsoluteFill>
  );
};

const SOverview: React.FC<P> = (p) => {
  const { spec } = p; const pts = spec.figure!.points;
  const reveal = pts.map((_, i) => at(p, 0.28 + i * 0.09));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 150 }}><H d={4} size={56}>{p.s.head ? p.s.head[0] : "ভেতরে "}<span style={{ color: C.brand }}>{bn(pts.length)}টি {p.s.head ? p.s.head[1] : "প্রধান অংশ"}</span></H></div>
      <div style={{ position: "absolute", left: 130, top: 260 }}><Figure spec={spec} W={1100} reveal={reveal} /></div>
      <div style={{ position: "absolute", left: 1290, right: 120, top: 260, display: "flex", flexDirection: "column", gap: 16 }}>
        {pts.map((q, i) => (
          <Rise key={q.n} d={reveal[i]} y={20} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 20px", borderRadius: 18, background: C.card, border: `1px solid ${C.line}` }}>
            <div style={{ position: "relative", width: 46, height: 46 }}><div style={{ position: "absolute", left: 23, top: 23 }}><Pin n={q.n} size={44} /></div></div>
            <div><div style={{ fontFamily: BN, fontSize: 30, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{q.label}</div><div style={{ fontFamily: EN, fontSize: 17, color: C.faint, fontWeight: 600 }}>{q.en}</div></div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SFocus: React.FC<P> = (p) => {
  const { s, spec } = p; const q = spec.figure!.points.find((x) => x.n === s.n)!;
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const A = s.analogy ? ICONS[s.analogy[0]] || BookOpen : null;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 190 }}><Figure spec={spec} W={1120} focus={s.n} zoom={s.zoom || 2} zoomAt={4} /></div>
      <div style={{ position: "absolute", left: 1290, right: 110, top: 190 }}>
        <Rise d={6} style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: C.amber, display: "grid", placeItems: "center", fontFamily: BN, fontWeight: 800, fontSize: 44, color: "#fff", boxShadow: `0 12px 30px ${C.amber}66`, transform: `scale(${pop(f, fps, 6)})` }}>{bn(q.n)}</div>
          <div><div style={{ fontFamily: BN, fontSize: 50, fontWeight: 800, color: C.ink, lineHeight: 1.15 }}>{q.label}</div><div style={{ fontFamily: EN, fontSize: 22, fontWeight: 700, color: C.brand, letterSpacing: "0.04em" }}>{q.en}</div></div>
        </Rise>
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 16 }}>
          {(s.pts || []).map((t: string, i: number) => (
            <Rise key={i} d={at(p, 0.15 + i * 0.22)} y={20} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.brand, transform: "rotate(45deg)", marginTop: 17, flex: "none" }} />
              <span style={{ fontFamily: BN, fontSize: 34, color: C.txt, lineHeight: 1.4 }}>{t}</span>
            </Rise>
          ))}
        </div>
        {A && (
          <Rise d={at(p, 0.55)} style={{ marginTop: 34 }}>
            <Card style={{ padding: "22px 24px", display: "flex", gap: 18, alignItems: "center", background: C.soft, border: `1px solid ${C.brand}22`, boxShadow: "none" }}>
              <div style={{ width: 62, height: 62, borderRadius: 18, background: "#fff", display: "grid", placeItems: "center", flex: "none" }}><A size={34} color={C.brand} strokeWidth={1.8} /></div>
              <span style={{ fontFamily: BN, fontSize: 28, color: C.ink, lineHeight: 1.4 }}>{s.analogy[1]}</span>
            </Card>
          </Rise>
        )}
        {s.compare && (
          <div style={{ marginTop: 30, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {s.compare.map(([k, b, t]: string[], i: number) => (
              <Rise key={k} d={at(p, 0.45 + i * 0.25)}>
                <Card style={{ padding: "22px 20px", border: `2px solid ${i ? C.green : C.line}`, boxShadow: "none", height: "100%" }}>
                  <div style={{ fontFamily: EN, fontSize: 30, fontWeight: 800, color: i ? C.green : C.mute }}>{k}</div>
                  <div style={{ fontFamily: BN, fontSize: 26, fontWeight: 700, color: C.ink }}>{b}</div>
                  <div style={{ fontFamily: BN, fontSize: 22, color: C.mute, marginTop: 6, lineHeight: 1.45 }}>{t}</div>
                </Card>
              </Rise>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const SUnits: React.FC<P> = (p) => {
  const { s } = p; const marks = [0.04, 0.16, 0.3, 0.44, 0.62, 0.8];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 150 }}><H d={4} size={56}>{s.head ? s.head[0] : "তথ্যের একক — "}<span style={{ color: C.brand }}>{s.head ? s.head[1] : "ছোট থেকে বড়"}</span></H></div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 270, display: "flex", flexDirection: "column", gap: 14 }}>
        {s.rows.map(([b, e, t, icon]: string[], i: number) => {
          const I = ICONS[icon] || FileText;
          return (
            <Rise key={i} d={at(p, marks[i])} y={24} style={{ display: "grid", gridTemplateColumns: "90px 300px 1fr", alignItems: "center", gap: 24, padding: "14px 26px", borderRadius: 20, background: C.card, border: `1px solid ${C.line}`, marginLeft: s.flat ? 0 : i * 34 }}>
              <div style={{ width: 66, height: 66, borderRadius: 18, background: C.soft, display: "grid", placeItems: "center" }}><I size={34} color={C.brand} strokeWidth={1.8} /></div>
              <div><span style={{ fontFamily: BN, fontSize: 38, fontWeight: 800, color: C.ink }}>{b}</span> <span style={{ fontFamily: EN, fontSize: 24, fontWeight: 800, color: C.brand2, marginLeft: 8 }}>{e}</span></div>
              <span style={{ fontFamily: BN, fontSize: 32, color: C.mute }}>{t}</span>
            </Rise>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SNote: React.FC<P> = (p) => {
  const { s } = p; const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = pop(f, fps, 4);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Card style={{ width: 1300, padding: "60px 70px", background: C.asoft, border: `2px solid ${C.amber}66`, display: "flex", gap: 46, alignItems: "center", marginTop: -40 }}>
        <div style={{ width: 170, height: 170, borderRadius: 40, background: C.amber, display: "grid", placeItems: "center", flex: "none", transform: `scale(${k}) rotate(${(1 - k) * -20}deg)` }}><TriangleAlert size={100} color="#fff" strokeWidth={1.8} /></div>
        <div>
          <H d={8} size={64} color={C.amber}>{s.head}</H>
          <Rise d={at(p, 0.1)} style={{ marginTop: 12 }}><div style={{ fontFamily: BN, fontSize: 46, fontWeight: 800, color: C.ink, lineHeight: 1.3 }}>{s.text}</div></Rise>
          <Rise d={at(p, 0.6)} style={{ marginTop: 16 }}><div style={{ fontFamily: BN, fontSize: 32, color: C.mute }}>{s.sub}</div></Rise>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const SRecap: React.FC<P> = (p) => {
  const { spec } = p; const pts = spec.figure ? spec.figure.points : [];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 150 }}><H d={4} size={56}>আজ যা <span style={{ color: C.green }}>শিখলাম</span></H></div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 280, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {(p.s.items || [...pts.map((q) => q.label), "তথ্যের একক"]).map((t, i) => (
          <Rise key={i} d={at(p, 0.1 + i * 0.1)} y={26}>
            <Card style={{ padding: "26px 24px", display: "flex", gap: 16, alignItems: "center", boxShadow: "none" }}>
              <CircleCheck size={42} color={C.green} strokeWidth={2} style={{ flex: "none" }} />
              <span style={{ fontFamily: BN, fontSize: 32, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{t}</span>
            </Card>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SQuiz: React.FC<P & { answer?: boolean }> = (p) => {
  const { s } = p; const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const holdStart = LEAD + p.vo, hold = s.hold || 0;
  const left = p.answer ? 0 : Math.max(0, Math.ceil((holdStart + hold - f) / 30));
  const ring = p.answer ? 0 : interpolate(f, [holdStart, holdStart + hold], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 150 }}><Rise d={2}><span style={{ fontFamily: EN, fontSize: 22, fontWeight: 800, letterSpacing: "0.28em", color: C.green }}>QUICK CHECK</span></Rise></div>
      <Card style={{ position: "absolute", left: 130, right: 130, top: 210, padding: "40px 48px" }}>
        <div style={{ fontFamily: BN, fontSize: 52, fontWeight: 800, color: C.ink }}>{s.q}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 30 }}>
          {s.o.map((o: string, i: number) => {
            const right = p.answer && i === s.a;
            return (
              <Rise key={i} d={p.answer ? 0 : at(p, 0.2 + i * 0.1)} y={18} style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 26px", borderRadius: 20, border: `3px solid ${right ? C.green : C.line}`, background: right ? C.gsoft : "#fff", opacity: p.answer && !right ? 0.5 : 1 }}>
                <div style={{ width: 52, height: 52, borderRadius: 26, background: right ? C.green : C.soft, color: right ? "#fff" : C.brand, display: "grid", placeItems: "center", fontFamily: EN, fontWeight: 800, fontSize: 24, flex: "none" }}>{right ? <Check size={30} strokeWidth={3.5} /> : "কখগঘ"[i]}</div>
                <span style={{ fontFamily: BN, fontSize: 38, fontWeight: 600, color: C.ink }}>{o}</span>
              </Rise>
            );
          })}
        </div>
        {p.answer && <Rise d={at(p, 0.3)} style={{ marginTop: 26, padding: "18px 24px", borderRadius: 16, background: C.gsoft, fontFamily: BN, fontSize: 32, color: C.green, fontWeight: 600 }}>✔ {s.ex}</Rise>}
      </Card>
      {!p.answer && hold > 0 && f >= holdStart && (
        <div style={{ position: "absolute", left: "50%", top: 820, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 18 }}>
          <svg width={92} height={92} style={{ transform: "rotate(-90deg)" }}><circle cx={46} cy={46} r={40} stroke={C.line} strokeWidth={8} fill="none" /><circle cx={46} cy={46} r={40} stroke={C.brand} strokeWidth={8} fill="none" strokeDasharray={251} strokeDashoffset={251 * (1 - ring)} strokeLinecap="round" /></svg>
          <span style={{ fontFamily: BN, fontSize: 40, fontWeight: 800, color: C.ink }}><Timer size={34} style={{ verticalAlign: -4 }} /> ভাবুন… {bn(left)}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

const SOutro: React.FC<P> = (p) => {
  const { spec } = p; const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = pop(f, fps, 4);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 180, width: 170, height: 170, borderRadius: 85, background: C.green, display: "grid", placeItems: "center", transform: `scale(${k})`, boxShadow: `0 20px 60px ${C.green}55` }}><Check size={100} color="#fff" strokeWidth={3} /></div>
      <div style={{ position: "absolute", top: 400, textAlign: "center" }}><H d={10} size={84}>পাঠ সম্পন্ন!</H></div>
      <Rise d={at(p, 0.2)} style={{ position: "absolute", top: 560 }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 24, padding: "28px 40px" }}>
          <span style={{ fontFamily: BN, fontSize: 30, color: C.mute }}>পরের পাঠ</span>
          <ArrowRight size={34} color={C.brand} />
          <span style={{ fontFamily: BN, fontSize: 42, fontWeight: 800, color: C.ink }}>{spec.next}</span>
        </Card>
      </Rise>
      <Rise d={at(p, 0.45)} style={{ position: "absolute", top: 740, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 15, background: GRAD, display: "grid", placeItems: "center" }}><GraduationCap size={30} color="#fff" /></div>
        <div style={{ fontFamily: EN, lineHeight: 1.1, color: C.ink }}><div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.12em" }}>AI UNIVERSITY</div><div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.42em", color: C.mute }}>OF BANGLADESH</div></div>
      </Rise>
    </AbsoluteFill>
  );
};

const MAP: Record<string, React.FC<any>> = { title: STitle, myth: SMyth, overview: SOverview, focus: SFocus, units: SUnits, note: SNote, recap: SRecap, quizQ: SQuiz, quizA: (p: P) => <SQuiz {...p} answer />, outro: SOutro };

/* ---------- frame chrome ---------- */
const Header: React.FC<{ spec: Spec; starts: number[] }> = ({ spec, starts }) => {
  const f = useCurrentFrame();
  const k = starts.filter((s) => f >= s).length;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 96, display: "flex", alignItems: "center", gap: 22, padding: "0 56px", background: "rgba(255,255,255,.88)", borderBottom: `1px solid ${C.line}` }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: GRAD, display: "grid", placeItems: "center" }}><GraduationCap size={30} color="#fff" /></div>
      <div style={{ fontFamily: BN, fontSize: 26, fontWeight: 700, color: C.ink }}>{spec.course}</div>
      <div style={{ width: 1, height: 34, background: C.line }} />
      <div style={{ fontFamily: BN, fontSize: 24, color: C.mute }}>{spec.lessonNo} · {spec.title}</div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 6, width: 420 }}>
        {starts.map((_, i) => <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < k - 1 ? `${C.brand}88` : i === k - 1 ? C.brand : C.line }} />)}
      </div>
    </div>
  );
};

const subChunks = (spec: Spec, starts: number[]) => spec.scenes.flatMap((s, i) => {
  const parts = s.vo.split(/(?<=[।?!,—])\s+/).reduce<string[]>((a, x) => { if (a.length && (a[a.length - 1].length < 24 || x.length < 10)) a[a.length - 1] += " " + x; else a.push(x); return a; }, []);
  const total = parts.reduce((n, x) => n + x.length, 0); let acc = 0;
  return parts.map((x) => { const from = starts[i] + LEAD + (s.frames * acc) / total; acc += x.length; return { s: x, from, to: starts[i] + LEAD + (s.frames * acc) / total }; });
});

export const LessonVideo: React.FC<{ spec: Spec }> = ({ spec }) => {
  const f = useCurrentFrame();
  const lens = spec.scenes.map(sceneLen);
  const starts = lens.reduce<number[]>((a, _, i) => [...a, i ? a[i - 1] + lens[i - 1] : 15], []);
  const chunks = subChunks(spec, starts);
  const c = chunks.find((x) => f >= x.from && f < x.to + 4);
  const total = lessonLen(spec);
  const speaking = (fr: number) => spec.scenes.some((s, i) => fr >= starts[i] + LEAD - 6 && fr <= starts[i] + LEAD + s.frames + 4);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: 0.55 }} />
      <AbsoluteFill style={{ background: `radial-gradient(1000px 600px at 85% 0%, ${C.brand}14, transparent 70%), radial-gradient(900px 600px at 0% 100%, ${C.brand2}12, transparent 70%)` }} />
      {spec.scenes.map((s, i) => {
        const S = MAP[s.type]; const len = lens[i];
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={len}>
            <Fade len={len}><S s={s} spec={spec} vo={s.frames} /></Fade>
            <Sequence from={LEAD}><Audio src={staticFile(`lessons/${spec.id}/vo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
            <Sequence from={0}><Audio src={staticFile(`aiu2/${i === 0 ? "swell" : s.type === "quizA" || s.type === "outro" ? "chime" : "whoosh"}.mp3`)} volume={0.32} /></Sequence>
          </Sequence>
        );
      })}
      <Header spec={spec} starts={starts} />
      {c && <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", opacity: interpolate(f, [c.from, c.from + 5, c.to, c.to + 4], [0, 1, 1, 0], clamp) }}><div style={{ maxWidth: 1500, padding: "10px 28px 14px", borderRadius: 14, background: "rgba(11,20,48,.86)", fontFamily: BN, fontSize: 36, fontWeight: 500, color: "#fff", textAlign: "center", lineHeight: 1.35 }}>{c.s.replace(/[।,]$/, "")}</div></div>}
      <Audio src={staticFile("aiu2/music.mp3")} volume={(fr) => (speaking(fr) ? 0.06 : 0.16) * interpolate(fr, [0, 30, total - 60, total], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [0, 12], [0, 1], { ...clamp, easing: ease }), interpolate(f, [len - 10, len], [1, 0], clamp));
  return <AbsoluteFill style={{ opacity: o, transform: `translateY(${(1 - o) * 14}px)` }}>{children}</AbsoluteFill>;
};
