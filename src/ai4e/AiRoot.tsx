import React from "react";
import { Composition } from "remotion";
import { AiVideo, aiLen, Spec } from "./AiEngine";
// SPECS-START (rewritten by scripts/ai4e_make.py)
import S_ai4e_how_ai_works from "./specs/ai4e-how-ai-works.json";
import S_ai4e_prompt_5_rules from "./specs/ai4e-prompt-5-rules.json";
const SPECS: Spec[] = [S_ai4e_how_ai_works, S_ai4e_prompt_5_rules] as any;
// SPECS-END
export const AiRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`AI4E-${s.id}`} component={AiVideo as any} durationInFrames={Math.max(60, aiLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
