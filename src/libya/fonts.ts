import { continueRender, delayRender, staticFile } from "remotion";
if (typeof document !== "undefined") {
  const h = delayRender("libya fonts");
  Promise.all([
    ["Anek Bangla", "AnekBangla-800.ttf", "800"], ["Anek Bangla", "AnekBangla-600.ttf", "600"], ["Anek Bangla", "AnekBangla-500.ttf", "500"],
    ["Hind Siliguri", "HindSiliguri-SemiBold.ttf", "600"], ["Hind Siliguri", "HindSiliguri-Bold.ttf", "700"],
    ["Tiro Bangla", "TiroBangla-Regular.ttf", "400"], ["Montserrat", "Montserrat.ttf", "100 900"], ["Bebas Neue", "BebasNeue-Regular.ttf", "400"],
  ].map(([n, f, w]) => {
    const ff = new FontFace(n, `url(${staticFile("fonts/" + f)})`, { weight: w });
    return ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  })).then(() => continueRender(h));
}
export {};
