import React from "react";
import { Composition } from "remotion";
import { GdsPromo5, totalOf, FPS } from "./GdsPromo5";
// GDS মাস্টারিং promo v5 (light mode) — also registered in src/Root.tsx; this standalone root is used for stills/renders (src/gdspromo5/index.ts)
export const Gds5Comps: React.FC = () => (
  <>
    <Composition id="GDS5-Main" component={GdsPromo5} durationInFrames={totalOf(false)} fps={FPS} width={1920} height={1080} defaultProps={{ reel: false }} />
    <Composition id="GDS5-Reel" component={GdsPromo5} durationInFrames={totalOf(true)} fps={FPS} width={1080} height={1920} defaultProps={{ reel: true }} />
  </>
);
