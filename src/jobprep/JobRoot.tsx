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
import S_gj_009 from "./specs/gj-009.json";
import S_gj_010 from "./specs/gj-010.json";
import S_gj_011 from "./specs/gj-011.json";
import S_gj_012 from "./specs/gj-012.json";
import S_gj_013 from "./specs/gj-013.json";
import S_gj_014 from "./specs/gj-014.json";
import S_gj_015 from "./specs/gj-015.json";
import S_gj_016 from "./specs/gj-016.json";
import S_gj_017 from "./specs/gj-017.json";
import S_gj_018 from "./specs/gj-018.json";
import S_gj_019 from "./specs/gj-019.json";
import S_gj_020 from "./specs/gj-020.json";
import S_gj_021 from "./specs/gj-021.json";
import S_gj_022 from "./specs/gj-022.json";
import S_gj_023 from "./specs/gj-023.json";
import S_gj_024 from "./specs/gj-024.json";
import S_gj_025 from "./specs/gj-025.json";
import S_gj_026 from "./specs/gj-026.json";
import S_gj_027 from "./specs/gj-027.json";
import S_gj_028 from "./specs/gj-028.json";
import S_gj_029 from "./specs/gj-029.json";
import S_gj_030 from "./specs/gj-030.json";
import S_gj_031 from "./specs/gj-031.json";
import S_gj_032 from "./specs/gj-032.json";
import S_gj_033 from "./specs/gj-033.json";
import S_gj_034 from "./specs/gj-034.json";
import S_gj_035 from "./specs/gj-035.json";
import S_gj_036 from "./specs/gj-036.json";
import S_gj_037 from "./specs/gj-037.json";
import S_gj_038 from "./specs/gj-038.json";
import S_gj_039 from "./specs/gj-039.json";
import S_gj_040 from "./specs/gj-040.json";
import S_gj_041 from "./specs/gj-041.json";
import S_gj_042 from "./specs/gj-042.json";
import S_gj_043 from "./specs/gj-043.json";
import S_gj_044 from "./specs/gj-044.json";
import S_gj_045 from "./specs/gj-045.json";
import S_gj_046 from "./specs/gj-046.json";
import S_gj_047 from "./specs/gj-047.json";
import S_gj_048 from "./specs/gj-048.json";
import S_jp_math_pct_1 from "./specs/jp-math-pct-1.json";
const SPECS: Spec[] = [S_gj_001, S_gj_002, S_gj_003, S_gj_004, S_gj_005, S_gj_006, S_gj_007, S_gj_008, S_gj_009, S_gj_010, S_gj_011, S_gj_012, S_gj_013, S_gj_014, S_gj_015, S_gj_016, S_gj_017, S_gj_018, S_gj_019, S_gj_020, S_gj_021, S_gj_022, S_gj_023, S_gj_024, S_gj_025, S_gj_026, S_gj_027, S_gj_028, S_gj_029, S_gj_030, S_gj_031, S_gj_032, S_gj_033, S_gj_034, S_gj_035, S_gj_036, S_gj_037, S_gj_038, S_gj_039, S_gj_040, S_gj_041, S_gj_042, S_gj_043, S_gj_044, S_gj_045, S_gj_046, S_gj_047, S_gj_048, S_jp_math_pct_1] as any;
// SPECS-END
export const JobRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Job-${s.id}`} component={JobVideo as any} durationInFrames={Math.max(60, jobLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
