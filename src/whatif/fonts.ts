import { continueRender, delayRender, staticFile } from "remotion";
if (typeof document !== "undefined") {
  const h = delayRender("whatif fonts");
  Promise.all([
    ["Anek Bangla", "AnekBangla-800.ttf", "800"], ["Anek Bangla", "AnekBangla-600.ttf", "600"],
    ["Hind Siliguri", "HindSiliguri-SemiBold.ttf", "600"], ["Hind Siliguri", "HindSiliguri-Bold.ttf", "700"],
    ["Montserrat", "Montserrat.ttf", "100 900"],
  ].map(([n, f, w]) => {
    const ff = new FontFace(n, `url(${staticFile("fonts/" + f)})`, { weight: w });
    return ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  })).then(() => continueRender(h));
}
export {};
