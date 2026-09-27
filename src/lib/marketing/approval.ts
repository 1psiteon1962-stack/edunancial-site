import type { PublicationStatus } from './types';

const APPROVABLE = new Set<PublicationStatus>(['review']);
const SCHEDULABLE = new Set<PublicationStatus>(['approved']);
const PUBLISHABLE = new Set<PublicationStatus>(['scheduled']);

export function canApprove(status: PublicationStatus) { return APPROVABLE.has(status); }
export function canSchedule(status: PublicationStatus) { return SCHEDULABLE.has(status); }
export function canPublish(status: PublicationStatus) { return PUBLISHABLE.has(status); }

export function assertApprovedBeforeScheduling(status: PublicationStatus) {
  if (!canSchedule(status)) throw new Error('Publication must be explicitly approved before scheduling.');
}

export function assertScheduledBeforePublishing(status: PublicationStatus) {
  if (!canPublish(status)) throw new Error('Publication must be scheduled from an approved state before publishing.');
}
