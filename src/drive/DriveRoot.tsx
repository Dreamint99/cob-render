// Local studio/preview entry: every spec in ./specs becomes a composition "Drive-<id>" (block rewritten by scripts/drive_make.py)
import React from "react";
import { Composition } from "remotion";
import { DriveVideo, driveLen, Spec } from "./DriveEngine";
// SPECS-START (rewritten by scripts/drive_make.py)
import S_accident_protocol_999_and_insurance from "./specs/accident-protocol-999-and-insurance.json";
import S_basic_car_maintenance_and_documents from "./specs/basic-car-maintenance-and-documents.json";
import S_brta_learner_licence_process from "./specs/brta-learner-licence-process.json";
import S_brta_smart_licence_exam_guide from "./specs/brta-smart-licence-exam-guide.json";
import S_brta_traffic_signs from "./specs/brta-traffic-signs.json";
import S_defensive_driving_mixed_traffic from "./specs/defensive-driving-mixed-traffic.json";
import S_handling_emergencies_brake_tyre from "./specs/handling-emergencies-brake-tyre.json";
import S_highway_driving_rules from "./specs/highway-driving-rules.json";
import S_lane_discipline_and_overtaking from "./specs/lane-discipline-and-overtaking.json";
import S_lht_and_road_transport_act_2018 from "./specs/lht-and-road-transport-act-2018.json";
import S_manual_and_automatic_gearbox from "./specs/manual-and-automatic-gearbox.json";
import S_navigating_roundabouts from "./specs/navigating-roundabouts.json";
import S_night_driving_and_headlight_use from "./specs/night-driving-and-headlight-use.json";
import S_parking_parallel_reverse_garage from "./specs/parking-parallel-reverse-garage.json";
import S_pre_drive_checks_powdery_dsssm from "./specs/pre-drive-checks-powdery-dsssm.json";
import S_rain_waterlogging_and_winter_fog from "./specs/rain-waterlogging-and-winter-fog.json";
import S_rhd_cockpit_steering_and_pedals from "./specs/rhd-cockpit-steering-and-pedals.json";
import S_road_markings_and_speed_limits from "./specs/road-markings-and-speed-limits.json";
import S_sim_cockpit_and_controls from "./specs/sim-cockpit-and-controls.json";
import S_sim_defensive_and_adverse_weather from "./specs/sim-defensive-and-adverse-weather.json";
import S_sim_moving_off_stopping_turning from "./specs/sim-moving-off-stopping-turning.json";
import S_sim_roundabouts_and_parking from "./specs/sim-roundabouts-and-parking.json";
import S_smooth_braking_and_stopping from "./specs/smooth-braking-and-stopping.json";
import S_starting_and_moving_off_msm from "./specs/starting-and-moving-off-msm.json";
import S_switches_lights_wipers_and_horn from "./specs/switches-lights-wipers-and-horn.json";
import S_traffic_lights_and_police_signals from "./specs/traffic-lights-and-police-signals.json";
import S_turning_left_and_right_at_junctions from "./specs/turning-left-and-right-at-junctions.json";
const SPECS: Spec[] = [S_accident_protocol_999_and_insurance, S_basic_car_maintenance_and_documents, S_brta_learner_licence_process, S_brta_smart_licence_exam_guide, S_brta_traffic_signs, S_defensive_driving_mixed_traffic, S_handling_emergencies_brake_tyre, S_highway_driving_rules, S_lane_discipline_and_overtaking, S_lht_and_road_transport_act_2018, S_manual_and_automatic_gearbox, S_navigating_roundabouts, S_night_driving_and_headlight_use, S_parking_parallel_reverse_garage, S_pre_drive_checks_powdery_dsssm, S_rain_waterlogging_and_winter_fog, S_rhd_cockpit_steering_and_pedals, S_road_markings_and_speed_limits, S_sim_cockpit_and_controls, S_sim_defensive_and_adverse_weather, S_sim_moving_off_stopping_turning, S_sim_roundabouts_and_parking, S_smooth_braking_and_stopping, S_starting_and_moving_off_msm, S_switches_lights_wipers_and_horn, S_traffic_lights_and_police_signals, S_turning_left_and_right_at_junctions] as any;
// SPECS-END
export const DriveRoot: React.FC = () => (
  <>
    {SPECS.map((s) => (
      <Composition key={s.id} id={`Drive-${s.id}`} component={DriveVideo as any} fps={30} width={1920} height={1080} durationInFrames={Math.max(30, driveLen(s))} defaultProps={{ spec: s }} />
    ))}
  </>
);
