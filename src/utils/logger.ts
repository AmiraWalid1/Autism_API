import logger from "pino";
import dayjs from "dayjs";
import config from "config";

const level = config.get<string>("logLevel");

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