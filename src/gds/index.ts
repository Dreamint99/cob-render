// Separate Remotion entry for the air-ticketing (GDS) course videos (keeps src/Root.tsx untouched): render with scripts/gds_make.py
import { registerRoot } from "remotion";
import { GdsRoot } from "./GdsRoot";
registerRoot(GdsRoot);
