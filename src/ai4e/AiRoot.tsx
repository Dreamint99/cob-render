import React from "react";
import { Composition } from "remotion";
import { AiVideo, aiLen, Spec } from "./AiEngine";
// SPECS-START (rewritten by scripts/ai4e_make.py)
import S_ai4e_ai_for_business from "./specs/ai4e-ai-for-business.json";
import S_ai4e_ai_for_jobs from "./specs/ai4e-ai-for-jobs.json";
import S_ai4e_ai_for_office from "./specs/ai4e-ai-for-office.json";
import S_ai4e_ai_for_study from "./specs/ai4e-ai-for-study.json";
import S_ai4e_ai_map from "./specs/ai4e-ai-map.json";
import S_ai4e_ai_scams from "./specs/ai4e-ai-scams.json";
import S_ai4e_ai_video_tools from "./specs/ai4e-ai-video-tools.json";
import S_ai4e_ai_voice_subtitles from "./specs/ai4e-ai-voice-subtitles.json";
import S_ai4e_bangla_tokens from "./specs/ai4e-bangla-tokens.json";
import S_ai4e_chatgpt_files from "./specs/ai4e-chatgpt-files.json";
import S_ai4e_chatgpt_images from "./specs/ai4e-chatgpt-images.json";
import S_ai4e_chatgpt_memory_projects from "./specs/ai4e-chatgpt-memory-projects.json";
import S_ai4e_chatgpt_plans from "./specs/ai4e-chatgpt-plans.json";
import S_ai4e_chatgpt_search_research from "./specs/ai4e-chatgpt-search-research.json";
import S_ai4e_chatgpt_voice from "./specs/ai4e-chatgpt-voice.json";
import S_ai4e_chatgpt_work_agent from "./specs/ai4e-chatgpt-work-agent.json";
import S_ai4e_claude from "./specs/ai4e-claude.json";
import S_ai4e_codex from "./specs/ai4e-codex.json";
import S_ai4e_context_window from "./specs/ai4e-context-window.json";
import S_ai4e_deepseek from "./specs/ai4e-deepseek.json";
import S_ai4e_does_ai_keep_data from "./specs/ai4e-does-ai-keep-data.json";
import S_ai4e_examples_and_formats from "./specs/ai4e-examples-and-formats.json";
import S_ai4e_final_project from "./specs/ai4e-final-project.json";
import S_ai4e_first_chat from "./specs/ai4e-first-chat.json";
import S_ai4e_fix_bad_prompts from "./specs/ai4e-fix-bad-prompts.json";
import S_ai4e_gemini_intro from "./specs/ai4e-gemini-intro.json";
import S_ai4e_gemini_live from "./specs/ai4e-gemini-live.json";
import S_ai4e_gemini_notebook from "./specs/ai4e-gemini-notebook.json";
import S_ai4e_gemini_research_canvas from "./specs/ai4e-gemini-research-canvas.json";
import S_ai4e_gems_and_video from "./specs/ai4e-gems-and-video.json";
import S_ai4e_grok from "./specs/ai4e-grok.json";
import S_ai4e_hallucination from "./specs/ai4e-hallucination.json";
import S_ai4e_honest_use from "./specs/ai4e-honest-use.json";
import S_ai4e_how_ai_works from "./specs/ai4e-how-ai-works.json";
import S_ai4e_how_image_ai_works from "./specs/ai4e-how-image-ai-works.json";
import S_ai4e_image_editing from "./specs/ai4e-image-editing.json";
import S_ai4e_image_prompts from "./specs/ai4e-image-prompts.json";
import S_ai4e_manus from "./specs/ai4e-manus.json";
import S_ai4e_nano_banana from "./specs/ai4e-nano-banana.json";
import S_ai4e_never_share from "./specs/ai4e-never-share.json";
import S_ai4e_organise_work from "./specs/ai4e-organise-work.json";
import S_ai4e_parameters_training from "./specs/ai4e-parameters-training.json";
import S_ai4e_perplexity from "./specs/ai4e-perplexity.json";
import S_ai4e_prompt_5_rules from "./specs/ai4e-prompt-5-rules.json";
import S_ai4e_prompt_lab from "./specs/ai4e-prompt-lab.json";
import S_ai4e_prompt_templates from "./specs/ai4e-prompt-templates.json";
import S_ai4e_spot_deepfakes from "./specs/ai4e-spot-deepfakes.json";
import S_ai4e_step_by_step_followup from "./specs/ai4e-step-by-step-followup.json";
import S_ai4e_turn_off_training from "./specs/ai4e-turn-off-training.json";
import S_ai4e_what_is_ai from "./specs/ai4e-what-is-ai.json";
import S_ai4e_which_ai_when from "./specs/ai4e-which-ai-when.json";
const SPECS: Spec[] = [S_ai4e_ai_for_business, S_ai4e_ai_for_jobs, S_ai4e_ai_for_office, S_ai4e_ai_for_study, S_ai4e_ai_map, S_ai4e_ai_scams, S_ai4e_ai_video_tools, S_ai4e_ai_voice_subtitles, S_ai4e_bangla_tokens, S_ai4e_chatgpt_files, S_ai4e_chatgpt_images, S_ai4e_chatgpt_memory_projects, S_ai4e_chatgpt_plans, S_ai4e_chatgpt_search_research, S_ai4e_chatgpt_voice, S_ai4e_chatgpt_work_agent, S_ai4e_claude, S_ai4e_codex, S_ai4e_context_window, S_ai4e_deepseek, S_ai4e_does_ai_keep_data, S_ai4e_examples_and_formats, S_ai4e_final_project, S_ai4e_first_chat, S_ai4e_fix_bad_prompts, S_ai4e_gemini_intro, S_ai4e_gemini_live, S_ai4e_gemini_notebook, S_ai4e_gemini_research_canvas, S_ai4e_gems_and_video, S_ai4e_grok, S_ai4e_hallucination, S_ai4e_honest_use, S_ai4e_how_ai_works, S_ai4e_how_image_ai_works, S_ai4e_image_editing, S_ai4e_image_prompts, S_ai4e_manus, S_ai4e_nano_banana, S_ai4e_never_share, S_ai4e_organise_work, S_ai4e_parameters_training, S_ai4e_perplexity, S_ai4e_prompt_5_rules, S_ai4e_prompt_lab, S_ai4e_prompt_templates, S_ai4e_spot_deepfakes, S_ai4e_step_by_step_followup, S_ai4e_turn_off_training, S_ai4e_what_is_ai, S_ai4e_which_ai_when] as any;
// SPECS-END
export const AiRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`AI4E-${s.id}`} component={AiVideo as any} durationInFrames={Math.max(60, aiLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
