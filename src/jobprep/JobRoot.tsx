import React from "react";
import { Composition } from "remotion";
import { JobVideo, jobLen, Spec } from "./JobEngine";
// SPECS-START (rewritten by scripts/jobprep_make.py)
import S_gj_001 from "./specs/gj-001.json";
import S_gj_002 from "./specs/gj-002.json";
import S_gj_003 from "./specs/gj-003.json";
import S_gj_004 from "./specs/gj-004.json";
import S_gj_005 from "./specs/gj-005.json";
import S_gj_006 from "./specs/gj-006.json";
import S_gj_007 from "./specs/gj-007.json";
import S_gj_008 from "./specs/gj-008.json";
import S_jp_math_pct_1 from "./specs/jp-math-pct-1.json";
const SPECS: Spec[] = [S_gj_001, S_gj_002, S_gj_003, S_gj_004, S_gj_005, S_gj_006, S_gj_007, S_gj_008, S_jp_math_pct_1] as any;
// SPECS-END
export const JobRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Job-${s.id}`} component={JobVideo as any} durationInFrames={Math.max(60, jobLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
