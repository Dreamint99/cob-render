// Qount — INTRO promo for every business type (2026-11-12). Same engine (Qd.tsx Film); reuses turf/doctor visuals.
// VO: work/qount/intro/{script,reel}.json → work/qpub/ivo, ivor (+ tvor/04, vo/11, vo/12, vor/06 reused).
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Store, PhoneCall, NotebookPen, Wallet, Smartphone, CalendarCheck, BarChart3, Volleyball, Gamepad2, Scissors, Stethoscope, FlaskConical, PartyPopper, TreePalm, Dumbbell, MessageSquareText, QrCode, BellRing, ShieldCheck, Globe, Megaphone, MonitorSmartphone, Building2, Clock, Users, LayoutGrid } from "lucide-react";
import { Film, Stage, Card, Browser, IncomeVis, MultiVis, TicketVis, timeline, dOf, total, Biz, Sc, Ic, LEAD, INDIGO, INK, MUTED, GREEN, AMBER, BKASH, F, sp, lerp } from "./Qd";
import { PayVis, ApproveVis } from "./Qt";

const TYPES: [Ic, string, string][] = [
  [Volleyball, "টার্ফ", "#15803D"], [Gamepad2, "গেমিং জোন", "#7C3AED"], [Scissors, "সেলুন", "#DB2777"], [Stethoscope, "ডাক্তার", "#0369A1"],
  [FlaskConical, "ডায়াগনস্টিক", "#0D9488"], [PartyPopper, "কমিউনিটি হল", "#D97706"], [TreePalm, "রিসোর্ট", "#65A30D"], [Dumbbell, "জিম", "#DC2626"],
];

const TypesVis: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = Math.max(6, Math.round((dur * 0.75) / TYPES.length));
  return (
    <Stage>
      <div style={{ position: "absolute", left: 0, top: 30, width: 900, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
        {TYPES.map(([I, l, c], i) => {
          const s = sp(f, fps, LEAD + 4 + i * step, 12);
          return (
            <div key={i} style={{ height: 330, borderRadius: 32, background: "#fff", border: "1.5px solid #E5E8F2", boxShadow: "0 22px 50px rgba(15,23,42,.10)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22,
              opacity: s, transform: `translateY(${(1 - s) * 60}px) scale(${0.8 + 0.2 * s})` }}>
              <div style={{ width: 130, height: 130, borderRadius: 40, background: c + "18", display: "flex", alignItems: "center", justifyContent: "center" }}><I size={70} color={c} strokeWidth={2} /></div>
              <span style={{ fontFamily: F, fontWeight: 800, fontSize: 34, color: INK, whiteSpace: "nowrap" }}>{l}</span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const TemplatesVis: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sites: [string, string, number][] = [["shots/s-salon.jpg", "qount.dreamithq.com/ora-salon", -7], ["shots/tsite.jpg", "qount.dreamithq.com/kickoff-arena", 0], ["shots/site.jpg", "qount.dreamithq.com/seba-medical", 7], ["shots/s-gym.jpg", "qount.dreamithq.com/iron-forge", 0]];
  const per = Math.round((dur * 0.6) / sites.length);
  return (
    <Stage>
      {sites.map(([src, url, rot], i) => {
        const s = sp(f, fps, LEAD + i * per, 14);
        const x = 40 + (i % 2) * 70 - (i === 3 ? 40 : 0), y = 60 + i * 34;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${rot * (1 - s * 0.6)}deg)`, transformOrigin: "50% 60%" }}>
            <Browser x={x} y={y} w={760} src={src} ratio={2160 / 1282} url={url} d={LEAD + i * per} />
          </div>
        );
      })}
      <Card x={640} y={560} w={250} d={LEAD + Math.round(dur * 0.62)} from="r">
        <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <QrCode size={64} color={INK} strokeWidth={1.7} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: INK }}>নিজের QR কোড</span>
        </div>
      </Card>
      <Card x={-20} y={600} w={330} d={LEAD + Math.round(dur * 0.72)} from="l">
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: INDIGO, display: "flex", alignItems: "center", justifyContent: "center" }}><Megaphone size={30} color="#fff" /></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 26, color: INK }}>অফার মেসেজ</span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 21, color: GREEN, opacity: lerp(f, LEAD + dur * 0.8, LEAD + dur * 0.9) }}>✓ সব কাস্টমারকে গেছে</span>
          </div>
        </div>
      </Card>
    </Stage>
  );
};

const IIncome: React.FC<{ dur: number }> = ({ dur }) => (
  <IncomeVis dur={dur} name="আমার ব্যবসা" stats={[["আজকের বুকিং", 18, "", "#15803D", CalendarCheck], ["এই মাসের আয়", 312500, "৳", INDIGO, Wallet], ["বাকি টাকা", 12400, "৳", AMBER, Clock]]} />
);
const IMulti: React.FC<{ dur: number }> = ({ dur }) => (
  <MultiVis dur={dur} src="shots/t-dash.jpg" ratio={800 / 542} phone="shots/t-home.png" pills={["গ্রিন ফিল্ড টার্ফ", "শেফা চেম্বার"]} />
);

const S: Record<string, Sc> = {
  hook: { kind: "hook", vo: "ivo/01", cap: "হ্যালো ব্যবসায়ী ভাই, | আপনাকেই বলছি!" },
  pain: { kind: "pain", vo: "ivo/02", cap: "সারাদিন বুকিংয়ের ফোন, খাতায় হিসাব, | কে অগ্রিম দিলো কে দিলো না — | কেমন হয় যদি আপনার পুরো ব্যবসা | অটোমেশন হয়ে যায়?" },
  types: { kind: "types", vo: "ivo/03", cap: "পরিচয় করিয়ে দিই Qount — | টার্ফ, গেমিং জোন, সেলুন, ডাক্তারের চেম্বার, | ডায়াগনস্টিক, কমিউনিটি হল, রিসোর্ট আর জিম — | সবার জন্য এক বুকিং অ্যাপ।",
    head: "সব বুকিং, এক অ্যাপে", hi: ["এক", "অ্যাপে"], color: INDIGO, chips: [[LayoutGrid, "৮ ধরনের ব্যবসা"]] },
  pay: { kind: "pay", vo: "ivo/04", pre: true, cap: "কাস্টমার লগইন ছাড়াই মোবাইল থেকে | খালি সময় দেখে বুক করে, বিকাশে অগ্রিম দেয়।",
    head: "লগইন ছাড়াই অনলাইন বুকিং", hi: ["অনলাইন", "বুকিং"], color: "#15803D", chips: [[Smartphone, "খালি সময় দেখে বুক"], [Wallet, "বিকাশে অগ্রিম"]] },
  ticket: { kind: "ticket", vo: "ivo/05", cap: "সাথে সাথে আপনার ব্যবসার নামে | SMS, ইমেইল আর QR টিকেট — | রিমাইন্ডারও যায় অটোমেটিক।",
    head: "আপনার নামে টিকেট", hi: ["আপনার", "নামে"], color: INDIGO, chips: [[MessageSquareText, "SMS · ইমেইল"], [QrCode, "QR টিকেট"], [BellRing, "অটো রিমাইন্ডার"]] },
  approve: { kind: "approve", vo: "ivo/06", cap: "নতুন বুকিং এলেই নোটিফিকেশন, | এক ট্যাপে কনফার্ম।",
    head: "এক ট্যাপে কনফার্ম", hi: ["এক", "ট্যাপে"], color: GREEN, chips: [[BellRing, "সাথে সাথে নোটিফিকেশন"], [ShieldCheck, "ডাবল বুকিং নেই"]] },
  income: { kind: "income", vo: "ivo/07", cap: "আজ কয়টা বুকিং, মাসে কত আয়, | কার কাছে কত বাকি — সব এক নজরে।",
    head: "বুকিং আর আয় — এক নজরে", hi: ["আয়"], color: INDIGO, chips: [[CalendarCheck, "দৈনিক বুকিং"], [BarChart3, "মাসিক আয়"], [Wallet, "কার কাছে কত বাকি"]] },
  site: { kind: "site", vo: "ivo/08", cap: "প্রতিটি ব্যবসার জন্য নিজের SEO ওয়েবসাইট — | কাস্টমার গুগলেই আপনাকে খুঁজে পাবে। | অফার দিন, সবাইকে একসাথে মেসেজ।",
    head: "নিজের নামে ওয়েবসাইট", hi: ["ওয়েবসাইট"], color: INDIGO, chips: [[Globe, "SEO ওয়েবসাইট"], [QrCode, "QR কোড"], [Megaphone, "অফার মেসেজ"]] },
  multi: { kind: "multi", vo: "ivo/09", cap: "অ্যাপ আর ওয়েবসাইট — দুটোতেই চলে। | এক অ্যাকাউন্টেই একাধিক ব্যবসা।",
    head: "অ্যাপ + ওয়েব, একাধিক ব্যবসা", hi: ["অ্যাপ", "ওয়েব,"], color: INDIGO, chips: [[MonitorSmartphone, "মোবাইল · কম্পিউটার"], [Building2, "সব ব্যবসা এক অ্যাকাউন্টে"]] },
  calm: { kind: "calm", vo: "ivo/10", cap: "আপনি শুধু ব্যবসা সামলান, | বাকি সব সামলাবে Qount।" },
  brand: { kind: "brand", vo: "vo/11", cap: "Qount — বাংলাদেশের সুপার বুকিং অ্যাপ। | একবার ট্রাই করে দেখুন — ৩ দিন সম্পূর্ণ ফ্রি।" },
  end: { kind: "end", vo: "vo/12", cap: "ডাউনলোড করুন Qount অ্যাপ, | অথবা ভিজিট করুন qount.dreamithq.com" },
};
const FULL = [S.hook, S.pain, S.types, S.pay, S.ticket, S.approve, S.income, S.site, S.multi, S.calm, S.brand, S.end];
const FEED = [S.hook, S.pain, S.types, S.pay, S.income, S.site, S.calm, S.brand, S.end];
const REEL: Sc[] = [
  S.hook,
  { ...S.types, vo: "ivor/01", cap: "টার্ফ, সেলুন, ডাক্তার, ডায়াগনস্টিক, | হল, রিসোর্ট, জিম — | সব বুকিং এক অ্যাপে।" },
  { ...S.pay, vo: "ivor/02", head: "নিজেই বুক, বিকাশে অগ্রিম", hi: ["বুক,", "অগ্রিম"], cap: "কাস্টমার নিজেই বুক করবে, বিকাশে অগ্রিম দেবে, | সাথে সাথে টিকেট পাবে।" },
  { ...S.income, vo: "tvor/04", chips: [[CalendarCheck, "দৈনিক বুকিং"], [BarChart3, "মাসিক আয়"]], cap: "দিনে কয়টা বুকিং, | মাসে কত আয় — সব এক নজরে।" },
  S.calm,
  { ...S.end, vo: "vor/06", cap: "৩ দিন সম্পূর্ণ ফ্রি — | আজই Qount অ্যাপ ডাউনলোড করুন।" },
];

const IB: Biz = {
  accent: INDIGO, hello: "হ্যালো ব্যবসায়ী ভাই,", helloHi: ["ব্যবসায়ী"], hookIcon: Store,
  pain: [[PhoneCall, "সারাদিন ফোন", "বুকিংয়ের কল"], [NotebookPen, "খাতায় হিসাব", "ভুল আর হারানো"], [Users, "কে অগ্রিম দিলো?", "মনে রাখা কঠিন"]],
  good: [[Smartphone, "অনলাইন বুকিং", "ফোন লাগে না"], [BarChart3, "অটো হিসাব", "এক নজরে আয়"], [Wallet, "বিকাশে অগ্রিম", "সব রেকর্ডে"]],
  goodHead: "পুরো ব্যবসা অটোমেশন!",
  calmIcon: Store, calmHead: "আপনি শুধু ব্যবসা সামলান", calmHi: ["ব্যবসা"], tagline: "সব ধরনের বুকিং, এক অ্যাপে", endShot: "shots/home.png",
  vis: { types: TypesVis, pay: PayVis, ticket: TicketVis, approve: ApproveVis, income: IIncome, site: TemplatesVis, multi: IMulti },
};

const TLH = timeline(FULL, dOf, 100), TLF = timeline(FEED, dOf, 90), TLR = timeline(REEL, dOf, 55);
export const QI_TOTAL = { H: total(TLH), F: total(TLF), R: total(TLR) };
export const QiH: React.FC = () => <Film SC={FULL} TL={TLH} B={IB} />;
export const QiF: React.FC = () => <Film SC={FEED} TL={TLF} B={IB} />;
export const QiR: React.FC = () => <Film SC={REEL} TL={TLR} B={IB} />;
