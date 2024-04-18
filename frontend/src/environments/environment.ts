import * as devEnvironment from "./environment.development";

export const environment = {
  apiUrl: `http://${devEnvironment.environment.apiHost}:${devEnvironment.environment.apiPort}/${devEnvironment.environment.apiRootEndpoint}/}`,
};
