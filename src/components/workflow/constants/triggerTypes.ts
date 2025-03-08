
import { TriggerType } from "@/types/workflow";

export const TRIGGER_TYPES: TriggerType[] = ["Schedule", "WebHook", "Event", "UserAction"];

export const TRIGGER_TYPE_PARAMS: Record<TriggerType, Record<string, any>> = {
  Schedule: {
    cron: "0 0 * * *",
    timezone: "UTC",
  },
  WebHook: {
    endpoint: "/api/webhook/[id]",
    method: "POST",
  },
  Event: {
    eventType: "custom.event",
  },
  UserAction: {
    actionType: "button_click",
  },
};
