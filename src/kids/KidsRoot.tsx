import React from "react";
import { Composition } from "remotion";
import { KidsVideo } from "./KidsEngine";
import { SPECS } from "./specs";

export const KidsRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Kids-${s.id}`} component={KidsVideo as any} durationInFrames={s.total} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
