export interface CommunicationSummary {

  phoneCalls: number;

  emails: number;

  sms: number;

  webChats: number;

  highPriority: number;

  criticalPriority: number;

}

export function getCommunicationSummary(): CommunicationSummary {

  return {

    phoneCalls: 0,

    emails: 0,

    sms: 0,

    webChats: 0,

    highPriority: 0,

    criticalPriority: 0,

  };

}

export function getExecutiveAlert(): string {

  return "No urgent communications.";

}
