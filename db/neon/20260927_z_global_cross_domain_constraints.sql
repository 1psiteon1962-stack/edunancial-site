-- Cross-domain constraints are applied only after both independent foundations exist.
alter table curriculum_publish_batches
  drop constraint if exists curriculum_publish_batches_region_key_fkey;
alter table curriculum_publish_batches
  add constraint curriculum_publish_batches_region_key_fkey
  foreign key(region_key) references global_regions(key) on delete restrict;
