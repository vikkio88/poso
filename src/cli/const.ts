import { APP_DESCRIPTION, APP_NAME } from "../config";
import { c } from "../libs/colours";
import { getVersion } from "./methods/version";

export const HEADER = `${c.b(APP_NAME)}
  ${APP_DESCRIPTION}
  version: ${c.green(getVersion())}
`;
