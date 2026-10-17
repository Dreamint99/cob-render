// Separate Remotion entry for AI University Kids videos (keeps src/Root.tsx untouched): scripts/kids_make.py → scripts/kids_render.mjs
import { registerRoot } from "remotion";
import { KidsRoot } from "./KidsRoot";
registerRoot(KidsRoot);
