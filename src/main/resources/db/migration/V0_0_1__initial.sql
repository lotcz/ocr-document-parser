create type tp_lang AS ENUM ('ces', 'eng', 'enb');
create cast (varchar AS tp_lang) WITH INOUT AS IMPLICIT;

create table document_template
(
	id              integer GENERATED ALWAYS AS IDENTITY,
	created_on      timestamp(6),
	last_updated_on timestamp(6),
	language        tp_lang not null default 'eng',
	name            varchar(255),
	height          integer not null,
	preview_img     varchar(255),
	width           integer not null,
	PRIMARY KEY (id)
);

create index ix_document_template_name on document_template (name);

create table folder
(
	id                   integer GENERATED ALWAYS AS IDENTITY,
	created_on           timestamp(6),
	last_updated_on      timestamp(6),
	name                 varchar(255),
	document_template_id integer,
	parent_id            integer,
	PRIMARY KEY (id)
);

ALTER TABLE folder
	ADD CONSTRAINT fk_folder_document_template
		FOREIGN KEY (document_template_id)
			REFERENCES document_template (id)
			ON DELETE SET NULL
			ON UPDATE NO ACTION;

ALTER TABLE folder
	ADD CONSTRAINT fk_folder_parent
		FOREIGN KEY (parent_id)
			REFERENCES folder (id)
			ON DELETE CASCADE
			ON UPDATE NO ACTION;

create type tp_document_state AS ENUM ('Waiting', 'Processed', 'NoImage', 'NoTemplate', 'Error');
create cast (varchar AS tp_document_state) WITH INOUT AS IMPLICIT;

create table document
(
	id                   integer GENERATED ALWAYS AS IDENTITY,
	created_on           timestamp(6),
	last_updated_on      timestamp(6),
	image_path           varchar(255),
	state                tp_document_state not null default 'Waiting',
	document_template_id integer           not null,
	folder_id            integer           not null,
	PRIMARY KEY (id)
);

ALTER TABLE document
	ADD CONSTRAINT fk_document_document_template
		FOREIGN KEY (document_template_id)
			REFERENCES document_template (id)
			ON DELETE SET NULL
			ON UPDATE NO ACTION;

ALTER TABLE document
	ADD CONSTRAINT fk_document_folder_parent
		FOREIGN KEY (folder_id)
			REFERENCES folder (id)
			ON DELETE CASCADE
			ON UPDATE NO ACTION;

create table fragment_template
(
	id                   integer GENERATED ALWAYS AS IDENTITY,
	created_on           timestamp(6),
	last_updated_on      timestamp(6),
	language             tp_lang,
	name                 varchar(255),
	height               double precision not null,
	lft                  double precision not null,
	top                  double precision not null,
	width                double precision not null,
	document_template_id integer,
	PRIMARY KEY (id)
);

create unique index ix_fragment_template_document_template_name on fragment_template (document_template_id, name);

ALTER TABLE fragment_template
	ADD CONSTRAINT fk_fragment_template_template_id
		FOREIGN KEY (document_template_id)
			REFERENCES document_template (id)
			ON DELETE CASCADE
			ON UPDATE NO ACTION;

create table fragment
(
	id                   integer GENERATED ALWAYS AS IDENTITY,
	created_on           timestamp(6),
	last_updated_on      timestamp(6),
	image_path           varchar(255),
	text                 text,
	document_id          integer not null,
	fragment_template_id integer not null,
	PRIMARY KEY (id)
);

ALTER TABLE fragment
	ADD CONSTRAINT fk_fragment_document_id
		FOREIGN KEY (document_id)
			REFERENCES document (id)
			ON DELETE CASCADE
			ON UPDATE NO ACTION;

ALTER TABLE fragment
	ADD CONSTRAINT fk_fragment_fragment_template_id
		FOREIGN KEY (fragment_template_id)
			REFERENCES fragment_template (id)
			ON DELETE CASCADE
			ON UPDATE NO ACTION;

create unique index ix_fragment_document_template_ids on fragment (document_id, fragment_template_id);
