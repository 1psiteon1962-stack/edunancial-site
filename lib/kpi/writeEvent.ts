import type { KPIEvent } from '@/lib/kpi/types';

interface WriteEventInput extends KPIEvent {}

export async function writeEvent(input: WriteEventInput) {
  try {
    // SAFE NO-OP IMPLEMENTATION FOR BUILD SUCCESS
    // Replace later with Supabase / Airtable / DB logic

    const record = {
      event_name: input.event_name,
      event_type: input.event_type ?? 'unknown',
      metadata: input.metadata ?? {},
      site_id: input.site_id ?? 'default',
      site_reg: input.site_reg ?? 'us',
      created_at: new Date().toISOString(),
    };

    console.log('KPI EVENT:', record);

    return { success: true };
  } catch (error) {
    console.error('writeEvent error:', error);
    return { success: false };
  }
}
