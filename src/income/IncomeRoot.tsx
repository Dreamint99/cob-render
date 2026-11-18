import React from "react";
import { Composition } from "remotion";
import { IncomeVideo, incLen, Spec } from "./IncomeEngine";
// SPECS-START (rewritten by scripts/income_make.py)
import S_inc_90_day_plan from "./specs/inc-90-day-plan.json";
import S_inc_account_safety from "./specs/inc-account-safety.json";
import S_inc_adobe_stock_ai from "./specs/inc-adobe-stock-ai.json";
import S_inc_affiliate_channels from "./specs/inc-affiliate-channels.json";
import S_inc_affiliate_how from "./specs/inc-affiliate-how.json";
import S_inc_affiliate_reality from "./specs/inc-affiliate-reality.json";
import S_inc_ai_assistants from "./specs/inc-ai-assistants.json";
import S_inc_ai_client_english from "./specs/inc-ai-client-english.json";
import S_inc_ai_data_work from "./specs/inc-ai-data-work.json";
import S_inc_ai_designs from "./specs/inc-ai-designs.json";
import S_inc_ai_media_tools from "./specs/inc-ai-media-tools.json";
import S_inc_ai_services_demand from "./specs/inc-ai-services-demand.json";
import S_inc_ai_video_workflow from "./specs/inc-ai-video-workflow.json";
import S_inc_automation_reality from "./specs/inc-automation-reality.json";
import S_inc_automation_why from "./specs/inc-automation-why.json";
import S_inc_chatbots from "./specs/inc-chatbots.json";
import S_inc_check_ai_work from "./specs/inc-check-ai-work.json";
import S_inc_client_scams from "./specs/inc-client-scams.json";
import S_inc_content_reality from "./specs/inc-content-reality.json";
import S_inc_content_writing from "./specs/inc-content-writing.json";
import S_inc_cover_keywords from "./specs/inc-cover-keywords.json";
import S_inc_digital_products from "./specs/inc-digital-products.json";
import S_inc_direct_clients from "./specs/inc-direct-clients.json";
import S_inc_disclosure from "./specs/inc-disclosure.json";
import S_inc_faceless_youtube from "./specs/inc-faceless-youtube.json";
import S_inc_first_gig from "./specs/inc-first-gig.json";
import S_inc_first_order from "./specs/inc-first-order.json";
import S_inc_fiverr_account from "./specs/inc-fiverr-account.json";
import S_inc_fiverr_odd_gigs from "./specs/inc-fiverr-odd-gigs.json";
import S_inc_freelancer_id from "./specs/inc-freelancer-id.json";
import S_inc_guest_posting from "./specs/inc-guest-posting.json";
import S_inc_income_map from "./specs/inc-income-map.json";
import S_inc_kdp_ai_rules from "./specs/inc-kdp-ai-rules.json";
import S_inc_kdp_intro from "./specs/inc-kdp-intro.json";
import S_inc_kdp_reality from "./specs/inc-kdp-reality.json";
import S_inc_keywords_upload from "./specs/inc-keywords-upload.json";
import S_inc_local_clients from "./specs/inc-local-clients.json";
import S_inc_low_content from "./specs/inc-low-content.json";
import S_inc_monetization_rules from "./specs/inc-monetization-rules.json";
import S_inc_money_home from "./specs/inc-money-home.json";
import S_inc_multiple_streams from "./specs/inc-multiple-streams.json";
import S_inc_n8n_make from "./specs/inc-n8n-make.json";
import S_inc_niche from "./specs/inc-niche.json";
import S_inc_payoneer_setup from "./specs/inc-payoneer-setup.json";
import S_inc_pod_intro from "./specs/inc-pod-intro.json";
import S_inc_pod_reality from "./specs/inc-pod-reality.json";
import S_inc_portfolio from "./specs/inc-portfolio.json";
import S_inc_product_reality from "./specs/inc-product-reality.json";
import S_inc_promo from "./specs/inc-promo.json";
import S_inc_prompting_for_work from "./specs/inc-prompting-for-work.json";
import S_inc_raise_prices from "./specs/inc-raise-prices.json";
import S_inc_rules_and_ethics from "./specs/inc-rules-and-ethics.json";
import S_inc_selling_platforms from "./specs/inc-selling-platforms.json";
import S_inc_seo_writing from "./specs/inc-seo-writing.json";
import S_inc_shorts_reels from "./specs/inc-shorts-reels.json";
import S_inc_stock_how from "./specs/inc-stock-how.json";
import S_inc_stock_reality from "./specs/inc-stock-reality.json";
import S_inc_tax_records from "./specs/inc-tax-records.json";
import S_inc_templates from "./specs/inc-templates.json";
import S_inc_time_money_reality from "./specs/inc-time-money-reality.json";
import S_inc_trademark_danger from "./specs/inc-trademark-danger.json";
import S_inc_truth_traps from "./specs/inc-truth-traps.json";
import S_inc_upwork_basics from "./specs/inc-upwork-basics.json";
import S_inc_what_sells from "./specs/inc-what-sells.json";
import S_inc_what_you_need from "./specs/inc-what-you-need.json";
import S_inc_writing_reality from "./specs/inc-writing-reality.json";
const SPECS: Spec[] = [S_inc_90_day_plan, S_inc_account_safety, S_inc_adobe_stock_ai, S_inc_affiliate_channels, S_inc_affiliate_how, S_inc_affiliate_reality, S_inc_ai_assistants, S_inc_ai_client_english, S_inc_ai_data_work, S_inc_ai_designs, S_inc_ai_media_tools, S_inc_ai_services_demand, S_inc_ai_video_workflow, S_inc_automation_reality, S_inc_automation_why, S_inc_chatbots, S_inc_check_ai_work, S_inc_client_scams, S_inc_content_reality, S_inc_content_writing, S_inc_cover_keywords, S_inc_digital_products, S_inc_direct_clients, S_inc_disclosure, S_inc_faceless_youtube, S_inc_first_gig, S_inc_first_order, S_inc_fiverr_account, S_inc_fiverr_odd_gigs, S_inc_freelancer_id, S_inc_guest_posting, S_inc_income_map, S_inc_kdp_ai_rules, S_inc_kdp_intro, S_inc_kdp_reality, S_inc_keywords_upload, S_inc_local_clients, S_inc_low_content, S_inc_monetization_rules, S_inc_money_home, S_inc_multiple_streams, S_inc_n8n_make, S_inc_niche, S_inc_payoneer_setup, S_inc_pod_intro, S_inc_pod_reality, S_inc_portfolio, S_inc_product_reality, S_inc_promo, S_inc_prompting_for_work, S_inc_raise_prices, S_inc_rules_and_ethics, S_inc_selling_platforms, S_inc_seo_writing, S_inc_shorts_reels, S_inc_stock_how, S_inc_stock_reality, S_inc_tax_records, S_inc_templates, S_inc_time_money_reality, S_inc_trademark_danger, S_inc_truth_traps, S_inc_upwork_basics, S_inc_what_sells, S_inc_what_you_need, S_inc_writing_reality] as any;
// SPECS-END
export const IncomeRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`INC-${s.id}`} component={IncomeVideo as any} durationInFrames={Math.max(60, incLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
