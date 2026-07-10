import { TriggerHandler } from "../triggerRegistry";

export const adminTriggers: TriggerHandler[] = [
  {
    eventType: "admin.action",
    name: "Administrative Action",
    description: "Fires when an administrator performs a significant action",
    payloadSchema: {
      adminId: "string",
      action: "string",
      entityType: "string",
      entityId: "string",
      performedAt: "string",
    },
    async handle(payload) {
      console.log("[Trigger] admin.action", payload.data);
    },
  },
  {
    eventType: "schedule.cron",
    name: "Scheduled (Cron)",
    description: "Fires on a defined schedule (cron expression)",
    payloadSchema: {
      cronExpression: "string",
      scheduledAt: "string",
    },
    async handle(payload) {
      console.log("[Trigger] schedule.cron", payload.data);
    },
  },
  {
    eventType: "manual",
    name: "Manual Trigger",
    description: "Manually triggered by an administrator",
    payloadSchema: {
      triggeredBy: "string",
      reason: "string",
      triggeredAt: "string",
    },
    async handle(payload) {
      console.log("[Trigger] manual", payload.data);
    },
  },
];
