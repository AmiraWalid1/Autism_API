import logger from "pino";
import dayjs from "dayjs";
import config from "config";

const level = config.get<string>("logLevel") || "info";

// Validate log level
const validLevels = ["fatal", "error", "warn", "info", "debug", "trace"];
if (!validLevels.includes(level)) {
  throw new Error(`Invalid log level: ${level}. Valid levels are: ${validLevels.join(", ")}`);
}

const log = logger({
  transport: {
    target: "pino-pretty",
    options: {
        translateTime: "yyyy-mm-dd HH:MM:ss.l"
    }
  },
  level,
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${dayjs().format()}"`
});

export default log;