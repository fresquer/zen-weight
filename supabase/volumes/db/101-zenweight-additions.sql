-- Migration: unit preference + notes on weight entries

ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS unit text NOT NULL DEFAULT 'kg'
    CHECK (unit IN ('kg', 'lbs'));

ALTER TABLE public.weights
  ADD COLUMN IF NOT EXISTS note text;

-- Migration: dashboard section visibility toggles

ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS show_weekly_summary boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_trend boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_goal boolean NOT NULL DEFAULT true;
