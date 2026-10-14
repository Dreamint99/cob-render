// Story: ফেসবুকে পরিচয় থেকে বিয়ে, পাকিস্তানি যুবক এখন কুষ্টিয়ায় (source: jagonews24, 12 Oct 2026). VO = Tanvir v4 (public/btlvo).
// Template for new stories: copy this file, change SEGMENTS (vo, voLen in frames, label, headline, zoom 0=studio/1=full, visual) and TICKER.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { LAND } from "../../dots";
import { N, BN, bn, clamp, ease, Photo, Sfx, useSp, NewsStory, Segment, storyLen, COB_THEME } from "../NewsKit";

const P1 = "btl/jagonewsimage-10-20261012011932.jpg"; // couple seated, flowers
const P2 = "btl/jagonewsimage-9-mv47fcer9wwoo6s-20261012013147.jpg"; // at home
const CREDIT = "ছবি: জাগো নিউজ";

const Card: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const s = useSp(delay, 14);
  return <div style={{ padding: "22px 34px", borderRadius: 22, background: "rgba(14,23,28,.88)", border: "2px solid rgba(255,255,255,.15)", boxShadow: "0 30px 70px rgba(0,0,0,.5)", fontFamily: BN, color: "white", transform: `translateY(${(1 - s) * 80}px) scale(${0.9 + 0.1 * s})`, opacity: s, ...style }}>{children}</div>;
};

// 1 — couple photo on the studio wall
const V1: React.FC = () => <Photo src={P1} credit={CREDIT} />;

// 2 — map: Punjab → Kushtia via Facebook
const proj = (lat: number, lng: number): [number, number] => [((lng - 58) / 44) * 1920, ((40 - lat) / 24.75) * 1080];
const V2: React.FC = () => {
  const f = useCurrentFrame();
  const A = proj(31.55, 74.34), B = proj(23.9, 89.12);
  const d = `M ${A[0]} ${A[1]} Q ${(A[0] + B[0]) / 2} ${Math.min(A[1], B[1]) - 260} ${B[0]} ${B[1]}`;
  const p = interpolate(f, [30, 120], [0, 1], { ...clamp, easing: ease });
  const ev = evolvePath(p, d);
  const pt = getPointAtLength(d, Math.max(0.1, p * getLength(d)));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #10306e, #04102a 75%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {LAND.map(([la, lo], i) => { const [x, y] = proj(la, lo); return x > -20 && x < 1940 && y > -20 && y < 1100 ? <circle key={i} cx={x} cy={y} r={14} fill="rgba(140,180,255,.2)" /> : null; })}
        <defs><filter id="gk"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <path d={d} stroke="#ff4d6d" strokeWidth={6} fill="none" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} filter="url(#gk)" />
        {[A, B].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={16} fill={i ? "#006a4e" : "#01411c"} stroke="white" strokeWidth={4} /><circle cx={x} cy={y} r={16 + ((f + i * 20) % 40)} fill="none" stroke="white" strokeWidth={2} opacity={1 - ((f + i * 20) % 40) / 40} /></g>)}
        {f > 30 && p < 1 && <text x={pt.x} y={pt.y} fontSize={64} textAnchor="middle" dominantBaseline="central">❤️</text>}
      </svg>
      <div style={{ position: "absolute", left: A[0] - 330, top: A[1] - 150 }}><Card delay={8}><div style={{ fontSize: 26, opacity: 0.7 }}>পাঞ্জাব, পাকিস্তান</div><div style={{ fontSize: 46, fontWeight: 700 }}>ফারহান</div></Card></div>
      <div style={{ position: "absolute", left: B[0] - 120, top: B[1] + 50 }}><Card delay={24}><div style={{ fontSize: 26, opacity: 0.7 }}>আড়ুয়াপাড়া, কুষ্টিয়া</div><div style={{ fontSize: 46, fontWeight: 700 }}>লাবনী</div></Card></div>
      <div style={{ position: "absolute", left: 80, top: 560, display: "flex", flexDirection: "column", gap: 16 }}>
        {[["f", "পরিচয় ফেসবুকে", 140], ["⏳", "প্রায় ২ বছর আগে", 175], ["💬", "বন্ধুত্ব থেকে প্রেম", 215]].map(([i, t, d]) => (
          <Card key={t as string} delay={d as number} style={{ padding: "14px 26px", display: "flex", gap: 16, alignItems: "center", fontSize: 38, fontWeight: 700 }}>
            <span style={{ width: 52, height: 52, borderRadius: 14, background: i === "f" ? "#1877f2" : "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: i === "f" ? "Montserrat" : BN, fontWeight: 900, fontSize: 36 }}>{i}</span>{t}
          </Card>
        ))}
      </div>
      <Sfx at={30} src="btlsfx/msg.mp3" vol={0.5} />
    </AbsoluteFill>
  );
};

// 3 — fake ID on Facebook → video call reveals the real person
const Avatar: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} fill={color} /><circle cx={50} cy={40} r={18} fill="rgba(255,255,255,.9)" /><path d="M18 88c4-18 18-26 32-26s28 8 32 26" fill="rgba(255,255,255,.9)" /></svg>
);
const V3: React.FC = () => {
  const f = useCurrentFrame();
  const call = f > 175;
  const stamp = spring({ frame: f - 85, fps: 30, config: { damping: 9 } });
  const ring = Math.sin(f / 2) * (f > 175 && f < 215 ? 6 : 0);
  const reveal = interpolate(f, [215, 245], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0b1f4a, #1a0b2e)", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", left: 120, top: 260, width: 640, fontFamily: BN, color: "white" }}>
        <div style={{ fontSize: 40, opacity: 0.75 }}>গল্পের মোড়</div>
        <div style={{ fontSize: 86, fontWeight: 700, lineHeight: 1.15 }}>{call ? "ভিডিও কলে খুলল আসল পরিচয়" : "শুরুতে ছিল একটি ফেক আইডি"}</div>
      </div>
      <div style={{ position: "absolute", right: 260, top: 110, width: 470, height: 860, borderRadius: 64, background: "#111", padding: 16, boxShadow: "0 50px 120px rgba(0,0,0,.6), 0 0 0 3px rgba(255,255,255,.2)", transform: `rotate(${ring}deg)` }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", background: call ? "#000" : "#f0f2f5", position: "relative", fontFamily: BN }}>
          {!call ? (
            <>
              <div style={{ height: 70, background: "#1877f2", color: "white", display: "flex", alignItems: "center", padding: "0 26px", fontFamily: "Montserrat", fontWeight: 800, fontSize: 34 }}>facebook</div>
              <div style={{ height: 170, background: "linear-gradient(135deg,#9bb7ff,#d9a7ff)" }} />
              <div style={{ position: "absolute", left: 140, top: 160, borderRadius: 999, border: "6px solid white", filter: "blur(2px)" }}><Avatar color="#c78bd6" size={180} /></div>
              <div style={{ marginTop: 100, textAlign: "center", fontSize: 40, fontWeight: 700, color: "#111" }}>প্রোফাইল</div>
              <div style={{ textAlign: "center", fontSize: 26, color: "#555", padding: "0 30px" }}>প্রোফাইলে অন্য এক তরুণীর ছবি</div>
              <div style={{ position: "absolute", left: 70, top: 470, transform: `rotate(-14deg) scale(${interpolate(stamp, [0, 1], [2.5, 1])})`, opacity: stamp, border: `8px solid ${N.red2}`, color: N.red2, fontFamily: "Montserrat", fontWeight: 900, fontSize: 92, padding: "0 26px", borderRadius: 14 }}>FAKE ID</div>
            </>
          ) : (
            <>
              <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, #2b4c8c, #000 70%)", justifyContent: "center", alignItems: "center" }}>
                <div style={{ filter: `blur(${(1 - reveal) * 18}px)`, transform: `scale(${0.9 + reveal * 0.1})` }}><Avatar color="#4a7bd1" size={260} /></div>
                <div style={{ marginTop: 26, color: "white", fontSize: 40, fontWeight: 700 }}>{reveal > 0.5 ? "আসল পরিচয় প্রকাশ" : "ভিডিও কল…"}</div>
              </AbsoluteFill>
              <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
                <div style={{ width: 90, height: 90, borderRadius: 99, background: N.red2 }} /><div style={{ width: 90, height: 90, borderRadius: 99, background: "#22c55e" }} />
              </div>
            </>
          )}
        </div>
      </div>
      <Sfx at={85} src="btlsfx/alert.mp3" vol={0.35} />
      <Sfx at={175} src="btlsfx/ring.mp3" vol={0.5} />
    </AbsoluteFill>
  );
};

// 4 — timeline of the relationship
const STEPS: [string, string][] = [["২ বছর আগে", "ফেসবুকে পরিচয়"], ["প্রস্তাব", "বিয়ের প্রস্তাব দেন ফারহান"], ["৭ মাস আগে", "দুই পরিবারের সম্মতিতে অনলাইনে বিয়ে"], ["পাকিস্তানে", "সে দেশের আইন মেনে আবার বিয়ে"]];
const V4: React.FC = () => {
  const f = useCurrentFrame();
  const line = interpolate(f, [20, 300], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #0a2356, #050c1f)", fontFamily: BN }}>
      <div style={{ position: "absolute", left: 120, top: 120, color: "white", fontSize: 70, fontWeight: 700 }}>সম্পর্ক থেকে <span style={{ color: "#ff5a68" }}>সংসার</span></div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 470, height: 8, borderRadius: 9, background: "rgba(255,255,255,.15)" }}>
        <div style={{ width: `${line * 100}%`, height: "100%", borderRadius: 9, background: `linear-gradient(90deg, ${N.red2}, ${"#ff5a68"})` }} />
      </div>
      {STEPS.map(([a, b], i) => {
        const d = 30 + i * 80;
        const s = spring({ frame: f - d, fps: 30, config: { damping: 13 } });
        const x = 160 + i * 533;
        return (
          <div key={a} style={{ position: "absolute", left: x - 30, top: 440, width: 470, opacity: s, transform: `translateY(${(1 - s) * 60}px)` }}>
            <div style={{ width: 68, height: 68, borderRadius: 99, background: N.red2, border: "6px solid white", boxShadow: `0 0 30px ${N.red}`, color: "white", fontSize: 34, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{bn(i + 1)}</div>
            <div style={{ marginTop: 30, color: "#ff5a68", fontSize: 40, fontWeight: 700 }}>{a}</div>
            <div style={{ color: "white", fontSize: 44, fontWeight: 700, lineHeight: 1.25, width: 420 }}>{b}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 5 — home photo + 10-year family visa card
const V5: React.FC = () => {
  const card = useSp(150, 13);
  return (
    <AbsoluteFill>
      <Photo src={P2} credit={CREDIT} origin="40% 40%" />
      <div style={{ position: "absolute", right: 90, top: 200, width: 560, borderRadius: 26, overflow: "hidden", fontFamily: BN, boxShadow: "0 40px 90px rgba(0,0,0,.6)", transform: `translateX(${(1 - card) * 700}px) rotate(${(1 - card) * 8}deg)` }}>
        <div style={{ background: "linear-gradient(135deg, #006a4e, #01411c)", padding: "22px 30px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 34, fontWeight: 700 }}>ফ্যামিলি ভিসা</span><span style={{ fontFamily: "Montserrat", fontWeight: 800, fontSize: 24, letterSpacing: "0.2em" }}>VISA</span>
        </div>
        <div style={{ background: "#fffdf6", padding: "26px 30px", color: N.ink }}>
          <div style={{ fontSize: 30, color: "#666" }}>মেয়াদ</div>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1, color: "#006a4e" }}>১০ বছর</div>
          <div style={{ marginTop: 14, fontSize: 30 }}>দুজনেরই · জানিয়েছেন দম্পতি</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 200 }}>
        <div style={{ padding: "16px 28px", borderRadius: 18, background: "rgba(14,23,28,.88)", color: "white", fontFamily: BN, fontSize: 40, fontWeight: 700 }}>পাকিস্তানে ৬ মাস সংসার <span style={{ color: "#ff5a68" }}>→</span> এখন কুষ্টিয়ায়</div>
      </div>
    </AbsoluteFill>
  );
};

// 6 — plan: online three-piece business
const V6: React.FC = () => {
  const s = useSp(40, 13);
  return (
    <AbsoluteFill>
      <Photo src={P1} credit={CREDIT} from={1.15} to={1.05} />
      <div style={{ position: "absolute", left: 90, bottom: 260, width: 760, display: "flex", gap: 26, alignItems: "center", padding: "26px 34px", borderRadius: 26, background: "rgba(14,23,28,.9)", border: `2px solid ${"#ff5a68"}`, fontFamily: BN, color: "white", transform: `translateY(${(1 - s) * 120}px)`, opacity: s }}>
        <div style={{ fontSize: 96 }}>🛍️</div>
        <div><div style={{ fontSize: 30, color: "#ff5a68", fontWeight: 700 }}>পরিকল্পনা</div><div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.2 }}>পাকিস্তানি থ্রি-পিসের অনলাইন ব্যবসা</div></div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(4, 12);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #24343c, #0b1317 65%)`, justifyContent: "center", alignItems: "center", fontFamily: BN, color: "white" }}>
      <Img src={staticFile("cob/logo-light.png")} style={{ width: 760, transform: `scale(${s})` }} />
      <div style={{ marginTop: 18, fontSize: 54, fontWeight: 700, opacity: interpolate(f, [20, 35], [0, 1], clamp) }}>বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন</div>
      <div style={{ marginTop: 22, fontFamily: "Montserrat", fontWeight: 700, fontSize: 40, color: "#ff5a68", opacity: interpolate(f, [35, 50], [0, 1], clamp) }}>coloursofbangladesh.com</div>
      <div style={{ position: "absolute", bottom: 50, fontSize: 26, opacity: 0.7 }}>তথ্য ও ছবি: জাগো নিউজ (জেলা প্রতিনিধি, কুষ্টিয়া)</div>
    </AbsoluteFill>
  );
};

const VO_LEN = [313, 367, 350, 408, 377, 423];
const SEGMENTS: Segment[] = [
  { vo: "btlvo/01.mp3", voLen: VO_LEN[0], label: "ব্রেকিং", headline: "ফেসবুকে পরিচয় থেকে বিয়ে, পাকিস্তানি যুবক এখন কুষ্টিয়ায়", zoom: 0, visual: V1, breaking: true },
  { vo: "btlvo/02.mp3", voLen: VO_LEN[1], label: "কুষ্টিয়া", headline: "ফেসবুকে পরিচয়, বন্ধুত্ব থেকে প্রেম", zoom: 1, visual: V2 },
  { vo: "btlvo/03.mp3", voLen: VO_LEN[2], label: "চমক", headline: "শুরুতে ফেক আইডি, ভিডিও কলে আসল পরিচয়", zoom: 1, visual: V3 },
  { vo: "btlvo/04.mp3", voLen: VO_LEN[3], label: "বিয়ে", headline: "দুই পরিবারের সম্মতিতে অনলাইনে বিয়ে", zoom: 1, visual: V4 },
  { vo: "btlvo/05.mp3", voLen: VO_LEN[4], label: "কুষ্টিয়া", headline: "১০ বছরের ফ্যামিলি ভিসা নিয়ে কুষ্টিয়ায় দম্পতি", zoom: 0.55, visual: V5 },
  { vo: "btlvo/06.mp3", voLen: VO_LEN[5], label: "সংবাদ", headline: "সামনে অনলাইন ব্যবসার পরিকল্পনা দম্পতির", zoom: 0.4, visual: V6 },
];
const TICKER = [
  "ফেসবুকে পরিচয় থেকে বিয়ে, পাকিস্তানি যুবক এখন কুষ্টিয়ায়",
  "দুজনেরই রয়েছে ১০ বছরের ফ্যামিলি ভিসা",
  "পাকিস্তানি থ্রি-পিসের অনলাইন ব্যবসার পরিকল্পনা দম্পতির",
  "কালারস অব বাংলাদেশ — বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন",
  "সর্বশেষ খবর পেতে ভিজিট করুন coloursofbangladesh.com",
];
export const KUSHTIA_LEN = storyLen(SEGMENTS);
export const KushtiaPakistan: React.FC = () => (
  <NewsStory segments={SEGMENTS} ticker={TICKER} date="১২ অক্টোবর ২০২৬" music="btlmusic.mp3" tagline="বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন" outro={Outro} theme={COB_THEME} />
);
