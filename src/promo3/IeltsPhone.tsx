// IELTS promo — PHONE MOCKUP + SPLIT-SCREEN style: bright sky/white, soft cards, the course shown inside a phone,
// coral highlights. Mobile-first feel (learners study on their phones).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BN, Clip, EN, Icon, Logo, Rec, Scene, Scenes, Soundtrack, Spec, clamp, enter, pop, totalLen, useFps } from "./shared";

const I = { bg: "#EEF5FF", ink: "#0A1A3A", mute: "#5E6E92", blue: "#1D4ED8", sky: "#38BDF8", coral: "#FF5A3C", green: "#12B76A", card: "#FFFFFF", bkash: "#E2136E", red: "#E5484D" };

const Phone: React.FC<{ w?: number; land?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ w = 430, land, children, style }) => {
  const W = land ? w * 2.06 : w, H = land ? w : w * 2.06;
  return (
    <div style={{ width: W, height: H, borderRadius: w * 0.14, background: "#0B0F1A", padding: w * 0.035, boxShadow: "0 50px 100px rgba(10,26,58,.35)", ...style }}>
      <div style={{ width: "100%", height: "100%", borderRadius: w * 0.11, overflow: "hidden", background: "#fff", position: "relative" }}>
        {children}
        <div style={{ position: "absolute", [land ? "left" : "top"]: 14, [land ? "top" : "left"]: "50%", transform: land ? "translateY(-50%)" : "translateX(-50%)", width: land ? 26 : 110, height: land ? 110 : 26, borderRadius: 14, background: "#0B0F1A" }} />
      </div>
    </div>
  );
};

const AppBar: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ height: 120, background: `linear-gradient(120deg, ${I.blue}, ${I.sky})`, color: "#fff", display: "flex", alignItems: "flex-end", padding: "0 30px 18px", fontFamily: BN, fontWeight: 700, fontSize: 30 }}>{title}</div>
);

const H: React.FC<{ f: number; children: React.ReactNode; size?: number }> = ({ f, children, size = 70 }) => (
  <div style={{ fontFamily: BN, fontWeight: 800, fontSize: size, color: I.ink, lineHeight: 1.15, opacity: enter(f, 0, 12), transform: `translateY(${(1 - enter(f, 0, 16)) * 30}px)` }}>{children}</div>
);

function render(spec: Spec, s: Scene, f: number, len: number) {
  const pid = spec.id;
  const fps = useFps();
  switch (s.k) {
    case "hook": {
      const wob = Math.sin(f / 3) * 4 * enter(f, 40);
      const [a, b] = s.line.split(", ");
      const split = enter(f, 0, 20);
      return (
        <AbsoluteFill style={{ flexDirection: "row" }}>
          <div style={{ width: `${50 * split}%`, background: I.blue, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 92, color: "#fff", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 24 }}><Icon name="circle-check" size={100} color="#fff" />{a},</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
            <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 96, color: I.ink, textAlign: "center", opacity: enter(f, 22), lineHeight: 1.2 }}>{b}</div>
            <div style={{ width: 520, height: 70, borderRadius: 40, background: "#dbe6fa", overflow: "hidden", opacity: enter(f, 34), position: "relative" }}>
              <div style={{ width: `${62 + wob}%`, height: "100%", background: `linear-gradient(90deg, ${I.sky}, ${I.coral})` }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EN, fontWeight: 800, fontSize: 34, color: I.ink }}>BAND ?</div>
            </div>
            <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 54, color: I.coral, opacity: enter(f, len * 0.6) }}>{s.sub}</div>
          </div>
        </AbsoluteFill>
      );
    }
    case "shock": {
      const p1 = pop(f, fps, 0, 9), p2 = pop(f, fps, 14, 9);
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 70, color: I.mute, opacity: enter(f, 0) }}>মাত্র</div>
          <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 250, color: I.blue, lineHeight: 1.05, transform: `scale(${p1}) rotate(${(1 - p1) * -10}deg)` }}>{s.big}</div>
          <div style={{ fontFamily: EN, fontWeight: 900, fontSize: 200, color: I.coral, lineHeight: 1, transform: `scale(${p2})` }}>{s.line}</div>
          <div style={{ position: "absolute", right: 230, top: 180, transform: `rotate(${Math.sin(f / 3) * 8}deg) scale(${pop(f, fps, 26, 8)})` }}><Icon name="circle-alert" size={170} color={I.coral} stroke={2.4} /></div>
          <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 56, color: I.ink, marginTop: 30, opacity: enter(f, len * 0.55) }}>{s.sub}</div>
        </AbsoluteFill>
      );
    }
    case "calm": {
      const bar = interpolate(f, [24, 56], [0, 20], clamp);
      return (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 130px", gap: 110 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-flex", gap: 14, alignItems: "center", fontFamily: BN, fontWeight: 700, fontSize: 40, color: "#fff", background: I.green, padding: "8px 26px", borderRadius: 40, opacity: enter(f, 0) }}><Icon name="smile" size={42} color="#fff" />অবাক হবেন না!</div>
            <H f={f} size={104}>{s.line}</H>
            <div style={{ marginTop: 44, opacity: enter(f, 18) }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: BN, fontWeight: 700, fontSize: 40, color: I.ink }}><span>কোর্স</span><span style={{ color: I.green }}>{s.bar}</span></div>
              <div style={{ height: 34, borderRadius: 17, background: "#d9e4f7", marginTop: 14, overflow: "hidden", position: "relative" }}>
                <div style={{ width: `${bar}%`, height: "100%", background: I.green }} />
                <div style={{ position: "absolute", left: "20%", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: I.mute, fontFamily: BN, fontSize: 26, fontWeight: 600 }}><Icon name="lock" size={26} color={I.mute} />বাকিটা কেনার পর</div>
              </div>
            </div>
          </div>
          <Phone w={400} style={{ opacity: enter(f, 4), transform: `translateY(${(1 - enter(f, 4, 22)) * 140}px) rotate(3deg)` }}>
            <Rec spec={spec} name={s.rec} fallback={<><AppBar title="বাংলায় IELTS" /><div style={{ padding: 30, fontFamily: BN, fontSize: 30, color: I.ink }}>ফ্রি প্রিভিউ</div></>} />
          </Phone>
        </AbsoluteFill>
      );
    }
    case "wait": {
      const left = Math.max(0, 120 - Math.floor(f / 30) * 1);
      const prog = interpolate(f, [0, len], [0, 1], clamp);
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
          <div style={{ position: "relative", width: 420, height: 420, transform: `scale(${pop(f, fps, 0, 11)})` }}>
            <svg width={420} height={420} style={{ position: "absolute" }}>
              <circle cx={210} cy={210} r={180} fill="#fff" stroke="#d9e4f7" strokeWidth={26} />
              <circle cx={210} cy={210} r={180} fill="none" stroke={I.coral} strokeWidth={26} strokeLinecap="round" strokeDasharray={2 * Math.PI * 180} strokeDashoffset={2 * Math.PI * 180 * prog} transform="rotate(-90 210 210)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EN, fontWeight: 800, fontSize: 120, color: I.ink }}>{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</div>
          </div>
          <H f={f} size={110}>{s.line}</H>
          <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 52, color: I.mute, opacity: enter(f, 20) }}>{s.sub}</div>
        </AbsoluteFill>
      );
    }
    case "tfng": {
      const tap = len * 0.55;
      return (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 120 }}>
          <Phone w={420} style={{ transform: `translateY(${(1 - pop(f, fps, 0, 14)) * 700}px)` }}>
            <AppBar title="Reading · প্রশ্ন ৭" />
            <div style={{ padding: 30, fontFamily: EN }}>
              <div style={{ fontSize: 26, color: I.mute, fontWeight: 700 }}>STATEMENT</div>
              <div style={{ fontSize: 34, color: I.ink, fontWeight: 600, lineHeight: 1.4, marginTop: 10 }}>{s.stmt}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 40 }}>
                {s.opts.map((o: string, i: number) => {
                  const on = i === s.ans && f > tap;
                  return <div key={o} style={{ padding: "22px 26px", borderRadius: 18, border: `3px solid ${on ? I.green : "#d5def0"}`, background: on ? "#E7F8EF" : "#fff", fontWeight: 800, fontSize: 30, color: on ? I.green : I.ink, transform: `scale(${on ? 1 + 0.06 * Math.max(0, 1 - (f - tap) / 8) : 1})` }}>{on ? "✓ " : ""}{o}</div>;
                })}
              </div>
            </div>
          </Phone>
          <div style={{ width: 700 }}>
            <H f={f}>True, False,<br />না <span style={{ color: I.coral }}>Not Given?</span></H>
            <div style={{ marginTop: 40, fontFamily: BN, fontSize: 48, color: I.mute, lineHeight: 1.45, opacity: enter(f, tap) }}>প্যাসেজে তথ্যটাই নেই →<br /><b style={{ color: I.green }}>NOT GIVEN</b></div>
          </div>
        </AbsoluteFill>
      );
    }
    case "intro":
      return (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 110px", gap: 80 }}>
          <div style={{ width: 720 }}>
            <div style={{ opacity: enter(f, 0) }}><Logo w={260} /></div>
            <H f={f} size={120}>{s.title}</H>
            <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 44, color: I.blue, marginTop: 20, opacity: enter(f, 12) }}>{s.sub}</div>
          </div>
          <Phone w={420} land style={{ transform: `rotate(${interpolate(enter(f, 4, 24), [0, 1], [-14, 0])}deg) scale(${0.85 + enter(f, 4, 24) * 0.15})`, opacity: enter(f, 4) }}>
            <Clip pid={pid} name="ielts-what-academic-gt" start={30 * 8} />
          </Phone>
        </AbsoluteFill>
      );
    case "quad": {
      const per = (len * 0.8) / 4;
      return (
        <AbsoluteFill style={{ padding: "80px 120px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, height: 760 }}>
            {s.cells.map(([ic, t, d]: string[], i: number) => {
              const on = f >= 6 + i * per;
              const p = pop(f, fps, 6 + i * per, 13);
              return (
                <div key={i} style={{ background: on ? I.card : "#ffffff60", borderRadius: 34, padding: "40px 50px", display: "flex", alignItems: "center", gap: 40, transform: `scale(${0.85 + p * 0.15})`, opacity: 0.3 + p * 0.7, boxShadow: on ? "0 24px 60px rgba(29,78,216,.18)" : "none", border: on ? `4px solid ${[I.blue, I.coral, I.green, I.sky][i]}` : "4px solid transparent" }}>
                  <div style={{ width: 150, height: 150, borderRadius: 40, background: [I.blue, I.coral, I.green, I.sky][i], display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name={ic} size={84} color="#fff" /></div>
                  <div>
                    <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 66, color: I.ink }}>{t}</div>
                    <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 36, color: I.mute, marginTop: 6 }}>{d}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 36, fontFamily: BN, fontWeight: 700, fontSize: 46, color: I.coral, opacity: enter(f, len * 0.82) }}>{s.extra}</div>
        </AbsoluteFill>
      );
    }
    case "stats": {
      const per = Math.floor((len * 0.6) / s.stats.length);
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 36 }}>
          {s.stats.map(([n, l]: string[], i: number) => {
            const p = pop(f, fps, i * per, 12);
            return (
              <div key={i} style={{ width: 380, height: 380, borderRadius: 190, background: i % 2 ? I.card : I.blue, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${p})`, boxShadow: "0 30px 60px rgba(29,78,216,.2)" }}>
                <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 140, color: i % 2 ? I.blue : "#fff", lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 36, color: i % 2 ? I.ink : "#fff", textAlign: "center", padding: "0 40px" }}>{l}</div>
              </div>
            );
          })}
        </AbsoluteFill>
      );
    }
    case "phone":
      return (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 120px", gap: 90 }}>
          <div style={{ flex: 1 }}>
            <H f={f}>{s.head}</H>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 44 }}>
              {s.items.map(([ic, t]: string[], i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, background: I.card, borderRadius: 24, padding: "20px 28px", boxShadow: "0 12px 30px rgba(29,78,216,.1)", opacity: enter(f, 10 + i * (len / 6)), transform: `translateX(${(1 - enter(f, 10 + i * (len / 6), 16)) * -60}px)` }}>
                  <div style={{ width: 76, height: 76, borderRadius: 20, background: i === 3 ? I.coral : I.blue, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name={ic} size={42} color="#fff" /></div>
                  <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 42, color: I.ink }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
          <Phone w={410} style={{ opacity: enter(f, 4), transform: `translateY(${(1 - enter(f, 4, 22)) * 120}px)` }}>
            <Rec spec={spec} name={s.rec} fallback={<div style={{ height: "100%", background: "#000", display: "flex", alignItems: "center" }}><div style={{ width: "100%", aspectRatio: "16/9" }}><Clip pid={pid} name={s.clip} start={30 * 10} /></div></div>} />
          </Phone>
        </AbsoluteFill>
      );
    case "guru": {
      const typed = Math.floor(interpolate(f, [30, 30 + s.a.length * 0.8], [0, s.a.length], clamp));
      return (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 120 }}>
          <Phone w={420} style={{ transform: `rotate(${interpolate(enter(f, 0, 20), [0, 1], [8, -3])}deg)`, opacity: enter(f, 0) }}>
            <Rec spec={spec} name={s.rec} fallback={<>
              <AppBar title={`${s.name} · ${s.label}`} />
              <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 22 }}>
                <div style={{ alignSelf: "flex-end", background: I.blue, color: "#fff", fontFamily: BN, fontSize: 28, lineHeight: 1.4, padding: "18px 22px", borderRadius: 22, opacity: enter(f, 8) }}>{s.q}</div>
                <div style={{ alignSelf: "flex-start", background: "#EEF3FC", color: I.ink, fontFamily: BN, fontSize: 28, lineHeight: 1.45, padding: "18px 22px", borderRadius: 22, opacity: enter(f, 26) }}>{s.a.slice(0, typed)}</div>
              </div>
            </>} />
          </Phone>
          <div style={{ width: 720 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: I.coral, color: "#fff", fontFamily: BN, fontWeight: 700, fontSize: 36, padding: "8px 24px", borderRadius: 40, opacity: enter(f, 4) }}><Icon name="bot" size={40} color="#fff" />{s.label}</div>
            <H f={f} size={120}>{s.name}</H>
            <div style={{ fontFamily: BN, fontWeight: 600, fontSize: 46, color: I.mute, opacity: enter(f, 14) }}>যেকোনো সময়, বাংলায় উত্তর</div>
          </div>
        </AbsoluteFill>
      );
    }
    case "book":
      return (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 110 }}>
          <div style={{ width: 500, height: 680, borderRadius: "10px 26px 26px 10px", background: `linear-gradient(150deg, ${I.blue}, ${I.sky})`, padding: "60px 46px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", transform: `perspective(1800px) rotateY(${interpolate(f, [0, len], [24, 10])}deg)`, boxShadow: "20px 30px 70px rgba(10,26,58,.35), inset -14px 0 0 rgba(0,0,0,.2)", opacity: enter(f, 0) }}>
            <div style={{ fontFamily: BN, fontSize: 30, opacity: 0.85 }}>স্পেশাল বই</div>
            <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 92, lineHeight: 1.1 }}>{s.title}</div>
            <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 34, letterSpacing: 4 }}>L · R · W · S</div>
          </div>
          <div style={{ width: 760 }}>
            <H f={f} size={96}>সাথে <span style={{ color: I.coral }}>স্পেশাল বই</span></H>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 34 }}>
              {s.sub.split(" · ").map((t: string, i: number) => <div key={i} style={{ fontFamily: BN, fontWeight: 600, fontSize: 44, color: I.ink, opacity: enter(f, 14 + i * 12), display: "flex", gap: 16, alignItems: "center" }}><Icon name="check" size={44} color={I.green} stroke={3} />{t}</div>)}
            </div>
          </div>
        </AbsoluteFill>
      );
    case "why": {
      const per = (len - 30) / s.pts.length;
      return (
        <AbsoluteFill style={{ flexDirection: "row" }}>
          <div style={{ width: 720, background: I.ink, display: "flex", alignItems: "center", padding: "0 80px" }}>
            <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 104, color: "#fff", lineHeight: 1.15, opacity: enter(f, 0) }}>কেন আমাদের<br /><span style={{ color: I.sky }}>কোর্স আলাদা?</span></div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30, padding: "0 90px" }}>
            {s.pts.map((t: string, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, background: I.card, borderRadius: 26, padding: "28px 34px", boxShadow: "0 14px 34px rgba(29,78,216,.12)", opacity: enter(f, 24 + i * per), transform: `translateX(${(1 - enter(f, 24 + i * per, 18)) * 120}px)` }}>
                <div style={{ fontFamily: EN, fontWeight: 900, fontSize: 50, color: I.coral, width: 70 }}>0{i + 1}</div>
                <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 46, color: I.ink, lineHeight: 1.3 }}>{t}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      );
    }
    case "price": {
      const strike = enter(f, 20, 14), now = pop(f, fps, 42, 9);
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: I.card, borderRadius: 44, padding: "60px 110px", boxShadow: "0 40px 90px rgba(29,78,216,.22)", textAlign: "center", transform: `scale(${0.9 + enter(f, 0, 16) * 0.1})` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 70 }}>
              <div style={{ position: "relative", fontFamily: BN, fontWeight: 800, fontSize: 96, color: I.mute }}>
                {s.regular}
                <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 12, background: I.red, transformOrigin: "left", transform: `scaleX(${strike}) rotate(-6deg)`, borderRadius: 6 }} />
              </div>
              <div style={{ transform: `scale(${now})` }}>
                {s.mid && <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 48, color: I.mute, textDecoration: "line-through", textDecorationColor: I.red, opacity: enter(f, 34) }}>{s.mid}</div>}
                <div style={{ display: "inline-block", fontFamily: BN, fontWeight: 800, fontSize: 40, color: "#fff", background: I.coral, padding: "4px 24px", borderRadius: 12 }}>{s.tag}</div>
                <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 190, color: I.blue, lineHeight: 1.05 }}>{s.now}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 28, justifyContent: "center", marginTop: 26 }}>
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: I.green, border: `3px solid ${I.green}`, borderRadius: 60, padding: "10px 36px", opacity: enter(f, len * 0.55) }}>✓ {s.free}</div>
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: "#fff", background: I.bkash, borderRadius: 60, padding: "10px 36px", opacity: enter(f, len * 0.8) }}>{s.pay}</div>
            </div>
          </div>
        </AbsoluteFill>
      );
    }
    case "cta":
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 26 }}>
          <div style={{ opacity: enter(f, 0), transform: `scale(${0.9 + enter(f, 0) * 0.1})` }}><Logo w={500} /></div>
          <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 64, color: I.ink, opacity: enter(f, 14) }}>শিখবে তুমি দেখবে দেশ</div>
          <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 48, color: I.blue, opacity: enter(f, 24) }}>এইবার তোমার হাতে আগামীর বাংলাদেশ</div>
          <div style={{ position: "absolute", bottom: 46, fontFamily: BN, fontSize: 26, color: I.mute, opacity: enter(f, 30) }}>IELTS-এর অফিসিয়াল পরীক্ষা নয় · ব্যান্ড-ফিডব্যাক আনুমানিক</div>
        </AbsoluteFill>
      );
  }
  return null;
}

const Bg: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: I.bg }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: 450, background: `${I.sky}30`, filter: "blur(80px)", left: -200 + Math.sin(f / 90) * 80, top: -300 }} />
      <div style={{ position: "absolute", width: 800, height: 800, borderRadius: 400, background: `${I.coral}18`, filter: "blur(90px)", right: -200, bottom: -300 + Math.cos(f / 80) * 60 }} />
    </AbsoluteFill>
  );
};

export const IeltsPhone: React.FC<{ spec: Spec; durs: number[] }> = ({ spec, durs }) => {
  const total = totalLen(durs);
  return (
    <AbsoluteFill>
      <Bg />
      <Scenes spec={spec} durs={durs} render={(s, f, len) => render(spec, s, f, len)} />
      <div style={{ position: "absolute", right: 50, top: 36, fontFamily: BN, fontWeight: 700, fontSize: 26, color: I.mute }}>এআই ইউনিভার্সিটি</div>
      <Soundtrack pid={spec.id} durs={durs} total={total} music="aiu2/music.mp3" />
    </AbsoluteFill>
  );
};
