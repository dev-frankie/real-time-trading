import createClient from "openapi-fetch";

import type { paths } from "@/shared/api/openapi/schema";

export const apiClient = createClient<paths>({
  baseUrl: "",
});
