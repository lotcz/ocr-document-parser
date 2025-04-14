ALTER TABLE document_template
	ADD is_multi boolean not null default false;

create index ix_multi_document_template_is_multi on document_template (is_multi);

create table document_template_page
(
	id                          integer GENERATED ALWAYS AS IDENTITY,
	created_on                  timestamp(6),
	last_updated_on             timestamp(6),
	page                        int     not null DEFAULT 0,
	parent_document_template_id integer not null,
	document_template_id        integer not null,
	PRIMARY KEY (id)
);

create unique index ix_multi_document_template_page_page
	on document_template_page (parent_document_template_id, page);

ALTER TABLE document_template_page
	ADD CONSTRAINT fk_multi_document_document_parent_template
		FOREIGN KEY (parent_document_template_id)
			REFERENCES document_template (id)
			ON DELETE CASCADE
			ON UPDATE NO ACTION;

ALTER TABLE document_template_page
	ADD CONSTRAINT fk_multi_document_document_template
		FOREIGN KEY (document_template_id)
			REFERENCES document_template (id)
			ON DELETE SET NULL
			ON UPDATE NO ACTION;

ALTER TABLE document
	ADD parent_document_id integer null;

create index ix_document_parent
	on document (parent_document_id);

ALTER TABLE document
	ADD CONSTRAINT fk_document_multi_page_parent
		FOREIGN KEY (parent_document_id)
			REFERENCES document (id)
			ON DELETE CASCADE
			ON UPDATE NO ACTION;
