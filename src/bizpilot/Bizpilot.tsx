// Bizpilot concept film (16:9) — the owner's SaaS idea: one inbox, per-page AI agent, comments, website links,
// rules, in-chat orders, branded invoices, dashboard, all-business platform. VO Tanvir (OpenRouter), work/bizpilot/.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import DURS from "./durs.json";

const FPS = 30, PAD = 0.5, LEAD = 10;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], { ...clamp, easing: ease });

const BG = "#070B18", CARD = "#0F1629", LINE = "rgba(148,163,255,0.14)", BLUE = "#3B82F6", VIO = "#7C5CFF",
  MINT = "#22C55E", PINK = "#E1306C", WA = "#25D366", FB = "#1877F2", RED = "#F43F5E", AMBER = "#FBBF24", TXT = "#E8ECFF", MUTE = "#8A93B8";
const GRAD = `linear-gradient(135deg, ${BLUE}, ${VIO})`;
const BN = "AnekB, 'Hind Siliguri', sans-serif", BODY = "Hind, 'Hind Siliguri', sans-serif", LAT = "Montserrat, sans-serif";

if (typeof document !== "undefined") {
  for (const [name, file] of [["AnekB", "AnekBangla.ttf"], ["Hind", "HindSiliguri-Bold.ttf"], ["Montserrat", "Montserrat.ttf"]]) {
    const ff = new FontFace(name, `url(${staticFile("fonts/" + file)})`);
    ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  }
}

type Seg = { p: string; text: string; dur: number };
const SEGS = DURS as Seg[];
export const timelineBP = () => {
  let at = 0;
  return SEGS.map((s) => {
    const len = Math.round((s.dur + PAD) * FPS) + LEAD + (s.p === "outro" ? 75 : 0);
    const it = { s, from: at, len }; at += len; return it;
  });
};
export const BP_TOTAL = (() => { const t = timelineBP(); return t[t.length - 1].from + t[t.length - 1].len; })();

/* ---------- shared bits ---------- */
const useIn = (delay = 0, damping = 16) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.8 } }); };

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const a = f * 0.25;
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1200, height: 1200, left: -300 + 60 * Math.sin(a / 40), top: -500, borderRadius: "50%", background: `radial-gradient(circle, ${BLUE}33, transparent 65%)` }} />
      <div style={{ position: "absolute", width: 1100, height: 1100, right: -350, bottom: -550 + 50 * Math.cos(a / 50), borderRadius: "50%", background: `radial-gradient(circle, ${VIO}30, transparent 65%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`, backgroundSize: "80px 80px", opacity: 0.35, maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)" }} />
    </AbsoluteFill>
  );
};

const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 28, boxShadow: "0 30px 80px rgba(0,0,0,0.45)", ...style }}>{children}</div>
);

// Headline at the top of each scene (short, Bangla).
const Title: React.FC<{ t: string; sub?: string; color?: string }> = ({ t, sub, color }) => {
  const k = useIn(2);
  return (
    <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
      <div style={{ fontFamily: BN, fontSize: 64, fontWeight: 700, color: color || TXT, wordSpacing: 6 }}>{t}</div>
      {sub ? <div style={{ fontFamily: LAT, fontSize: 24, color: MUTE, marginTop: 8, letterSpacing: 4, textTransform: "uppercase" }}>{sub}</div> : null}
    </div>
  );
};

const Logo: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs><linearGradient id="bpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={BLUE} /><stop offset="1" stopColor={VIO} /></linearGradient></defs>
    <rect x="4" y="4" width="92" height="92" rx="26" fill="url(#bpg)" />
    <path d="M24 52 L76 28 L60 76 L50 56 Z" fill="#fff" />
    <path d="M50 56 L76 28" stroke={VIO} strokeWidth="4" />
  </svg>
);

const Dot: React.FC<{ c: string; s?: number }> = ({ c, s = 16 }) => <span style={{ display: "inline-block", width: s, height: s, borderRadius: s, background: c, boxShadow: `0 0 14px ${c}` }} />;

const ChBadge: React.FC<{ ch: "fb" | "ig" | "wa"; s?: number }> = ({ ch, s = 44 }) => {
  const bg = ch === "fb" ? FB : ch === "ig" ? `linear-gradient(135deg, #F58529, ${PINK}, #8134AF)` : WA;
  const l = ch === "fb" ? "f" : ch === "ig" ? "◎" : "✆";
  return <div style={{ width: s, height: s, borderRadius: s * 0.3, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: LAT, fontWeight: 800, fontSize: s * 0.55, flexShrink: 0 }}>{l}</div>;
};

const Bubble: React.FC<{ me?: boolean; ai?: boolean; children: React.ReactNode; k: number; w?: number }> = ({ me, ai, children, k, w = 560 }) => (
  <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", opacity: k, transform: `translateY(${(1 - k) * 24}px) scale(${0.96 + 0.04 * k})` }}>
    <div style={{ maxWidth: w, padding: "18px 24px", borderRadius: 24, borderBottomRightRadius: me ? 6 : 24, borderBottomLeftRadius: me ? 24 : 6, background: me ? GRAD : "#1A2340", color: TXT, fontFamily: BODY, fontSize: 30, lineHeight: 1.45, border: ai ? `1px solid ${VIO}88` : "none" }}>
      {ai ? <div style={{ fontFamily: LAT, fontSize: 16, color: "#C7BCFF", letterSpacing: 2, marginBottom: 6 }}>✦ AI AGENT</div> : null}
      {children}
    </div>
  </div>
);

const Typing: React.FC<{ k: number }> = ({ k }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: k, display: "flex", gap: 8, padding: "18px 22px", background: "#1A2340", borderRadius: 22, width: 96 }}>
      {[0, 1, 2].map((i) => <span key={i} style={{ width: 12, height: 12, borderRadius: 12, background: "#C7BCFF", opacity: 0.4 + 0.6 * Math.abs(Math.sin((f / 6) + i)) }} />)}
    </div>
  );
};

const Count: React.FC<{ to: number; from?: number; start: number; len?: number; fmt?: (n: number) => string }> = ({ to, from = 0, start, len = 40, fmt }) => {
  const f = useCurrentFrame();
  const n = Math.round(lerp(f, start, start + len, from, to));
  return <>{fmt ? fmt(n) : n.toLocaleString("en-IN")}</>;
};
const bnDigits = (s: string) => s.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

/* ---------- scenes ---------- */
const Hook: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const ph = useIn(4), msg = useIn(40), gone = lerp(f, len - 70, len - 30);
  return (
    <AbsoluteFill style={{ background: "#03050C", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", left: 220, top: 380, fontFamily: LAT, fontWeight: 800, fontSize: 150, color: TXT, opacity: lerp(f, 0, 20) * (1 - gone) }}>2:00<span style={{ fontSize: 60, color: MUTE }}> AM</span></div>
      <div style={{ position: "absolute", left: 230, top: 560, fontFamily: BN, fontSize: 44, color: MUTE, opacity: lerp(f, 10, 30) * (1 - gone) }}>সবাই ঘুমে…</div>
      <div style={{ position: "absolute", right: 300, top: 120, transform: `translateY(${(1 - ph) * 80}px)`, opacity: ph * (1 - 0.85 * gone) }}>
        <div style={{ width: 430, height: 860, borderRadius: 60, background: "#0B1020", border: "10px solid #1E2640", padding: 28, boxShadow: `0 0 120px ${BLUE}22` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: TXT, fontFamily: BN, fontSize: 28, paddingBottom: 18, borderBottom: `1px solid ${LINE}` }}><ChBadge ch="fb" s={46} />রহিম ফ্যাশন</div>
          <div style={{ marginTop: 40, opacity: msg, transform: `translateX(${(1 - msg) * -30}px)` }}>
            <div style={{ display: "inline-block", padding: "18px 26px", borderRadius: 24, background: "#1A2340", color: TXT, fontFamily: BODY, fontSize: 34 }}>আপু, দাম কত? 🙂</div>
            <div style={{ fontFamily: LAT, fontSize: 18, color: MUTE, marginTop: 10 }}>2:00 AM · Unread</div>
          </div>
          <div style={{ marginTop: 60, display: "flex", alignItems: "center", gap: 10, color: MUTE, fontFamily: LAT, fontSize: 20, opacity: lerp(f, 90, 110) * (1 - gone) }}>
            <span style={{ width: 10, height: 10, borderRadius: 10, background: MUTE }} /> No reply…
          </div>
        </div>
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(3,5,12,${0.94 * gone})` }}>
        <div style={{ fontFamily: BN, fontSize: 76, fontWeight: 700, color: RED, opacity: gone, transform: `scale(${0.9 + 0.1 * gone})` }}>কাস্টমার চলে গেল অন্য পেজে</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const icons = Array.from({ length: 26 }, (_, i) => i);
  return (
    <AbsoluteFill>
      <Backdrop />
      {icons.map((i) => {
        const ch = (["fb", "ig", "wa"] as const)[i % 3];
        const st = 6 + i * 5, k = lerp(f, st, st + 14);
        const col = i % 7, row = Math.floor(i / 7);
        const x = 120 + col * 255 + ((i * 37) % 60), y = 140 + row * 230 + ((i * 53) % 70);
        if (x > 560 && x < 1300 && y > 300 && y < 720) return null;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + Math.sin((f + i * 9) / 14) * 8, opacity: k * 0.9, transform: `scale(${k})` }}>
            <ChBadge ch={ch} s={64} />
            <div style={{ position: "absolute", top: -10, right: -12, background: RED, color: "#fff", borderRadius: 20, padding: "2px 9px", fontFamily: LAT, fontWeight: 800, fontSize: 18 }}>{1 + (i % 9)}</div>
          </div>
        );
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Card style={{ padding: "40px 70px", textAlign: "center", background: "rgba(15,22,41,0.92)" }}>
          <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: 150, color: TXT, lineHeight: 1 }}><Count to={347} start={10} len={150} /></div>
          <div style={{ fontFamily: BN, fontSize: 40, color: MUTE, marginTop: 10 }}>উত্তর না পাওয়া মেসেজ</div>
          <div style={{ fontFamily: BN, fontSize: 46, color: RED, marginTop: 18, opacity: lerp(f, 150, 175) }}>= হারানো বিক্রি</div>
        </Card>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const k = useIn(4, 12), w = useIn(18), t = useIn(40);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${VIO}55, transparent 60%)`, transform: `scale(${0.6 + 0.5 * k})`, opacity: k }} />
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ transform: `scale(${k}) rotate(${(1 - k) * -40}deg)` }}><Logo size={200} /></div>
          <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: 170, color: TXT, opacity: w, transform: `translateX(${(1 - w) * -40}px)`, letterSpacing: -4 }}>Biz<span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>pilot</span></div>
        </div>
        <div style={{ position: "absolute", top: 700, fontFamily: LAT, fontSize: 40, color: MUTE, letterSpacing: 3, opacity: t }}>Put your business on autopilot</div>
        <div style={{ position: "absolute", top: 770, fontFamily: BN, fontSize: 40, color: TXT, opacity: lerp(f, 60, 80) }}>আপনার ব্যবসা, এখন অটোপাইলটে</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CONVOS: { ch: "fb" | "ig" | "wa"; n: string; m: string; t: string }[] = [
  { ch: "fb", n: "সাদিয়া আক্তার", m: "লাল শাড়িটা কি আছে?", t: "2m" },
  { ch: "wa", n: "Rakib Hasan", m: "Delivery charge koto?", t: "4m" },
  { ch: "ig", n: "নুসরাত জাহান", m: "সাইজ চার্ট দিবেন?", t: "6m" },
  { ch: "fb", n: "তানভীর আহমেদ", m: "অর্ডার করতে চাই", t: "9m" },
  { ch: "wa", n: "Dr. Mitu", m: "Appointment kal?", t: "12m" },
  { ch: "ig", n: "আরিফ", m: "অফিস কয়টা পর্যন্ত খোলা?", t: "15m" },
];

const InboxShell: React.FC<{ active?: number; children?: React.ReactNode; right?: React.ReactNode; listIn?: boolean }> = ({ active = 0, children, right, listIn = true }) => {
  const f = useCurrentFrame();
  return (
    <Card style={{ position: "absolute", left: 120, right: 120, top: 210, bottom: 70, display: "flex", overflow: "hidden" }}>
      <div style={{ width: 470, borderRight: `1px solid ${LINE}`, padding: 22 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {["সব", "Messenger", "Instagram", "WhatsApp"].map((x, i) => <div key={x} style={{ padding: "8px 16px", borderRadius: 20, fontFamily: i ? LAT : BN, fontSize: 18, color: i ? MUTE : "#fff", background: i ? "transparent" : GRAD, border: i ? `1px solid ${LINE}` : "none" }}>{x}</div>)}
        </div>
        {CONVOS.map((c, i) => {
          const k = listIn ? lerp(f, 6 + i * 7, 22 + i * 7) : 1;
          return (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 12px", borderRadius: 18, background: i === active ? "#1A2340" : "transparent", opacity: k, transform: `translateX(${(1 - k) * -40}px)` }}>
              <ChBadge ch={c.ch} s={46} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: BODY, fontSize: 24, color: TXT }}>{c.n}</div>
                <div style={{ fontFamily: BODY, fontSize: 20, color: MUTE, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.m}</div>
              </div>
              <div style={{ fontFamily: LAT, fontSize: 16, color: MUTE }}>{c.t}</div>
            </div>
          );
        })}
      </div>
      <div style={{ flex: 1, padding: 34, display: "flex", flexDirection: "column", gap: 20, justifyContent: "flex-end" }}>{children}</div>
      {right ? <div style={{ width: 430, borderLeft: `1px solid ${LINE}`, padding: 26 }}>{right}</div> : null}
    </Card>
  );
};

const Inbox: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title t="সব মেসেজ, এক ইনবক্সে" />
      <InboxShell active={0}>
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 70 }}>
          {(["fb", "ig", "wa"] as const).map((c, i) => {
            const k = lerp(f, 20 + i * 10, 40 + i * 10);
            return <div key={c} style={{ transform: `translateY(${(1 - k) * -60}px) scale(${k})`, opacity: k }}><ChBadge ch={c} s={110} /></div>;
          })}
        </div>
        <div style={{ position: "absolute", top: 210, left: 0, right: 0, textAlign: "center", fontFamily: LAT, fontSize: 30, color: MUTE, opacity: lerp(f, 60, 80) }}>↓ ↓ ↓</div>
        <Bubble k={lerp(f, 70, 90)}>লাল শাড়িটা কি আছে?</Bubble>
      </InboxShell>
    </AbsoluteFill>
  );
};

const Agent: React.FC = () => {
  const f = useCurrentFrame();
  const chips = ["পেজের তথ্য", "প্রোডাক্ট", "সার্ভিস", "FAQ", "দাম"];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title t="প্রতিটি পেজের নিজের AI এজেন্ট" />
      <InboxShell active={0} listIn={false} right={
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
            <div style={{ width: 70, height: 70, borderRadius: 22, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 36, boxShadow: `0 0 ${20 + 15 * Math.sin(f / 8)}px ${VIO}` }}>✦</div>
            <div><div style={{ fontFamily: LAT, fontWeight: 700, fontSize: 26, color: TXT }}>AI Agent</div><div style={{ fontFamily: BN, fontSize: 20, color: MINT }}>শিখছে…</div></div>
          </div>
          {chips.map((c, i) => {
            const k = lerp(f, 10 + i * 12, 28 + i * 12);
            return <div key={c} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", marginBottom: 12, borderRadius: 16, border: `1px solid ${LINE}`, background: "#141C34", opacity: k, transform: `translateX(${(1 - k) * 60}px)`, fontFamily: BN, fontSize: 26, color: TXT }}><span style={{ color: MINT }}>✓</span>{c}</div>;
          })}
          <div style={{ marginTop: 18, display: "flex", gap: 10, opacity: lerp(f, 150, 170) }}>
            {["বাংলা", "English", "Banglish"].map((l) => <div key={l} style={{ padding: "8px 14px", borderRadius: 14, background: `${VIO}33`, color: "#D6CCFF", fontFamily: BODY, fontSize: 20 }}>{l}</div>)}
          </div>
        </div>
      }>
        <Bubble k={1}>লাল শাড়িটা কি আছে?</Bubble>
        {f < 120 ? <Typing k={lerp(f, 60, 70)} /> : null}
        <Bubble ai k={lerp(f, 120, 138)}>জি আপু, আছে! 😊 জামদানি লাল শাড়ি ৳২,৪৫০। ঢাকায় ডেলিভারি ১–২ দিনে। অর্ডার করবেন?</Bubble>
        <Bubble me k={lerp(f, 220, 238)}>Ji, order korbo</Bubble>
      </InboxShell>
    </AbsoluteFill>
  );
};

const Comments: React.FC = () => {
  const f = useCurrentFrame();
  const r = lerp(f, 60, 80), dm = lerp(f, 100, 125);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title t="কমেন্টেও অটো উত্তর" />
      <Card style={{ position: "absolute", left: 260, top: 230, width: 820, padding: 34 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}><ChBadge ch="fb" s={56} /><div><div style={{ fontFamily: BN, fontSize: 30, color: TXT }}>রহিম ফ্যাশন</div><div style={{ fontFamily: LAT, fontSize: 18, color: MUTE }}>Sponsored · New arrival</div></div></div>
        <div style={{ height: 230, marginTop: 22, borderRadius: 20, background: `linear-gradient(135deg, #7F1D1D, #B91C1C 50%, ${AMBER})`, display: "flex", alignItems: "flex-end", padding: 24, fontFamily: BN, fontSize: 42, color: "#fff" }}>নতুন জামদানি কালেকশন</div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ opacity: lerp(f, 10, 28), fontFamily: BODY, fontSize: 28, color: TXT }}><b style={{ color: "#9DB4FF" }}>সুমাইয়া</b> · দাম কত?</div>
          <div style={{ marginLeft: 50, opacity: r, transform: `translateY(${(1 - r) * 16}px)`, fontFamily: BODY, fontSize: 28, color: TXT }}><b style={{ color: "#C7BCFF" }}>রহিম ফ্যাশন ✦</b> · ইনবক্সে বিস্তারিত দিলাম 😊</div>
          <div style={{ opacity: lerp(f, 40, 58), fontFamily: BODY, fontSize: 28, color: TXT }}><b style={{ color: "#9DB4FF" }}>Hasan</b> · price plz</div>
        </div>
      </Card>
      <svg style={{ position: "absolute", left: 1080, top: 560 }} width="200" height="80"><path d={`M0 40 L${180 * dm} 40`} stroke={VIO} strokeWidth="5" strokeDasharray="12 10" /><path d="M170 25 L195 40 L170 55" fill="none" stroke={VIO} strokeWidth="5" opacity={dm} /></svg>
      <Card style={{ position: "absolute", left: 1300, top: 400, width: 470, padding: 28, opacity: dm, transform: `translateX(${(1 - dm) * 40}px)` }}>
        <div style={{ fontFamily: LAT, fontSize: 18, color: MUTE, letterSpacing: 2, marginBottom: 16 }}>INBOX · সুমাইয়া</div>
        <Bubble ai k={1} w={400}>জামদানি শাড়ি ৳২,৪৫০, ৩টি রঙে আছে। ছবি আর সাইজ পাঠালাম 👇</Bubble>
      </Card>
    </AbsoluteFill>
  );
};

const Website: React.FC = () => {
  const f = useCurrentFrame();
  const scan = lerp(f, 15, 75), pull = lerp(f, 90, 120);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title t="ওয়েবসাইট কানেক্ট, লিংক অটো" />
      <Card style={{ position: "absolute", left: 160, top: 240, width: 860, height: 640, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 22px", borderBottom: `1px solid ${LINE}` }}>
          {[RED, AMBER, MINT].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: 14, background: c }} />)}
          <div style={{ marginLeft: 16, flex: 1, padding: "8px 18px", borderRadius: 12, background: "#141C34", fontFamily: LAT, fontSize: 20, color: MUTE }}>rahimfashion.com</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, padding: 26 }}>
          {["#B91C1C", "#0EA5E9", "#A16207", "#7C3AED", "#059669", "#DB2777"].map((c, i) => (
            <div key={i} style={{ borderRadius: 18, background: "#141C34", padding: 12, outline: i === 0 ? `3px solid ${pull > 0 ? VIO : "transparent"}` : "none" }}>
              <div style={{ height: 150, borderRadius: 12, background: `linear-gradient(135deg, ${c}, ${c}88)` }} />
              <div style={{ height: 14, width: "70%", background: "#26304F", borderRadius: 8, marginTop: 12 }} />
              <div style={{ height: 14, width: "40%", background: "#26304F", borderRadius: 8, marginTop: 8 }} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 80 + scan * 540, height: 4, background: VIO, boxShadow: `0 0 30px ${VIO}`, opacity: scan < 1 ? 1 : 0 }} />
        <div style={{ position: "absolute", right: 22, bottom: 20, fontFamily: BN, fontSize: 22, color: MINT, opacity: lerp(f, 75, 90) }}>✓ ১২৪টি পেজ শেখা হয়েছে</div>
      </Card>
      <Card style={{ position: "absolute", left: 1110, top: 300, width: 650, padding: 30, opacity: lerp(f, 80, 100) }}>
        <Bubble me k={1} w={500}>এই শাড়িটার লিংক দিবেন?</Bubble>
        <div style={{ height: 18 }} />
        <Bubble ai k={pull} w={560}>
          অবশ্যই! 👇
          <div style={{ marginTop: 12, display: "flex", gap: 14, alignItems: "center", background: "#0F1629", borderRadius: 16, padding: 12 }}>
            <div style={{ width: 80, height: 80, borderRadius: 12, background: "linear-gradient(135deg, #B91C1C, #B91C1C88)" }} />
            <div><div style={{ fontFamily: BN, fontSize: 24 }}>লাল জামদানি শাড়ি</div><div style={{ fontFamily: LAT, fontSize: 18, color: "#9DB4FF" }}>rahimfashion.com/p/jamdani-red</div></div>
          </div>
        </Bubble>
      </Card>
    </AbsoluteFill>
  );
};

const RULES = [
  { t: "ঢাকায় ডেলিভারি", v: "৳৬০" },
  { t: "ঢাকার বাইরে", v: "৳১২০" },
  { t: "অফিস টাইম", v: "১০টা–৮টা" },
  { t: "দাম কমানোর প্রতিশ্রুতি", v: "না" },
  { t: "নিশ্চিত না হলে", v: "মানুষের কাছে" },
];
const Rules: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title t="আপনি নিয়ম শেখান, এজেন্ট মানে" />
      <Card style={{ position: "absolute", left: 460, right: 460, top: 240, padding: "30px 40px" }}>
        <div style={{ fontFamily: LAT, fontSize: 20, color: MUTE, letterSpacing: 3, marginBottom: 14 }}>AGENT RULES</div>
        {RULES.map((r, i) => {
          const k = lerp(f, 10 + i * 18, 26 + i * 18), on = lerp(f, 22 + i * 18, 32 + i * 18);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "20px 0", borderTop: i ? `1px solid ${LINE}` : "none", opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
              <div style={{ flex: 1, fontFamily: BN, fontSize: 34, color: TXT }}>{r.t}</div>
              <div style={{ fontFamily: BN, fontSize: 32, color: "#C7BCFF", marginRight: 30 }}>{r.v}</div>
              <div style={{ width: 76, height: 42, borderRadius: 42, background: on > 0.5 ? MINT : "#2A3352", position: "relative" }}>
                <div style={{ position: "absolute", top: 5, left: 5 + 34 * on, width: 32, height: 32, borderRadius: 32, background: "#fff" }} />
              </div>
            </div>
          );
        })}
      </Card>
    </AbsoluteFill>
  );
};

const FIELDS = [["নাম", "সাদিয়া আক্তার"], ["ফোন", "01712-xxxxxx"], ["ঠিকানা", "মিরপুর ১০, ঢাকা"], ["প্রোডাক্ট", "লাল জামদানি × ১"], ["পেমেন্ট", "ক্যাশ অন ডেলিভারি"]];
const Order: React.FC = () => {
  const f = useCurrentFrame();
  const ok = useIn(140, 11);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title t="চ্যাটেই অর্ডার বা বুকিং" />
      <InboxShell active={0} listIn={false} right={
        <div>
          <div style={{ fontFamily: LAT, fontSize: 18, color: MUTE, letterSpacing: 3, marginBottom: 18 }}>NEW ORDER</div>
          {FIELDS.map(([a, b], i) => {
            const k = lerp(f, 15 + i * 22, 32 + i * 22);
            return <div key={a} style={{ marginBottom: 16 }}><div style={{ fontFamily: BN, fontSize: 18, color: MUTE }}>{a}</div><div style={{ fontFamily: BODY, fontSize: 26, color: TXT, padding: "10px 14px", borderRadius: 12, background: "#141C34", border: `1px solid ${k > 0.5 ? VIO + "88" : LINE}`, minHeight: 44 }}><span style={{ opacity: k }}>{b}</span></div></div>;
          })}
          <div style={{ marginTop: 10, padding: "16px", borderRadius: 16, background: MINT, color: "#04210F", fontFamily: BN, fontSize: 28, fontWeight: 700, textAlign: "center", transform: `scale(${ok})`, opacity: ok }}>✓ অর্ডার কনফার্ম</div>
        </div>
      }>
        <Bubble ai k={lerp(f, 0, 12)}>আপনার নাম আর ঠিকানা দিন প্লিজ 😊</Bubble>
        <Bubble me k={lerp(f, 30, 45)}>সাদিয়া, মিরপুর ১০, ঢাকা</Bubble>
        <Bubble ai k={lerp(f, 120, 135)}>ধন্যবাদ! মোট ৳২,৫১০ (ডেলিভারি সহ)। অর্ডার কনফার্ম ✅</Bubble>
      </InboxShell>
    </AbsoluteFill>
  );
};

const Invoice: React.FC = () => {
  const f = useCurrentFrame();
  const k = useIn(4, 14), fly = lerp(f, 100, 135);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title t="লোগোসহ ইনভয়েস, অটো পাঠানো" />
      <div style={{ position: "absolute", left: 300, top: 220, width: 640, transform: `translateY(${(1 - k) * 60}px) translateX(${fly * 720}px) scale(${1 - 0.55 * fly}) rotate(${fly * 4}deg)`, opacity: k * (1 - fly), transformOrigin: "top left" }}>
        <div style={{ background: "#fff", borderRadius: 22, padding: 40, color: "#111827", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #B91C1C, #F59E0B)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BN, fontSize: 34 }}>র</div><div style={{ fontFamily: BN, fontSize: 30, fontWeight: 700 }}>রহিম ফ্যাশন</div></div>
            <div style={{ textAlign: "right", fontFamily: LAT }}><div style={{ fontSize: 28, fontWeight: 800, color: "#B91C1C" }}>INVOICE</div><div style={{ fontSize: 18, color: "#6B7280" }}>#RF-1042</div></div>
          </div>
          <div style={{ marginTop: 26, fontFamily: BODY, fontSize: 22, color: "#374151" }}>বিল: সাদিয়া আক্তার · মিরপুর ১০, ঢাকা</div>
          <div style={{ marginTop: 22, borderTop: "2px solid #E5E7EB" }}>
            {[["লাল জামদানি শাড়ি × ১", "৳২,৪৫০"], ["ডেলিভারি (ঢাকা)", "৳৬০"]].map(([a, b]) => <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #F3F4F6", fontFamily: BODY, fontSize: 24 }}><span>{a}</span><span>{b}</span></div>)}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", fontFamily: BN, fontSize: 30, fontWeight: 700 }}><span>মোট</span><span style={{ color: "#B91C1C" }}>৳২,৫১০</span></div>
          </div>
          <div style={{ fontFamily: BODY, fontSize: 18, color: "#9CA3AF", marginTop: 6 }}>ধন্যবাদ! আবার আসবেন 💛</div>
        </div>
      </div>
      <Card style={{ position: "absolute", right: 200, top: 300, width: 560, padding: 30, opacity: lerp(f, 80, 100) }}>
        <div style={{ fontFamily: LAT, fontSize: 18, color: MUTE, letterSpacing: 2, marginBottom: 16 }}>MESSENGER · সাদিয়া</div>
        <Bubble ai k={lerp(f, 130, 145)} w={480}>
          আপনার ইনভয়েস 👇
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 14, background: "#0F1629" }}>
            <div style={{ width: 54, height: 64, borderRadius: 8, background: RED, color: "#fff", fontFamily: LAT, fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>PDF</div>
            <div style={{ fontFamily: LAT, fontSize: 22 }}>Invoice-RF-1042.pdf</div>
          </div>
        </Bubble>
      </Card>
    </AbsoluteFill>
  );
};

const KPIS = [
  { l: "অর্ডার", to: 128, c: BLUE, fmt: (n: number) => bnDigits(String(n)) },
  { l: "কনভার্শন", to: 34, c: MINT, fmt: (n: number) => bnDigits(String(n)) + "%" },
  { l: "বিক্রি", to: 245000, c: AMBER, fmt: (n: number) => "৳" + bnDigits(n.toLocaleString("en-IN")) },
  { l: "AI সামলেছে", to: 72, c: VIO, fmt: (n: number) => bnDigits(String(n)) + "%" },
];
const BARS = [32, 48, 41, 60, 74, 66, 88];
const Dashboard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title t="এক নজরে পুরো ব্যবসা" />
      <div style={{ position: "absolute", left: 120, right: 120, top: 220, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26 }}>
        {KPIS.map((k, i) => {
          const a = lerp(f, 6 + i * 8, 24 + i * 8);
          return (
            <Card key={k.l} style={{ padding: "26px 30px", opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>
              <div style={{ fontFamily: BN, fontSize: 26, color: MUTE }}>{k.l}</div>
              <div style={{ fontFamily: BN, fontSize: 60, fontWeight: 700, color: k.c, marginTop: 6 }}><Count to={k.to} start={14 + i * 8} len={50} fmt={k.fmt} /></div>
            </Card>
          );
        })}
      </div>
      <Card style={{ position: "absolute", left: 120, width: 1000, top: 440, height: 560, padding: 34 }}>
        <div style={{ fontFamily: BN, fontSize: 28, color: TXT }}>এই সপ্তাহের অর্ডার</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 34, height: 400, marginTop: 30 }}>
          {BARS.map((b, i) => {
            const h = lerp(f, 30 + i * 6, 70 + i * 6) * b * 4.3;
            return <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}><div style={{ width: "100%", height: h, borderRadius: 14, background: i === BARS.length - 1 ? GRAD : "#26315A" }} /><div style={{ fontFamily: BN, fontSize: 20, color: MUTE }}>{["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র"][i]}</div></div>;
          })}
        </div>
      </Card>
      <Card style={{ position: "absolute", left: 1150, right: 120, top: 440, height: 560, padding: 30 }}>
        <div style={{ fontFamily: BN, fontSize: 28, color: TXT, marginBottom: 18 }}>সমস্যা <span style={{ color: RED }}>●</span></div>
        {[["রিয়াদ", "ডেলিভারি দেরি", RED], ["মিতু", "ভুল সাইজ এসেছে", AMBER], ["Karim", "রিফান্ড চাইছেন", RED], ["সুমন", "AI নিশ্চিত না, আপনার অপেক্ষায়", BLUE]].map(([n, p, c], i) => {
          const a = lerp(f, 90 + i * 14, 108 + i * 14);
          return <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 0", borderTop: i ? `1px solid ${LINE}` : "none", opacity: a, transform: `translateX(${(1 - a) * 40}px)` }}><Dot c={c as string} s={14} /><div><div style={{ fontFamily: BODY, fontSize: 24, color: TXT }}>{n}</div><div style={{ fontFamily: BODY, fontSize: 21, color: MUTE }}>{p}</div></div></div>;
        })}
      </Card>
    </AbsoluteFill>
  );
};

const BIZ = ["দোকান", "ক্লিনিক", "কোচিং", "রেস্টুরেন্ট", "সেলুন", "এজেন্সি"];
const TOOLS = ["Inbox", "AI Agent", "Comments", "Orders", "Booking", "Invoice", "CRM", "Reports"];
const Platform: React.FC = () => {
  const f = useCurrentFrame();
  const core = useIn(4, 13);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Title t="যেকোনো ব্যবসার জন্য" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: 60 }}>
        <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: -60 }}>
          {TOOLS.map((_, i) => {
            const a = (i / TOOLS.length) * Math.PI * 2 + f / 220;
            const k = lerp(f, 30 + i * 6, 50 + i * 6);
            return <line key={i} x1={960} y1={600} x2={960 + Math.cos(a) * 390 * k} y2={600 + Math.sin(a) * 300 * k} stroke={LINE} strokeWidth="2" />;
          })}
        </svg>
        <div style={{ transform: `scale(${core})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Logo size={150} />
          <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: 46, color: TXT }}>Bizpilot</div>
        </div>
        {TOOLS.map((t, i) => {
          const a = (i / TOOLS.length) * Math.PI * 2 + f / 220;
          const k = lerp(f, 30 + i * 6, 50 + i * 6);
          return <div key={t} style={{ position: "absolute", left: 960 + Math.cos(a) * 390 - 100, top: 540 + Math.sin(a) * 300 - 30, width: 200, textAlign: "center", padding: "14px 0", borderRadius: 18, background: CARD, border: `1px solid ${i < 6 ? VIO + "88" : LINE}`, fontFamily: LAT, fontWeight: 700, fontSize: 24, color: i < 6 ? TXT : MUTE, opacity: k, transform: `scale(${k})` }}>{t}{i >= 6 ? <span style={{ fontSize: 14, color: AMBER }}> soon</span> : null}</div>;
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
        {BIZ.map((b, i) => {
          const k = lerp(f, 60 + i * 10, 78 + i * 10);
          return <div key={b} style={{ padding: "12px 26px", borderRadius: 30, background: "#141C34", border: `1px solid ${LINE}`, fontFamily: BN, fontSize: 28, color: TXT, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>{b}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const k = useIn(4, 12);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36, transform: `scale(${0.9 + 0.1 * k})`, opacity: k }}>
          <Logo size={170} />
          <div style={{ fontFamily: LAT, fontWeight: 800, fontSize: 150, color: TXT, letterSpacing: -4 }}>Biz<span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>pilot</span></div>
        </div>
        <div style={{ fontFamily: BN, fontSize: 52, color: TXT, opacity: lerp(f, 20, 40) }}>আপনার ব্যবসা, এখন অটোপাইলটে</div>
        <div style={{ marginTop: 20, padding: "16px 40px", borderRadius: 40, background: GRAD, fontFamily: BN, fontSize: 36, color: "#fff", opacity: lerp(f, 50, 70) }}>শীঘ্রই আসছে</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC<{ len: number }>> = {
  hook: Hook, problem: Problem, intro: Intro, inbox: Inbox, agent: Agent, comments: Comments, website: Website,
  rules: Rules, order: Order, invoice: Invoice, dashboard: Dashboard, platform: Platform, outro: Outro,
};
const SFX: Record<string, string> = { intro: "boom", inbox: "whoosh", comments: "whoosh", website: "whoosh", order: "tick", invoice: "shimmer", dashboard: "riser", platform: "whoosh", outro: "shimmer" };

const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(lerp(f, 0, 10), 1 - lerp(f, len - 8, len));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Bizpilot: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const f = useCurrentFrame();
  const music = Math.min(lerp(f, 0, 30, 0, 0.16), lerp(f, durationInFrames - 60, durationInFrames, 0.16, 0));
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("dgmusic.mp3")} volume={() => music} loop />
      {timelineBP().map(({ s, from, len }) => {
        const Sc = SCENES[s.p];
        return (
          <Sequence key={s.p} from={from} durationInFrames={len}>
            <Fade len={len}><Sc len={len} /></Fade>
            <Sequence from={LEAD}><Audio src={staticFile(`bizpilot/vo/${s.p}.mp3`)} /></Sequence>
            {SFX[s.p] ? <Audio src={staticFile(`dgsfx/${SFX[s.p]}.mp3`)} volume={0.35} /> : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
