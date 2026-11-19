import "./fonts";
import React from "react";
import { Composition, staticFile } from "remotion";
import { MysGlobe, GLOBE_LEN, MysBDMap, BDMAP_LEN, MysDelta, DELTA_LEN } from "./Geo";
import { Ep1, type Timeline } from "./Ep1";
const W = 2560, H = 1440;
const empty: Timeline = { total: 300, shots: [], overlays: [], caps: [], audio: [], booms: [], vo: [] };
export const MysRoot: React.FC = () => (
  <>
    <Composition id="MysGlobe" component={MysGlobe} durationInFrames={GLOBE_LEN} fps={30} width={W} height={H} />
    <Composition id="MysBDMap" component={MysBDMap} durationInFrames={BDMAP_LEN} fps={30} width={W} height={H} />
    <Composition id="MysDelta" component={MysDelta} durationInFrames={DELTA_LEN} fps={30} width={W} height={H} />
    <Composition id="MysEp1" component={Ep1 as any} durationInFrames={300} fps={30} width={W} height={H} defaultProps={{ tl: empty }}
      calculateMetadata={async () => { const tl = await fetch(staticFile("mystery/ep1/timeline.json")).then((r) => r.json()); return { durationInFrames: tl.total, props: { tl } }; }} />
    <Composition id="MysEp1Full" component={Ep1 as any} durationInFrames={300} fps={30} width={W} height={H} defaultProps={{ tl: empty }}
      calculateMetadata={async () => { const tl = await fetch(staticFile("mystery/ep1/timeline_full.json")).then((r) => r.json()); return { durationInFrames: tl.total, props: { tl } }; }} />
  </>
);
