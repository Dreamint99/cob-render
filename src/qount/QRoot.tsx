import React from "react";
import { Composition } from "remotion";
import { QdH, QdF, QdR, QD_TOTAL } from "./Qd";
import { QtH, QtF, QtR, QT_TOTAL } from "./Qt";
import { QiH, QiF, QiR, QI_TOTAL } from "./Qi";
import { GuideFilm, guideFrames } from "./Guide";
import GD from "./guide-data.json";
export const QRoot: React.FC = () => (
  <>
    <Composition id="QD-H" component={QdH} durationInFrames={QD_TOTAL.H} fps={30} width={1920} height={1080} />
    <Composition id="QD-F" component={QdF} durationInFrames={QD_TOTAL.F} fps={30} width={1080} height={1350} />
    <Composition id="QD-R" component={QdR} durationInFrames={QD_TOTAL.R} fps={30} width={1080} height={1920} />
    <Composition id="QT-H" component={QtH} durationInFrames={QT_TOTAL.H} fps={30} width={1920} height={1080} />
    <Composition id="QT-F" component={QtF} durationInFrames={QT_TOTAL.F} fps={30} width={1080} height={1350} />
    <Composition id="QT-R" component={QtR} durationInFrames={QT_TOTAL.R} fps={30} width={1080} height={1920} />
    <Composition id="QI-H" component={QiH} durationInFrames={QI_TOTAL.H} fps={30} width={1920} height={1080} />
    <Composition id="QI-F" component={QiF} durationInFrames={QI_TOTAL.F} fps={30} width={1080} height={1350} />
    <Composition id="QI-R" component={QiR} durationInFrames={QI_TOTAL.R} fps={30} width={1080} height={1920} />
    {Object.keys(GD).map((id) => <Composition key={id} id={"QG-" + id} component={GuideFilm} defaultProps={{ id }} durationInFrames={guideFrames(id)} fps={30} width={1920} height={1080} />)}
  </>
);
