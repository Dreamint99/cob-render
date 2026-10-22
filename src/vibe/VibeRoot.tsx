import React from "react";
import { Composition } from "remotion";
import { VibeVideo, vibeLen, Spec } from "./VibeEngine";
// SPECS-START (rewritten by scripts/vibe_make.py)
import S_app_apk_playstore from "./specs/app-apk-playstore.json";
import S_app_build_steps from "./specs/app-build-steps.json";
import S_app_setup from "./specs/app-setup.json";
import S_app_technology from "./specs/app-technology.json";
import S_builder_platforms from "./specs/builder-platforms.json";
import S_capstone from "./specs/capstone.json";
import S_coding_agents from "./specs/coding-agents.json";
import S_domain_hosting_server from "./specs/domain-hosting-server.json";
import S_frameworks_libraries from "./specs/frameworks-libraries.json";
import S_frontend_backend from "./specs/frontend-backend.json";
import S_git_github from "./specs/git-github.json";
import S_human_role from "./specs/human-role.json";
import S_master_prompt from "./specs/master-prompt.json";
import S_mistakes_costs from "./specs/mistakes-costs.json";
import S_page_anatomy from "./specs/page-anatomy.json";
import S_programming_languages from "./specs/programming-languages.json";
import S_prompt_engineering from "./specs/prompt-engineering.json";
import S_web_backend from "./specs/web-backend.json";
import S_web_first_version from "./specs/web-first-version.json";
import S_web_launch_audit from "./specs/web-launch-audit.json";
import S_web_security from "./specs/web-security.json";
import S_web_seo from "./specs/web-seo.json";
import S_what_is_vibe_coding from "./specs/what-is-vibe-coding.json";
const SPECS: Spec[] = [S_app_apk_playstore, S_app_build_steps, S_app_setup, S_app_technology, S_builder_platforms, S_capstone, S_coding_agents, S_domain_hosting_server, S_frameworks_libraries, S_frontend_backend, S_git_github, S_human_role, S_master_prompt, S_mistakes_costs, S_page_anatomy, S_programming_languages, S_prompt_engineering, S_web_backend, S_web_first_version, S_web_launch_audit, S_web_security, S_web_seo, S_what_is_vibe_coding] as any;
// SPECS-END

export const VibeRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Vibe-${s.id}`} component={VibeVideo as any} durationInFrames={vibeLen(s)} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
