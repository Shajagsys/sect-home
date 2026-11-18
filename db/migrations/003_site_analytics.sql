-- Reverts 003's original site_events table: the marketing site switched
-- from first-party analytics to Google Analytics 4, so this table is no
-- longer written to. Safe to run even if 003 was never applied.
DROP TABLE IF EXISTS site_events;
