import React from "react";
import { Composition } from "remotion";
import { OfficeVideo, officeLen, Spec } from "./ExcelEngine";
// SPECS-START (rewritten by scripts/office_make.py)
import S_excel_01 from "./specs/excel-01.json";
import S_excel_03 from "./specs/excel-03.json";
import S_word_01 from "./specs/word-01.json";
import S_zz_test from "./specs/zz-test.json";
const SPECS: Spec[] = [S_excel_01, S_excel_03, S_word_01, S_zz_test] as any;
// SPECS-END
export const OfficeRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Office-${s.id}`} component={OfficeVideo as any} durationInFrames={Math.max(60, officeLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
