import "./fonts";
import React from "react";
import { Composition } from "remotion";
import { LibyaGlobe, GLOBE_LEN, LibyaMed, MED_LEN, LibyaSea, SEA_LEN } from "./Geo3D";
import { LibyaEp0, EP0_LEN } from "./Ep0";
const W = 1920, H = 1080;
export const LibyaRoot: React.FC = () => (
  <>
    <Composition id="LibyaGlobe" component={LibyaGlobe} durationInFrames={GLOBE_LEN} fps={30} width={W} height={H} />
    <Composition id="LibyaMed" component={LibyaMed} durationInFrames={MED_LEN} fps={30} width={W} height={H} />
    <Composition id="LibyaSeaOpen" component={LibyaSea} durationInFrames={SEA_LEN} fps={30} width={W} height={H} defaultProps={{ variant: "open" as const }} />
    <Composition id="LibyaSeaBoat" component={LibyaSea} durationInFrames={150} fps={30} width={W} height={H} defaultProps={{ variant: "boat" as const }} />
    <Composition id="LibyaEp0" component={LibyaEp0} durationInFrames={EP0_LEN} fps={30} width={W} height={H} />
  </>
);
