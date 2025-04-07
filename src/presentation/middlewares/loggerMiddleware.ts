import { createCustomLogger } from "@buxlo/common";
import morgan from "morgan";

export const customLogger = createCustomLogger("api-gateway");

// Morgan format string (includes response time properly)
const logFormat = ":method :url :status  - :response-time ms";

// Custom stream handler with improved parsing
const logMessageHandler = (message: string) => {
  try {
    // Example Morgan output: "POST /api/auth/user/signout 200 33 - 12.345 ms"
    const parts = message.trim().split(" ");
    const logData = {
      httpMethod: parts[0],
      requestUrl: parts[1], 
      responseStatus: parts[2], 
      responseTime: parts[5] ? `${parts[5]} ${parts[6]}` : "0 ms",
    };
    customLogger.info("HTTP request received", logData);
  } catch (error) {
    customLogger.error("Failed to parse log message", { message, error });
  }
};

// Morgan middleware
const loggerMiddleware = morgan(logFormat, {
  stream: { write: logMessageHandler },
});

// Handle unhandled rejections
process.on("unhandledRejection", (error) => {
  customLogger.error("Unhandled Rejection:", { error });
});

export default loggerMiddleware;