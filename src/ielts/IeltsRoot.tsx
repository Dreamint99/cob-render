import React from "react";
import { Composition } from "remotion";
import { IeltsVideo, ieltsLen, Spec } from "./IeltsEngine";
import { IeltsPromo, promoLen } from "./IeltsPromo";
import PROMO from "./promo.json";
// SPECS-START (rewritten by scripts/ielts_make.py)
import S_academic_vocabulary from "./specs/academic-vocabulary.json";
import S_articles_a_an_the from "./specs/articles-a-an-the.json";
import S_band_score_explained from "./specs/band-score-explained.json";
import S_booking_bangladesh from "./specs/booking-bangladesh.json";
import S_completion_tasks from "./specs/completion-tasks.json";
import S_complex_sentences from "./specs/complex-sentences.json";
import S_computer_vs_paper_test_day from "./specs/computer-vs-paper-test-day.json";
import S_gt_reading_sections from "./specs/gt-reading-sections.json";
import S_ielts_what_academic_gt from "./specs/ielts-what-academic-gt.json";
import S_letter_complaint_request from "./specs/letter-complaint-request.json";
import S_letter_types_tone from "./specs/letter-types-tone.json";
import S_listening_accents from "./specs/listening-accents.json";
import S_listening_distractors from "./specs/listening-distractors.json";
import S_listening_format from "./specs/listening-format.json";
import S_listening_maps from "./specs/listening-maps.json";
import S_listening_mcq from "./specs/listening-mcq.json";
import S_listening_part1_form from "./specs/listening-part1-form.json";
import S_listening_part3 from "./specs/listening-part3.json";
import S_listening_part4 from "./specs/listening-part4.json";
import S_matching_headings from "./specs/matching-headings.json";
import S_matching_information from "./specs/matching-information.json";
import S_mock_how_to from "./specs/mock-how-to.json";
import S_paraphrase_key from "./specs/paraphrase-key.json";
import S_pronunciation_sounds from "./specs/pronunciation-sounds.json";
import S_reading_format from "./specs/reading-format.json";
import S_skimming_scanning from "./specs/skimming-scanning.json";
import S_speaking_confidence from "./specs/speaking-confidence.json";
import S_speaking_format from "./specs/speaking-format.json";
import S_speaking_part1 from "./specs/speaking-part1.json";
import S_speaking_part2 from "./specs/speaking-part2.json";
import S_speaking_part3 from "./specs/speaking-part3.json";
import S_task1_bar_table from "./specs/task1-bar-table.json";
import S_task1_line_graph from "./specs/task1-line-graph.json";
import S_task1_overview from "./specs/task1-overview.json";
import S_task1_pie_mixed from "./specs/task1-pie-mixed.json";
import S_task1_process from "./specs/task1-process.json";
import S_task2_band_criteria from "./specs/task2-band-criteria.json";
import S_task2_band6_vs_band8 from "./specs/task2-band6-vs-band8.json";
import S_task2_body_paragraph from "./specs/task2-body-paragraph.json";
import S_task2_cohesion from "./specs/task2-cohesion.json";
import S_task2_lexical from "./specs/task2-lexical.json";
import S_task2_planning from "./specs/task2-planning.json";
import S_task2_question_types from "./specs/task2-question-types.json";
import S_tense_perfect_vs_past from "./specs/tense-perfect-vs-past.json";
import S_tfng from "./specs/tfng.json";
import S_ynng from "./specs/ynng.json";
import S_your_study_plan from "./specs/your-study-plan.json";
const SPECS: Spec[] = [S_academic_vocabulary, S_articles_a_an_the, S_band_score_explained, S_booking_bangladesh, S_completion_tasks, S_complex_sentences, S_computer_vs_paper_test_day, S_gt_reading_sections, S_ielts_what_academic_gt, S_letter_complaint_request, S_letter_types_tone, S_listening_accents, S_listening_distractors, S_listening_format, S_listening_maps, S_listening_mcq, S_listening_part1_form, S_listening_part3, S_listening_part4, S_matching_headings, S_matching_information, S_mock_how_to, S_paraphrase_key, S_pronunciation_sounds, S_reading_format, S_skimming_scanning, S_speaking_confidence, S_speaking_format, S_speaking_part1, S_speaking_part2, S_speaking_part3, S_task1_bar_table, S_task1_line_graph, S_task1_overview, S_task1_pie_mixed, S_task1_process, S_task2_band_criteria, S_task2_band6_vs_band8, S_task2_body_paragraph, S_task2_cohesion, S_task2_lexical, S_task2_planning, S_task2_question_types, S_tense_perfect_vs_past, S_tfng, S_ynng, S_your_study_plan] as any;
// SPECS-END

export const IeltsRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Ielts-${s.id}`} component={IeltsVideo as any} durationInFrames={ieltsLen(s)} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
    <Composition id="IeltsPromo" component={IeltsPromo as any} durationInFrames={promoLen(PROMO as any)} fps={30} width={1920} height={1080} defaultProps={{ spec: PROMO as any }} />
  </>
);
