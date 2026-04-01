import { Inngest } from "inngest";

import "server-only";

export const inngest = new Inngest({
  id: "smashwraps-retail",
  name: "Smash Wraps retail",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
