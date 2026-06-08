-- Migration: unit preference + notes on weight entries

ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS unit text NOT NULL DEFAULT 'kg'
    CHECK (unit IN ('kg', 'lbs'));

ALTER TABLE public.weights
  ADD COLUMN IF NOT EXISTS note text;
