import React from "react";
import { Composition } from "remotion";
import { DesignVideo, gdLen, Spec } from "./DesignEngine";
// SPECS-START (rewritten by scripts/gdesign_make.py)
import S_gd_alignment_grid from "./specs/gd-alignment-grid.json";
import S_gd_animated_post from "./specs/gd-animated-post.json";
import S_gd_balance from "./specs/gd-balance.json";
import S_gd_bangla_type from "./specs/gd-bangla-type.json";
import S_gd_brand_colors from "./specs/gd-brand-colors.json";
import S_gd_brand_stories from "./specs/gd-brand-stories.json";
import S_gd_brand_system from "./specs/gd-brand-system.json";
import S_gd_brand_value from "./specs/gd-brand-value.json";
import S_gd_bulk_sheet from "./specs/gd-bulk-sheet.json";
import S_gd_canva_ai from "./specs/gd-canva-ai.json";
import S_gd_canva_basics from "./specs/gd-canva-basics.json";
import S_gd_canva_brand_kit from "./specs/gd-canva-brand-kit.json";
import S_gd_canva_bulk from "./specs/gd-canva-bulk.json";
import S_gd_canva_resize from "./specs/gd-canva-resize.json";
import S_gd_chatgpt_images from "./specs/gd-chatgpt-images.json";
import S_gd_color_mistakes from "./specs/gd-color-mistakes.json";
import S_gd_consistent_character from "./specs/gd-consistent-character.json";
import S_gd_contrast from "./specs/gd-contrast.json";
import S_gd_crap_rules from "./specs/gd-crap-rules.json";
import S_gd_design_process from "./specs/gd-design-process.json";
import S_gd_designer_ai_era from "./specs/gd-designer-ai-era.json";
import S_gd_erase_add from "./specs/gd-erase-add.json";
import S_gd_file_formats from "./specs/gd-file-formats.json";
import S_gd_final_project from "./specs/gd-final-project.json";
import S_gd_find_clients from "./specs/gd-find-clients.json";
import S_gd_font_pairing from "./specs/gd-font-pairing.json";
import S_gd_font_types from "./specs/gd-font-types.json";
import S_gd_gemini_images from "./specs/gd-gemini-images.json";
import S_gd_hierarchy from "./specs/gd-hierarchy.json";
import S_gd_image_to_video from "./specs/gd-image-to-video.json";
import S_gd_logo_ai_workflow from "./specs/gd-logo-ai-workflow.json";
import S_gd_logo_animation from "./specs/gd-logo-animation.json";
import S_gd_logo_ideas from "./specs/gd-logo-ideas.json";
import S_gd_logo_package from "./specs/gd-logo-package.json";
import S_gd_logo_types from "./specs/gd-logo-types.json";
import S_gd_logo_vector from "./specs/gd-logo-vector.json";
import S_gd_marketplaces from "./specs/gd-marketplaces.json";
import S_gd_n8n_pipeline from "./specs/gd-n8n-pipeline.json";
import S_gd_palette_tools from "./specs/gd-palette-tools.json";
import S_gd_photo_color_fix from "./specs/gd-photo-color-fix.json";
import S_gd_photo_composition from "./specs/gd-photo-composition.json";
import S_gd_portfolio from "./specs/gd-portfolio.json";
import S_gd_print_basics from "./specs/gd-print-basics.json";
import S_gd_product_photo from "./specs/gd-product-photo.json";
import S_gd_promo from "./specs/gd-promo.json";
import S_gd_prompt_anatomy from "./specs/gd-prompt-anatomy.json";
import S_gd_prompt_library from "./specs/gd-prompt-library.json";
import S_gd_readable_text from "./specs/gd-readable-text.json";
import S_gd_reels_design from "./specs/gd-reels-design.json";
import S_gd_remove_bg from "./specs/gd-remove-bg.json";
import S_gd_screen_vs_print from "./specs/gd-screen-vs-print.json";
import S_gd_sell_templates_stock from "./specs/gd-sell-templates-stock.json";
import S_gd_setup from "./specs/gd-setup.json";
import S_gd_shapes_gestalt from "./specs/gd-shapes-gestalt.json";
import S_gd_social_sizes from "./specs/gd-social-sizes.json";
import S_gd_style_guide from "./specs/gd-style-guide.json";
import S_gd_template_system from "./specs/gd-template-system.json";
import S_gd_text_in_images from "./specs/gd-text-in-images.json";
import S_gd_text_on_image from "./specs/gd-text-on-image.json";
import S_gd_tool_map from "./specs/gd-tool-map.json";
import S_gd_upscale from "./specs/gd-upscale.json";
import S_gd_what_is_brand from "./specs/gd-what-is-brand.json";
import S_gd_what_is_design from "./specs/gd-what-is-design.json";
import S_gd_white_space from "./specs/gd-white-space.json";
import S_gd_youtube_thumbnail from "./specs/gd-youtube-thumbnail.json";
const SPECS: Spec[] = [S_gd_alignment_grid, S_gd_animated_post, S_gd_balance, S_gd_bangla_type, S_gd_brand_colors, S_gd_brand_stories, S_gd_brand_system, S_gd_brand_value, S_gd_bulk_sheet, S_gd_canva_ai, S_gd_canva_basics, S_gd_canva_brand_kit, S_gd_canva_bulk, S_gd_canva_resize, S_gd_chatgpt_images, S_gd_color_mistakes, S_gd_consistent_character, S_gd_contrast, S_gd_crap_rules, S_gd_design_process, S_gd_designer_ai_era, S_gd_erase_add, S_gd_file_formats, S_gd_final_project, S_gd_find_clients, S_gd_font_pairing, S_gd_font_types, S_gd_gemini_images, S_gd_hierarchy, S_gd_image_to_video, S_gd_logo_ai_workflow, S_gd_logo_animation, S_gd_logo_ideas, S_gd_logo_package, S_gd_logo_types, S_gd_logo_vector, S_gd_marketplaces, S_gd_n8n_pipeline, S_gd_palette_tools, S_gd_photo_color_fix, S_gd_photo_composition, S_gd_portfolio, S_gd_print_basics, S_gd_product_photo, S_gd_promo, S_gd_prompt_anatomy, S_gd_prompt_library, S_gd_readable_text, S_gd_reels_design, S_gd_remove_bg, S_gd_screen_vs_print, S_gd_sell_templates_stock, S_gd_setup, S_gd_shapes_gestalt, S_gd_social_sizes, S_gd_style_guide, S_gd_template_system, S_gd_text_in_images, S_gd_text_on_image, S_gd_tool_map, S_gd_upscale, S_gd_what_is_brand, S_gd_what_is_design, S_gd_white_space, S_gd_youtube_thumbnail] as any;
// SPECS-END
export const DesignRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`GD-${s.id}`} component={DesignVideo as any} durationInFrames={Math.max(60, gdLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
