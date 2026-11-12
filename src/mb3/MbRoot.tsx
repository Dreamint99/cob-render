import React from "react";
import { Composition } from "remotion";
import { Mb3, Mb3Reel, MB3_TOTAL, MB3R_TOTAL } from "./Mb3";
export const MbRoot: React.FC = () => (
  <>
    <Composition id="MB3-H" component={Mb3} durationInFrames={MB3_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="MB3-R" component={Mb3Reel} durationInFrames={MB3R_TOTAL} fps={30} width={1080} height={1920} />
  </>
);
