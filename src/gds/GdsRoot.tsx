import React from "react";
import { Composition } from "remotion";
import { GdsVideo, gdsLen, Spec } from "./GdsEngine";
// SPECS-START (rewritten by scripts/gds_make.py)
import S_adm_avoid from "./specs/adm-avoid.json";
import S_agency_types_iata from "./specs/agency-types-iata.json";
import S_airline_codes_alliances from "./specs/airline-codes-alliances.json";
import S_baggage from "./specs/baggage.json";
import S_bsp_settlement from "./specs/bsp-settlement.json";
import S_commission_profit from "./specs/commission-profit.json";
import S_connections_mct from "./specs/connections-mct.json";
import S_contact_tktl_rf_save from "./specs/contact-tktl-rf-save.json";
import S_currency_bsp_rate from "./specs/currency-bsp-rate.json";
import S_customer_service from "./specs/customer-service.json";
import S_cv_interview from "./specs/cv-interview.json";
import S_emd from "./specs/emd.json";
import S_ethics_fraud from "./specs/ethics-fraud.json";
import S_eticket_basics from "./specs/eticket-basics.json";
import S_fare_construction from "./specs/fare-construction.json";
import S_fare_rules from "./specs/fare-rules.json";
import S_full_pnr_task from "./specs/full-pnr-task.json";
import S_geography_areas_time from "./specs/geography-areas-time.json";
import S_hajj_umrah_ticketing from "./specs/hajj-umrah-ticketing.json";
import S_iata_city_airport_codes from "./specs/iata-city-airport-codes.json";
import S_issue_ticket from "./specs/issue-ticket.json";
import S_journey_types_cabins_classes from "./specs/journey-types-cabins-classes.json";
import S_migrant_worker_travel from "./specs/migrant-worker-travel.json";
import S_names_chd_inf from "./specs/names-chd-inf.json";
import S_ndc_direct from "./specs/ndc-direct.json";
import S_ota_law_2026 from "./specs/ota-law-2026.json";
import S_ota_marketing_trust from "./specs/ota-marketing-trust.json";
import S_ota_operations from "./specs/ota-operations.json";
import S_ota_tech_stack from "./specs/ota-tech-stack.json";
import S_passport_visa_transit from "./specs/passport-visa-transit.json";
import S_payments_chargeback_fraud from "./specs/payments-chargeback-fraud.json";
import S_pnr_mandatory_elements from "./specs/pnr-mandatory-elements.json";
import S_pricing_store from "./specs/pricing-store.json";
import S_queues_schedule_change from "./specs/queues-schedule-change.json";
import S_registration_law from "./specs/registration-law.json";
import S_reissue_exchange from "./specs/reissue-exchange.json";
import S_retrieve_modify_split from "./specs/retrieve-modify-split.json";
import S_return_multicity from "./specs/return-multicity.json";
import S_selling_seats from "./specs/selling-seats.json";
import S_sim_first_steps from "./specs/sim-first-steps.json";
import S_sim_mock_tests from "./specs/sim-mock-tests.json";
import S_ssr_osi_docs from "./specs/ssr-osi-docs.json";
import S_status_codes from "./specs/status-codes.json";
import S_taxes_fees from "./specs/taxes-fees.json";
import S_timatic_concept from "./specs/timatic-concept.json";
import S_timetable_vs_availability from "./specs/timetable-vs-availability.json";
import S_travel_industry_careers from "./specs/travel-industry-careers.json";
import S_void_vs_refund from "./specs/void-vs-refund.json";
import S_what_is_gds_ndc from "./specs/what-is-gds-ndc.json";
import S_what_is_ota from "./specs/what-is-ota.json";
import S_written_mock from "./specs/written-mock.json";
const SPECS: Spec[] = [S_adm_avoid, S_agency_types_iata, S_airline_codes_alliances, S_baggage, S_bsp_settlement, S_commission_profit, S_connections_mct, S_contact_tktl_rf_save, S_currency_bsp_rate, S_customer_service, S_cv_interview, S_emd, S_ethics_fraud, S_eticket_basics, S_fare_construction, S_fare_rules, S_full_pnr_task, S_geography_areas_time, S_hajj_umrah_ticketing, S_iata_city_airport_codes, S_issue_ticket, S_journey_types_cabins_classes, S_migrant_worker_travel, S_names_chd_inf, S_ndc_direct, S_ota_law_2026, S_ota_marketing_trust, S_ota_operations, S_ota_tech_stack, S_passport_visa_transit, S_payments_chargeback_fraud, S_pnr_mandatory_elements, S_pricing_store, S_queues_schedule_change, S_registration_law, S_reissue_exchange, S_retrieve_modify_split, S_return_multicity, S_selling_seats, S_sim_first_steps, S_sim_mock_tests, S_ssr_osi_docs, S_status_codes, S_taxes_fees, S_timatic_concept, S_timetable_vs_availability, S_travel_industry_careers, S_void_vs_refund, S_what_is_gds_ndc, S_what_is_ota, S_written_mock] as any;
// SPECS-END

export const GdsRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Gds-${s.id}`} component={GdsVideo as any} durationInFrames={gdsLen(s)} fps={30} width={1920} height={1080} defaultProps={{ spec: s }} />
    ))}
  </>
);
