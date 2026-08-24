alter table public.video_assets drop constraint if exists video_assets_asset_type_check;
alter table public.video_assets
  add constraint video_assets_asset_type_check
  check (asset_type in ('RAW_VIDEO','RAW_IMAGE','EDITED_MASTER'));
