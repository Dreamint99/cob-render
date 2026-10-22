import React from "react";
import { Composition } from "remotion";
import { KidsVideo } from "./KidsEngine";
import { KidsPromo } from "./KidsPromo";
import { SPECS } from "./specs";
import PROMO from "./promo.timed.json";

export const KidsRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Kids-${s.id}`} component={KidsVideo as any} durationInFrames={s.total} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
    {/* মার্কেটিং প্রোমো: খাড়া (Reels/বুস্ট) আর আড়াআড়ি */}
    <Composition id="Kids-Promo" component={KidsPromo as any} durationInFrames={(PROMO as any).total} fps={30} width={1080} height={1920} defaultProps={{ spec: PROMO as any }} />
    <Composition id="Kids-Promo-H" component={KidsPromo as any} durationInFrames={(PROMO as any).total} fps={30} width={1920} height={1080} defaultProps={{ spec: PROMO as any }} />
  </>
);
