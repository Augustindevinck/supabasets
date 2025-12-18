import axios from "axios";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import config from "@/config";
import { createModuleLogger } from "@/lib/logger";

const apiLogger = createModuleLogger("API");

// use this to interact with our own API (/app/api folder) from the front-end side
// See https://shipfa.st/docs/tutorials/api-call
const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.response.use(
  function (response) {
    apiLogger.logApiCall(
      "API Call",
      response.config.url || "unknown",
      response.status
    );
    return response.data;
  },
  function (error) {
    let message = "";

    if (error.response?.status === 401) {
      // User not auth, ask to re login
      apiLogger.warn("Unauthorized access - redirecting to login", {
        status: 401,
      });
      toast.error("Please login");
      // Sends the user to the login page
      redirect(config.auth.loginUrl);
    } else if (error.response?.status === 403) {
      // User not authorized, must subscribe/purchase/pick a plan
      message = "Pick a plan to use this feature";
      apiLogger.warn("Forbidden - user not authorized", { status: 403 });
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
      apiLogger.error("API request failed", error, {
        status: error.response?.status,
        url: error.config?.url,
      });
    }

    error.message =
      typeof message === "string" ? message : JSON.stringify(message);

    // Automatically display errors to the user
    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("something went wrong...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
