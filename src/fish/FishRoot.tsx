import React from "react";
import { Composition } from "remotion";
import { FishVideo, fishLen, Spec } from "./FishEngine";
// SPECS-START (rewritten by scripts/fish_make.py)
import S_bfri_homemade_feed_formulas from "./specs/bfri-homemade-feed-formulas.json";
import S_buying_quality_commercial_feed from "./specs/buying-quality-commercial-feed.json";
import S_farm_record_keeping from "./specs/farm-record-keeping.json";
import S_fcr_and_cost_control from "./specs/fcr-and-cost-control.json";
import S_feed_storage_aflatoxin_prevention from "./specs/feed-storage-aflatoxin-prevention.json";
import S_feed_types_floating_vs_sinking from "./specs/feed-types-floating-vs-sinking.json";
import S_feeding_times_and_methods from "./specs/feeding-times-and-methods.json";
import S_fish_feed_act_2010 from "./specs/fish-feed-act-2010.json";
import S_fish_nutrition_basics from "./specs/fish-nutrition-basics.json";
import S_fry_fingerling_nursery_feeding from "./specs/fry-fingerling-nursery-feeding.json";
import S_local_feed_ingredients from "./specs/local-feed-ingredients.json";
import S_natural_food_plankton from "./specs/natural-food-plankton.json";
import S_pond_prep_liming_fertilising from "./specs/pond-prep-liming-fertilising.json";
import S_practice_100kg_feed_formulation from "./specs/practice-100kg-feed-formulation.json";
import S_practice_daily_ration_calculation from "./specs/practice-daily-ration-calculation.json";
import S_practice_fcr_calculation from "./specs/practice-fcr-calculation.json";
import S_practice_feed_bag_and_register from "./specs/practice-feed-bag-and-register.json";
import S_practice_pond_fertilisation_calc from "./specs/practice-pond-fertilisation-calc.json";
import S_practice_species_diet_selection from "./specs/practice-species-diet-selection.json";
import S_protein_needs_by_species from "./specs/protein-needs-by-species.json";
import S_sampling_and_feeding_rate from "./specs/sampling-and-feeding-rate.json";
import S_step_by_step_feed_making from "./specs/step-by-step-feed-making.json";
import S_water_layers_and_feeding_habits from "./specs/water-layers-and-feeding-habits.json";
import S_water_quality_and_overfeeding from "./specs/water-quality-and-overfeeding.json";
const SPECS: Spec[] = [S_bfri_homemade_feed_formulas, S_buying_quality_commercial_feed, S_farm_record_keeping, S_fcr_and_cost_control, S_feed_storage_aflatoxin_prevention, S_feed_types_floating_vs_sinking, S_feeding_times_and_methods, S_fish_feed_act_2010, S_fish_nutrition_basics, S_fry_fingerling_nursery_feeding, S_local_feed_ingredients, S_natural_food_plankton, S_pond_prep_liming_fertilising, S_practice_100kg_feed_formulation, S_practice_daily_ration_calculation, S_practice_fcr_calculation, S_practice_feed_bag_and_register, S_practice_pond_fertilisation_calc, S_practice_species_diet_selection, S_protein_needs_by_species, S_sampling_and_feeding_rate, S_step_by_step_feed_making, S_water_layers_and_feeding_habits, S_water_quality_and_overfeeding] as any;
// SPECS-END

export const FishRoot: React.FC = () => (
  <>
    {SPECS.filter((s) => s.scenes.every((x) => x.frames)).map((s) => (
      <Composition key={s.id} id={`Fish-${s.id}`} component={FishVideo as any} durationInFrames={fishLen(s)} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
