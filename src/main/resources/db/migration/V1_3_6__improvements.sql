alter table page_template
	add scan_full_text boolean default false;
alter table page
	add full_text text;

ALTER TYPE tp_document_state ADD VALUE IF NOT EXISTS 'Synchronized';

-- (Optional) Recreate the cast if needed
-- First, drop the cast if it already exists to avoid duplication errors
DROP CAST IF EXISTS (varchar AS tp_document_state);

-- Then recreate the implicit cast
CREATE CAST (varchar AS tp_document_state)
			WITH INOUT AS IMPLICIT;
