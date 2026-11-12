// Entry for the ১১.১১ offer promo only (slim bundle, public dir work/puboffer) — node scripts/offer11.mjs
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Offer11, offerLen } from "./Offer11";
const Root: React.FC = () => (
  <>
    <Composition id="Offer11H" component={Offer11} width={1920} height={1080} fps={30} durationInFrames={offerLen("h")} defaultProps={{ k: "h" as const }} />
    <Composition id="Offer11V" component={Offer11} width={1080} height={1920} fps={30} durationInFrames={offerLen("v")} defaultProps={{ k: "v" as const }} />
  </>
);
registerRoot(Root);
