// Qount — TURF promo (2026-11-12). Same engine as the doctor promo (Qd.tsx Film), turf visuals here.
// VO: work/qount/turf/{script,reel}.json → work/qpub/tvo, tvor (brand/end lines reuse vo/11, vo/12, vor/06).
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Goal, Volleyball, PhoneCall, CalendarX, NotebookPen, Smartphone, CalendarCheck, BarChart3, Clock, Sun, Moon, Wallet, MessageSquareText, QrCode, BellRing, ShieldCheck, CalendarDays, LandPlot, Globe, Megaphone, MonitorSmartphone, Building2, Trophy, CheckCircle2 } from "lucide-react";
import { Film, Stage, Phone, Tap, Push, Card, IncomeVis, SiteVis, MultiVis, timeline, dOf, total, Biz, Sc, LEAD, INDIGO, INK, MUTED, WHITE, GREEN, AMBER, BKASH, F, LAT, clamp, sp, bn } from "./Qd";

const TURF = "#2C7A3F";

/* ---------- visuals ---------- */
const SlotsVis: React.FC<{ dur: number }> = ({ dur }) => {
  const sw = LEAD + Math.round(dur * 0.4);
  return (
    <Stage>
      <Phone x={300} y={400} screens={[{ src: "shots/t-when.png", at: 0 }, { src: "shots/t-slots.png", at: sw }]} d={2}>
        <Tap x={540} y={1816} at={sw - 22} />
        <Tap x={874} y={1816} at={sw - 6} />
      </Phone>
      <Card x={560} y={130} w={330} d={14}>
        <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <Sun size={44} color={AMBER} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 24, color: MUTED }}>দিনে</span>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 38, color: INK }}>৳১,৫০০<span style={{ fontSize: 22, color: MUTED }}>/ঘণ্টা</span></span>
          </div>
        </div>
      </Card>
      <Card x={590} y={270} w={310} d={24}>
        <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <Moon size={42} color={INDIGO} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 24, color: MUTED }}>রাতে</span>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 38, color: INK }}>৳২,০০০<span style={{ fontSize: 22, color: MUTED }}>/ঘণ্টা</span></span>
          </div>
        </div>
      </Card>
      <Card x={540} y={460} w={360} d={sw + 16} from="b">
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: TURF + "1C", display: "flex", alignItems: "center", justifyContent: "center" }}><CalendarCheck size={36} color={TURF} /></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 30, color: INK }}>কোর্ট A · ৯–১১ PM</span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 23, color: MUTED }}>আজ · ২ ঘণ্টা · স্লট খালি ✓</span>
          </div>
        </div>
      </Card>
    </Stage>
  );
};

export const PayVis: React.FC<{ dur: number; pre?: boolean }> = ({ dur, pre }) => {
  const a = pre ? LEAD + Math.round(dur * 0.25) : 0;
  const b = LEAD + Math.round(dur * (pre ? 0.55 : 0.4));
  const screens = pre
    ? [{ src: "shots/t-slots.png", at: 0 }, { src: "shots/t-pay.png", at: a }, { src: "shots/t-ticket.png", at: b }]
    : [{ src: "shots/t-pay.png", at: 0 }, { src: "shots/t-ticket.png", at: b }];
  return (
    <Stage>
      <Phone x={270} y={400} screens={screens} d={2}>
        {pre && <Tap x={768} y={2236} at={a - 8} />}
        <Tap x={1020} y={2236} at={b - 8} />
        <div style={{ opacity: interpolate(useCurrentFrame(), [b, b + 6], [0, 1], clamp) }}>
          <Push title="আপনার বুকিং কনফার্ম ✓" body="গ্রিন ফিল্ড টার্ফ · আজ ৯:০০–১১:০০ PM" at={b + 6} cover={false} />
        </div>
      </Phone>
      <Card x={520} y={110} w={360} d={pre ? a + 6 : 12}>
        <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: BKASH, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: 32, color: "#fff" }}>৳</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 29, color: INK }}>বিকাশে অগ্রিম ৳৮০০</span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 21, color: GREEN }}>✓ TrxID সহ জমা হয়েছে</span>
          </div>
        </div>
      </Card>
      <Card x={500} y={290} w={400} d={b + 14}>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 50, height: 50, borderRadius: 99, background: TURF, display: "flex", alignItems: "center", justifyContent: "center" }}><MessageSquareText size={27} color="#fff" /></div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: LAT, fontWeight: 800, fontSize: 23, color: INK, letterSpacing: 0.5 }}>GREENFIELD</span>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: 20, color: GREEN }}>টার্ফের নিজের নামে SMS</span>
            </div>
          </div>
          <div style={{ background: "#F8F5EE", borderRadius: "6px 22px 22px 22px", padding: "12px 18px", fontFamily: F, fontWeight: 600, fontSize: 24, color: INK, lineHeight: 1.4 }}>
            বুকিং কনফার্ম! কোর্ট A, আজ <b style={{ color: TURF }}>৯:০০–১১:০০ PM</b>। টিকেট: <span style={{ fontFamily: LAT, fontWeight: 700 }}>QT-WB2XX</span>
          </div>
        </div>
      </Card>
      <Card x={560} y={590} w={300} d={b + 30} from="b">
        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <QrCode size={52} color={INK} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 23, color: INK }}>মাঠে QR দেখালেই এন্ট্রি</span>
        </div>
      </Card>
    </Stage>
  );
};

export const ApproveVis: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tap = LEAD + Math.round(dur * 0.42);
  const ok = sp(f, fps, tap + 4, 13);
  return (
    <Stage>
      <Phone x={630} y={400} screens={[{ src: "shots/t-pending.png", at: 0 }]} d={2} tilt={2}>
        <Push title="নতুন বুকিং · অনুমোদন দিন" body="কোর্ট A · আজ ৯–১১ PM · বিকাশ ৳৮০০" at={8} cover={false} />
        <Tap x={772} y={1060} at={tap} />
        <div style={{ position: "absolute", left: 45, top: 696, width: 990, height: 466, borderRadius: 50, background: "rgba(22,163,74,.93)", opacity: ok, transform: `scale(${0.9 + 0.1 * ok})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <CheckCircle2 size={130} color="#fff" strokeWidth={2.2} />
          <span style={{ fontFamily: F, fontWeight: 800, fontSize: 70, color: WHITE }}>কনফার্মড!</span>
          <span style={{ fontFamily: F, fontWeight: 600, fontSize: 44, color: "#F3EEE3" }}>খেলোয়াড়কে SMS চলে গেছে</span>
        </div>
      </Phone>
      <Card x={0} y={170} w={390} d={14} from="l">
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 62, height: 62, borderRadius: 16, background: AMBER + "1E", display: "flex", alignItems: "center", justifyContent: "center" }}><BellRing size={34} color={AMBER} /></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 29, color: INK }}>নতুন বুকিং এসেছে</span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 22, color: MUTED }}>সাথে সাথে নোটিফিকেশন</span>
          </div>
        </div>
      </Card>
      <Card x={20} y={420} w={370} d={tap + 12} from="l">
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 62, height: 62, borderRadius: 16, background: GREEN + "1C", display: "flex", alignItems: "center", justifyContent: "center" }}><ShieldCheck size={34} color={GREEN} /></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 29, color: INK }}>ডাবল বুকিং নেই</span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 22, color: MUTED }}>স্লট নিজেই লক হয়ে যায়</span>
          </div>
        </div>
      </Card>
    </Stage>
  );
};

const CalendarVis: React.FC<{ dur: number }> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hours = ["৪ PM", "৫ PM", "৬ PM", "৭ PM", "৮ PM", "৯ PM", "১০ PM"];
  const courts = ["কোর্ট A", "কোর্ট B", "কোর্ট C"];
  // [court, startRow, rows, label, color]
  const blocks: [number, number, number, string, string][] = [
    [0, 0, 2, "রাকিব ভাই", TURF], [1, 1, 1, "অফিস টিম", INDIGO], [2, 0, 1, "স্কুল ক্লাব", TURF], [0, 3, 1, "ক্রিকেট নেট", AMBER],
    [1, 3, 2, "মিরপুর এফসি", TURF], [2, 2, 2, "বার্থডে ম্যাচ", INDIGO], [0, 5, 2, "QA টিম", TURF], [2, 5, 1, "অনুমোদন বাকি", AMBER], [1, 6, 1, "ফ্রেন্ডস XI", INDIGO],
  ];
  const days = ["বৃহঃ ১২", "শুক্র ১৩", "শনি ১৪", "রবি ১৫", "সোম ১৬"];
  const rowH = 70, top = 150, left = 120, colW = 250;
  return (
    <Stage>
      <Card x={0} y={20} w={900} d={2} from="b" style={{ borderRadius: 34, height: 700 }}>
        <div style={{ position: "absolute", left: 30, top: 28, right: 30, display: "flex", gap: 12 }}>
          {days.map((d, i) => (
            <div key={i} style={{ flex: 1, padding: "10px 0", borderRadius: 18, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 26, background: i === 0 ? TURF : "#F3EEE3", color: i === 0 ? WHITE : INK, opacity: sp(f, fps, 4 + i * 3) }}>{i === 0 ? "আজ · " + d.split(" ")[1] : d}</div>
          ))}
        </div>
        {courts.map((c, i) => (
          <div key={i} style={{ position: "absolute", left: left + i * colW + 10, top: 106, width: colW - 20, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 26, color: INK }}>{c}</div>
        ))}
        {hours.map((h, r) => (
          <div key={r} style={{ position: "absolute", left: 24, top: top + r * rowH, width: 860, height: rowH, borderTop: "1.5px solid #F3EEE3", fontFamily: LAT, fontWeight: 700, fontSize: 19, color: MUTED, paddingTop: 6 }}>{bn(h)}</div>
        ))}
        {blocks.map(([c, r, n, l, col], i) => {
          const s = sp(f, fps, 14 + i * 5, 13);
          return (
            <div key={i} style={{ position: "absolute", left: left + c * colW + 8, top: top + r * rowH + 6, width: colW - 16, height: n * rowH - 12, borderRadius: 14, background: col + "1C", borderLeft: `6px solid ${col}`,
              padding: "8px 14px", fontFamily: F, fontWeight: 700, fontSize: 23, color: INK, opacity: s, transform: `scale(${0.85 + 0.15 * s})`, transformOrigin: "left top" }}>{l}</div>
          );
        })}
      </Card>
    </Stage>
  );
};

const TIncome: React.FC<{ dur: number }> = ({ dur }) => (
  <IncomeVis dur={dur} name="গ্রিন ফিল্ড টার্ফ" stats={[["আজকের বুকিং", 12, "", TURF, CalendarCheck], ["এই মাসের আয়", 248000, "৳", INDIGO, Wallet], ["বাকি টাকা", 8800, "৳", AMBER, Clock]]} />
);
const TSite: React.FC<{ dur: number }> = ({ dur }) => (
  <SiteVis dur={dur} q="মিরপুরে টার্ফ বুকিং রাতে" src="shots/tsite.jpg" url="qount.dreamithq.com/kickoff-arena" qr="টার্ফের QR" c1={[Megaphone, "অফার SMS সবাইকে", "✓ ৮৫০ জনকে পাঠানো হলো", TURF]} />
);
const TMulti: React.FC<{ dur: number }> = ({ dur }) => (
  <MultiVis dur={dur} src="shots/b-dash.png" ratio={1440 / 900} phone="shots/b-owner.png" pills={["মিরপুর টার্ফ", "উত্তরা টার্ফ"]} />
);

/* ---------- scenes ---------- */
const S: Record<string, Sc> = {
  hook: { kind: "hook", vo: "tvo/01", cap: "হ্যালো টার্ফ মালিক ভাই, | আপনাকেই বলছি!" },
  pain: { kind: "pain", vo: "tvo/02", cap: "সারাদিন বুকিংয়ের ফোন, | কোন স্লট খালি খাতা ঘেঁটে দেখা, | অগ্রিম টাকার হিসাব — | কেমন হয় যদি আপনার পুরো টার্ফ | অটোমেশন হয়ে যায়?" },
  slots: { kind: "slots", vo: "tvo/03", cap: "খেলোয়াড়রা আর ফোন করবে না। | মোবাইল থেকেই খালি স্লট দেখে নিজেই বুক করবে — | দিন আর রাতের রেট আলাদা।",
    head: "খালি স্লট দেখে অনলাইন বুকিং", hi: ["অনলাইন", "বুকিং"], color: TURF, chips: [[PhoneCall, "কল ধরার ঝামেলা নেই"], [Clock, "২৪ ঘণ্টা বুকিং"], [Moon, "দিন / রাতের আলাদা রেট"]] },
  pay: { kind: "pay", vo: "tvo/04", cap: "বিকাশে অগ্রিম দিয়ে বুকিং — | আর সাথে সাথে আপনার টার্ফের নামে | SMS আর ইমেইলে টিকেট।",
    head: "অগ্রিম আর টিকেট — অটোমেটিক", hi: ["অগ্রিম", "টিকেট"], color: INDIGO, chips: [[Wallet, "বিকাশে অগ্রিম"], [MessageSquareText, "SMS · ইমেইল টিকেট"], [QrCode, "QR এন্ট্রি"]] },
  approve: { kind: "approve", vo: "tvo/05", cap: "নতুন বুকিং এলেই নোটিফিকেশন। | এক ট্যাপে কনফার্ম — | একই স্লট দুবার বুক হওয়ার ভয় নেই।",
    head: "এক ট্যাপে কনফার্ম", hi: ["এক", "ট্যাপে"], color: GREEN, chips: [[BellRing, "নতুন বুকিং নোটিফিকেশন"], [ShieldCheck, "ডাবল বুকিং নেই"]] },
  calendar: { kind: "calendar", vo: "tvo/06", cap: "কোন দিন, কোন কোর্টে, কখন খেলা — | এক ক্যালেন্ডারেই সব।",
    head: "সব কোর্ট এক ক্যালেন্ডারে", hi: ["ক্যালেন্ডারে"], color: TURF, chips: [[CalendarDays, "দিন ধরে সময়সূচি"], [LandPlot, "একাধিক কোর্ট"]] },
  income: { kind: "income", vo: "tvo/07", cap: "আজ কয়টা বুকিং, | মাসে কত টাকা আয় হলো, | কার কাছে কত বাকি — সব এক নজরে।",
    head: "বুকিং আর আয় — এক নজরে", hi: ["আয়"], color: INDIGO, chips: [[CalendarCheck, "দৈনিক বুকিং"], [BarChart3, "মাসিক আয়"], [Wallet, "কার কাছে কত বাকি"]] },
  site: { kind: "site", vo: "tvo/08", cap: "আপনার টার্ফের নিজের ওয়েবসাইট আর QR কোড — | খেলোয়াড়রা গুগলেই খুঁজে পাবে। | অফার দিন, সবাইকে একসাথে SMS।",
    head: "নিজের নামে ওয়েবসাইট", hi: ["ওয়েবসাইট"], color: TURF, chips: [[Globe, "SEO ওয়েবসাইট"], [QrCode, "QR কোড"], [Megaphone, "অফার SMS সবাইকে"]] },
  multi: { kind: "multi", vo: "tvo/09", cap: "অ্যাপ আর ওয়েবসাইট — দুটোতেই চলে। | এক অ্যাকাউন্টেই একাধিক টার্ফ।",
    head: "অ্যাপ + ওয়েব, একাধিক টার্ফ", hi: ["অ্যাপ", "ওয়েব,"], color: INDIGO, chips: [[MonitorSmartphone, "মোবাইল · কম্পিউটার"], [Building2, "সব টার্ফ এক অ্যাকাউন্টে"]] },
  calm: { kind: "calm", vo: "tvo/10", cap: "বাংলাদেশে আমরাই প্রথম! | আপনি শুধু মাঠ সামলান, | বাকি সব সামলাবে Qount।" },
  brand: { kind: "brand", vo: "vo/11", cap: "Qount — বাংলাদেশের সুপার বুকিং অ্যাপ। | একবার ট্রাই করে দেখুন — ৩ দিন সম্পূর্ণ ফ্রি।" },
  end: { kind: "end", vo: "vo/12", cap: "ডাউনলোড করুন Qount অ্যাপ, | অথবা ভিজিট করুন qount.dreamithq.com" },
};
const FULL = [S.hook, S.pain, S.slots, S.pay, S.approve, S.calendar, S.income, S.site, S.multi, S.calm, S.brand, S.end];
const FEED = [S.hook, S.pain, S.slots, S.pay, S.approve, S.income, S.site, S.calm, S.brand, S.end];
const REEL: Sc[] = [
  { ...S.hook, vo: "tvor/01" },
  { ...S.calendar, vo: "tvor/02", head: "বাংলাদেশে আমরাই প্রথম", hi: ["প্রথম"], chips: [[Trophy, "অটোমেটিক টার্ফ বুকিং"]], cap: "বাংলাদেশে আমরাই প্রথম — | টার্ফ বুকিং এখন পুরো অটোমেটিক।" },
  { ...S.pay, vo: "tvor/03", pre: true, head: "স্লট দেখে বুকিং, বিকাশে অগ্রিম", hi: ["বুকিং,", "অগ্রিম"], chips: [[Smartphone, "অনলাইন বুকিং"], [Wallet, "বিকাশে অগ্রিম"]], cap: "খেলোয়াড়রা নিজেই খালি স্লট দেখে বুক করবে, | বিকাশে অগ্রিম দেবে।" },
  { ...S.income, vo: "tvor/04", chips: [[CalendarCheck, "দৈনিক বুকিং"], [BarChart3, "মাসিক আয়"]], cap: "দিনে কয়টা বুকিং, | মাসে কত আয় — সব এক নজরে।" },
  { ...S.calm, vo: "tvor/05", cap: "আপনি শুধু মাঠ সামলান, | বাকি সব সামলাবে Qount।" },
  { ...S.end, vo: "vor/06", cap: "৩ দিন সম্পূর্ণ ফ্রি — | আজই Qount অ্যাপ ডাউনলোড করুন।" },
];

const TB: Biz = {
  accent: TURF, hello: "হ্যালো টার্ফ মালিক ভাই,", helloHi: ["টার্ফ"], hookIcon: Goal,
  pain: [[PhoneCall, "সারাদিন ফোন", "২০+ বুকিং কল"], [CalendarX, "ডাবল বুকিং", "একই স্লট দুজনকে"], [NotebookPen, "অগ্রিমের হিসাব", "খাতায় গোলমাল"]],
  good: [[Smartphone, "অনলাইন বুকিং", "ফোন লাগে না"], [CalendarCheck, "লাইভ স্লট", "ডাবল বুকিং নেই"], [BarChart3, "অটো হিসাব", "এক নজরে আয়"]],
  goodHead: "পুরো টার্ফ অটোমেশন!",
  calmIcon: Volleyball, calmHead: "আপনি শুধু মাঠ সামলান", calmHi: ["মাঠ"], first: "বাংলাদেশে আমরাই প্রথম", tagline: "টার্ফ বুকিং এখন অটোমেটিক", endShot: "shots/b-turf.png",
  vis: { slots: SlotsVis, pay: PayVis, approve: ApproveVis, calendar: CalendarVis, income: TIncome, site: TSite, multi: TMulti },
};

const TLH = timeline(FULL, dOf, 100), TLF = timeline(FEED, dOf, 90), TLR = timeline(REEL, dOf, 75);
export const QT_TOTAL = { H: total(TLH), F: total(TLF), R: total(TLR) };
export const QtH: React.FC = () => <Film SC={FULL} TL={TLH} B={TB} />;
export const QtF: React.FC = () => <Film SC={FEED} TL={TLF} B={TB} />;
export const QtR: React.FC = () => <Film SC={REEL} TL={TLR} B={TB} />;
