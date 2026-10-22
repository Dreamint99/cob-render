// Separate Remotion entry for AI University Shorts + feature images (keeps src/Root.tsx untouched).
import React from "react";
import { Composition, Still, registerRoot } from "remotion";
import { AiuShort, AiuThumb, AiuFrame, AiuEnd, AiuBanner } from "./AiuShort";

const Root: React.FC = () =>
  React.createElement(React.Fragment, null,
    React.createElement(Composition, {
      id: "AiuShort", component: AiuShort as any, fps: 30, width: 1080, height: 1920, durationInFrames: 900,
      defaultProps: { clip: "", dur: 30, hook: "", title: "", chip: "", accent: "#38bdf8", caps: [] },
      calculateMetadata: ({ props }: any) => ({ durationInFrames: Math.round(props.dur * 30) }),
    }),
    React.createElement(Still, { id: "AiuFrame", component: AiuFrame as any, width: 1080, height: 1920,
      defaultProps: { layer: "base", hook: "", title: "", chip: "", accent: "#38bdf8" } }),
    React.createElement(Still, { id: "AiuBanner", component: AiuBanner, width: 2560, height: 1440 }),
    React.createElement(Composition, { id: "AiuEnd", component: AiuEnd, fps: 30, width: 1080, height: 1920, durationInFrames: 75 }),
    React.createElement(Still, {
      id: "AiuThumb", component: AiuThumb as any, width: 1280, height: 720,
      defaultProps: { frame: "", badge: "", title: "", course: "", chip: "", accent: "#38bdf8" },
    }));

registerRoot(Root);
