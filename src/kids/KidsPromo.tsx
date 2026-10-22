// AI University কিডস — মার্কেটিং প্রোমো (Facebook/Instagram বুস্ট)। খাড়া ১০৮০×১৯২০ আর আড়াআড়ি ১৯২০×১০৮০।
// স্পেক src/kids/promo.json → scripts/kids_promo_make.py (Tanvir VO + সময়) → promo.timed.json। সব স্ক্রিন আসল (সাইট/অ্যাপ থেকে তোলা)।
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, delayRender, continueRender } from "remotion";
import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as loadNaskh } from "@remotion/google-fonts/NotoNaskhArabic";
import { loadFont as loadEmoji } from "@remotion/google-fonts/NotoColorEmoji";
import { Sky, Tuni, Confetti } from "./KidsEngine";

const FRED = loadFredoka("normal", { weights: ["600", "700"] }).fontFamily;
const NASKH = loadNaskh("normal", { weights: ["700"] }).fontFamily;
const EMOJI = `${loadEmoji().fontFamily},'Segoe UI Emoji',sans-serif`;
const BN = "Anek";
if (typeof document !== "undefined") {
  const h = delayRender("font Anek");
  const f = new FontFace("Anek", `url(${staticFile("fonts/AnekBangla.ttf")})`, { weight: "100 900" });
  f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}
const INK = "#2A1B5C";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 11, mass: 0.7 } });
const soft = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 200 }, durationInFrames: 16 });
const P = (p: string) => staticFile("kids/promo/" + p);

type Sc = { type: string; cap: string; vo: string; audio: string; frames: number; voAt: number; voFrames: number; [k: string]: any };
export type PromoSpec = { scenes: Sc[]; total: number };

// ফোনের ফ্রেমে আসল স্ক্রিন (লম্বা ছবি হলে ধীরে স্ক্রল)
const Phone: React.FC<{ src: string; w: number; x: number; y: number; rot?: number; s?: number; scroll?: number; shadow?: boolean }> = ({ src, w, x, y, rot = 0, s = 1, scroll = 0, shadow = true }) => {
  const h = w * 2.165, pad = w * 0.035;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: w * 0.12, background: "#1F2A44", padding: pad, transform: `rotate(${rot}deg) scale(${s})`, boxShadow: shadow ? "0 30px 60px rgba(30,20,80,.35)" : "none" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: w * 0.09, overflow: "hidden", background: "#fff", position: "relative" }}>
        <Img src={P(src)} style={{ width: "100%", display: "block", transform: `translateY(-${scroll}%)` }} />
      </div>
      <div style={{ position: "absolute", top: pad * 1.6, left: "50%", transform: "translateX(-50%)", width: w * 0.28, height: w * 0.05, borderRadius: 99, background: "#1F2A44" }} />
    </div>
  );
};

const Chip: React.FC<{ text: string; x: number; y: number; s: number; bg?: string; color?: string; size?: number; ar?: boolean }> = ({ text, x, y, s, bg = "#fff", color = INK, size = 52, ar }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, background: bg, color, borderRadius: 99, padding: `${size * 0.28}px ${size * 0.6}px`, fontFamily: ar ? `${NASKH}, ${BN}` : `${BN}, ${EMOJI}`, fontWeight: 800, fontSize: size, whiteSpace: "nowrap", boxShadow: "0 10px 0 rgba(42,27,92,.15)" }}>{text}</div>
);

// বড় বাংলা ক্যাপশন (শব্দ বন্ধ থাকলেও বোঝা যায়)
const Caption: React.FC<{ text: string; V: boolean }> = ({ text, V }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig(), s = pop(f, fps, 2);
  return (
    <div style={{ position: "absolute", left: V ? 50 : 0, right: V ? 50 : 0, bottom: V ? 150 : 46, display: "flex", justifyContent: "center", transform: `scale(${s})` }}>
      <div style={{ background: "#2A1B5C", color: "#fff", borderRadius: 36, padding: V ? "22px 38px" : "14px 40px", fontFamily: `${BN}, ${FRED}, ${EMOJI}`, fontWeight: 800, fontSize: V ? 66 : 54, lineHeight: 1.25, textAlign: "center", boxShadow: "0 12px 0 rgba(0,0,0,.18)", maxWidth: V ? 980 : 1500 }}>{text}</div>
    </div>
  );
};

const COURSES: [string, string, string][] = [["🔤", "ABC বন্ধু", "#4D7CFE"], ["অ", "বর্ণের দেশে", "#FF7A59"], ["ب", "আলিফ বা তা", "#12A4A4"], ["🌍", "ভাষার জাদু", "#FF9F1C"], ["🍎", "শব্দের ঝুলি", "#FF6B8B"], ["🤖", "ছোট্ট কোডার", "#9B5DE5"], ["➕", "মজার অঙ্ক", "#22B573"], ["🛟", "নিরাপদ আমি", "#F4A300"]];

const Scene: React.FC<{ sc: Sc; V: boolean }> = ({ sc, V }) => {
  const f = useCurrentFrame(), { fps, width: W, height: H } = useVideoConfig();
  const vo0 = sc.voAt, vo1 = sc.voAt + sc.voFrames, prog = (a: number, b: number) => interpolate(f, [vo0 + (vo1 - vo0) * a, vo0 + (vo1 - vo0) * b], [0, 1], clamp);
  const talking = f > vo0 && f < vo1;
  const cx = W / 2;
  switch (sc.type) {
    case "hook": {
      const shake = Math.sin(f / 1.6) * 4 * (1 - prog(0.6, 1));
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", left: cx - (V ? 260 : 210), top: V ? 260 : 120, width: V ? 520 : 420, height: V ? 1126 : 909, borderRadius: 60, background: "#1F2A44", padding: 18, transform: `rotate(${shake}deg) scale(${pop(f, fps, 0)})` }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 44, background: "linear-gradient(160deg,#ff5f6d,#ffc371,#8e54e9)", display: "grid", placeItems: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ fontFamily: EMOJI, fontSize: V ? 260 : 210, transform: `scale(${1 + Math.sin(f / 4) * 0.06})` }}>📺</div>
              <div style={{ position: "absolute", top: "12%", left: "10%", fontFamily: EMOJI, fontSize: 90, transform: `rotate(${f * 4}deg)` }}>💫</div>
              <div style={{ position: "absolute", bottom: "14%", right: "12%", fontFamily: EMOJI, fontSize: 90, transform: `rotate(${-f * 3}deg)` }}>🌀</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: V ? cx + 170 : cx + 230, top: V ? 230 : 110, fontFamily: EMOJI, fontSize: V ? 200 : 170, transform: `scale(${pop(f, fps, 10)}) rotate(${Math.sin(f / 3) * 10}deg)` }}>😵‍💫</div>
          <div style={{ position: "absolute", left: V ? 70 : cx - 520, top: V ? 1020 : 640, fontFamily: BN, fontWeight: 800, fontSize: V ? 230 : 200, color: "#FF5A5F", transform: `scale(${pop(f, fps, 16)})`, textShadow: "0 10px 0 rgba(0,0,0,.15)" }}>?</div>
        </AbsoluteFill>
      );
    }
    case "reveal": {
      const B = [["ABC", "#4D7CFE", FRED], ["অ আ", "#FF7A59", BN], ["ا ب ت", "#12A4A4", NASKH]];
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", top: V ? 220 : 90, width: "100%", textAlign: "center", fontFamily: BN, fontWeight: 800, fontSize: V ? 96 : 84, color: "#fff", textShadow: "0 6px 0 #3A7BD5", transform: `scale(${pop(f, fps, 2)})` }}>এবার মোবাইলেই শিখবে!</div>
          <div style={{ position: "absolute", top: V ? 520 : 300, left: 0, right: 0, display: "flex", flexDirection: V ? "column" : "row", alignItems: "center", justifyContent: "center", gap: V ? 50 : 60 }}>
            {B.map(([t, c, fnt], i) => {
              const at = vo0 + Math.round((vo1 - vo0) * (0.32 + i * 0.2)), s = pop(f, fps, at);
              return <div key={i} style={{ width: V ? 640 : 460, height: V ? 290 : 420, borderRadius: 60, background: c, color: "#fff", display: "grid", placeItems: "center", fontFamily: fnt, fontWeight: 700, fontSize: V ? 180 : 170, transform: `scale(${s}) rotate(${(1 - s) * 20 + (i - 1) * 3}deg)`, boxShadow: "0 18px 0 rgba(0,0,0,.18)", direction: i === 2 ? "rtl" : "ltr" }}>{t}</div>;
            })}
          </div>
        </AbsoluteFill>
      );
    }
    case "brand":
      return (
        <AbsoluteFill>
          <Img src={P("img/kids-logo.png")} style={{ position: "absolute", left: cx - (V ? 470 : 450), top: V ? 360 : 90, width: V ? 940 : 900, transform: `scale(${pop(f, fps, 2)})` }} />
          <div style={{ position: "absolute", top: V ? 820 : 470, width: "100%", textAlign: "center", fontFamily: BN, fontWeight: 800, fontSize: V ? 104 : 88, color: "#fff", textShadow: "0 6px 0 #3A7BD5", opacity: soft(f, fps, 14) }}>খেলতে খেলতে শিখি!</div>
          <div style={{ position: "absolute", left: cx, top: V ? 1080 : 660, transform: `translate(-50%,0) scale(${pop(f, fps, vo0 + (vo1 - vo0) * 0.55)}) rotate(-4deg)`, background: "linear-gradient(120deg,#FFC93C,#FF9F1C)", color: INK, borderRadius: 30, padding: "18px 60px", fontFamily: BN, fontWeight: 800, fontSize: V ? 96 : 84, boxShadow: "0 14px 0 rgba(0,0,0,.18)", whiteSpace: "nowrap" }}>⭐ প্রথম পাঠ ফ্রি ⭐</div>
          <Tuni size={V ? 300 : 260} talking={talking} x={V ? 60 : 80} y={V ? 1230 : 700} />
        </AbsoluteFill>
      );
    case "courses": {
      const phoneW = V ? 330 : 380;
      return (
        <AbsoluteFill>
          <Phone src={sc.shot} w={phoneW} x={V ? cx - phoneW / 2 : 220} y={V ? 930 : 50} rot={V ? 0 : -3} s={soft(f, fps, 0)} />
          {COURSES.map(([e, t, c], i) => {
            const at = vo0 + Math.round((vo1 - vo0) * (0.12 + i * 0.105)), s = pop(f, fps, at);
            const pos = V ? [i % 2 ? W - 275 : 275, 250 + Math.floor(i / 2) * 165] : [1000 + (i % 2) * 520, 140 + Math.floor(i / 2) * 200];
            return (
              <div key={i} style={{ position: "absolute", left: pos[0], top: pos[1], transform: `translate(-50%,-50%) scale(${s}) rotate(${(i % 2 ? 3 : -3)}deg)`, background: c, color: "#fff", borderRadius: 34, padding: V ? "16px 28px" : "14px 26px", display: "flex", alignItems: "center", gap: 14, fontFamily: `${BN}, ${NASKH}, ${EMOJI}`, fontWeight: 800, fontSize: V ? 50 : 46, whiteSpace: "nowrap", boxShadow: "0 12px 0 rgba(0,0,0,.18)" }}>
                <span style={{ fontFamily: `${EMOJI}, ${NASKH}, ${BN}`, background: "rgba(255,255,255,.25)", borderRadius: 18, width: V ? 72 : 66, height: V ? 72 : 66, display: "grid", placeItems: "center" }}>{e}</span>{t}
              </div>
            );
          })}
        </AbsoluteFill>
      );
    }
    case "how": {
      const shots: [string, string][] = sc.shots, cuts = [0, 0.3, 0.52, 0.76, 1.01];
      const k = Math.max(0, cuts.findIndex((c, i) => f < vo0 + (vo1 - vo0) * cuts[i + 1]));
      const at = vo0 + Math.round((vo1 - vo0) * cuts[k]), s = pop(f, fps, at - 4);
      const [src, label] = shots[Math.min(k, shots.length - 1)], phoneW = V ? 560 : 420;
      const tall = src.includes("paint-full");
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", top: V ? 120 : 60, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
            {shots.map((_, i) => <div key={i} style={{ width: i === k ? 90 : 30, height: 22, borderRadius: 99, background: i <= k ? "#FF6B8B" : "rgba(255,255,255,.7)", transition: "none" }} />)}
          </div>
          <Phone src={src} w={phoneW} x={V ? cx - phoneW / 2 : cx - phoneW / 2 - 330} y={V ? 300 : 110} s={0.85 + 0.15 * s} rot={(1 - s) * -8} scroll={tall ? interpolate(f, [at, at + 70], [0, 14], clamp) : 0} />
          <Chip text={label} x={V ? cx : cx + 360} y={V ? 230 : H / 2 - 40} s={s} bg="#FF6B8B" color="#fff" size={V ? 64 : 64} />
        </AbsoluteFill>
      );
    }
    case "langs": {
      const phoneW = V ? 520 : 400, L: [string, string, boolean][] = [["বাংলা · আপেল", "#FF7A59", false], ["English · Apple", "#4D7CFE", false], ["আরবি · تُفَّاحَة", "#12A4A4", true]];
      return (
        <AbsoluteFill>
          <Phone src={sc.shot} w={phoneW} x={V ? cx - phoneW / 2 : 260} y={V ? 300 : 60} s={soft(f, fps, 0)} />
          {L.map(([t, c, ar], i) => <Chip key={i} text={t} x={V ? cx : 1240} y={V ? 190 + 0 * i : 280 + i * 190} s={V ? (i === Math.min(2, Math.floor(prog(0.2, 0.95) * 3)) ? pop(f, fps, vo0 + (vo1 - vo0) * (0.2 + i * 0.25)) : 0) : pop(f, fps, vo0 + (vo1 - vo0) * (0.2 + i * 0.25))} bg={c} color="#fff" size={V ? 70 : 64} ar={ar} />)}
        </AbsoluteFill>
      );
    }
    case "clips": {
      const cl: [string, string, string][] = sc.clips, n = cl.length;
      const seg = Math.max(1, Math.floor((vo1 - vo0 + 20) / n)), k = Math.min(n - 1, Math.max(0, Math.floor((f - vo0 + 6) / seg)));
      const t0 = vo0 - 6 + k * seg, s0 = pop(f, fps, t0), [file, label, col] = cl[k];
      const cw = V ? 1000 : 960, ch = cw * 9 / 16, tilt = (k % 2 ? 2.2 : -2.2) * (1 - Math.min(1, s0));
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", top: V ? 150 : 28, width: "100%", textAlign: "center", fontFamily: BN, fontWeight: 800, fontSize: V ? 60 : 54, color: "#fff", whiteSpace: "nowrap", textShadow: "0 6px 0 #3A7BD5", transform: `scale(${pop(f, fps, 2)})` }}>🎬 প্রতিটা পাঠ শুরু অ্যানিমেশনে</div>
          <div style={{ position: "absolute", left: cx - cw / 2, top: V ? 400 : 150, width: cw, height: ch, borderRadius: 52, overflow: "hidden", border: `14px solid ${col}`, background: "#fff", boxShadow: "0 30px 70px rgba(30,40,90,.38)", transform: `scale(${0.88 + 0.12 * Math.min(1, s0)}) rotate(${tilt}deg)` }}>
            <OffthreadVideo src={P("clips/" + file)} muted startFrom={0} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 22, top: 18, background: "rgba(255,255,255,.92)", borderRadius: 99, padding: "6px 22px", fontFamily: EMOJI, fontSize: 38 }}>▶ আসল পাঠ</div>
          </div>
          <Chip text={label} x={cx} y={V ? 400 + ch + 120 : 150 + ch + 72} s={s0} bg={col} color="#fff" size={V ? 66 : 56} />
          <div style={{ position: "absolute", top: V ? 400 + ch + 230 : 150 + ch + 140, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
            {cl.map((_, i) => <div key={i} style={{ width: i === k ? 90 : 28, height: 22, borderRadius: 99, background: i <= k ? "#FF6B8B" : "rgba(255,255,255,.75)" }} />)}
          </div>
          <Tuni size={V ? 250 : 230} talking={talking} x={V ? W - 330 : 60} y={V ? 1330 : 760} />
        </AbsoluteFill>
      );
    }
    case "home": {
      const phoneW = V ? 500 : 400;
      return (
        <AbsoluteFill>
          <Phone src={sc.shot} w={phoneW} x={V ? cx - phoneW / 2 - 120 : 300} y={V ? 200 : 60} rot={-4} s={soft(f, fps, 0)} />
          <div style={{ position: "absolute", left: V ? cx + 10 : 980, top: V ? 860 : 330, width: V ? 470 : 680, transform: `rotate(5deg) scale(${pop(f, fps, vo0 + (vo1 - vo0) * 0.6)})`, borderRadius: 26, overflow: "hidden", boxShadow: "0 24px 50px rgba(30,20,80,.35)", border: "8px solid #fff" }}>
            <Img src={P(sc.cert)} style={{ width: "100%", display: "block", marginTop: "-28%", marginBottom: "-110%" }} />
          </div>
          {["⭐", "🏅", "🔥"].map((e, i) => <div key={i} style={{ position: "absolute", left: V ? 760 + i * 90 : 1000 + i * 150, top: V ? 300 + i * 120 : 150, fontFamily: EMOJI, fontSize: V ? 110 : 100, transform: `scale(${pop(f, fps, vo0 + (vo1 - vo0) * (0.25 + i * 0.12))}) rotate(${Math.sin(f / 6 + i) * 10}deg)` }}>{e}</div>)}
        </AbsoluteFill>
      );
    }
    case "parent": {
      const phoneW = V ? 540 : 420;
      return (
        <AbsoluteFill>
          <Phone src={sc.shot} w={phoneW} x={V ? cx - phoneW / 2 : 360} y={V ? 280 : 60} s={soft(f, fps, 0)} scroll={interpolate(f, [vo0, vo1], [0, 6], clamp)} />
          <Chip text="👩 বাবা-মায়ের ড্যাশবোর্ড" x={V ? cx : 1300} y={V ? 190 : 420} s={pop(f, fps, 6)} bg="#2A1B5C" color="#fff" size={V ? 60 : 58} />
          <Chip text="📊 কোর্সে কত %" x={V ? cx : 1300} y={V ? 1500 : 600} s={pop(f, fps, vo0 + (vo1 - vo0) * 0.5)} bg="#22B573" color="#fff" size={V ? 56 : 54} />
        </AbsoluteFill>
      );
    }
    case "app": {
      const phoneW = V ? 440 : 380, [a, b] = sc.shots;
      return (
        <AbsoluteFill>
          <Phone src={a} w={phoneW} x={V ? cx - phoneW - 10 : cx - phoneW - 40} y={V ? 330 : 80} rot={-7} s={pop(f, fps, 2)} />
          <Phone src={b} w={phoneW} x={V ? cx + 10 : cx + 40} y={V ? 290 : 60} rot={6} s={pop(f, fps, 10)} />
          <div style={{ position: "absolute", left: cx, top: V ? 160 : 70, transform: `translate(-50%,0) scale(${pop(f, fps, 14)})`, display: "flex", alignItems: "center", gap: 20, background: "#fff", borderRadius: 40, padding: "14px 34px 14px 14px", boxShadow: "0 12px 0 rgba(0,0,0,.15)" }}>
            <Img src={P("img/app-icon.png")} style={{ width: V ? 110 : 96, height: V ? 110 : 96, borderRadius: 26 }} />
            <span style={{ fontFamily: `${BN}, ${EMOJI}`, fontWeight: 800, fontSize: V ? 58 : 54, color: INK, whiteSpace: "nowrap" }}>📱 অ্যান্ড্রয়েড অ্যাপ</span>
          </div>
        </AbsoluteFill>
      );
    }
    default: // cta
      return (
        <AbsoluteFill>
          <Img src={P("img/kids-logo.png")} style={{ position: "absolute", left: cx - (V ? 440 : 480), top: V ? 260 : 80, width: V ? 880 : 960, transform: `scale(${pop(f, fps, 2)})` }} />
          <div style={{ position: "absolute", left: cx, top: V ? 760 : 520, transform: `translate(-50%,0) scale(${pop(f, fps, 12) * (1 + Math.sin(f / 7) * 0.025)})`, background: "#fff", color: "#4D7CFE", borderRadius: 99, padding: V ? "26px 56px" : "22px 60px", fontFamily: FRED, fontWeight: 700, fontSize: V ? 76 : 80, whiteSpace: "nowrap", boxShadow: "0 14px 0 rgba(42,27,92,.18)" }}>aiuniversitybd.com/kids</div>
          <div style={{ position: "absolute", left: cx, top: V ? 960 : 700, transform: `translate(-50%,0) scale(${pop(f, fps, 24)}) rotate(-3deg)`, background: "linear-gradient(120deg,#FFC93C,#FF9F1C)", color: INK, borderRadius: 30, padding: "14px 50px", fontFamily: BN, fontWeight: 800, fontSize: V ? 82 : 76, whiteSpace: "nowrap", boxShadow: "0 12px 0 rgba(0,0,0,.18)" }}>৩–১২ বছর · প্রথম পাঠ ফ্রি</div>
          <Tuni size={V ? 340 : 280} talking={talking} x={V ? cx - 170 : 100} y={V ? 1150 : 700} />
          <Confetti from={0} seed="cta" />
        </AbsoluteFill>
      );
  }
};

export const KidsPromo: React.FC<{ spec: PromoSpec }> = ({ spec }) => {
  const { width, height } = useVideoConfig(), V = height > width;
  let at = 0;
  return (
    <AbsoluteFill style={{ fontFamily: BN, overflow: "hidden" }}>
      <Sky />
      <Audio src={staticFile("kids/_shared/music.mp3")} volume={(fr) => interpolate(fr, [0, 15, spec.total - 30, spec.total], [0.08, 0.16, 0.16, 0], clamp)} />
      {spec.scenes.map((sc, i) => {
        const from = at; at += sc.frames;
        return (
          <Sequence key={i} from={from} durationInFrames={sc.frames}>
            <Sequence from={sc.voAt}><Audio src={staticFile(sc.audio)} /></Sequence>
            {i ? <Sequence durationInFrames={20}><Audio src={staticFile("kids/_shared/pop.mp3")} volume={0.35} /></Sequence> : null}
            <Scene sc={sc} V={V} />
            <Caption text={sc.cap} V={V} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", right: V ? 36 : 40, top: V ? 40 : 30, background: "rgba(255,255,255,.92)", borderRadius: 99, padding: "8px 24px", fontFamily: FRED, fontWeight: 700, fontSize: V ? 34 : 30, color: INK }}>AI University <span style={{ color: "#FF6B8B" }}>Kids</span></div>
    </AbsoluteFill>
  );
};
