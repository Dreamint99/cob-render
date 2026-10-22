import { HeadsVideo, headsLen } from "./heads/HeadsEngine";
import { Composition } from "remotion";
import { FifaMatch, FIFA_LEN } from "./fifa/FifaMatch";
import { SoulmateReel, SM_TOTAL } from "./soulmate/SoulmateReel";
import { TestCard } from "./TestCard";
import { EralBeel, BEEL_TOTAL } from "./EralBeel";
import { EralBeel2, BEEL2_TOTAL, FPS2 } from "./EralBeel2";
import { StyleDemo, DEMO_TOTAL } from "./StyleDemo";
import { Mohajon, MOHAJON_TOTAL } from "./Mohajon";
import { MohajonReel, REEL_TOTAL } from "./MohajonReel";
import { CountryGuide, GuideThumb, guideTotal } from "./CountryGuide";
import { ChannelBanner } from "./ChannelBanner";
import { QatarEurope, QEThumb, QE_TOTAL } from "./QatarEurope";
import { SaudiEurope, SEThumb, SE_TOTAL } from "./SaudiEurope";
import { ShortsReel, shortTotal, SHORT_IDS } from "./ShortsReel";
import { ProbashiPromo, PB_TOTAL } from "./ProbashiPromo";
import { InfoPromo, PI_TOTAL } from "./InfoPromo";
import { DreamGroup, DG_TOTAL } from "./DreamGroup";
import { InfoReel, REELS, reelLen } from "./InfoReels";
import { KushtiaPakistan, KUSHTIA_LEN } from "./news/stories/KushtiaPakistan";
import { ComillaArrest, COMILLA_LEN } from "./news/stories/ComillaArrest";
import { GulshanRaid, GULSHAN_LEN } from "./news/stories/GulshanRaid";
import { HoneyTrap, HT_LEN } from "./investigation/HoneyTrap";
import { CoffinReport, CF_LEN } from "./investigation/Coffin";
import { FlightCancel, FLIGHT_LEN } from "./news/stories/FlightCancel";
import { TinkerFeature, TINKER_LEN } from "./feature/Tinker";
import { MasumFeature, MASUM_LEN } from "./feature/Masum";
import { Masum2, MASUM2_LEN } from "./feature/Masum2";
import { DataReel, REELS as DATA_REELS } from "./investigation/DataReel";
import { InfoMotion, IM_REELS, imLen } from "./infomotion/InfoMotion";
import { RonaldoBan, RONALDO_LEN } from "./news/stories/RonaldoBan";
import { Gambling, GAMBLING_LEN } from "./investigation/Gambling";
import { BarFilm, BARFILM_LEN } from "./investigation/BarFilm";
import { Doc, FILM_LIST, filmLen } from "./docs/DocEngine";
import { Explainer, TOPIC_LIST, topicLen } from "./overnight/Explainer";
import { AvatarTech, avTotal } from "./avatar/AvatarTech";
import { AIUPromo, AIU_TOTAL } from "./AIUPromo";
import { AIUPromo2, AIU2_TOTAL } from "./AIUPromo2";
import { CFEPromo, CFE_TOTAL } from "./CFEPromo";
import { LessonVideo, lessonLen, Spec } from "./lessons/LessonEngine";
import L_cfe_browser from "./lessons/cfe-browser.json";
import L_cfe_connect_desktop from "./lessons/cfe-connect-desktop.json";
import L_cfe_desktop_intro from "./lessons/cfe-desktop-intro.json";
import L_cfe_email from "./lessons/cfe-email.json";
import L_cfe_files_folders from "./lessons/cfe-files-folders.json";
import L_cfe_history from "./lessons/cfe-history.json";
import L_cfe_how_internet_works from "./lessons/cfe-how-internet-works.json";
import L_cfe_hw_vs_sw from "./lessons/cfe-hw-vs-sw.json";
import L_cfe_inside_parts from "./lessons/cfe-inside-parts.json";
import L_cfe_install_software from "./lessons/cfe-install-software.json";
import L_cfe_io_devices from "./lessons/cfe-io-devices.json";
import L_cfe_keyboard from "./lessons/cfe-keyboard.json";
import L_cfe_laptop_vs_desktop from "./lessons/cfe-laptop-vs-desktop.json";
import L_cfe_main_parts from "./lessons/cfe-main-parts.json";
import L_cfe_malware_scams from "./lessons/cfe-malware-scams.json";
import L_cfe_modern_society from "./lessons/cfe-modern-society.json";
import L_cfe_mouse from "./lessons/cfe-mouse.json";
import L_cfe_p_m2 from "./lessons/cfe-p-m2.json";
import L_cfe_p_m3 from "./lessons/cfe-p-m3.json";
import L_cfe_p_m4 from "./lessons/cfe-p-m4.json";
import L_cfe_p_m6 from "./lessons/cfe-p-m6.json";
import L_cfe_passwords from "./lessons/cfe-passwords.json";
import L_cfe_ports_cables from "./lessons/cfe-ports-cables.json";
import L_cfe_search from "./lessons/cfe-search.json";
import L_cfe_shortcuts from "./lessons/cfe-shortcuts.json";
import L_cfe_start_desktop from "./lessons/cfe-start-desktop.json";
import L_cfe_taskbar from "./lessons/cfe-taskbar.json";
import L_cfe_what_can_you_do from "./lessons/cfe-what-can-you-do.json";
import L_cfe_what_is_computer from "./lessons/cfe-what-is-computer.json";
const LESSONS = [L_cfe_browser, L_cfe_connect_desktop, L_cfe_desktop_intro, L_cfe_email, L_cfe_files_folders, L_cfe_history, L_cfe_how_internet_works, L_cfe_hw_vs_sw, L_cfe_inside_parts, L_cfe_install_software, L_cfe_io_devices, L_cfe_keyboard, L_cfe_laptop_vs_desktop, L_cfe_main_parts, L_cfe_malware_scams, L_cfe_modern_society, L_cfe_mouse, L_cfe_p_m2, L_cfe_p_m3, L_cfe_p_m4, L_cfe_p_m6, L_cfe_passwords, L_cfe_ports_cables, L_cfe_search, L_cfe_shortcuts, L_cfe_start_desktop, L_cfe_taskbar, L_cfe_what_can_you_do, L_cfe_what_is_computer] as unknown as Spec[];
import { CfeKinetic } from "./promo3/CfeKinetic";
import { GdsBoard } from "./promo3/GdsBoard";
import { IeltsPhone } from "./promo3/IeltsPhone";
import { EnglishChat } from "./promo3/EnglishChat";
import p3en from "./promo3/english.json";
import p3enD from "./promo3/english.durs.json";
import { totalLen as p3Len, Spec as P3Spec } from "./promo3/shared";
import p3cfe from "./promo3/cfe.json";
import p3cfeD from "./promo3/cfe.durs.json";
import p3gds from "./promo3/gds.json";
import p3gdsD from "./promo3/gds.durs.json";
import p3ielts from "./promo3/ielts.json";
import p3ieltsD from "./promo3/ielts.durs.json";
import { CoursePromo, promoLen, PSpec } from "./promos/CoursePromo";
import prVibe from "./promos/vibe-coding.json";
import prSnake from "./promos/snake-rescue.json";
import prFish from "./promos/fish-feed.json";
import prHealth from "./promos/family-health.json";
const PROMOS = [prVibe, prSnake, prFish, prHealth] as unknown as PSpec[];
import { PocketVideo, pocketLen, KSpec } from "./pocket/PocketEngine";
import pkSaree from "./pocket/saree.json";
import pkKala from "./pocket/kala-bhuna.json";
import pkFraud from "./pocket/mobile-fraud.json";
import pkGas from "./pocket/gas-safety.json";
import pkDengue from "./pocket/dengue.json";
import { AIU3Comps } from "./aiu3/CloudRoot";
const POCKETS = [pkSaree, pkKala, pkFraud, pkGas, pkDengue] as unknown as KSpec[];
// Register each new video here.
export const Root = () => (
  <>
    {POCKETS.map((s) => <Composition key={s.id} id={`Pocket-${s.id}`} component={PocketVideo} defaultProps={{ spec: s }} durationInFrames={pocketLen(s)} fps={30} width={1920} height={1080} />)}
    {PROMOS.map((s) => <Composition key={s.id} id={`Promo-${s.id}`} component={CoursePromo} defaultProps={{ spec: s }} durationInFrames={promoLen(s)} fps={30} width={1920} height={1080} />)}
    {LESSONS.map((s) => <Composition key={s.id} id={`Lesson-${s.id}`} component={LessonVideo} defaultProps={{ spec: s }} durationInFrames={lessonLen(s)} fps={30} width={1920} height={1080} />)}
    <Composition id="CFEPromo" component={CFEPromo} durationInFrames={CFE_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="P3-cfe" component={CfeKinetic} defaultProps={{ spec: p3cfe as unknown as P3Spec, durs: p3cfeD }} durationInFrames={p3Len(p3cfeD)} fps={30} width={1920} height={1080} />
    <Composition id="P3-gds" component={GdsBoard} defaultProps={{ spec: p3gds as unknown as P3Spec, durs: p3gdsD }} durationInFrames={p3Len(p3gdsD)} fps={30} width={1920} height={1080} />
    <Composition id="P3-english" component={EnglishChat} defaultProps={{ spec: p3en as unknown as P3Spec, durs: p3enD }} durationInFrames={p3Len(p3enD)} fps={30} width={1920} height={1080} />
    <Composition id="P3-ielts" component={IeltsPhone} defaultProps={{ spec: p3ielts as unknown as P3Spec, durs: p3ieltsD }} durationInFrames={p3Len(p3ieltsD)} fps={30} width={1920} height={1080} />
    <AIU3Comps />
    <Composition id="AIUPromo2" component={AIUPromo2} durationInFrames={AIU2_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="AIUPromo" component={AIUPromo} durationInFrames={AIU_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="TestCard" component={TestCard} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="StyleDemo" component={StyleDemo} durationInFrames={DEMO_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="EralBeel" component={EralBeel} durationInFrames={BEEL_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="EralBeel2" component={EralBeel2} durationInFrames={BEEL2_TOTAL} fps={FPS2} width={1920} height={1080} />
    <Composition id="Mohajon" component={Mohajon} durationInFrames={MOHAJON_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="ProbashiPromo" component={ProbashiPromo} durationInFrames={PB_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="MohajonReel" component={MohajonReel} durationInFrames={REEL_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="InfoPromo" component={InfoPromo} durationInFrames={PI_TOTAL} fps={30} width={1920} height={1080} />
    {["rs", "qa", "sa", "md", "mk", "pt"].map((cc) => <Composition key={cc} id={`Guide-${cc}`} component={CountryGuide} defaultProps={{ cc }} durationInFrames={guideTotal(cc)} fps={30} width={1920} height={1080} />)}
    {["rs", "qa", "sa", "md", "mk", "pt"].map((cc) => <Composition key={"t" + cc} id={`Thumb-${cc}`} component={GuideThumb} defaultProps={{ cc }} durationInFrames={1} fps={30} width={1280} height={720} />)}
    <Composition id="DreamGroup" component={DreamGroup} durationInFrames={DG_TOTAL} fps={30} width={1920} height={1080} />
    {REELS.map((r) => <Composition key={r.id} id={r.id} component={InfoReel} durationInFrames={reelLen(r.props.segs)} fps={30} width={1080} height={1920} defaultProps={r.props} />)}
    <Composition id="ChannelBanner" component={ChannelBanner} durationInFrames={1} fps={30} width={2560} height={1440} />
    {SHORT_IDS.map((id) => <Composition key={"sh" + id} id={`Short-${id}`} component={ShortsReel} defaultProps={{ id }} durationInFrames={shortTotal(id)} fps={30} width={1080} height={1920} />)}
    <Composition id="QatarEurope" component={QatarEurope} durationInFrames={QE_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="QEThumb" component={QEThumb} durationInFrames={1} fps={30} width={1280} height={720} />
    <Composition id="SaudiEurope" component={SaudiEurope} durationInFrames={SE_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="SEThumb" component={SEThumb} durationInFrames={1} fps={30} width={1280} height={720} />
    <Composition id="NewsKushtiaPakistan" component={KushtiaPakistan} durationInFrames={KUSHTIA_LEN} fps={30} width={1920} height={1080} />
    <Composition id="NewsComillaArrest" component={ComillaArrest} durationInFrames={COMILLA_LEN} fps={30} width={1920} height={1080} />
    {IM_REELS.map((r) => <Composition key={r.id} id={r.id} component={InfoMotion} defaultProps={{ id: r.id }} durationInFrames={imLen(r)} fps={30} width={1080} height={1920} />)}
    {DATA_REELS.map((r) => <Composition key={r.id} id={r.id} component={DataReel} defaultProps={{ r }} durationInFrames={r.dur} fps={30} width={1080} height={1920} />)}
    <Composition id="FeatureMasum2" component={Masum2} durationInFrames={MASUM2_LEN} fps={30} width={1920} height={1080} />
    <Composition id="FeatureMasum" component={MasumFeature} durationInFrames={MASUM_LEN} fps={30} width={1920} height={1080} />
    <Composition id="FeatureTinker" component={TinkerFeature} durationInFrames={TINKER_LEN} fps={30} width={1920} height={1080} />
    <Composition id="NewsFlightCancel" component={FlightCancel} durationInFrames={FLIGHT_LEN} fps={30} width={1920} height={1080} />
    <Composition id="InvCoffin" component={CoffinReport} durationInFrames={CF_LEN} fps={30} width={1920} height={1080} />
    <Composition id="InvHoneyTrap" component={HoneyTrap} durationInFrames={HT_LEN} fps={30} width={1920} height={1080} />
    <Composition id="NewsGulshanRaid" component={GulshanRaid} durationInFrames={GULSHAN_LEN} fps={30} width={1920} height={1080} />
    <Composition id="NewsRonaldoBan" component={RonaldoBan} durationInFrames={RONALDO_LEN} fps={30} width={1920} height={1080} />
    <Composition id="InvBarFilm" component={BarFilm} durationInFrames={BARFILM_LEN} fps={30} width={1920} height={1080} />
    <Composition id="InvGambling" component={Gambling} durationInFrames={GAMBLING_LEN} fps={30} width={1920} height={1080} />
    {FILM_LIST.map((f) => <Composition key={f.id} id={`Doc-${f.id}`} component={Doc} defaultProps={{ id: f.id }} durationInFrames={filmLen(f)} fps={30} width={1920} height={1080} />)}
    {TOPIC_LIST.map((t) => <Composition key={t.id} id={`Ov-${t.id}`} component={Explainer} defaultProps={{ id: t.id }} durationInFrames={topicLen(t)} fps={30} width={1920} height={1080} />)}
    <Composition id="Heads" component={HeadsVideo} defaultProps={{ id: "heads" as const }} durationInFrames={headsLen("heads")} fps={30} width={1920} height={1080} />
    <Composition id="HeadsReel" component={HeadsVideo} defaultProps={{ id: "heads" as const }} durationInFrames={headsLen("heads")} fps={30} width={1080} height={1920} />
    <Composition id="HeadsSerbia" component={HeadsVideo} defaultProps={{ id: "serbia" as const }} durationInFrames={headsLen("serbia")} fps={30} width={1920} height={1080} />
    <Composition id="HeadsSerbiaReel" component={HeadsVideo} defaultProps={{ id: "serbia" as const }} durationInFrames={headsLen("serbia")} fps={30} width={1080} height={1920} />
    <Composition id="SoulmateReel" component={SoulmateReel} durationInFrames={SM_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="FifaMatch" component={FifaMatch} durationInFrames={FIFA_LEN} fps={30} width={1920} height={1080} />
    <Composition id="AvatarTech" component={AvatarTech} durationInFrames={avTotal} fps={30} width={1920} height={1080} />
  </>
);
