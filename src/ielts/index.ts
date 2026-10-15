// Separate Remotion entry for the IELTS course videos (keeps src/Root.tsx untouched): render with scripts/ielts_make.py
import { registerRoot } from "remotion";
import { IeltsRoot } from "./IeltsRoot";
registerRoot(IeltsRoot);
