import { getCurrentMember } from "./member-service";

export async function getMemberDisplayName() {

  const member = await getCurrentMember();

  return `${member.firstName} ${member.lastName}`;

}

export async function hasCompletedAssessment() {

  const member = await getCurrentMember();

  return member.assessmentCompleted;

}

export async function getMembershipLevel() {

  const member = await getCurrentMember();

  return member.membershipLevel;

}
