import { handleErrorWithSentry, Replay } from "@sentry/sveltekit";
import * as Sentry from "@sentry/sveltekit";

Sentry.init({
	dsn: "https://dd2cf4f45b4a4f1eb21cf554b5739a52@o4505291516870656.ingest.sentry.io/4505291519164416",
	tracesSampleRate: 1.0,
	replaysSessionSampleRate: 1.0,
	replaysOnErrorSampleRate: 1.0,
	integrations: [new Replay()],
	enabled: import.meta.env.PROD,
});

export const handleError = handleErrorWithSentry();
