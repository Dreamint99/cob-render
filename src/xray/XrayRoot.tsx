import React from "react";
import { Composition } from "remotion";
import { XrayVideo, xrayLen, Spec } from "./XrayEngine";
// SPECS-START (rewritten by scripts/xray_make.py)
import S_xr_admin_panel from "./specs/xr-admin-panel.json";
import S_xr_agent_plan from "./specs/xr-agent-plan.json";
import S_xr_ai_api from "./specs/xr-ai-api.json";
import S_xr_api_rest from "./specs/xr-api-rest.json";
import S_xr_app_backend from "./specs/xr-app-backend.json";
import S_xr_auth_tokens_api from "./specs/xr-auth-tokens-api.json";
import S_xr_aws_gcp from "./specs/xr-aws-gcp.json";
import S_xr_baas_supabase_firebase from "./specs/xr-baas-supabase-firebase.json";
import S_xr_backup_migration from "./specs/xr-backup-migration.json";
import S_xr_bkash_breakdown from "./specs/xr-bkash-breakdown.json";
import S_xr_bola_idor from "./specs/xr-bola-idor.json";
import S_xr_browser_render from "./specs/xr-browser-render.json";
import S_xr_build_vs_understand from "./specs/xr-build-vs-understand.json";
import S_xr_choose_stack from "./specs/xr-choose-stack.json";
import S_xr_click_journey from "./specs/xr-click-journey.json";
import S_xr_cloudflare_vercel from "./specs/xr-cloudflare-vercel.json";
import S_xr_code_review from "./specs/xr-code-review.json";
import S_xr_components from "./specs/xr-components.json";
import S_xr_cross_platform from "./specs/xr-cross-platform.json";
import S_xr_data_json from "./specs/xr-data-json.json";
import S_xr_db_basics from "./specs/xr-db-basics.json";
import S_xr_db_index_speed from "./specs/xr-db-index-speed.json";
import S_xr_db_relations from "./specs/xr-db-relations.json";
import S_xr_domain_dns from "./specs/xr-domain-dns.json";
import S_xr_email_push from "./specs/xr-email-push.json";
import S_xr_errors_debug from "./specs/xr-errors-debug.json";
import S_xr_final_blueprint from "./specs/xr-final-blueprint.json";
import S_xr_foodpanda_breakdown from "./specs/xr-foodpanda-breakdown.json";
import S_xr_frameworks_map from "./specs/xr-frameworks-map.json";
import S_xr_git from "./specs/xr-git.json";
import S_xr_github_actions_deploy from "./specs/xr-github-actions-deploy.json";
import S_xr_github_basics from "./specs/xr-github-basics.json";
import S_xr_github_collab from "./specs/xr-github-collab.json";
import S_xr_hosting_cdn from "./specs/xr-hosting-cdn.json";
import S_xr_html_css_js from "./specs/xr-html-css-js.json";
import S_xr_https from "./specs/xr-https.json";
import S_xr_input_ratelimit from "./specs/xr-input-ratelimit.json";
import S_xr_js_ts from "./specs/xr-js-ts.json";
import S_xr_languages_map from "./specs/xr-languages-map.json";
import S_xr_library_framework from "./specs/xr-library-framework.json";
import S_xr_login_auth from "./specs/xr-login-auth.json";
import S_xr_logs_bugs from "./specs/xr-logs-bugs.json";
import S_xr_loops_functions from "./specs/xr-loops-functions.json";
import S_xr_monitoring_analytics from "./specs/xr-monitoring-analytics.json";
import S_xr_native_apps from "./specs/xr-native-apps.json";
import S_xr_payment_gateway from "./specs/xr-payment-gateway.json";
import S_xr_promo from "./specs/xr-promo.json";
import S_xr_promo_noprice from "./specs/xr-promo-noprice.json";
import S_xr_python from "./specs/xr-python.json";
import S_xr_railway_render_vps from "./specs/xr-railway-render-vps.json";
import S_xr_real_leaks from "./specs/xr-real-leaks.json";
import S_xr_realtime_graphql from "./specs/xr-realtime-graphql.json";
import S_xr_responsive from "./specs/xr-responsive.json";
import S_xr_rls from "./specs/xr-rls.json";
import S_xr_roles_authorization from "./specs/xr-roles-authorization.json";
import S_xr_scaling_cost from "./specs/xr-scaling-cost.json";
import S_xr_secrets_env from "./specs/xr-secrets-env.json";
import S_xr_security_checklist from "./specs/xr-security-checklist.json";
import S_xr_sql_nosql from "./specs/xr-sql-nosql.json";
import S_xr_static_dynamic from "./specs/xr-static-dynamic.json";
import S_xr_store_publish from "./specs/xr-store-publish.json";
import S_xr_temu_breakdown from "./specs/xr-temu-breakdown.json";
import S_xr_testing from "./specs/xr-testing.json";
import S_xr_uber_breakdown from "./specs/xr-uber-breakdown.json";
import S_xr_variables_conditions from "./specs/xr-variables-conditions.json";
import S_xr_webhooks from "./specs/xr-webhooks.json";
import S_xr_what_backend from "./specs/xr-what-backend.json";
import S_xr_what_is_code from "./specs/xr-what-is-code.json";
import S_xr_what_is_server from "./specs/xr-what-is-server.json";
import S_xr_why_course from "./specs/xr-why-course.json";
import S_xr_youtube_breakdown from "./specs/xr-youtube-breakdown.json";
const SPECS: Spec[] = [S_xr_admin_panel, S_xr_agent_plan, S_xr_ai_api, S_xr_api_rest, S_xr_app_backend, S_xr_auth_tokens_api, S_xr_aws_gcp, S_xr_baas_supabase_firebase, S_xr_backup_migration, S_xr_bkash_breakdown, S_xr_bola_idor, S_xr_browser_render, S_xr_build_vs_understand, S_xr_choose_stack, S_xr_click_journey, S_xr_cloudflare_vercel, S_xr_code_review, S_xr_components, S_xr_cross_platform, S_xr_data_json, S_xr_db_basics, S_xr_db_index_speed, S_xr_db_relations, S_xr_domain_dns, S_xr_email_push, S_xr_errors_debug, S_xr_final_blueprint, S_xr_foodpanda_breakdown, S_xr_frameworks_map, S_xr_git, S_xr_github_actions_deploy, S_xr_github_basics, S_xr_github_collab, S_xr_hosting_cdn, S_xr_html_css_js, S_xr_https, S_xr_input_ratelimit, S_xr_js_ts, S_xr_languages_map, S_xr_library_framework, S_xr_login_auth, S_xr_logs_bugs, S_xr_loops_functions, S_xr_monitoring_analytics, S_xr_native_apps, S_xr_payment_gateway, S_xr_promo, S_xr_promo_noprice, S_xr_python, S_xr_railway_render_vps, S_xr_real_leaks, S_xr_realtime_graphql, S_xr_responsive, S_xr_rls, S_xr_roles_authorization, S_xr_scaling_cost, S_xr_secrets_env, S_xr_security_checklist, S_xr_sql_nosql, S_xr_static_dynamic, S_xr_store_publish, S_xr_temu_breakdown, S_xr_testing, S_xr_uber_breakdown, S_xr_variables_conditions, S_xr_webhooks, S_xr_what_backend, S_xr_what_is_code, S_xr_what_is_server, S_xr_why_course, S_xr_youtube_breakdown] as any;
// SPECS-END
export const XrayRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Xray-${s.id}`} component={XrayVideo as any} durationInFrames={Math.max(60, xrayLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
