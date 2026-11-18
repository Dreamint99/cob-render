import { continueRender, delayRender, staticFile } from "remotion";
if (typeof document !== "undefined") {
  const h = delayRender("mystery fonts");
  Promise.all([["Anek Bangla", "AnekBangla.ttf"], ["Tiro Bangla", "TiroBangla-Regular.ttf"], ["Noto Serif Bengali", "NotoSerifBengali.ttf"], ["Hind Siliguri", "HindSiliguri-SemiBold.ttf"], ["Montserrat", "Montserrat.ttf"], ["Bebas Neue", "BebasNeue-Regular.ttf"], ["STIX", "STIXTwoText.ttf"], ["Galada", "Galada-Regular.ttf"]].map(([n, f]) => {
    const ff = new FontFace(n, `url(${staticFile("fonts/" + f)})`);
    return ff.load().then(() => document.fonts.add(ff)).catch(() => {});
  })).then(() => continueRender(h));
}
export {};
