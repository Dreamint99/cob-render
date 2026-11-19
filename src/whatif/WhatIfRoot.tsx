import "./fonts";
import React from "react";
import { Composition } from "remotion";
import { WhatIfEp1, EP1_LEN } from "./Ep1";
// "যদি…" episode 1 full — 2560x1440, 30 fps, 17103 frames (9:30)
export const WhatIfRoot: React.FC = () => (
  <>
    <Composition id="WhatIfEp1" component={WhatIfEp1} durationInFrames={EP1_LEN} fps={30} width={2560} height={1440} />
  </>
);
