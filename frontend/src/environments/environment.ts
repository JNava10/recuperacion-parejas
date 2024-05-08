import * as devEnvironment from "./environment.development";

// En caso de querer cambiar de entorno, cambiar devEnvironment por otro.

export const environment = {
  apiUrl: `http://${devEnvironment.environment.apiUrl}/}`,
  tokenHeader: devEnvironment.environment.tokenHeader
};
