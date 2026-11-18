import React from "react";
import { Composition } from "remotion";
import { BundleFilm, filmLen, Spec } from "./BundleFilm";
import spec from "./spec.json";
export const BundleRoot: React.FC = () => (
  <Composition id="AIU-Bundle-Film" component={BundleFilm as any} durationInFrames={filmLen(spec as Spec)} fps={30} width={1920} height={1080} defaultProps={{ spec: spec as Spec }} />
);
