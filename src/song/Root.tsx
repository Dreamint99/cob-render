import React from "react";
import { Composition } from "remotion";
import { SongFilm, Film } from "./SongFilm";
import film from "./film.json";

export const SongRoot: React.FC = () => (
  <Composition id="AIU-Song" component={SongFilm as any} fps={30} width={1920} height={1080}
    durationInFrames={Math.round((film as Film).total * 30)} defaultProps={{ film }} />
);
