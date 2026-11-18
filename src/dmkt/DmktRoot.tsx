import React from "react";
import { Composition } from "remotion";
import { DmktVideo, dmLen, Spec } from "./DmktEngine";
// SPECS-START (rewritten by scripts/dmkt_make.py)
import S_dm_ab_testing from "./specs/dm-ab-testing.json";
import S_dm_ai_content from "./specs/dm-ai-content.json";
import S_dm_ai_visibility from "./specs/dm-ai-visibility.json";
import S_dm_andromeda_creative from "./specs/dm-andromeda-creative.json";
import S_dm_attribution from "./specs/dm-attribution.json";
import S_dm_bd_market from "./specs/dm-bd-market.json";
import S_dm_brand from "./specs/dm-brand.json";
import S_dm_competitor_research from "./specs/dm-competitor-research.json";
import S_dm_consent_privacy from "./specs/dm-consent-privacy.json";
import S_dm_consumer_behaviour from "./specs/dm-consumer-behaviour.json";
import S_dm_content_strategy from "./specs/dm-content-strategy.json";
import S_dm_copywriting from "./specs/dm-copywriting.json";
import S_dm_creative_testing from "./specs/dm-creative-testing.json";
import S_dm_cro from "./specs/dm-cro.json";
import S_dm_ecommerce_events from "./specs/dm-ecommerce-events.json";
import S_dm_funnel_journey from "./specs/dm-funnel-journey.json";
import S_dm_ga4_setup from "./specs/dm-ga4-setup.json";
import S_dm_google_ads_setup from "./specs/dm-google-ads-setup.json";
import S_dm_google_optimise from "./specs/dm-google-optimise.json";
import S_dm_gtm from "./specs/dm-gtm.json";
import S_dm_how_search_works from "./specs/dm-how-search-works.json";
import S_dm_keywords from "./specs/dm-keywords.json";
import S_dm_landing_page from "./specs/dm-landing-page.json";
import S_dm_links_authority from "./specs/dm-links-authority.json";
import S_dm_local_seo from "./specs/dm-local-seo.json";
import S_dm_market_research from "./specs/dm-market-research.json";
import S_dm_marketing_foundations from "./specs/dm-marketing-foundations.json";
import S_dm_marketing_plan from "./specs/dm-marketing-plan.json";
import S_dm_meta_leads_messages from "./specs/dm-meta-leads-messages.json";
import S_dm_meta_scale_policy from "./specs/dm-meta-scale-policy.json";
import S_dm_meta_setup from "./specs/dm-meta-setup.json";
import S_dm_meta_structure from "./specs/dm-meta-structure.json";
import S_dm_nocode_store from "./specs/dm-nocode-store.json";
import S_dm_offer from "./specs/dm-offer.json";
import S_dm_offline_chat_sales from "./specs/dm-offline-chat-sales.json";
import S_dm_onpage_technical from "./specs/dm-onpage-technical.json";
import S_dm_organic_social from "./specs/dm-organic-social.json";
import S_dm_paid_owned_earned from "./specs/dm-paid-owned-earned.json";
import S_dm_persona_ai_research from "./specs/dm-persona-ai-research.json";
import S_dm_pmax from "./specs/dm-pmax.json";
import S_dm_pricing from "./specs/dm-pricing.json";
import S_dm_retargeting_audiences from "./specs/dm-retargeting-audiences.json";
import S_dm_search_aimax from "./specs/dm-search-aimax.json";
import S_dm_server_side from "./specs/dm-server-side.json";
import S_dm_stp from "./specs/dm-stp.json";
import S_dm_tracking_first from "./specs/dm-tracking-first.json";
import S_dm_ugc_creators from "./specs/dm-ugc-creators.json";
import S_dm_unit_economics from "./specs/dm-unit-economics.json";
import S_dm_visual_video from "./specs/dm-visual-video.json";
import S_dm_what_marketer_does from "./specs/dm-what-marketer-does.json";
import S_dm_youtube_channel from "./specs/dm-youtube-channel.json";
import S_dm_youtube_demandgen from "./specs/dm-youtube-demandgen.json";
import S_dmk_claude_meta_mcp from "./specs/dmk-claude-meta-mcp.json";
import S_dmk_pixel_capi from "./specs/dmk-pixel-capi.json";
import S_dmk_promo from "./specs/dmk-promo.json";
const SPECS: Spec[] = [S_dm_ab_testing, S_dm_ai_content, S_dm_ai_visibility, S_dm_andromeda_creative, S_dm_attribution, S_dm_bd_market, S_dm_brand, S_dm_competitor_research, S_dm_consent_privacy, S_dm_consumer_behaviour, S_dm_content_strategy, S_dm_copywriting, S_dm_creative_testing, S_dm_cro, S_dm_ecommerce_events, S_dm_funnel_journey, S_dm_ga4_setup, S_dm_google_ads_setup, S_dm_google_optimise, S_dm_gtm, S_dm_how_search_works, S_dm_keywords, S_dm_landing_page, S_dm_links_authority, S_dm_local_seo, S_dm_market_research, S_dm_marketing_foundations, S_dm_marketing_plan, S_dm_meta_leads_messages, S_dm_meta_scale_policy, S_dm_meta_setup, S_dm_meta_structure, S_dm_nocode_store, S_dm_offer, S_dm_offline_chat_sales, S_dm_onpage_technical, S_dm_organic_social, S_dm_paid_owned_earned, S_dm_persona_ai_research, S_dm_pmax, S_dm_pricing, S_dm_retargeting_audiences, S_dm_search_aimax, S_dm_server_side, S_dm_stp, S_dm_tracking_first, S_dm_ugc_creators, S_dm_unit_economics, S_dm_visual_video, S_dm_what_marketer_does, S_dm_youtube_channel, S_dm_youtube_demandgen, S_dmk_claude_meta_mcp, S_dmk_pixel_capi, S_dmk_promo] as any;
// SPECS-END
export const DmktRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`DMK-${s.id}`} component={DmktVideo as any} durationInFrames={Math.max(60, dmLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
