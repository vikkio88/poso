import type { Variables } from "../libs/variables";
import type { RestRequest } from "../rest/types";

export type HttpFile = {
  variables: Variables;
  requests: Record<string, RestRequest>;
  length: number;
};
