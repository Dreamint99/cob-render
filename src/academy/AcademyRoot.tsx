import React from "react";
import { Composition } from "remotion";
import { MathVideo, mathLen, Spec } from "./MathEngine";
// SPECS-START (rewritten by scripts/academy_make.py)
import S_ssc_math_sq_1 from "./specs/ssc-math-sq-1.json";
import S_ssc_math_sq_2 from "./specs/ssc-math-sq-2.json";
import S_ssc_math_sq_3 from "./specs/ssc-math-sq-3.json";
import S_ssc_math_sq_4 from "./specs/ssc-math-sq-4.json";
const SPECS: Spec[] = [S_ssc_math_sq_1, S_ssc_math_sq_2, S_ssc_math_sq_3, S_ssc_math_sq_4] as any;
// SPECS-END
export const AcademyRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Acad-${s.id}`} component={MathVideo as any} durationInFrames={Math.max(60, mathLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
