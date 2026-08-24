alter table public.video_scenes
  add column if not exists transition_type text not null default 'cut'
    check (transition_type in ('cut','fade','wipeleft','wiperight','slideleft','slideright')),
  add column if not exists transition_seconds numeric(4,2) not null default 0.35
    check (transition_seconds between 0.10 and 2.00);

comment on column public.video_scenes.transition_type is 'Transition from this scene into the next scene. The final scene transition is ignored.';
comment on column public.video_scenes.transition_seconds is 'Duration in seconds of the transition from this scene into the next scene.';
