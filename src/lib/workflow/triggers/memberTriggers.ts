import { TriggerHandler } from "../triggerRegistry";

export const memberTriggers: TriggerHandler[] = [
  {
    eventType: "member.registered",
    name: "New Member Registration",
    description: "Fires when a new member registers an account",
    payloadSchema: {
      userId: "string",
      email: "string",
      name: "string",
      plan: "string",
      registeredAt: "string",
    },
    async handle(payload) {
      // In production: validate payload, enrich with member data
      console.log("[Trigger] member.registered", payload.data);
    },
  },
  {
    eventType: "member.login",
    name: "Member Login",
    description: "Fires when a member logs in",
    payloadSchema: {
      userId: "string",
      email: "string",
      loginAt: "string",
      ipAddress: "string",
    },
    async handle(payload) {
      console.log("[Trigger] member.login", payload.data);
    },
  },
  {
    eventType: "membership.upgraded",
    name: "Membership Upgrade",
    description: "Fires when a member upgrades their membership plan",
    payloadSchema: {
      userId: "string",
      fromPlan: "string",
      toPlan: "string",
      upgradedAt: "string",
    },
    async handle(payload) {
      console.log("[Trigger] membership.upgraded", payload.data);
    },
  },
  {
    eventType: "membership.cancelled",
    name: "Membership Cancellation",
    description: "Fires when a member cancels their membership",
    payloadSchema: {
      userId: "string",
      plan: "string",
      cancelledAt: "string",
      reason: "string",
    },
    async handle(payload) {
      console.log("[Trigger] membership.cancelled", payload.data);
    },
  },
  {
    eventType: "support.ticket_created",
    name: "Support Ticket Created",
    description: "Fires when a support ticket is submitted",
    payloadSchema: {
      ticketId: "string",
      userId: "string",
      subject: "string",
      priority: "string",
      createdAt: "string",
    },
    async handle(payload) {
      console.log("[Trigger] support.ticket_created", payload.data);
    },
  },
];
