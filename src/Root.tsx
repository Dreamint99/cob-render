import { HeadsVideo, headsLen } from "./heads/HeadsEngine";
import { Composition } from "remotion";
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
import { RonaldoBan, RONALDO_LEN } from "./news/stories/RonaldoBan";
import { Gambling, GAMBLING_LEN } from "./investigation/Gambling";
import { Doc, FILM_LIST, filmLen } from "./docs/DocEngine";
import { Explainer, TOPIC_LIST, topicLen } from "./overnight/Explainer";
import { AvatarTech, avTotal } from "./avatar/AvatarTech";
import { AIUPromo, AIU_TOTAL } from "./AIUPromo";
// Register each new video here.
export const Root = () => (
  <>
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
    {DATA_REELS.map((r) => <Composition key={r.id} id={r.id} component={DataReel} defaultProps={{ r }} durationInFrames={r.dur} fps={30} width={1080} height={1920} />)}
    <Composition id="FeatureMasum2" component={Masum2} durationInFrames={MASUM2_LEN} fps={30} width={1920} height={1080} />
    <Composition id="FeatureMasum" component={MasumFeature} durationInFrames={MASUM_LEN} fps={30} width={1920} height={1080} />
    <Composition id="FeatureTinker" component={TinkerFeature} durationInFrames={TINKER_LEN} fps={30} width={1920} height={1080} />
    <Composition id="NewsFlightCancel" component={FlightCancel} durationInFrames={FLIGHT_LEN} fps={30} width={1920} height={1080} />
    <Composition id="InvCoffin" component={CoffinReport} durationInFrames={CF_LEN} fps={30} width={1920} height={1080} />
    <Composition id="InvHoneyTrap" component={HoneyTrap} durationInFrames={HT_LEN} fps={30} width={1920} height={1080} />
    <Composition id="NewsGulshanRaid" component={GulshanRaid} durationInFrames={GULSHAN_LEN} fps={30} width={1920} height={1080} />
    <Composition id="NewsRonaldoBan" component={RonaldoBan} durationInFrames={RONALDO_LEN} fps={30} width={1920} height={1080} />
    <Composition id="InvGambling" component={Gambling} durationInFrames={GAMBLING_LEN} fps={30} width={1920} height={1080} />
    {FILM_LIST.map((f) => <Composition key={f.id} id={`Doc-${f.id}`} component={Doc} defaultProps={{ id: f.id }} durationInFrames={filmLen(f)} fps={30} width={1920} height={1080} />)}
    {TOPIC_LIST.map((t) => <Composition key={t.id} id={`Ov-${t.id}`} component={Explainer} defaultProps={{ id: t.id }} durationInFrames={topicLen(t)} fps={30} width={1920} height={1080} />)}
    <Composition id="Heads" component={HeadsVideo} defaultProps={{ id: "heads" as const }} durationInFrames={headsLen("heads")} fps={30} width={1920} height={1080} />
    <Composition id="HeadsReel" component={HeadsVideo} defaultProps={{ id: "heads" as const }} durationInFrames={headsLen("heads")} fps={30} width={1080} height={1920} />
    <Composition id="HeadsSerbia" component={HeadsVideo} defaultProps={{ id: "serbia" as const }} durationInFrames={headsLen("serbia")} fps={30} width={1920} height={1080} />
    <Composition id="HeadsSerbiaReel" component={HeadsVideo} defaultProps={{ id: "serbia" as const }} durationInFrames={headsLen("serbia")} fps={30} width={1080} height={1920} />
    <Composition id="AvatarTech" component={AvatarTech} durationInFrames={avTotal} fps={30} width={1920} height={1080} />
  </>
);
