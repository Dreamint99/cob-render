import React from "react";
import { Composition } from "remotion";
import { Film, total } from "./Film";
export const AiufRoot: React.FC = () => (
  <>
    <Composition id="AIUF-H" component={Film} durationInFrames={total("h")} fps={30} width={1920} height={1080} />
    <Composition id="AIUF-V" component={Film} durationInFrames={total("v")} fps={30} width={1080} height={1920} />
  </>
);
