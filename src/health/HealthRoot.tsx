import React from "react";
import { Composition } from "remotion";
import { HealthVideo, healthLen, Spec } from "./HealthEngine";
// SPECS-START (rewritten by scripts/health_make.py)
import S_antibiotics_steroids_amr from "./specs/antibiotics-steroids-amr.json";
import S_asthma_home_management from "./specs/asthma-home-management.json";
import S_bangladesh_healthcare_pathway from "./specs/bangladesh-healthcare-pathway.json";
import S_bleeding_and_burns from "./specs/bleeding-and-burns.json";
import S_cold_flu_child_pneumonia from "./specs/cold-flu-child-pneumonia.json";
import S_course_safety_scope from "./specs/course-safety-scope.json";
import S_cpr_choking_adults_children from "./specs/cpr-choking-adults-children.json";
import S_diarrhoea_cholera_dehydration from "./specs/diarrhoea-cholera-dehydration.json";
import S_drowning_and_electric_shock from "./specs/drowning-and-electric-shock.json";
import S_epi_vaccination_schedule_bd from "./specs/epi-vaccination-schedule-bd.json";
import S_eye_ear_and_toothache from "./specs/eye-ear-and-toothache.json";
import S_fever_dengue_malaria_typhoid from "./specs/fever-dengue-malaria-typhoid.json";
import S_fractures_head_injury_accidents from "./specs/fractures-head-injury-accidents.json";
import S_gastric_and_worms from "./specs/gastric-and-worms.json";
import S_headache_migraine_backpain from "./specs/headache-migraine-backpain.json";
import S_heart_attack_and_stroke_fast from "./specs/heart-attack-and-stroke-fast.json";
import S_heatstroke_fainting_seizures from "./specs/heatstroke-fainting-seizures.json";
import S_home_first_aid_box from "./specs/home-first-aid-box.json";
import S_hypertension_and_diabetes from "./specs/hypertension-and-diabetes.json";
import S_m1_practice from "./specs/m1-practice.json";
import S_m2_practice from "./specs/m2-practice.json";
import S_m3_practice from "./specs/m3-practice.json";
import S_m4_practice from "./specs/m4-practice.json";
import S_m6_practice from "./specs/m6-practice.json";
import S_m8_practice from "./specs/m8-practice.json";
import S_maternal_health_danger_signs from "./specs/maternal-health-danger-signs.json";
import S_medicine_labels_expiry_fake from "./specs/medicine-labels-expiry-fake.json";
import S_mental_health_basics from "./specs/mental-health-basics.json";
import S_newborn_child_danger_signs from "./specs/newborn-child-danger-signs.json";
import S_poisoning_and_pesticides from "./specs/poisoning-and-pesticides.json";
import S_safe_otc_medicines_doses from "./specs/safe-otc-medicines-doses.json";
import S_skin_scabies_and_allergy from "./specs/skin-scabies-and-allergy.json";
import S_snakebite_and_dog_bite from "./specs/snakebite-and-dog-bite.json";
import S_vital_signs_bp_sugar from "./specs/vital-signs-bp-sugar.json";
import S_vital_signs_temp_pulse_breathing from "./specs/vital-signs-temp-pulse-breathing.json";
const SPECS: Spec[] = [S_antibiotics_steroids_amr, S_asthma_home_management, S_bangladesh_healthcare_pathway, S_bleeding_and_burns, S_cold_flu_child_pneumonia, S_course_safety_scope, S_cpr_choking_adults_children, S_diarrhoea_cholera_dehydration, S_drowning_and_electric_shock, S_epi_vaccination_schedule_bd, S_eye_ear_and_toothache, S_fever_dengue_malaria_typhoid, S_fractures_head_injury_accidents, S_gastric_and_worms, S_headache_migraine_backpain, S_heart_attack_and_stroke_fast, S_heatstroke_fainting_seizures, S_home_first_aid_box, S_hypertension_and_diabetes, S_m1_practice, S_m2_practice, S_m3_practice, S_m4_practice, S_m6_practice, S_m8_practice, S_maternal_health_danger_signs, S_medicine_labels_expiry_fake, S_mental_health_basics, S_newborn_child_danger_signs, S_poisoning_and_pesticides, S_safe_otc_medicines_doses, S_skin_scabies_and_allergy, S_snakebite_and_dog_bite, S_vital_signs_bp_sugar, S_vital_signs_temp_pulse_breathing] as any;
// SPECS-END

export const HealthRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Health-${s.id}`} component={HealthVideo as any} durationInFrames={healthLen(s)} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
