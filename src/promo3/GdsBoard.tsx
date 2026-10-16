// GDS / air-ticketing promo — AIRPORT style: night-navy, amber departure-board flips, a live GDS-like terminal,
// boarding-pass cards and split screens (terminal | recording).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AppWindow, BN, Clip, EN, Icon, Logo, MONO, Rec, hasRec, Scene, Scenes, Soundtrack, Spec, clamp, enter, pop, totalLen, useFps } from "./shared";

const G = { bg: "#050B1C", bg2: "#0A1530", panel: "#0E1B3A", amber: "#FFB21A", text: "#EAF0FF", mute: "#8796BC", blue: "#2F7BFF", green: "#2BE38A", red: "#FF4D5E", bkash: "#E2136E", term: "#7CF7C1" };
const BAS = "Bebas";

// one word that flips in like a split-flap card
const Flap: React.FC<{ f: number; at: number; children: React.ReactNode; size?: number; color?: string; bg?: string; font?: string }> = ({ f, at, children, size = 80, color = G.amber, bg = "#111a33", font = BN }) => {
  const p = interpolate(f, [at, at + 9], [0, 1], { ...clamp });
  return (
    <span style={{ display: "inline-block", perspective: 600, margin: "0 6px" }}>
      <span style={{ display: "inline-block", background: bg, color, fontFamily: font, fontWeight: 700, fontSize: size, lineHeight: 1.25, padding: `0 ${size * 0.22}px`, borderRadius: 8, transform: `rotateX(${(1 - p) * -95}deg)`, transformOrigin: "50% 0", opacity: p > 0 ? 1 : 0, boxShadow: "inset 0 -3px 0 rgba(0,0,0,.45)", backgroundImage: `linear-gradient(transparent 49%, rgba(0,0,0,.55) 50%, transparent 51%)` }}>{children}</span>
    </span>
  );
};

const Term: React.FC<{ f: number; lines: { cmd?: string; out?: string[] }[]; cps?: number; start?: number; size?: number }> = ({ f, lines, cps = 0.9, start = 0, size = 34 }) => {
  let t = start;
  const rows: React.ReactNode[] = [];
  lines.forEach((l, i) => {
    if (l.cmd) {
      const n = Math.floor(interpolate(f, [t, t + l.cmd.length / cps], [0, l.cmd.length], clamp));
      if (f >= t) rows.push(<div key={"c" + i}><span style={{ color: G.amber }}>&gt;</span> {l.cmd.slice(0, n)}{n < l.cmd.length && f % 14 < 7 ? "█" : ""}</div>);
      t += l.cmd.length / cps + 8;
    }
    (l.out || []).forEach((o, j) => { if (f >= t + j * 3) rows.push(<div key={i + "o" + j} style={{ color: "#BFD3FF", whiteSpace: "pre" }}>{o}</div>); });
    t += (l.out?.length || 0) * 3 + 8;
  });
  return <div style={{ fontFamily: MONO, fontSize: size, color: G.term, lineHeight: 1.5 }}>{rows}</div>;
};

const AVAIL = ["** AI UNIVERSITY TICKETING LAB — PRACTICE DATA **", "20NOV  DAC  DXB", "1  XY 101  J4 C4 Y9 M9   DAC 0910  DXB 1235", "2  XY 145  J2 Y9 B9      DAC 1420  DXB 1745", "3  ZZ 207  Y7 K5 L0      DAC 2230  DXB 0155+1"];

const Board: React.FC<{ f: number; rows: string[][]; per: number; status?: string }> = ({ f, rows, per, status = "শিখবেন" }) => (
  <div style={{ background: "#0a0f1f", borderRadius: 20, padding: "18px 26px", border: `2px solid #ffffff14` }}>
    {rows.map((r, i) => {
      const at = 6 + i * per;
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", height: 86, borderBottom: i < rows.length - 1 ? "1px solid #ffffff10" : "none" }}>
          <div style={{ width: 110 }}><Flap f={f} at={at} size={46} font={BAS}>{r[0]}</Flap></div>
          <div style={{ width: r[2] ? 520 : 1400 }}><Flap f={f} at={at + 2} size={48}>{r[1]}</Flap></div>
          <div style={{ flex: 1, whiteSpace: "nowrap", fontFamily: BN, fontSize: 36, color: G.mute, opacity: enter(f, at + 6) }}>{r[2]}</div>
          <div style={{ width: 190, textAlign: "right", fontFamily: BN, fontWeight: 700, fontSize: 34, color: G.green, opacity: enter(f, at + 9) }}>● {status}</div>
        </div>
      );
    })}
  </div>
);

const Title: React.FC<{ f: number; children: React.ReactNode; color?: string }> = ({ f, children, color = G.text }) => (
  <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 66, color, opacity: enter(f, 0, 12), transform: `translateX(${(1 - enter(f, 0, 16)) * -40}px)`, display: "flex", alignItems: "center", gap: 20 }}>
    <div style={{ width: 14, height: 60, background: G.amber, borderRadius: 4 }} />{children}
  </div>
);

function render(spec: Spec, s: Scene, f: number, len: number) {
  const pid = spec.id;
  switch (s.k) {
    case "hook":
      return (
        <AbsoluteFill style={{ background: "#000" }}>
          <div style={{ position: "absolute", inset: 0, padding: "120px 150px", transform: `scale(${interpolate(f, [0, len], [1.08, 1])})` }}>
            <Term f={f} size={44} lines={[{ cmd: s.cmd, out: AVAIL }]} cps={0.7} start={4} />
          </div>
          <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 4px)" }} />
          <div style={{ position: "absolute", left: 150, bottom: 120, fontFamily: BN, fontWeight: 800, fontSize: 86, color: "#fff", background: G.blue, padding: "8px 34px", borderRadius: 14, opacity: enter(f, 50), transform: `translateY(${(1 - enter(f, 50)) * 40}px)` }}>{s.sub}</div>
        </AbsoluteFill>
      );
    case "q":
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex" }}>{s.line.split(" ").map((w: string, i: number) => <Flap key={i} f={f} at={4 + i * 6} size={170}>{w}</Flap>)}</div>
          <div style={{ display: "flex", gap: 10 }}>{s.sub.split(" · ").map((w: string, i: number) => <Flap key={i} f={f} at={len * 0.45 + i * 5} size={64} color={G.text}>{w}</Flap>)}</div>
        </AbsoluteFill>
      );
    case "intro": {
      const fps = useFps();
      const p = pop(f, fps, 0, 14);
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: 1560, height: 600, display: "flex", borderRadius: 30, overflow: "hidden", background: "#F4F7FF", transform: `translateY(${(1 - p) * 500}px) rotate(${(1 - p) * 6}deg)`, boxShadow: "0 50px 100px rgba(0,0,0,.5)" }}>
            <div style={{ flex: 1, padding: "50px 60px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Logo w={210} />
                <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 30, color: G.blue, letterSpacing: 6 }}>BOARDING PASS</div>
              </div>
              <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 84, color: "#0B1530", lineHeight: 1.1 }}>{s.title}</div>
              <div style={{ display: "flex", gap: 70, fontFamily: BN }}>
                {[["থেকে", "একদম শুরু"], ["গন্তব্য", "ট্রাভেল এজেন্সি ক্যারিয়ার"], ["ভাষা", "বাংলা"]].map(([a, b]) => (
                  <div key={a}><div style={{ fontSize: 26, color: "#6A7598" }}>{a}</div><div style={{ fontSize: 40, fontWeight: 700, color: "#0B1530" }}>{b}</div></div>
                ))}
              </div>
            </div>
            <div style={{ width: 360, borderLeft: "4px dashed #c7d0e6", background: G.blue, color: "#fff", padding: 40, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
              <Icon name="plane" size={90} color="#fff" />
              <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 30, lineHeight: 1.5 }}>{s.sub.split(" · ").join("\n")}</div>
            </div>
          </div>
        </AbsoluteFill>
      );
    }
    case "calm": {
      const bar = interpolate(f, [20, 50], [0, 20], clamp);
      return (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 110px", gap: 70 }}>
          <div style={{ width: 760 }}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>{s.line.split(" ").map((w: string, i: number) => <Flap key={i} f={f} at={i * 5} size={92}>{w}</Flap>)}</div>
            <div style={{ marginTop: 50, opacity: enter(f, 16) }}>
              <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 44, color: G.green }}>✓ {s.bar}</div>
              <div style={{ height: 30, borderRadius: 15, background: "#ffffff14", marginTop: 16, overflow: "hidden" }}><div style={{ width: `${bar}%`, height: "100%", background: G.green }} /></div>
            </div>
            <div style={{ marginTop: 50, display: "inline-flex", alignItems: "center", gap: 18, fontFamily: BN, fontWeight: 700, fontSize: 46, color: "#000", background: G.amber, padding: "10px 30px", borderRadius: 14, opacity: enter(f, len * 0.6) }}><Icon name="timer" size={48} color="#000" />দুই মিনিট দিন</div>
          </div>
          <div style={{ opacity: enter(f, 6), transform: `translateX(${(1 - enter(f, 6, 20)) * 100}px)` }}><AppWindow w={900} h={640} dark><Rec spec={spec} name={s.rec} fallback={<Clip pid={pid} name="sim-first-steps" start={30 * 5} />} /></AppWindow></div>
        </AbsoluteFill>
      );
    }
    case "board":
      return (
        <AbsoluteFill style={{ padding: "70px 120px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <Title f={f}>{s.head}</Title>
            <div style={{ fontFamily: BAS, fontSize: 58, color: G.amber, letterSpacing: 6 }}>DEPARTURES · প্রস্থান</div>
          </div>
          <Board f={f} rows={s.rows} per={Math.floor((len * 0.75) / s.rows.length)} />
        </AbsoluteFill>
      );
    case "stats": {
      const per = Math.floor((len * 0.55) / s.stats.length);
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 40 }}>
            {s.stats.map(([n, l]: string[], i: number) => (
              <div key={i} style={{ width: 380, height: 420, background: G.panel, borderRadius: 26, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, border: "2px solid #ffffff12" }}>
                <Flap f={f} at={i * per} size={190}>{n}</Flap>
                <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 40, color: G.text, textAlign: "center", padding: "0 20px", opacity: enter(f, i * per + 8) }}>{l}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      );
    }
    case "lab":
      return (
        <AbsoluteFill style={{ padding: "70px 90px" }}>
          <Title f={f}>{s.head} <span style={{ fontFamily: EN, fontSize: 40, color: G.amber, fontWeight: 700 }}>· SIMULATOR</span></Title>
          <div style={{ display: "flex", gap: 40, marginTop: 36, height: 780 }}>
            <div style={{ width: 760, background: "#000", borderRadius: 20, padding: "34px 40px", border: `2px solid ${G.term}40`, overflow: "hidden", opacity: enter(f, 4) }}>
              <Term f={f} size={32} cps={1.4} start={10} lines={[
                { cmd: s.cmds[0], out: ["1  XY 101  Y9  DAC 0910 DXB 1235"] }, { cmd: s.cmds[1], out: ["1 XY 101 Y 20NOV DACDXB HK1"] },
                { cmd: s.cmds[2] }, { cmd: s.cmds[3] }, { cmd: s.cmds[4] }, { cmd: s.cmds[5] }, { cmd: s.cmds[6], out: ["RP/AIU — PNR SAVED ✓  টাস্ক ১০/১০"] },
              ]} />
            </div>
            <div style={{ flex: 1, opacity: enter(f, 10), transform: `translateX(${(1 - enter(f, 10, 20)) * 80}px)` }}>
              <AppWindow w={890} h={780} dark>
                <Rec spec={spec} name={s.rec} fallback={<Clip pid={pid} name="sim-first-steps" start={30 * 30} />} />
              </AppWindow>
            </div>
          </div>
          <div style={{ position: "absolute", left: 90, bottom: 26, fontFamily: BN, fontSize: 28, color: G.mute }}>* {s.note}</div>
        </AbsoluteFill>
      );
    case "how":
      return (
        <AbsoluteFill style={{ padding: "90px 110px", flexDirection: "row", gap: 60, alignItems: "center" }}>
          <div style={{ width: 640 }}>
            <Title f={f}>{s.head}</Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 40 }}>
              {s.items.map(([ic, t]: string[], i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, background: G.panel, borderRadius: 18, padding: "20px 28px", opacity: enter(f, 10 + i * 14), transform: `translateX(${(1 - enter(f, 10 + i * 14)) * -60}px)` }}>
                  <div style={{ width: 70, height: 70, borderRadius: 16, background: G.amber, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={ic} size={40} color="#000" /></div>
                  <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 46, color: G.text }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, opacity: enter(f, 6) }}>
            <AppWindow w={1010} h={640}><Rec spec={spec} name={s.rec} fallback={<Clip pid={pid} name={s.clip} start={30 * 15} />} /></AppWindow>
          </div>
        </AbsoluteFill>
      );
    case "guru": {
      const typed = Math.floor(interpolate(f, [34, 34 + s.a.length * 0.9], [0, s.a.length], clamp));
      return (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 120px", gap: 80 }}>
          <div style={{ width: 620 }}>
            <div style={{ width: 150, height: 150, borderRadius: 80, background: G.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(f, useFps(), 0, 10)})` }}><Icon name="bot" size={86} color="#fff" /></div>
            <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 96, color: G.text, marginTop: 30 }}>{s.name}</div>
            <div style={{ display: "inline-block", fontFamily: BN, fontWeight: 700, fontSize: 38, color: "#000", background: G.amber, padding: "4px 20px", borderRadius: 10 }}>{s.label} · যেকোনো সময়</div>
          </div>
          {hasRec(spec, s.rec) ? <div style={{ opacity: enter(f, 4) }}><AppWindow w={1100} h={700} dark><Rec spec={spec} name={s.rec} fallback={null} /></AppWindow></div> :
          <div style={{ flex: 1, background: G.panel, borderRadius: 30, padding: 46, display: "flex", flexDirection: "column", gap: 30, opacity: enter(f, 4) }}>
            <Rec spec={spec} name={s.rec} fallback={<>
              <div style={{ alignSelf: "flex-end", background: G.blue, color: "#fff", fontFamily: BN, fontWeight: 600, fontSize: 44, padding: "22px 30px", borderRadius: 26, opacity: enter(f, 10) }}>{s.q}</div>
              <div style={{ alignSelf: "flex-start", background: "#16264d", color: G.text, fontFamily: BN, fontWeight: 500, fontSize: 42, lineHeight: 1.45, padding: "22px 30px", borderRadius: 26, maxWidth: 820, opacity: enter(f, 30) }}>{s.a.slice(0, typed)}</div>
            </>} />
          </div>}
        </AbsoluteFill>
      );
    }
    case "book": {
      const cmds = ["AN", "SS", "NM", "AP", "TKTL", "RF", "ER", "FXP", "TTP", "RT"];
      return (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 150px", gap: 100 }}>
          {cmds.map((c, i) => <div key={c} style={{ position: "absolute", left: 100 + ((i * 173) % 1700), top: 80 + ((i * 251) % 900), fontFamily: MONO, fontSize: 40, color: G.amber, opacity: 0.12 + 0.1 * Math.sin(f / 10 + i), transform: `translateY(${-f * (0.3 + (i % 3) * 0.2)}px)` }}>{c}</div>)}
          <div style={{ width: 500, height: 680, borderRadius: "10px 24px 24px 10px", background: "linear-gradient(160deg,#011835,#0050ED)", padding: "60px 46px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", transform: `perspective(1800px) rotateY(${interpolate(f, [0, len], [-30, -12])}deg)`, boxShadow: "-20px 30px 70px rgba(0,0,0,.6), inset 16px 0 0 rgba(0,0,0,.3)", opacity: enter(f, 0) }}>
            <div style={{ fontFamily: BN, fontSize: 30, opacity: 0.8 }}>স্পেশাল বই · রেফারেন্স</div>
            <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 80, lineHeight: 1.12 }}>{s.title}</div>
            <div style={{ fontFamily: MONO, fontSize: 30, color: G.amber }}>&gt; AN20NOVDACDXB</div>
          </div>
          <div>
            <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 96, color: G.text, opacity: enter(f, 8) }}>সাথে স্পেশাল বই</div>
            <div style={{ fontFamily: BN, fontSize: 46, color: G.mute, marginTop: 24, maxWidth: 900, lineHeight: 1.4, opacity: enter(f, 18) }}>{s.sub}</div>
            {hasRec(spec, s.rec) && <div style={{ marginTop: 34, opacity: enter(f, 24) }}><AppWindow w={960} h={460} dark><Rec spec={spec} name={s.rec} fallback={null} /></AppWindow></div>}
          </div>
        </AbsoluteFill>
      );
    }
    case "why":
      return (
        <AbsoluteFill style={{ padding: "90px 120px" }}>
          <Title f={f} color={G.amber}>{s.head}</Title>
          <div style={{ marginTop: 50 }}>
            <Board f={f} rows={s.pts.map((p: string, i: number) => [String(i + 1).padStart(2, "0"), p, ""])} per={Math.floor((len * 0.7) / s.pts.length)} status="✓" />
          </div>
        </AbsoluteFill>
      );
    case "price": {
      const fps = useFps();
      const strike = enter(f, 20, 14);
      const now = pop(f, fps, 44, 9);
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {hasRec(spec, s.rec) && <div style={{ position: "absolute", right: -260, bottom: -120, opacity: 0.22 * enter(f, 0), transform: "rotate(-4deg)" }}><AppWindow w={1100} h={640} dark><Rec spec={spec} name={s.rec} fallback={null} /></AppWindow></div>}
          <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: BN, fontSize: 44, color: G.mute }}>রেগুলার দাম</div>
              <div style={{ position: "relative", fontFamily: BN, fontWeight: 800, fontSize: 104, color: G.mute }}>
                {s.regular}
                <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 12, background: G.red, transformOrigin: "left", transform: `scaleX(${strike}) rotate(-6deg)`, borderRadius: 6 }} />
              </div>
            </div>
            <Icon name="arrow-right" size={110} color={G.amber} />
            <div style={{ textAlign: "center", transform: `scale(${now})` }}>
              {s.mid && <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 52, color: G.mute, textDecoration: "line-through", textDecorationColor: G.red, opacity: enter(f, 34) }}>{s.mid}</div>}
              <div style={{ display: "inline-block", fontFamily: BN, fontWeight: 800, fontSize: 44, color: "#000", background: G.amber, padding: "4px 26px", borderRadius: 12 }}>{s.tag}</div>
              <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 210, color: G.green, lineHeight: 1.05 }}>{s.now}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 30, marginTop: 50 }}>
            <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 48, color: G.text, border: `3px solid ${G.green}`, borderRadius: 60, padding: "12px 40px", opacity: enter(f, len * 0.55) }}>✓ {s.free}</div>
            <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 48, color: "#fff", background: G.bkash, borderRadius: 60, padding: "12px 40px", opacity: enter(f, len * 0.8) }}>{s.pay}</div>
          </div>
        </AbsoluteFill>
      );
    }
    case "cta":
      return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
          <div style={{ opacity: enter(f, 0), transform: `scale(${0.9 + enter(f, 0) * 0.1})` }}><Logo dark w={520} /></div>
          <div style={{ fontFamily: BN, fontWeight: 800, fontSize: 64, color: G.text, opacity: enter(f, 16) }}>শিখবে তুমি দেখবে দেশ</div>
          <div style={{ fontFamily: BN, fontWeight: 700, fontSize: 48, color: G.amber, opacity: enter(f, 26) }}>এইবার তোমার হাতে আগামীর বাংলাদেশ</div>
          <div style={{ position: "absolute", bottom: 50, fontFamily: BN, fontSize: 28, color: G.mute, opacity: enter(f, 30) }}>{s.note} · সিমুলেটর আসল GDS নয়</div>
        </AbsoluteFill>
      );
  }
  return null;
}

const Bg: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1200px 700px at 80% -10%, ${G.bg2}, ${G.bg})` }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(#ffffff07 1px, transparent 1px), linear-gradient(90deg, #ffffff07 1px, transparent 1px)", backgroundSize: "80px 80px", backgroundPosition: `0 ${f * 0.5}px` }} />
    </AbsoluteFill>
  );
};

export const GdsBoard: React.FC<{ spec: Spec; durs: number[] }> = ({ spec, durs }) => {
  const total = totalLen(durs);
  return (
    <AbsoluteFill>
      <Bg />
      <Scenes spec={spec} durs={durs} render={(s, f, len) => render(spec, s, f, len)} />
      <div style={{ position: "absolute", right: 50, top: 36, fontFamily: BN, fontWeight: 700, fontSize: 26, color: "#ffffff70" }}>এআই ইউনিভার্সিটি</div>
      <Soundtrack pid={spec.id} durs={durs} total={total} music="aiu2/music.mp3" />
    </AbsoluteFill>
  );
};
