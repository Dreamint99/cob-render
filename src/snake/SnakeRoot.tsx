import React from "react";
import { Composition } from "remotion";
import { SnakeVideo, snakeLen, Spec } from "./SnakeEngine";
// SPECS-START (rewritten by scripts/snake_make.py)
import S_calling_rescuers_ethics from "./specs/calling-rescuers-ethics.json";
import S_field_and_flood_safety from "./specs/field-and-flood-safety.json";
import S_forbidden_first_aid_mistakes from "./specs/forbidden-first-aid-mistakes.json";
import S_harmless_rat_keelback from "./specs/harmless-rat-keelback.json";
import S_homestead_rat_control from "./specs/homestead-rat-control.json";
import S_hospital_antivenom_bd from "./specs/hospital-antivenom-bd.json";
import S_never_catch_venomous_snakes from "./specs/never-catch-venomous-snakes.json";
import S_night_and_sleep_safety from "./specs/night-and-sleep-safety.json";
import S_practice_house_encounter from "./specs/practice-house-encounter.json";
import S_practice_lookalike_sorting from "./specs/practice-lookalike-sorting.json";
import S_practice_snakebite_emergency from "./specs/practice-snakebite-emergency.json";
import S_practice_venomous_id from "./specs/practice-venomous-id.json";
import S_recognizing_bite_symptoms from "./specs/recognizing-bite-symptoms.json";
import S_snake_biology_basics from "./specs/snake-biology-basics.json";
import S_snake_diversity_bangladesh from "./specs/snake-diversity-bangladesh.json";
import S_snake_in_house_protocol from "./specs/snake-in-house-protocol.json";
import S_snake_myths_ojha from "./specs/snake-myths-ojha.json";
import S_venomous_cobras_bd from "./specs/venomous-cobras-bd.json";
import S_venomous_kraits_bd from "./specs/venomous-kraits-bd.json";
import S_vipers_and_sea_snakes from "./specs/vipers-and-sea-snakes.json";
import S_who_dghs_first_aid from "./specs/who-dghs-first-aid.json";
import S_why_snakes_matter_law from "./specs/why-snakes-matter-law.json";
import S_wolf_snake_vs_krait from "./specs/wolf-snake-vs-krait.json";
const SPECS: Spec[] = [S_calling_rescuers_ethics, S_field_and_flood_safety, S_forbidden_first_aid_mistakes, S_harmless_rat_keelback, S_homestead_rat_control, S_hospital_antivenom_bd, S_never_catch_venomous_snakes, S_night_and_sleep_safety, S_practice_house_encounter, S_practice_lookalike_sorting, S_practice_snakebite_emergency, S_practice_venomous_id, S_recognizing_bite_symptoms, S_snake_biology_basics, S_snake_diversity_bangladesh, S_snake_in_house_protocol, S_snake_myths_ojha, S_venomous_cobras_bd, S_venomous_kraits_bd, S_vipers_and_sea_snakes, S_who_dghs_first_aid, S_why_snakes_matter_law, S_wolf_snake_vs_krait] as any;
// SPECS-END

export const SnakeRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Snake-${s.id}`} component={SnakeVideo as any} durationInFrames={snakeLen(s)} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
