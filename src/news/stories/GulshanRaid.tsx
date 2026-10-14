// Story: গুলশানে মধ্যরাতে বারে ডিএনসির অভিযান, শতাধিক নারী আটক (12 Oct 2026).
// Facts: Star News video report (title) — attributed on air; context: recent DNC/customs liquor raids in Gulshan (Prothom Alo, TBS).
// Footage: Star News (their logo kept, credited). Detained people: no blur (owner decision) — only wide/through-grille shots, no close-ups; never called guilty.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BN, clamp, useSp, NewsStory, Segment, storyLen, COB_THEME } from "../NewsKit";

export const FOOTAGE = "gulshan/footage.mp4";
export const CLIP: Record<string, number> = { a: 24, b: 84, c: 60, d: 108, e: 42 };

const Footage: React.FC<{ at: number }> = ({ at }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {/* blurred fill behind; the clip is inset so the Star News logo stays visible beside our bug */}
    <OffthreadVideo src={staticFile(FOOTAGE)} startFrom={Math.round(at * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(30px) brightness(.45)", transform: "scale(1.1)" }} />
    <OffthreadVideo src={staticFile(FOOTAGE)} startFrom={Math.round(at * 30)} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: "scale(.84)", transformOrigin: "100% 92%", borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", right: 24, top: 96, padding: "4px 12px", borderRadius: 6, background: "rgba(0,0,0,.55)", fontFamily: BN, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,.85)" }}>ভিডিও: স্টার নিউজ</div>
  </AbsoluteFill>
);

const Card: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const s = useSp(delay, 14);
  return <div style={{ padding: "22px 34px", borderRadius: 20, background: "rgba(14,23,28,.92)", border: "2px solid rgba(255,255,255,.15)", boxShadow: "0 30px 70px rgba(0,0,0,.5)", fontFamily: BN, color: "white", transform: `translateY(${(1 - s) * 80}px)`, opacity: s, ...style }}>{children}</div>;
};

const V1: React.FC = () => (
  <AbsoluteFill>
    <Footage at={CLIP.a} />
    <div style={{ position: "absolute", right: 70, top: 300, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
      <Card delay={20}><div style={{ fontSize: 26, color: "#ff5a68", fontWeight: 700 }}>অভিযান</div><div style={{ fontSize: 48, fontWeight: 700 }}>মাদকদ্রব্য নিয়ন্ত্রণ অধিদপ্তর</div></Card>
      <Card delay={150}><div style={{ fontSize: 26, color: "#ff5a68", fontWeight: 700 }}>আটক</div><div style={{ fontSize: 60, fontWeight: 700 }}>শতাধিক নারী</div><div style={{ fontSize: 22, opacity: 0.7 }}>স্টার নিউজের প্রতিবেদন অনুযায়ী</div></Card>
    </div>
  </AbsoluteFill>
);
const V2: React.FC = () => <Footage at={CLIP.b} />;
const V3: React.FC = () => (
  <AbsoluteFill>
    <Footage at={CLIP.c} />
    <div style={{ position: "absolute", left: 70, top: 140 }}><Card delay={10}><div style={{ fontSize: 26, color: "#ff5a68", fontWeight: 700 }}>ঘটনাস্থল</div><div style={{ fontSize: 48, fontWeight: 700 }}>গুলশান, ঢাকা</div><div style={{ fontSize: 30, opacity: 0.85 }}>মধ্যরাত</div></Card></div>
  </AbsoluteFill>
);

const V4: React.FC = () => {
  const items = ["অনুমোদনহীন মদ বিক্রি ও মজুতের অভিযোগ", "ডিএনসি ও শুল্ক গোয়েন্দাদের একাধিক অভিযান", "এই অভিযানের যোগসূত্র এখনো অস্পষ্ট"];
  return (
    <AbsoluteFill>
      <Footage at={CLIP.d} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,19,23,.94) 0%, rgba(11,19,23,.7) 55%, rgba(11,19,23,.2) 85%)" }} />
      <div style={{ position: "absolute", left: 100, top: 150, fontFamily: BN, color: "white" }}>
        <div style={{ fontSize: 34, color: "#ff5a68", fontWeight: 700 }}>প্রেক্ষাপট</div>
        <div style={{ fontSize: 66, fontWeight: 700, marginBottom: 30 }}>সম্প্রতি গুলশানে অভিযান</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {items.map((t, i) => <Card key={t} delay={40 + i * 90} style={{ fontSize: 40, fontWeight: 700 }}>{t}</Card>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const V5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Footage at={CLIP.e} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,19,23,.92) 0%, rgba(11,19,23,.55) 60%, transparent 85%)" }} />
      <div style={{ position: "absolute", left: 90, top: 210, width: 1000, fontFamily: BN, color: "white", opacity: interpolate(f, [10, 30], [0, 1], clamp) }}>
        <div style={{ fontSize: 34, color: "#ff5a68", fontWeight: 700 }}>অপেক্ষা</div>
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.35 }}>জব্দ ও মামলার বিষয়ে ডিএনসির আনুষ্ঠানিক বক্তব্য মেলেনি</div>
        <div style={{ marginTop: 26, fontSize: 36, opacity: 0.85 }}>দায় নির্ধারিত হবে তদন্তে</div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(4, 12);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #24343c, #0b1317 65%)`, justifyContent: "center", alignItems: "center", fontFamily: BN, color: "white" }}>
      <img src={staticFile("cob/logo-light.png")} style={{ width: 760, transform: `scale(${s})` }} />
      <div style={{ marginTop: 18, fontSize: 54, fontWeight: 700, opacity: interpolate(f, [20, 35], [0, 1], clamp) }}>বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন</div>
      <div style={{ marginTop: 30, fontSize: 40, fontWeight: 700, color: "#ff5a68", opacity: interpolate(f, [30, 45], [0, 1], clamp) }}>ভিডিও ক্রেডিট: স্টার নিউজ</div>
      <div style={{ position: "absolute", bottom: 50, fontSize: 26, opacity: 0.7 }}>তথ্যসূত্র: স্টার নিউজ, প্রথম আলো, টিবিএস</div>
    </AbsoluteFill>
  );
};

const VO_LEN = [339, 339, 245, 377, 416];
const SEGMENTS: Segment[] = [
  { vo: "gulshanvo/01.mp3", voLen: VO_LEN[0], label: "ব্রেকিং", headline: "গুলশানে মধ্যরাতে বারে ডিএনসির অভিযান, শতাধিক নারী আটক", zoom: 0, visual: V1, breaking: true },
  { vo: "gulshanvo/02.mp3", voLen: VO_LEN[1], label: "গুলশান", headline: "ভবনের সামনে জড়ো করে রাখা হয় আটক ব্যক্তিদের", zoom: 1, visual: V2 },
  { vo: "gulshanvo/03.mp3", voLen: VO_LEN[2], label: "ঘটনাস্থল", headline: "মধ্যরাতেও ফটকের বাইরে উৎসুক মানুষের ভিড়", zoom: 1, visual: V3 },
  { vo: "gulshanvo/04.mp3", voLen: VO_LEN[3], label: "প্রেক্ষাপট", headline: "গুলশানে অনুমোদনহীন মদের বিরুদ্ধে ধারাবাহিক অভিযান", zoom: 1, visual: V4 },
  { vo: "gulshanvo/05.mp3", voLen: VO_LEN[4], label: "সংবাদ", headline: "ডিএনসির আনুষ্ঠানিক বক্তব্যের অপেক্ষা", zoom: 0.4, visual: V5 },
];
const TICKER = [
  "গুলশানে মধ্যরাতে বারে মাদকদ্রব্য নিয়ন্ত্রণ অধিদপ্তরের অভিযান",
  "স্টার নিউজের প্রতিবেদন: শতাধিক নারী আটক",
  "জব্দ ও মামলার বিষয়ে আনুষ্ঠানিক বক্তব্যের অপেক্ষা",
  "কালারস অব বাংলাদেশ — বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন",
];
export const GULSHAN_LEN = storyLen(SEGMENTS);
export const GulshanRaid: React.FC = () => (
  <NewsStory segments={SEGMENTS} ticker={TICKER} date="১২ অক্টোবর ২০২৬" music="btlmusic.mp3" tagline="বাংলাদেশের রঙে সংবাদ, গল্প ও জীবন" outro={Outro} theme={COB_THEME} />
);
