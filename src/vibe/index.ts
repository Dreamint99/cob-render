// Separate Remotion entry for the vibe-coding course videos (keeps src/Root.tsx untouched): render with scripts/vibe_make.py
import { registerRoot } from "remotion";
import { VibeRoot } from "./VibeRoot";
registerRoot(VibeRoot);
