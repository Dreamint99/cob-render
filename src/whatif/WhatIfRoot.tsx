import "./fonts";
import React from "react";
import { Composition } from "remotion";
import { WhatIfEp1, EP1_LEN } from "./Ep1";
// "যদি…" episode 1 sample — 2560x1440, 30 fps, ceil(139.9 × 30) = 4197 frames
export const WhatIfRoot: React.FC = () => (
  <>
    <Composition id="WhatIfEp1" component={WhatIfEp1} durationInFrames={EP1_LEN} fps={30} width={2560} height={1440} />
  </>
);
