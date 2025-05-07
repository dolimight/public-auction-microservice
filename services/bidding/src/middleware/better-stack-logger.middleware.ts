import { Logtail } from "@logtail/node";

const logtail = new Logtail(process.env.LOGGING_SOURCE_TOKEN!, {
  endpoint: `https://${process.env.LOGGING_INGESTING_HOST}`,
});

export const betterStackLogger = (message: string, ...rest: string[]) => {
  logtail.log(message, ...rest);
};
