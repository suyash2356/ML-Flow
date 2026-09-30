-- The project already has another auth.users trigger that creates profiles.
-- Remove only the ML Flow trigger added by migration 202609300001.
drop trigger if exists ml_flow_profile_after_signup on auth.users;
