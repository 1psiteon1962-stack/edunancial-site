export interface KPIEvent {
  event_name: string;
  event_type?: string;
  metadata?: Record<string, any>;
  site_id?: string;
  site_reg?: string;
  created_at?: string;
}
