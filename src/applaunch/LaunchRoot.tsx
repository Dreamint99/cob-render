import React from "react";
import { Composition } from "remotion";
import { Launch, launchTotal } from "./Launch";
import { Story, storyTotal } from "./Story";
import { LangStory, langTotal } from "./LangStory";
export const LaunchRoot: React.FC = () => (
  <>
    <Composition id="Launch-Reel" component={Launch} defaultProps={{ cut: "short" as const }} durationInFrames={launchTotal("short")} fps={30} width={1080} height={1920} />
    <Composition id="Launch-Feed" component={Launch} defaultProps={{ cut: "short" as const }} durationInFrames={launchTotal("short")} fps={30} width={1080} height={1350} />
    <Composition id="Launch-Wide" component={Launch} defaultProps={{ cut: "short" as const }} durationInFrames={launchTotal("short")} fps={30} width={1920} height={1080} />
    <Composition id="Launch-Long" component={Launch} defaultProps={{ cut: "long" as const }} durationInFrames={launchTotal("long")} fps={30} width={1920} height={1080} />
    <Composition id="Launch-LongV" component={Launch} defaultProps={{ cut: "long" as const }} durationInFrames={launchTotal("long")} fps={30} width={1080} height={1920} />
    <Composition id="Story-Reel" component={Story} durationInFrames={storyTotal()} fps={30} width={1080} height={1920} />
    <Composition id="Story-Feed" component={Story} durationInFrames={storyTotal()} fps={30} width={1080} height={1350} />
    <Composition id="Story-Wide" component={Story} durationInFrames={storyTotal()} fps={30} width={1920} height={1080} />
    <Composition id="LangJA-Reel" component={LangStory} defaultProps={{ lang: "ja" as const }} durationInFrames={langTotal("ja")} fps={30} width={1080} height={1920} />
    <Composition id="LangJA-Feed" component={LangStory} defaultProps={{ lang: "ja" as const }} durationInFrames={langTotal("ja")} fps={30} width={1080} height={1350} />
    <Composition id="LangJA-Wide" component={LangStory} defaultProps={{ lang: "ja" as const }} durationInFrames={langTotal("ja")} fps={30} width={1920} height={1080} />
    <Composition id="LangEN-Reel" component={LangStory} defaultProps={{ lang: "en" as const }} durationInFrames={langTotal("en")} fps={30} width={1080} height={1920} />
    <Composition id="LangEN-Feed" component={LangStory} defaultProps={{ lang: "en" as const }} durationInFrames={langTotal("en")} fps={30} width={1080} height={1350} />
    <Composition id="LangEN-Wide" component={LangStory} defaultProps={{ lang: "en" as const }} durationInFrames={langTotal("en")} fps={30} width={1920} height={1080} />
    <Composition id="LangAR-Reel" component={LangStory} defaultProps={{ lang: "ar" as const }} durationInFrames={langTotal("ar")} fps={30} width={1080} height={1920} />
    <Composition id="LangAR-Feed" component={LangStory} defaultProps={{ lang: "ar" as const }} durationInFrames={langTotal("ar")} fps={30} width={1080} height={1350} />
    <Composition id="LangAR-Wide" component={LangStory} defaultProps={{ lang: "ar" as const }} durationInFrames={langTotal("ar")} fps={30} width={1920} height={1080} />
  </>
);
