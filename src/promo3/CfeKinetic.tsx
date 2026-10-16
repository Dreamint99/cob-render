// Computer course promo — KINETIC TYPOGRAPHY style: paper-white, giant black Bangla words that slam in,
// yellow marker highlights, electric-blue accents, real lesson clips in tilted cards.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AppWindow, BN, Clip, EN, Icon, Logo, Rec, hasRec, Scene, Scenes, Soundtrack, Spec, clamp, enter, pop, totalLen, useFps } from "./shared";

const K = { paper: "#FAF8F2", ink: "#0B0D12", blue: "#1D4ED8", sky: "#0EA5E9", yel: "#FFD43B", mute: "#6B7080", red: "#E11D48", green: "#16A34A" };

const Marker: React.FC<{ p: number; children: React.ReactNode; color?: string }> = ({ p, children, color = K.yel }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    <span style={{ position: "absolute", left: -10, right: -10, bottom: "8%", height: "42%", background: color, transformOrigin: "left", transform: `scaleX(${p}) skewX(-8deg)`, zIndex: 0 }} />
    <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
  </span>
);

const Slam: React.FC<{ f: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, children, style }) => {
  const fps = useFps();
  const p = pop(f, fps, at, 11);
  const o = interpolate(f, [at, at + 3], [0, 1], clamp);
  return <div style={{ opacity: o, transform: `scale(${interpolate(p, [0, 1], [2.2, 1])}) rotate(${interpolate(p, [0, 1], [-6, 0])}deg)`, ...style }}>{children}</div>;
};

const Bg: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: K.paper }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${K.ink}14 1.6px, transparent 1.6px)`, backgroundSize: "34px 34px", backgroundPosition: `${-f * 0.4}px 0` }} />
  </AbsoluteFill>
);

const Head: React.FC<{ f: number; text: string; color?: string }> = ({ f, text, color = K.ink }) => (
  <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 64, color, opacity: enter(f, 0, 12), transform: `translateY(${(1 - enter(f, 0, 14)) * 30}px)` }}>{text}</div>
);

function render(spec: Spec, s: Scene, f: number, len: number) {
  const pid = spec.id;
  switch (s.k) {
    case "hook": {
      const per = Math.min(14, Math.floor((len * 0.55) / s.words.length));
      const shake = Math.sin(f * 1.7) * 6 * interpolate(f, [0, 60], [1, 0.4], clamp);
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "absolute", right: 210, top: 170, transform: `rotate(${shake}deg)`, opacity: enter(f, 4) }}><Icon name="mouse-pointer-2" size={170} color={K.blue} stroke={2.4} /></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 40px", justifyContent: "center", width: 1500, fontFamily: BN, fontWeight: 800, fontSize: 190, lineHeight: 1.1, color: K.ink }}>
            {s.words.map((w: string, i: number) => (
              <Slam key={i} f={f} at={i * per}>{w === s.mark ? <Marker p={enter(f, i * per + 6, 10)} color={K.yel}>{w}</Marker> : w}</Slam>
            ))}
          </div>
          <div style={{ position: "absolute", bottom: 160, fontFamily: BN, fontSize: 58, fontWeight: 600, color: K.mute, opacity: enter(f, s.words.length * per + 10) }}>{s.sub}</div>
        </AbsoluteFill>
      );
    }
    case "free": {
      const fps = useFps();
      const st = pop(f, fps, 34, 9);
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Slam f={f} at={2} style={{ fontFamily: EN, fontWeight: 900, fontSize: 470, color: K.blue, lineHeight: 1, letterSpacing: -10 }}>৳০</Slam>
          <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 92, color: K.ink, marginTop: 10 }}><Marker p={enter(f, 18, 14)}>{s.line}</Marker></div>
          <div style={{ position: "absolute", right: 260, top: 230, transform: `rotate(${interpolate(st, [0, 1], [-40, -12])}deg) scale(${st})`, border: `7px solid ${K.red}`, color: K.red, borderRadius: 18, padding: "14px 30px", fontFamily: BN, fontWeight: 800, fontSize: 52 }}>{s.tag}</div>
        </AbsoluteFill>
      );
    }
    case "list": {
      const n = s.items.length, per = (len - 30) / n;
      const cur = Math.min(n - 1, Math.floor(Math.max(0, f - 10) / per));
      const clip = s.clips[Math.min(s.clips.length - 1, Math.floor((f / len) * s.clips.length))];
      return (
        <AbsoluteFill style={{ padding: "110px 120px" }}>
          <Head f={f} text={s.head} color={K.blue} />
          <div style={{ display: "flex", gap: 70, marginTop: 40 }}>
            <div style={{ width: 860, position: "relative", height: 760 }}>
              {s.items.map((t: string, i: number) => {
                const d = i - cur;
                if (d > 0 || d < -3) return null;
                const e = enter(f, 10 + i * per, 12);
                return (
                  <div key={i} style={{ position: "absolute", top: 300 + d * 92 - (1 - e) * -80, left: 0, fontFamily: BN, fontWeight: 800, fontSize: d === 0 ? 84 : 52, color: d === 0 ? K.ink : K.mute, opacity: d === 0 ? e : Math.max(0, 0.75 + d * 0.13), whiteSpace: "nowrap", transition: "none" }}>
                    {d === 0 ? <Marker p={enter(f, 14 + i * per, 10)}>{t}</Marker> : t}
                  </div>
                );
              })}
            </div>
            <div style={{ width: 820, height: 470, marginTop: 120, borderRadius: 26, overflow: "hidden", border: `8px solid ${K.ink}`, transform: `rotate(2.5deg) scale(${0.9 + enter(f, 6) * 0.1})`, boxShadow: `22px 22px 0 ${K.blue}`, opacity: enter(f, 6) }}>
              <Clip pid={pid} name={clip} />
            </div>
          </div>
        </AbsoluteFill>
      );
    }
    case "stats": {
      const per = Math.floor((len * 0.6) / s.stats.length);
      return (
        <AbsoluteFill style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", padding: 110, gap: 0 }}>
          {s.stats.map(([n, l]: string[], i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 40, padding: "0 50px", borderRight: i % 2 === 0 ? `4px solid ${K.ink}` : "none", borderBottom: i < 2 ? `4px solid ${K.ink}` : "none" }}>
              <Slam f={f} at={i * per} style={{ fontFamily: BN, fontWeight: 800, fontSize: 250, color: i % 2 ? K.ink : K.blue, lineHeight: 1 }}>{n}</Slam>
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 64, color: K.ink, opacity: enter(f, i * per + 8) }}>{l}</div>
            </div>
          ))}
        </AbsoluteFill>
      );
    }
    case "video": {
      const z = interpolate(f, [0, len], [1, 1.06]);
      return (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 80 }}>
          <Head f={f} text={s.head} />
          <div style={{ marginTop: 40, transform: `perspective(1600px) rotateX(${(1 - enter(f, 4, 22)) * 25}deg) scale(${z})`, opacity: enter(f, 4) }}>
            <AppWindow w={1440} h={810}>
              <Rec spec={spec} name={s.rec} fallback={<Clip pid={pid} name={s.clip} start={30 * 20} />} />
            </AppWindow>
          </div>
        </AbsoluteFill>
      );
    }
    case "guru": {
      const typed = Math.floor(interpolate(f, [30, 30 + s.a.length * 0.9], [0, s.a.length], clamp));
      const bubble = (mine: boolean, txt: React.ReactNode, at: number) => (
        <div style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: 900, padding: "26px 34px", borderRadius: 30, borderBottomRightRadius: mine ? 6 : 30, borderBottomLeftRadius: mine ? 30 : 6, background: mine ? K.blue : "#fff", color: mine ? "#fff" : K.ink, border: mine ? "none" : `4px solid ${K.ink}`, fontFamily: BN, fontWeight: 600, fontSize: 46, lineHeight: 1.4, opacity: enter(f, at, 10), transform: `translateY(${(1 - enter(f, at, 14)) * 40}px)` }}>{txt}</div>
      );
      return (
        <AbsoluteFill style={{ padding: "100px 200px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: enter(f, 0) }}>
            <div style={{ width: 110, height: 110, borderRadius: 60, background: K.blue, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="bot" size={64} color="#fff" /></div>
            <div>
              <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 74, color: K.ink, lineHeight: 1.1 }}>{s.name}</div>
              <div style={{ display: "inline-block", marginTop: 6, background: K.yel, padding: "4px 18px", borderRadius: 10, fontFamily: BN, fontWeight: 700, fontSize: 34 }}>{s.label} · ২৪ ঘণ্টা</div>
            </div>
          </div>
          {hasRec(spec, s.rec) ? (
            <div style={{ marginTop: 40, opacity: enter(f, 4), transform: `scale(${0.94 + enter(f, 4, 20) * 0.06})` }}><AppWindow w={1520} h={740}><Rec spec={spec} name={s.rec} fallback={null} /></AppWindow></div>
          ) : <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 70 }}>
            {bubble(true, s.q, 8)}
            {bubble(false, <>{s.a.slice(0, typed)}<span style={{ opacity: f % 16 < 8 ? 1 : 0 }}>▍</span></>, 26)}
          </div>}
        </AbsoluteFill>
      );
    }
    case "book": {
      const rot = interpolate(f, [0, len], [-28, -12]);
      return (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 170px", gap: 110 }}>
          <div style={{ perspective: 1800, opacity: enter(f, 0) }}>
            <div style={{ width: 520, height: 700, borderRadius: "10px 26px 26px 10px", background: `linear-gradient(150deg, #0b2a6f, ${K.sky})`, transform: `rotateY(${rot}deg)`, boxShadow: `-18px 30px 60px rgba(0,0,0,.35), inset 18px 0 0 rgba(0,0,0,.25)`, padding: "70px 50px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#fff" }}>
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 30, opacity: 0.8 }}>স্পেশাল বই</div>
              <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 78, lineHeight: 1.15 }}>{s.title}</div>
              <Logo dark w={210} />
            </div>
          </div>
          <div>
            <Slam f={f} at={6} style={{ fontFamily: BN, fontWeight: 800, fontSize: 110, color: K.ink, lineHeight: 1.1 }}>সাথে <Marker p={enter(f, 14, 12)}>স্পেশাল বই</Marker></Slam>
            <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 50, color: K.mute, marginTop: 30, opacity: enter(f, 20) }}>{s.sub}</div>
            {hasRec(spec, s.rec) && <div style={{ marginTop: 40, opacity: enter(f, 26), transform: `rotate(1.5deg)` }}><AppWindow w={960} h={500} style={{ boxShadow: `18px 18px 0 ${K.blue}` }}><Rec spec={spec} name={s.rec} fallback={null} /></AppWindow></div>}
          </div>
        </AbsoluteFill>
      );
    }
    case "why": {
      const n = s.pts.length, start = 40, per = (len - start - 10) / n;
      const cur = Math.max(-1, Math.min(n - 1, Math.floor((f - start) / per)));
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: K.ink }}>
          {cur < 0 ? (
            <Slam f={f} at={2} style={{ fontFamily: BN, fontWeight: 800, fontSize: 140, color: "#fff", textAlign: "center", lineHeight: 1.15 }}>কেন আমাদের<br /><span style={{ color: K.yel }}>কোর্স আলাদা?</span></Slam>
          ) : (
            <div key={cur} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: EN, fontWeight: 900, fontSize: 60, color: K.yel, opacity: 0.9 }}>0{cur + 1}</div>
              <Slam f={f} at={start + cur * per} style={{ fontFamily: BN, fontWeight: 800, fontSize: 112, color: "#fff", maxWidth: 1600, lineHeight: 1.2 }}>{s.pts[cur]}</Slam>
            </div>
          )}
          <div style={{ position: "absolute", bottom: 90, display: "flex", gap: 16 }}>
            {s.pts.map((_: string, i: number) => <div key={i} style={{ width: 70, height: 10, borderRadius: 5, background: i <= cur ? K.yel : "#ffffff30" }} />)}
          </div>
        </AbsoluteFill>
      );
    }
    case "cert": {
      const sweep = interpolate(f, [20, 60], [-40, 140], clamp);
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ transform: `rotate(${interpolate(enter(f, 0, 20), [0, 1], [-8, -2])}deg) scale(${0.85 + enter(f, 0, 20) * 0.15})`, opacity: enter(f, 0) }}>
            <Rec spec={spec} name={s.rec} fallback={
              <div style={{ width: 1300, height: 760, background: "#fff", border: `14px double ${K.blue}`, borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, position: "relative", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.2)" }}>
                <Logo w={260} />
                <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 96, color: K.ink }}>সার্টিফিকেট</div>
                <div style={{ fontFamily: BN, fontSize: 40, color: K.mute }}>এই মর্মে প্রত্যয়ন করা যাচ্ছে যে</div>
                <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 70, color: K.blue, borderBottom: `3px solid ${K.ink}30`, padding: "0 80px" }}>আপনার নাম</div>
                <div style={{ fontFamily: BN, fontSize: 38, color: K.ink }}>“{spec.title}” সফলভাবে সম্পন্ন করেছেন</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: BN, fontSize: 32, color: K.green, fontWeight: 700 }}><Icon name="shield-check" size={38} color={K.green} />অনলাইনে যাচাইযোগ্য</div>
                <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep}%`, width: 160, background: "linear-gradient(90deg, transparent, rgba(255,212,59,.55), transparent)", transform: "skewX(-20deg)" }} />
              </div>
            } />
          </div>
        </AbsoluteFill>
      );
    }
    case "cta":
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 10 }}>
          <Slam f={f} at={2} style={{ fontFamily: BN, fontWeight: 800, fontSize: 300, color: K.blue, lineHeight: 1 }}>{s.price}</Slam>
          <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 64, color: K.ink, opacity: enter(f, 14) }}><Marker p={enter(f, 18)}>{s.line}</Marker></div>
          <div style={{ marginTop: 60, opacity: enter(f, 40), transform: `scale(${0.9 + enter(f, 40) * 0.1})` }}><Logo w={430} /></div>
          <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 48, color: K.ink, opacity: enter(f, 60) }}>শিখবে তুমি দেখবে দেশ — <span style={{ color: K.green }}>এইবার তোমার হাতে আগামীর বাংলাদেশ</span></div>
        </AbsoluteFill>
      );
  }
  return null;
}

export const CfeKinetic: React.FC<{ spec: Spec; durs: number[] }> = ({ spec, durs }) => {
  const total = totalLen(durs);
  return (
    <AbsoluteFill style={{ background: K.paper }}>
      <BgLayer />
      <Scenes spec={spec} durs={durs} render={(s, f, len) => render(spec, s, f, len)} />
      <Corner />
      <Soundtrack pid={spec.id} durs={durs} total={total} music="aiu2/music.mp3" />
    </AbsoluteFill>
  );
};
const BgLayer: React.FC = () => <Bg f={useCurrentFrame()} />;
const Corner: React.FC = () => (
  <div style={{ position: "absolute", left: 50, bottom: 40, display: "flex", alignItems: "center", gap: 12, fontFamily: BN, fontWeight: 700, fontSize: 26, color: K.mute }}>
    <Img src={staticFile("brand/mark-dark.png")} style={{ width: 40, height: 40, borderRadius: 10, background: K.ink }} />এআই ইউনিভার্সিটি
  </div>
);
export const cfeLen = totalLen;
