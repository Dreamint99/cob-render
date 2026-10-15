import React from "react";
import { Composition } from "remotion";
import { IeltsVideo, ieltsLen, Spec } from "./IeltsEngine";
import { IeltsPromo, promoLen } from "./IeltsPromo";
import PROMO from "./promo.json";
// SPECS-START (rewritten by scripts/ielts_make.py)
import S_listening_part1_form from "./specs/listening-part1-form.json";
import S_task2_band_criteria from "./specs/task2-band-criteria.json";
const SPECS: Spec[] = [S_listening_part1_form, S_task2_band_criteria] as any;
// SPECS-END

export const IeltsRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Ielts-${s.id}`} component={IeltsVideo as any} durationInFrames={ieltsLen(s)} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
    <Composition id="IeltsPromo" component={IeltsPromo as any} durationInFrames={promoLen(PROMO as any)} fps={30} width={1920} height={1080} defaultProps={{ spec: PROMO as any }} />
  </>
);
