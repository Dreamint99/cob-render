import React from "react";
import { Composition } from "remotion";
import { Launch, launchTotal } from "./Launch";
export const LaunchRoot: React.FC = () => (
  <>
    <Composition id="Launch-Reel" component={Launch} defaultProps={{ cut: "short" as const }} durationInFrames={launchTotal("short")} fps={30} width={1080} height={1920} />
    <Composition id="Launch-Feed" component={Launch} defaultProps={{ cut: "short" as const }} durationInFrames={launchTotal("short")} fps={30} width={1080} height={1350} />
    <Composition id="Launch-Wide" component={Launch} defaultProps={{ cut: "short" as const }} durationInFrames={launchTotal("short")} fps={30} width={1920} height={1080} />
    <Composition id="Launch-Long" component={Launch} defaultProps={{ cut: "long" as const }} durationInFrames={launchTotal("long")} fps={30} width={1920} height={1080} />
    <Composition id="Launch-LongV" component={Launch} defaultProps={{ cut: "long" as const }} durationInFrames={launchTotal("long")} fps={30} width={1080} height={1920} />
  </>
);
