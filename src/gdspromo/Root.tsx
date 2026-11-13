import React from "react";
import { Composition } from "remotion";
import { Promo, total } from "./Promo";
export const GdsRoot: React.FC = () => (
  <>
    <Composition id="GDSP-H" component={Promo} durationInFrames={total("h")} fps={30} width={1920} height={1080} />
    <Composition id="GDSP-V" component={Promo} durationInFrames={total("v")} fps={30} width={1080} height={1920} />
  </>
);
