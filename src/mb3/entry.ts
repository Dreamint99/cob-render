// Slim entry for the Moneybag video only (the full Root loads every project's fonts, which 404 with --public=work/mb3pub).
import { registerRoot } from "remotion";
import { MbRoot } from "./MbRoot";
registerRoot(MbRoot);
