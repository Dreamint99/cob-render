import React from "react";
import { Composition } from "remotion";
import { MarriageVideo, marLen, Spec } from "./MarriageEngine";
// SPECS-START (rewritten by scripts/marriage_make.py)
import S_mar_abuse_safety from "./specs/mar-abuse-safety.json";
import S_mar_anxiety_depression from "./specs/mar-anxiety-depression.json";
import S_mar_appreciation from "./specs/mar-appreciation.json";
import S_mar_baby_arrives from "./specs/mar-baby-arrives.json";
import S_mar_beat_boredom from "./specs/mar-beat-boredom.json";
import S_mar_bids_for_connection from "./specs/mar-bids-for-connection.json";
import S_mar_body_basics from "./specs/mar-body-basics.json";
import S_mar_boundaries from "./specs/mar-boundaries.json";
import S_mar_breaking_silence from "./specs/mar-breaking-silence.json";
import S_mar_broken_trust from "./specs/mar-broken-trust.json";
import S_mar_budget_together from "./specs/mar-budget-together.json";
import S_mar_calm_anger from "./specs/mar-calm-anger.json";
import S_mar_check_m1 from "./specs/mar-check-m1.json";
import S_mar_check_m10 from "./specs/mar-check-m10.json";
import S_mar_check_m11 from "./specs/mar-check-m11.json";
import S_mar_check_m2 from "./specs/mar-check-m2.json";
import S_mar_check_m3 from "./specs/mar-check-m3.json";
import S_mar_check_m4 from "./specs/mar-check-m4.json";
import S_mar_check_m5 from "./specs/mar-check-m5.json";
import S_mar_check_m6 from "./specs/mar-check-m6.json";
import S_mar_check_m7 from "./specs/mar-check-m7.json";
import S_mar_check_m8 from "./specs/mar-check-m8.json";
import S_mar_check_m9 from "./specs/mar-check-m9.json";
import S_mar_common_problems_men from "./specs/mar-common-problems-men.json";
import S_mar_common_problems_women from "./specs/mar-common-problems-women.json";
import S_mar_compromise from "./specs/mar-compromise.json";
import S_mar_desire_mismatch from "./specs/mar-desire-mismatch.json";
import S_mar_distance from "./specs/mar-distance.json";
import S_mar_dreams_fears from "./specs/mar-dreams-fears.json";
import S_mar_emotional_bank from "./specs/mar-emotional-bank.json";
import S_mar_expectation_reality from "./specs/mar-expectation-reality.json";
import S_mar_family_backgrounds from "./specs/mar-family-backgrounds.json";
import S_mar_family_planning from "./specs/mar-family-planning.json";
import S_mar_first_night from "./specs/mar-first-night.json";
import S_mar_forgiveness from "./specs/mar-forgiveness.json";
import S_mar_four_enemies from "./specs/mar-four-enemies.json";
import S_mar_how_to_take_course from "./specs/mar-how-to-take-course.json";
import S_mar_hygiene from "./specs/mar-hygiene.json";
import S_mar_i_statements from "./specs/mar-i-statements.json";
import S_mar_in_laws_balance from "./specs/mar-in-laws-balance.json";
import S_mar_infertility from "./specs/mar-infertility.json";
import S_mar_intimacy_talk from "./specs/mar-intimacy-talk.json";
import S_mar_jealousy_trust from "./specs/mar-jealousy-trust.json";
import S_mar_joint_family from "./specs/mar-joint-family.json";
import S_mar_listening from "./specs/mar-listening.json";
import S_mar_love_languages from "./specs/mar-love-languages.json";
import S_mar_love_maps from "./specs/mar-love-maps.json";
import S_mar_money_fights from "./specs/mar-money-fights.json";
import S_mar_money_talk from "./specs/mar-money-talk.json";
import S_mar_myths_men_women from "./specs/mar-myths-men-women.json";
import S_mar_our_roadmap from "./specs/mar-our-roadmap.json";
import S_mar_parenting_team from "./specs/mar-parenting-team.json";
import S_mar_phone_and_screen from "./specs/mar-phone-and-screen.json";
import S_mar_pleasing_each_other from "./specs/mar-pleasing-each-other.json";
import S_mar_professional_help from "./specs/mar-professional-help.json";
import S_mar_promo from "./specs/mar-promo.json";
import S_mar_protect_commitment from "./specs/mar-protect-commitment.json";
import S_mar_quack_warning from "./specs/mar-quack-warning.json";
import S_mar_repair_apology from "./specs/mar-repair-apology.json";
import S_mar_self_care from "./specs/mar-self-care.json";
import S_mar_share_housework from "./specs/mar-share-housework.json";
import S_mar_shared_meaning from "./specs/mar-shared-meaning.json";
import S_mar_small_moments from "./specs/mar-small-moments.json";
import S_mar_solvable_perpetual from "./specs/mar-solvable-perpetual.json";
import S_mar_stress_together from "./specs/mar-stress-together.json";
import S_mar_time_together from "./specs/mar-time-together.json";
import S_mar_touch_affection from "./specs/mar-touch-affection.json";
import S_mar_trust_vulnerability from "./specs/mar-trust-vulnerability.json";
import S_mar_weekly_meeting from "./specs/mar-weekly-meeting.json";
import S_mar_when_counseling from "./specs/mar-when-counseling.json";
import S_mar_why_marriages_break from "./specs/mar-why-marriages-break.json";
const SPECS: Spec[] = [S_mar_abuse_safety, S_mar_anxiety_depression, S_mar_appreciation, S_mar_baby_arrives, S_mar_beat_boredom, S_mar_bids_for_connection, S_mar_body_basics, S_mar_boundaries, S_mar_breaking_silence, S_mar_broken_trust, S_mar_budget_together, S_mar_calm_anger, S_mar_check_m1, S_mar_check_m10, S_mar_check_m11, S_mar_check_m2, S_mar_check_m3, S_mar_check_m4, S_mar_check_m5, S_mar_check_m6, S_mar_check_m7, S_mar_check_m8, S_mar_check_m9, S_mar_common_problems_men, S_mar_common_problems_women, S_mar_compromise, S_mar_desire_mismatch, S_mar_distance, S_mar_dreams_fears, S_mar_emotional_bank, S_mar_expectation_reality, S_mar_family_backgrounds, S_mar_family_planning, S_mar_first_night, S_mar_forgiveness, S_mar_four_enemies, S_mar_how_to_take_course, S_mar_hygiene, S_mar_i_statements, S_mar_in_laws_balance, S_mar_infertility, S_mar_intimacy_talk, S_mar_jealousy_trust, S_mar_joint_family, S_mar_listening, S_mar_love_languages, S_mar_love_maps, S_mar_money_fights, S_mar_money_talk, S_mar_myths_men_women, S_mar_our_roadmap, S_mar_parenting_team, S_mar_phone_and_screen, S_mar_pleasing_each_other, S_mar_professional_help, S_mar_promo, S_mar_protect_commitment, S_mar_quack_warning, S_mar_repair_apology, S_mar_self_care, S_mar_share_housework, S_mar_shared_meaning, S_mar_small_moments, S_mar_solvable_perpetual, S_mar_stress_together, S_mar_time_together, S_mar_touch_affection, S_mar_trust_vulnerability, S_mar_weekly_meeting, S_mar_when_counseling, S_mar_why_marriages_break] as any;
// SPECS-END
export const MarriageRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`MAR-${s.id}`} component={MarriageVideo as any} durationInFrames={Math.max(60, marLen(s))} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
