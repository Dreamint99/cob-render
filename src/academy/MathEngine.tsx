// AI University একাডেমি — chalkboard lesson engine (2026-11-15). Matches the /academy landing look: green chalkboard, wooden frame,
// chalk text written on left→right, textbook serif titles (Tiro Bangla), chalk hand (Galada), formulas in a maths serif.
// One spec per lesson: src/academy/specs/<id>.json, timed by scripts/academy_make.py (Bangla VO via OpenRouter Tanvir).
// Scenes: title · points · formula · area · steps · mistake · quizQ · quizA · recap · outro
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, delayRender, continueRender } from "remotion";

const K = { board: "#1F3A2E", board2: "#14261C", chalk: "#F4F1E8", dim: "rgba(244,241,232,.62)", faint: "rgba(244,241,232,.18)", yellow: "#FFE58A", pink: "#FF9EB5", blue: "#9AD0FF", green: "#A8E6A1", red: "#FF6B5B", wood: "#7A5530", wood2: "#5A3D20" };
const BN = "Anek", SERIF = "Tiro", HAND = "Galada", MATH = "Cambria, 'Cambria Math', Georgia, Anek, serif";
if (typeof document !== "undefined") {
  for (const [n, u] of [["Anek", "fonts/AnekBangla.ttf"], ["Tiro", "fonts/TiroBangla-Regular.ttf"], ["Galada", "fonts/Galada-Regular.ttf"]]) {
    const h = delayRender(`font ${n}`);
    const f = new FontFace(n, `url(${staticFile(u)})`, { weight: "100 900" });
    f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
  }
}
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const bn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 13, mass: 0.6 } });

export type Scene = { type: string; vo: string; frames: number; hold?: number; [k: string]: any };
export type Spec = { id: string; course: string; chapter: string; lessonNo: string; title: string; next: string; scenes: Scene[] };
const LEAD = 12, TAIL = 18;
const sceneLen = (s: Scene) => LEAD + s.frames + (s.hold || 0) + TAIL;
export const mathLen = (spec: Spec) => spec.scenes.reduce((n, s) => n + sceneLen(s), 0) + 30;
type P = { s: Scene; spec: Spec; vo: number };
const v = (p: P, x: number) => LEAD + p.vo * x;
const COL: Record<string, string> = { y: K.yellow, p: K.pink, b: K.blue, g: K.green, r: K.red, w: K.chalk };

/* ---------- chalk primitives ---------- */
const chalkShadow = "0 0 1px rgba(244,241,232,.9), 0 0 6px rgba(244,241,232,.25)";
// text "written" left→right with a chalk tip
const Write: React.FC<{ at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, dur = 18, children, style }) => {
  const f = useCurrentFrame(); const x = interpolate(f, [at, at + dur], [0, 100], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return <div style={{ position: "relative", clipPath: `inset(-20px ${100 - x}% -20px -20px)`, textShadow: chalkShadow, ...style }}>{children}</div>;
};
const Fade: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame(); const o = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: ease });
  return <div style={{ opacity: o, transform: `translateY(${(1 - o) * 12}px)`, ...style }}>{children}</div>;
};
// formula string with colour marks: "[y:a²] + [p:2ab] + [b:b²]"
const Mx: React.FC<{ t: string; size?: number; at?: number; step?: number }> = ({ t, size = 64, at = 0, step = 0 }) => {
  const f = useCurrentFrame(); let k = 0;
  const parts = String(t).split(/(\[[a-z]:[^\]]+\])/).filter(Boolean);
  return <span style={{ fontFamily: MATH, fontSize: size, color: K.chalk, textShadow: chalkShadow, whiteSpace: "pre" }}>{parts.map((x, i) => {
    const m = x.match(/^\[([a-z]):([^\]]+)\]$/);
    if (!m) return <span key={i}>{x}</span>;
    const d = at + step * k++, o = step ? interpolate(f, [d, d + 10], [0, 1], clamp) : 1;
    return <span key={i} style={{ color: COL[m[1]] || K.chalk, opacity: o, fontWeight: 700 }}>{m[2]}</span>;
  })}</span>;
};
const Head: React.FC<{ t: string; at?: number }> = ({ t, at = 2 }) => (
  <Write at={at} dur={16} style={{ fontFamily: HAND, fontSize: 54, color: K.yellow, marginBottom: 26 }}>{t}</Write>
);
const Box: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", left: 140, right: 140, top: 150, bottom: 170, display: "flex", flexDirection: "column", ...style }}>{children}</div>
);

/* ---------- scenes ---------- */
const STitle: React.FC<P> = (p) => (
  <Box style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
    <Fade at={4}><div style={{ fontFamily: HAND, fontSize: 40, color: K.yellow }}>{p.s.kicker || p.spec.chapter}</div></Fade>
    <Write at={10} dur={26} style={{ fontFamily: SERIF, fontSize: 104, color: K.chalk, lineHeight: 1.25, margin: "18px 0 10px" }}>{p.s.title || p.spec.title}</Write>
    {p.s.formula && <Fade at={40}><div style={{ marginTop: 18 }}><Mx t={p.s.formula} size={78} /></div></Fade>}
    {p.s.sub && <Fade at={v(p, 0.45)}><div style={{ fontFamily: BN, fontSize: 36, color: K.dim, marginTop: 26 }}>{p.s.sub}</div></Fade>}
  </Box>
);

const SPoints: React.FC<P> = (p) => {
  const it: string[] = p.s.items || [];
  return (
    <Box>
      <Head t={p.s.head} />
      {it.map((x, i) => (
        <Write key={i} at={v(p, 0.08 + (0.8 * i) / it.length)} dur={20} style={{ display: "flex", gap: 22, alignItems: "baseline", fontFamily: BN, fontSize: 46, color: K.chalk, lineHeight: 1.45, margin: "10px 0" }}>
          <span style={{ fontFamily: HAND, color: K.yellow, fontSize: 44 }}>{bn(i + 1)}.</span><span>{x}</span>
        </Write>
      ))}
    </Box>
  );
};

const SFormula: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const rows: string[] = p.s.rows || [p.s.formula];
  return (
    <Box style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <Head t={p.s.head} />
      {rows.map((r, i) => {
        const at = v(p, 0.06 + (0.62 * i) / rows.length);
        return <Write key={i} at={at} dur={26} style={{ margin: "16px 0" }}><Mx t={r} size={p.s.size || 92} at={at + 10} step={8} /></Write>;
      })}
      {p.s.note && <Fade at={v(p, 0.72)} style={{ marginTop: 40 }}><div style={{ fontFamily: BN, fontSize: 38, color: K.dim, border: `2px dashed ${K.faint}`, borderRadius: 16, padding: "14px 30px" }}>{p.s.note}</div></Fade>}
      {p.s.box && <div style={{ position: "absolute", inset: "130px 220px auto", height: 0, transform: `scale(${pop(f, fps, v(p, 0.66))})` }} />}
    </Box>
  );
};

// (a+b)² as an area: big square split into a², ab, ab, b²
const SArea: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const A = 330, B = 190, S = A + B, x0 = 0, y0 = 0;
  const reg = [
    { x: x0, y: y0, w: A, h: A, c: K.yellow, t: "a²", at: 0.28 },
    { x: x0 + A, y: y0, w: B, h: A, c: K.pink, t: "ab", at: 0.42 },
    { x: x0, y: y0 + A, w: A, h: B, c: K.pink, t: "ab", at: 0.5 },
    { x: x0 + A, y: y0 + A, w: B, h: B, c: K.blue, t: "b²", at: 0.6 },
  ];
  const draw = interpolate(f, [v(p, 0.04), v(p, 0.2)], [0, 1], clamp);
  return (
    <Box style={{ flexDirection: "row", alignItems: "center", gap: 90 }}>
      <svg width={S + 120} height={S + 120} viewBox={`-60 -60 ${S + 120} ${S + 120}`} style={{ flex: "none", overflow: "visible" }}>
        <rect x={0} y={0} width={S} height={S} fill="none" stroke={K.chalk} strokeWidth={5} strokeDasharray={4 * S} strokeDashoffset={4 * S * (1 - draw)} />
        {reg.map((r, i) => { const o = pop(f, fps, v(p, r.at)); return (
          <g key={i} opacity={Math.min(1, o)}>
            <rect x={r.x + 6} y={r.y + 6} width={r.w - 12} height={r.h - 12} fill={r.c} fillOpacity={0.18} stroke={r.c} strokeWidth={3} rx={6} />
            <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 22} textAnchor="middle" fontFamily={MATH} fontStyle="italic" fontSize={r.w > 250 ? 86 : 58} fill={r.c}>{r.t}</text>
          </g>); })}
        {[["a", A / 2, -18, 0], ["b", A + B / 2, -18, 0], ["a", -30, A / 2 + 14, 1], ["b", -30, A + B / 2 + 14, 1]].map(([t, x, y], i) => (
          <text key={i} x={x as number} y={y as number} textAnchor="middle" fontFamily={MATH} fontStyle="italic" fontSize={46} fill={K.chalk} opacity={draw}>{t}</text>))}
      </svg>
      <div style={{ flex: 1 }}>
        <Head t={p.s.head} />
        <Fade at={v(p, 0.22)}><div style={{ fontFamily: BN, fontSize: 40, color: K.dim, lineHeight: 1.5 }}>{p.s.side || "বাহুর দৈর্ঘ্য (a + b) — তাই ক্ষেত্রফল (a + b)²"}</div></Fade>
        <Write at={v(p, 0.72)} dur={28} style={{ marginTop: 50 }}><Mx t="(a + b)² = [y:a²] + [p:2ab] + [b:b²]" size={72} /></Write>
      </div>
    </Box>
  );
};

// worked example — each line written in turn
const SSteps: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const L: { t: string; why?: string }[] = p.s.lines || [];
  const n = L.length, start = p.s.given ? 0.16 : 0.06;
  return (
    <Box>
      <Head t={p.s.head} />
      {p.s.given && <Write at={v(p, 0.02)} dur={22} style={{ fontFamily: BN, fontSize: 40, color: K.dim, marginBottom: 18 }}>{p.s.given}</Write>}
      <div style={{ display: "grid", gap: 6 }}>
        {L.map((x, i) => {
          const at = v(p, start + ((0.92 - start) * i) / n), last = i === n - 1;
          return (
            <div key={i} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 40, rowGap: 2 }}>
              <Write at={at} dur={20}>
                <div style={{ display: "inline-block", padding: last ? "4px 22px" : 0, border: last ? `3px solid ${K.yellow}` : 0, borderRadius: 12, transform: last ? `scale(${0.9 + 0.1 * Math.min(1, pop(f, fps, at + 10))})` : undefined }}><Mx t={x.t} size={x.t.length > 30 ? 56 : 66} /></div>
              </Write>
              {x.why && <Fade at={at + 14}><div style={{ fontFamily: HAND, fontSize: 34, color: K.green }}>← {x.why}</div></Fade>}
            </div>);
        })}
      </div>
    </Box>
  );
};

const SMistake: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const cross = interpolate(f, [v(p, 0.3), v(p, 0.4)], [0, 1], clamp);
  return (
    <Box style={{ alignItems: "center", textAlign: "center" }}>
      <Head t={p.s.head || "সাবধান! সবচেয়ে কমন ভুল"} />
      <div style={{ position: "relative", marginTop: 20 }}>
        <Write at={v(p, 0.05)} dur={22}><Mx t={p.s.wrong} size={84} /></Write>
        <svg style={{ position: "absolute", inset: "-20px -40px", width: "calc(100% + 80px)", height: "calc(100% + 40px)", overflow: "visible" }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="2" y1="85" x2={2 + 96 * cross} y2={85 - 70 * cross} stroke={K.red} strokeWidth="2.2" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 10 }} />
        </svg>
        <div style={{ position: "absolute", right: -110, top: -10, fontFamily: MATH, fontSize: 90, color: K.red, transform: `scale(${pop(f, fps, v(p, 0.38))})` }}>✗</div>
      </div>
      <div style={{ position: "relative", marginTop: 60 }}>
        <Write at={v(p, 0.5)} dur={24}><Mx t={p.s.right} size={84} /></Write>
        <div style={{ position: "absolute", right: -110, top: -10, fontFamily: MATH, fontSize: 90, color: K.green, transform: `scale(${pop(f, fps, v(p, 0.62))})` }}>✓</div>
      </div>
      {p.s.why && <Fade at={v(p, 0.7)} style={{ marginTop: 50 }}><div style={{ fontFamily: BN, fontSize: 38, color: K.dim, maxWidth: 1300, lineHeight: 1.5 }}>{p.s.why}</div></Fade>}
    </Box>
  );
};

const SQuiz: React.FC<P & { answer?: boolean }> = (p) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o: string[] = p.s.o || [], ans = p.answer, a = p.s.a;
  const total = p.vo + (p.s.hold || 0), left = Math.max(0, Math.ceil((LEAD + total - f) / fps));
  return (
    <Box>
      <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
        <Head t={ans ? "উত্তর" : "এবার তোমার পালা!"} />
        {!ans && p.s.hold ? <div style={{ marginLeft: "auto", fontFamily: HAND, fontSize: 64, color: K.yellow }}>{bn(left)}</div> : null}
      </div>
      <Write at={6} dur={22} style={{ marginBottom: 34 }}>{/\[|\^|²|√|=/.test(p.s.q) ? <Mx t={p.s.q} size={60} /> : <span style={{ fontFamily: BN, fontSize: 50, color: K.chalk }}>{p.s.q}</span>}</Write>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {o.map((x, i) => {
          const ok = ans && i === a, dim = ans && i !== a;
          return (
            <Fade key={i} at={14 + i * 6}>
              <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 26px", borderRadius: 18, border: `3px solid ${ok ? K.green : K.faint}`, background: ok ? "rgba(168,230,161,.12)" : "transparent", opacity: dim ? 0.4 : 1, transform: ok ? `scale(${0.95 + 0.05 * Math.min(1, pop(f, fps, 10))})` : undefined }}>
                <span style={{ width: 58, height: 58, borderRadius: "50%", border: `3px solid ${ok ? K.green : K.chalk}`, background: ok ? K.green : "transparent", color: ok ? K.board : K.chalk, display: "grid", placeItems: "center", fontFamily: BN, fontSize: 32, fontWeight: 700, flex: "none" }}>{"কখগঘ"[i]}</span>
                <Mx t={x} size={50} />
              </div>
            </Fade>);
        })}
      </div>
      {ans && p.s.ex && <Fade at={v(p, 0.35)} style={{ marginTop: 34 }}><div style={{ fontFamily: BN, fontSize: 38, color: K.dim, lineHeight: 1.5 }}><span style={{ fontFamily: HAND, color: K.yellow }}>কারণ: </span>{p.s.ex}</div></Fade>}
    </Box>
  );
};

const SRecap: React.FC<P> = (p) => {
  const it: string[] = p.s.items || [];
  return (
    <Box>
      <Head t={p.s.head || "আজ যা শিখলাম"} />
      {it.map((x, i) => (
        <Write key={i} at={v(p, 0.06 + (0.8 * i) / it.length)} dur={22} style={{ display: "flex", gap: 22, alignItems: "center", margin: "14px 0" }}>
          <span style={{ fontFamily: MATH, fontSize: 52, color: K.green }}>✓</span><Mx t={x} size={54} />
        </Write>
      ))}
    </Box>
  );
};

const SOutro: React.FC<P> = (p) => (
  <Box style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
    <Write at={4} dur={22} style={{ fontFamily: HAND, fontSize: 64, color: K.yellow }}>{p.s.head || "পরের পাঠে দেখা হবে!"}</Write>
    {p.spec.next && <Fade at={20}><div style={{ fontFamily: SERIF, fontSize: 60, color: K.chalk, margin: "26px 0 40px" }}>পরের পাঠ: {p.spec.next}</div></Fade>}
    <Fade at={34}><div style={{ fontFamily: BN, fontSize: 40, color: K.dim }}>অনুশীলন আর এআই শিক্ষক — <span style={{ color: K.chalk, fontWeight: 700 }}>aiuniversitybd.com/academy</span></div></Fade>
  </Box>
);

const MAP: Record<string, React.FC<any>> = { title: STitle, points: SPoints, formula: SFormula, area: SArea, steps: SSteps, mistake: SMistake, quizQ: SQuiz, quizA: (p: P) => <SQuiz {...p} answer />, recap: SRecap, outro: SOutro };

/* ---------- frame chrome ---------- */
const Chrome: React.FC<{ spec: Spec; starts: number[] }> = ({ spec, starts }) => {
  const f = useCurrentFrame(); const k = starts.filter((s) => f >= s).length;
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 46, display: "flex", alignItems: "center", gap: 18 }}>
        <Img src={staticFile("academy/_brand/aiu-logo-dark.svg")} style={{ height: 40 }} />
        <div style={{ fontFamily: HAND, fontSize: 34, color: K.yellow }}>একাডেমি</div>
        <div style={{ fontFamily: BN, fontSize: 26, color: K.dim }}>· {spec.course} · {spec.lessonNo}</div>
      </div>
      <div style={{ position: "absolute", right: 70, top: 62, display: "flex", gap: 10 }}>
        {starts.map((_, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: i < k ? K.chalk : "transparent", border: `2px solid ${K.dim}`, opacity: i === k - 1 ? 1 : 0.6 }} />)}
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 120, fontFamily: BN, fontSize: 20, color: K.dim }}>এআই শিক্ষক · এআই কণ্ঠ</div>
    </>
  );
};
const subChunks = (spec: Spec, starts: number[]) => spec.scenes.flatMap((s, i) => {
  const parts = s.vo.split(/(?<=[।?!,—])\s+/).reduce<string[]>((a, x) => { if (a.length && (a[a.length - 1].length < 26 || x.length < 10)) a[a.length - 1] += " " + x; else a.push(x); return a; }, []);
  const total = parts.reduce((n, x) => n + x.length, 0); let acc = 0; const b = starts[i] + LEAD;
  return parts.map((x) => { const from = b + (s.frames * acc) / total; acc += x.length; return { s: x, from, to: b + (s.frames * acc) / total }; });
});
const SceneFade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  // "wiped off the board": fade out with a slight horizontal smudge
  const o = Math.min(interpolate(f, [0, 10], [0, 1], clamp), interpolate(f, [len - 12, len], [1, 0], clamp));
  return <AbsoluteFill style={{ opacity: o, filter: `blur(${(1 - o) * 3}px)` }}>{children}</AbsoluteFill>;
};

export const MathVideo: React.FC<{ spec: Spec }> = ({ spec }) => {
  const f = useCurrentFrame();
  const lens = spec.scenes.map(sceneLen);
  const starts = lens.reduce<number[]>((a, _, i) => [...a, i ? a[i - 1] + lens[i - 1] : 15], []);
  const chunks = subChunks(spec, starts);
  const cur = chunks.find((x) => f >= x.from && f < x.to + 4);
  const total = mathLen(spec);
  const busy = (fr: number) => spec.scenes.some((s, i) => fr >= starts[i] + LEAD - 6 && fr <= starts[i] + LEAD + s.frames + 4);
  return (
    <AbsoluteFill style={{ background: K.wood }}>
      {/* wooden frame + board */}
      <AbsoluteFill style={{ inset: 22, borderRadius: 10, background: `radial-gradient(120% 90% at 30% 20%, #2C4D3C 0%, ${K.board} 45%, ${K.board2} 100%)`, boxShadow: `inset 0 0 0 4px ${K.wood2}, inset 0 0 120px rgba(0,0,0,.45)` }} />
      <AbsoluteFill style={{ inset: 22, borderRadius: 10, opacity: 0.08, backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,.5) 0 1px, transparent 1px 7px), repeating-linear-gradient(25deg, rgba(255,255,255,.35) 0 1px, transparent 1px 11px)" }} />
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, height: 26, background: `linear-gradient(${K.wood}, ${K.wood2})`, borderTop: "2px solid rgba(0,0,0,.25)" }}>
        <div style={{ position: "absolute", left: 300, top: -9, width: 90, height: 16, borderRadius: 4, background: "#F4F1E8" }} /><div style={{ position: "absolute", left: 420, top: -8, width: 60, height: 14, borderRadius: 4, background: K.yellow }} />
      </div>
      {spec.scenes.map((s, i) => {
        const S = MAP[s.type]; const len = lens[i];
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={len}>
            <SceneFade len={len}><S s={s} spec={spec} vo={s.frames} /></SceneFade>
            <Sequence from={LEAD}><Audio src={staticFile(`academy/${spec.id}/vo/${String(i + 1).padStart(2, "0")}.mp3`)} /></Sequence>
            <Sequence from={0}><Audio src={staticFile(`aiu2/${i === 0 ? "swell" : s.type === "quizA" || s.type === "outro" ? "chime" : "whoosh"}.mp3`)} volume={0.22} /></Sequence>
          </Sequence>
        );
      })}
      <Chrome spec={spec} starts={starts} />
      {cur && <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, display: "flex", justifyContent: "center", opacity: interpolate(f, [cur.from, cur.from + 5, cur.to, cur.to + 4], [0, 1, 1, 0], clamp) }}><div style={{ maxWidth: 1500, padding: "8px 26px 12px", borderRadius: 12, background: "rgba(10,20,14,.78)", fontFamily: BN, fontSize: 34, fontWeight: 500, color: "#fff", textAlign: "center", lineHeight: 1.35 }}>{cur.s.replace(/[।,]$/, "")}</div></div>}
      <Audio src={staticFile("aiu2/music.mp3")} volume={(fr) => (busy(fr) ? 0.04 : 0.12) * interpolate(fr, [0, 30, total - 60, total], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
