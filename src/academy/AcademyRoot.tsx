import React from "react";
import { Composition } from "remotion";
import { AcademyVideo, academyLen, Spec } from "./AcademyEngine";
// SPECS-START (rewritten by scripts/academy_make.py)
import S_ssc_chem_mole_1 from "./specs/ssc-chem-mole-1.json";
import S_ssc_chem_mole_2 from "./specs/ssc-chem-mole-2.json";
import S_ssc_chem_mole_3 from "./specs/ssc-chem-mole-3.json";
import S_ssc_chem_mole_4 from "./specs/ssc-chem-mole-4.json";
import S_ssc_chem_mole_5 from "./specs/ssc-chem-mole-5.json";
import S_ssc_math_cu_1 from "./specs/ssc-math-cu-1.json";
import S_ssc_math_cu_2 from "./specs/ssc-math-cu-2.json";
import S_ssc_math_rem_1 from "./specs/ssc-math-rem-1.json";
import S_ssc_math_sq_1 from "./specs/ssc-math-sq-1.json";
import S_ssc_math_sq_2 from "./specs/ssc-math-sq-2.json";
import S_ssc_math_sq_3 from "./specs/ssc-math-sq-3.json";
import S_ssc_math_sq_4 from "./specs/ssc-math-sq-4.json";
import S_ssc_phy_f_1 from "./specs/ssc-phy-f-1.json";
import S_ssc_phy_f_2 from "./specs/ssc-phy-f-2.json";
import S_ssc_phy_f_3 from "./specs/ssc-phy-f-3.json";
import S_ssc_phy_f_4 from "./specs/ssc-phy-f-4.json";
import S_ssc_phy_f_5 from "./specs/ssc-phy-f-5.json";
import S_zz_demo from "./specs/zz-demo.json";
const SPECS: Spec[] = [S_ssc_chem_mole_1, S_ssc_chem_mole_2, S_ssc_chem_mole_3, S_ssc_chem_mole_4, S_ssc_chem_mole_5, S_ssc_math_cu_1, S_ssc_math_cu_2, S_ssc_math_rem_1, S_ssc_math_sq_1, S_ssc_math_sq_2, S_ssc_math_sq_3, S_ssc_math_sq_4, S_ssc_phy_f_1, S_ssc_phy_f_2, S_ssc_phy_f_3, S_ssc_phy_f_4, S_ssc_phy_f_5, S_zz_demo] as any;
// SPECS-END
export const AcademyRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Acad-${s.id}`} component={AcademyVideo as any} durationInFrames={Math.max(60, academyLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
