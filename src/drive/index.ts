// Separate Remotion entry for the driving course videos (keeps src/Root.tsx untouched): render with scripts/drive_make.py
import { registerRoot } from "remotion";
import { DriveRoot } from "./DriveRoot";
registerRoot(DriveRoot);
