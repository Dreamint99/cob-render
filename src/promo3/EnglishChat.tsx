// English course promo — CHAT style: the whole film is a messenger thread. The viewer (left, white bubbles)
// asks; AI University (right, green bubbles) answers with cards, video messages and stickers. Mint wallpaper.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BN, Clip, EN, Icon, Logo, Scene, Scenes, Soundtrack, Spec, clamp, enter, pop, totalLen, useFps } from "./shared";

const E = { bg: "#E7F5EF", ink: "#0B2A22", mute: "#5B7A70", green: "#059669", mint: "#D1FAE5", cyan: "#22D3EE", yel: "#FACC15", red: "#E5484D", white: "#FFFFFF", bkash: "#E2136E" };

// one chat bubble; `me` = viewer (left/white), otherwise AI University (right/green)
const Bubble: React.FC<{ f: number; at: number; me?: boolean; children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ f, at, me, children, size = 54, style }) => {
  const fps = useFps();
  const p = pop(f, fps, at, 13);
  if (f < at) return null;
  return (
    <div style={{ alignSelf: me ? "flex-start" : "flex-end", maxWidth: 1250, transformOrigin: me ? "left bottom" : "right bottom", transform: `scale(${0.6 + p * 0.4})`, opacity: Math.min(1, p * 2) }}>
      <div style={{ padding: "24px 36px", borderRadius: 40, borderBottomLeftRadius: me ? 8 : 40, borderBottomRightRadius: me ? 40 : 8, background: me ? E.white : E.green, color: me ? E.ink : "#fff", fontFamily: BN, fontWeight: 700, fontSize: size, lineHeight: 1.35, boxShadow: "0 10px 30px rgba(11,42,34,.12)", ...style }}>{children}</div>
    </div>
  );
};

const Typing: React.FC<{ f: number; from: number; to: number; me?: boolean }> = ({ f, from, to, me }) => {
  if (f < from || f >= to) return null;
  return (
    <div style={{ alignSelf: me ? "flex-start" : "flex-end", background: me ? E.white : E.green, borderRadius: 30, padding: "22px 30px", display: "flex", gap: 10 }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: me ? E.mute : "#fff", opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f - i * 4) / 4)) }} />)}
    </div>
  );
};

const Thread: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 150 }) => (
  <div style={{ position: "absolute", left: 230, right: 230, top, bottom: 90, display: "flex", flexDirection: "column", gap: 26, justifyContent: "flex-end" }}>{children}</div>
);

const Header: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, background: E.green, display: "flex", alignItems: "center", padding: "0 60px", gap: 22, boxShadow: "0 6px 20px rgba(5,150,105,.25)" }}>
    <div style={{ width: 70, height: 70, borderRadius: 35, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="message-circle" size={40} color={E.green} /></div>
    <div>
      <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 38, color: "#fff", lineHeight: 1.1 }}>এআই ইউনিভার্সিটি · ইংলিশ মাস্টার কোর্স</div>
      <div style={{ fontFamily: BN, fontSize: 26, color: "#D1FAE5" }}>অনলাইন · সাধারণত সাথে সাথে উত্তর দেয়</div>
    </div>
  </div>
);

function render(spec: Spec, s: Scene, f: number, len: number) {
  const pid = spec.id;
  const fps = useFps();
  switch (s.k) {
    case "shock":
      return (
        <Thread>
          <Bubble f={f} at={4} me size={78}>{s.q}</Bubble>
          <div style={{ alignSelf: "flex-start", marginLeft: 30, transform: `rotate(${Math.sin(f / 3) * 10}deg) scale(${pop(f, fps, 30, 8)})` }}><div style={{ fontFamily: BN, fontWeight: 800, fontSize: 64, color: E.ink, background: E.yel, borderRadius: 24, padding: "8px 30px", boxShadow: "0 8px 20px rgba(0,0,0,.12)" }}>হা-হা!</div></div>
          <Typing f={f} from={50} to={len * 0.72} />
          <Bubble f={f} at={len * 0.72} size={70}>{s.a}</Bubble>
        </Thread>
      );
    case "calm": {
      const bar = interpolate(f, [len * 0.3, len * 0.55], [0, 20], clamp);
      return (
        <Thread>
          <Bubble f={f} at={4} size={64}>{s.a1}</Bubble>
          <Bubble f={f} at={len * 0.28} style={{ width: 900 }}>
            <div style={{ fontSize: 44 }}>{s.bar}</div>
            <div style={{ height: 34, borderRadius: 17, background: "#ffffff40", marginTop: 16, overflow: "hidden" }}><div style={{ width: `${bar * 5}%`, maxWidth: "100%", height: "100%", background: E.yel }} /></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, marginTop: 8, opacity: 0.85 }}><span>ফ্রি প্রিভিউ</span><span>২০%</span></div>
          </Bubble>
          <Bubble f={f} at={len * 0.62} size={60}><span style={{ display: "inline-flex", alignItems: "center", gap: 16 }}><Icon name="timer" size={56} color="#fff" />{s.a2}</span></Bubble>
        </Thread>
      );
    }
    case "pain":
      return (
        <Thread>
          <Bubble f={f} at={4} me size={66}>{s.q}</Bubble>
          <div style={{ alignSelf: "flex-start", display: "flex", gap: 22, marginTop: 10 }}>
            {s.think.map((t: string, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: enter(f, 40 + i * 40), transform: `translateY(${(1 - enter(f, 40 + i * 40)) * 30}px)` }}>
                <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: i === 2 ? E.red : E.ink, background: "#ffffffb0", border: `3px dashed ${i === 2 ? E.red : E.mute}`, borderRadius: 30, padding: "16px 28px" }}>{t}</div>
                {i < 2 && <Icon name="arrow-right" size={50} color={E.mute} />}
              </div>
            ))}
          </div>
        </Thread>
      );
    case "intro":
      return (
        <Thread>
          <Bubble f={f} at={4} style={{ padding: 0, overflow: "hidden", width: 1100 }}>
            <div style={{ background: `linear-gradient(120deg, ${E.green}, ${E.cyan})`, padding: "50px 56px", position: "relative" }}>
              <div style={{ position: "absolute", right: 40, top: 30, fontFamily: EN, fontWeight: 900, fontSize: 150, color: "#ffffff22" }}>Aa</div>
              <div style={{ fontSize: 30, opacity: 0.9 }}>নতুন কোর্স</div>
              <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.1 }}>{s.title}</div>
              <div style={{ fontSize: 42, fontWeight: 600, marginTop: 10 }}>{s.sub}</div>
            </div>
            <div style={{ background: "#fff", padding: "22px 56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Logo w={190} />
              <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 32, color: E.green }}>Zero → Fluent</div>
            </div>
          </Bubble>
        </Thread>
      );
    case "ladder": {
      const per = (len * 0.85) / s.steps.length;
      const cur = Math.min(s.steps.length - 1, Math.floor(Math.max(0, f - 8) / per));
      return (
        <AbsoluteFill style={{ padding: "150px 120px 60px" }}>
          <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 64, color: E.ink, opacity: enter(f, 0) }}>{s.head}</div>
          <div style={{ position: "relative", height: 760 }}>
            {s.steps.map(([n, t, d]: string[], i: number) => {
              const on = f >= 8 + i * per;
              const x = i * 275, y = 620 - i * 122;
              return (
                <div key={i} style={{ position: "absolute", left: x, top: y, width: 420, opacity: on ? 1 : 0.25, transform: `translateY(${on ? 0 : 20}px)` }}>
                  <div style={{ height: 22, background: on ? E.green : "#b7d6ca", borderRadius: 11, width: 300 }} />
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 10 }}>
                    <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 60, color: i === cur ? E.green : E.ink }}>{n}</div>
                    <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 32, color: E.ink, lineHeight: 1.15, whiteSpace: "nowrap", background: i === cur ? "#ffffffd0" : "transparent", borderRadius: 10, padding: "0 8px" }}>{t}</div>
                  </div>
                  {i === cur && <div style={{ fontFamily: BN, fontSize: 28, fontWeight: 600, color: E.green, marginTop: 2, whiteSpace: "nowrap" }}>{d}</div>}
                </div>
              );
            })}
            <div style={{ position: "absolute", left: cur * 275 + 110, top: 620 - cur * 122 - 120, width: 100, height: 100, borderRadius: 50, background: E.yel, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,.15)", transform: `translateY(${-Math.abs(Math.sin(f / 6)) * 18}px)` }}><Icon name="user-round" size={60} color={E.ink} /></div>
          </div>
        </AbsoluteFill>
      );
    }
    case "stats": {
      const per = Math.floor((len * 0.55) / s.stats.length);
      return (
        <Thread>
          <Bubble f={f} at={2} me size={56}>কোর্সে কী কী আছে?</Bubble>
          <Bubble f={f} at={16} style={{ display: "flex", gap: 22, padding: "28px 30px" }}>
            {s.stats.map(([n, l]: string[], i: number) => (
              <div key={i} style={{ width: 250, background: "#ffffff22", borderRadius: 28, padding: "20px 10px", textAlign: "center", transform: `scale(${pop(f, fps, 18 + i * per, 12)})` }}>
                <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 30, fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </Bubble>
        </Thread>
      );
    }
    case "video": {
      const clip = f < len / 2 ? s.clips[0] : s.clips[1];
      return (
        <Thread>
          <Bubble f={f} at={2} style={{ padding: 14 }}>
            <div style={{ width: 1120, height: 630, borderRadius: 28, overflow: "hidden", position: "relative" }}>
              <Clip pid={pid} name={clip} start={f < len / 2 ? 30 * 40 : 0} />
              <div style={{ position: "absolute", left: 18, bottom: 18, background: "#000000a0", color: "#fff", fontSize: 30, borderRadius: 14, padding: "6px 18px", display: "flex", alignItems: "center", gap: 10 }}><Icon name="play" size={28} color="#fff" />{s.label}</div>
            </div>
          </Bubble>
        </Thread>
      );
    }
    case "fix":
      return (
        <Thread>
          {s.pairs.map(([bad, good]: string[], i: number) => {
            const at = 6 + i * (len * 0.45);
            return (
              <React.Fragment key={i}>
                <Bubble f={f} at={at} me size={58}><span style={{ fontFamily: EN, color: E.red, textDecoration: f > at + 25 ? "line-through" : "none" }}>✗ {bad}</span></Bubble>
                <Bubble f={f} at={at + 30} size={58}><span style={{ fontFamily: EN }}>✓ {good}</span></Bubble>
              </React.Fragment>
            );
          })}
        </Thread>
      );
    case "guru": {
      const typed = Math.floor(interpolate(f, [70, 70 + s.a.length * 0.9], [0, s.a.length], clamp));
      return (
        <Thread>
          <div style={{ alignSelf: "center", display: "flex", alignItems: "center", gap: 18, background: "#fff", borderRadius: 40, padding: "12px 30px", fontFamily: BN, fontWeight: 700, fontSize: 36, color: E.ink, opacity: enter(f, 0) }}><Icon name="bot" size={44} color={E.green} />{s.name} · {s.label}</div>
          <Bubble f={f} at={14} me size={52}>{s.q}</Bubble>
          <Typing f={f} from={40} to={70} />
          {f >= 70 && <Bubble f={f} at={70} size={46}>{s.a.slice(0, typed)}</Bubble>}
        </Thread>
      );
    }
    case "why": {
      const per = (len - 40) / s.pts.length;
      return (
        <Thread>
          <Bubble f={f} at={2} me size={58}>{s.head}</Bubble>
          {s.pts.map((t: string, i: number) => <Bubble key={i} f={f} at={30 + i * per} size={48}><span style={{ display: "inline-flex", gap: 16, alignItems: "center" }}><Icon name="circle-check" size={46} color={E.yel} />{t}</span></Bubble>)}
        </Thread>
      );
    }
    case "price": {
      const strike = enter(f, 34, 14);
      return (
        <Thread>
          <Bubble f={f} at={2} me size={58}>দাম কত?</Bubble>
          <Bubble f={f} at={20} style={{ background: "#fff", color: E.ink, width: 1250, textAlign: "center", padding: "40px 50px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60 }}>
              <div style={{ position: "relative", fontSize: 90, fontWeight: 800, color: E.mute, whiteSpace: "nowrap" }}>{s.regular}<div style={{ position: "absolute", left: -8, right: -8, top: "52%", height: 10, background: E.red, transformOrigin: "left", transform: `scaleX(${strike}) rotate(-6deg)`, borderRadius: 5 }} /></div>
              <div style={{ transform: `scale(${pop(f, fps, 50, 9)})` }}>
                <div style={{ display: "inline-block", fontSize: 36, color: "#000", background: E.yel, borderRadius: 12, padding: "2px 20px" }}>{s.tag}</div>
                <div style={{ fontSize: 160, fontWeight: 800, color: E.green, lineHeight: 1.05, whiteSpace: "nowrap" }}>{s.now}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 20, fontSize: 40 }}>
              <span style={{ color: E.green, border: `3px solid ${E.green}`, borderRadius: 50, padding: "6px 28px", opacity: enter(f, len * 0.6) }}>✓ {s.free}</span>
              <span style={{ color: "#fff", background: E.bkash, borderRadius: 50, padding: "6px 28px", opacity: enter(f, len * 0.78) }}>{s.pay}</span>
            </div>
          </Bubble>
        </Thread>
      );
    }
    case "cta":
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 26, background: E.bg }}>
          <div style={{ opacity: enter(f, 0), transform: `scale(${0.9 + enter(f, 0) * 0.1})` }}><Logo w={500} /></div>
          <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 70, color: E.green, opacity: enter(f, 10) }}>{s.line}</div>
          <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 56, color: E.ink, opacity: enter(f, 22) }}>শিখবে তুমি দেখবে দেশ</div>
          <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: E.mute, opacity: enter(f, 32) }}>এইবার তোমার হাতে আগামীর বাংলাদেশ</div>
        </AbsoluteFill>
      );
  }
  return null;
}

const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const icons = ["message-circle", "mic", "headphones", "book-open", "smile", "globe"];
  return (
    <AbsoluteFill style={{ background: E.bg }}>
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: (i * 331) % 1900, top: ((i * 197) % 1000) + Math.sin(f / 40 + i) * 8, opacity: 0.09, transform: `rotate(${(i * 37) % 60 - 30}deg)` }}><Icon name={icons[i % icons.length]} size={70} color={E.green} /></div>
      ))}
    </AbsoluteFill>
  );
};

export const EnglishChat: React.FC<{ spec: Spec; durs: number[] }> = ({ spec, durs }) => {
  const total = totalLen(durs);
  return (
    <AbsoluteFill>
      <Bg />
      <Scenes spec={spec} durs={durs} render={(s, f, len) => render(spec, s, f, len)} />
      <Header />
      <Soundtrack pid={spec.id} durs={durs} total={total} music="aiu2/music.mp3" />
    </AbsoluteFill>
  );
};
