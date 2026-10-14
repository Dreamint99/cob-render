import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { Caption, ChapterTitle, FilmLook, FlashCut, GlitchCut, LightLeak, LogoBug, PaperNote, Preset, Shot } from "./style";

// fast documentary montage: ~1.3s shots (Voice of Dhaka median)
const SHOTS: { src: string; preset: Preset; len: number; fx?: "flash" | "leak" | "glitch" }[] = [
  { src: "broll/book_pages.mp4", preset: "vod-sepia", len: 40, fx: "flash" },
  { src: "broll/dhaka_rickshaw.mp4", preset: "vod-sepia", len: 38 },
  { src: "broll/office_meeting.mp4", preset: "bw", len: 36, fx: "glitch" },
  { src: "broll/classroom.mp4", preset: "vod-teal", len: 40, fx: "leak" },
  { src: "broll/camera_lens.mp4", preset: "vod-teal", len: 36, fx: "flash" },
];
const INTRO = 75;
const MONTAGE = SHOTS.reduce((a, s) => a + s.len, 0);
const NOTE = 75;
const OUTRO = 70;
export const DEMO_TOTAL = INTRO + MONTAGE + NOTE + OUTRO;

export const StyleDemo = () => {
  let t = INTRO;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <Audio src={staticFile("sfx/bed.mp3")} volume={(f) => interpolate(f, [0, 20, DEMO_TOTAL - 30, DEMO_TOTAL], [0, 0.35, 0.35, 0])} />
      <Sequence from={INTRO - 5}><Audio src={staticFile("vo/demo.mp3")} /></Sequence>

      <Sequence durationInFrames={INTRO}>
        <FilmLook preset="vod-teal"><Shot src="broll/earth_night.mp4" zoom={[1.0, 1.12]} /></FilmLook>
        <ChapterTitle title="BEFORE THE STORY" sub="DHAKA • 1971–2026" />
      </Sequence>

      {SHOTS.map((s, i) => {
        const from = t;
        t += s.len;
        const body = <FilmLook preset={s.preset}><Shot src={s.src} /></FilmLook>;
        return (
          <Sequence key={i} from={from} durationInFrames={s.len}>
            {s.fx === "glitch" ? <GlitchCut>{body}</GlitchCut> : body}
            {s.fx === "flash" && <FlashCut />}
            {s.fx === "leak" && <LightLeak />}
            {s.fx && <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />}
          </Sequence>
        );
      })}

      <Sequence from={INTRO + MONTAGE} durationInFrames={NOTE}>
        <FilmLook preset="vod-sepia"><Shot src="broll/book_pages.mp4" zoom={[1.2, 1.3]} /></FilmLook>
        <PaperNote lines={["কিছু মুহূর্ত বদলে দেয় সবকিছু।", "ইতিহাস মনে রাখে তাদেরই।"]} />
      </Sequence>

      <Sequence from={INTRO + MONTAGE + NOTE} durationInFrames={OUTRO}>
        <FilmLook preset="punchy"><Shot src="broll/earth_night.mp4" zoom={[1.3, 1.5]} /></FilmLook>
        <LightLeak len={25} color="255,30,30" />
        <Caption text="আজ আমরা বলব এমনই এক গল্প" />
        <Audio src={staticFile("sfx/boom.mp3")} volume={0.8} />
      </Sequence>

      <LogoBug text="DREAMIT STUDIO" />
    </AbsoluteFill>
  );
};
