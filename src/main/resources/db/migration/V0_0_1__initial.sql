/* BASIC */

create table language
(
	id              integer GENERATED ALWAYS AS IDENTITY,
	created_on      timestamp(6) not null default current_timestamp,
	last_updated_on timestamp(6) not null default current_timestamp,
	name            varchar(50),
	tesseract_code  char(3)      not null,
	description     text,
	PRIMARY KEY (id)
);

insert into language(name, tesseract_code, description)
values ('English', 'eng', 'Standard American English'),
	   ('English-binary', 'enb', 'English with support for custom words'),
	   ('Čeština', 'ces', 'Český jazyk');

/* TEMPLATES */

create table document_template
(
	id              integer GENERATED ALWAYS AS IDENTITY,
	created_on      timestamp(6) not null default current_timestamp,
	last_updated_on timestamp(6) not null default current_timestamp,
	language_id     integer      not null,
	pages           integer      not null default 1,
	name            varchar(100),
	preview_img     varchar(255),
	PRIMARY KEY (id)
);

ALTER TABLE document_template
	ADD CONSTRAINT fk_document_template_language
		FOREIGN KEY (language_id)
			REFERENCES language (id)
			ON DELETE CASCADE;

create table page_template
(
	id                            integer GENERATED ALWAYS AS IDENTITY,
	created_on                    timestamp(6),
	last_updated_on               timestamp(6),
	page                          int     not null DEFAULT 0,
	document_template_id          integer not null,
	inherit_from_page_template_id integer null,
	PRIMARY KEY (id)
);

create unique index ix_multi_page_template_document_page
	on page_template (document_template_id, page);

ALTER TABLE page_template
	ADD CONSTRAINT fk_page_template_document
		FOREIGN KEY (document_template_id)
			REFERENCES document_template (id)
			ON DELETE CASCADE;

ALTER TABLE page_template
	ADD CONSTRAINT fk_page_template_inherit_from
		FOREIGN KEY (inherit_from_page_template_id)
			REFERENCES page_template (id)
			ON DELETE CASCADE;

create table fragment_template
(
	id               integer GENERATED ALWAYS AS IDENTITY,
	created_on       timestamp(6)     not null default current_timestamp,
	last_updated_on  timestamp(6)     not null default current_timestamp,
	language_id      integer,
	name             varchar(100),
	lft              double precision not null,
	top              double precision not null,
	height           double precision not null,
	width            double precision not null,
	page_template_id integer          not null,
	PRIMARY KEY (id)
);

create unique index ix_fragment_template_document_template_name
	on fragment_template (page_template_id, name);

ALTER TABLE fragment_template
	ADD CONSTRAINT fk_fragment_template_template_id
		FOREIGN KEY (page_template_id)
			REFERENCES page_template (id)
			ON DELETE CASCADE;

/* PARSED DATA */

create table folder
(
	id                   integer GENERATED ALWAYS AS IDENTITY,
	created_on           timestamp(6) not null default current_timestamp,
	last_updated_on      timestamp(6) not null default current_timestamp,
	name                 varchar(50),
	document_template_id integer,
	parent_id            integer,
	PRIMARY KEY (id)
);

ALTER TABLE folder
	ADD CONSTRAINT fk_folder_document_template
		FOREIGN KEY (document_template_id)
			REFERENCES document_template (id)
			ON DELETE SET NULL;

ALTER TABLE folder
	ADD CONSTRAINT fk_folder_parent
		FOREIGN KEY (parent_id)
			REFERENCES folder (id)
			ON DELETE CASCADE;

create type tp_document_state AS ENUM ('Waiting', 'Processed', 'NoImage', 'NoTemplate', 'Error');
create cast (varchar AS tp_document_state) WITH INOUT AS IMPLICIT;

create table document
(
	id                   integer GENERATED ALWAYS AS IDENTITY,
	created_on           timestamp(6)      not null default current_timestamp,
	last_updated_on      timestamp(6)      not null default current_timestamp,
	image_path           varchar(255),
	state                tp_document_state not null default 'Waiting',
	document_template_id integer           not null,
	folder_id            integer           not null,
	pages                integer           not null default 0,
	PRIMARY KEY (id)
);

create index ix_document_folder on document (folder_id, state, last_updated_on desc);

ALTER TABLE document
	ADD CONSTRAINT fk_document_document_template
		FOREIGN KEY (document_template_id)
			REFERENCES document_template (id)
			ON DELETE SET NULL;

ALTER TABLE document
	ADD CONSTRAINT fk_document_folder_parent
		FOREIGN KEY (folder_id)
			REFERENCES folder (id)
			ON DELETE CASCADE;

create table page
(
	id               integer GENERATED ALWAYS AS IDENTITY,
	created_on       timestamp(6) not null default current_timestamp,
	last_updated_on  timestamp(6) not null default current_timestamp,
	image_path       varchar(255),
	document_id      integer      not null,
	page_template_id integer      not null,
	page_number      integer      not null default 0,
	PRIMARY KEY (id)
);

create unique index ix_page_document on page (document_id, page_number);

ALTER TABLE page
	ADD CONSTRAINT fk_page_document
		FOREIGN KEY (document_id)
			REFERENCES document (id)
			ON DELETE CASCADE;

ALTER TABLE page
	ADD CONSTRAINT fk_page_template
		FOREIGN KEY (page_template_id)
			REFERENCES page_template (id)
			ON DELETE CASCADE;

create table fragment
(
	id                   integer GENERATED ALWAYS AS IDENTITY,
	created_on           timestamp(6),
	last_updated_on      timestamp(6),
	image_path           varchar(255),
	text                 text,
	page_id              integer not null,
	fragment_template_id integer not null,
	PRIMARY KEY (id)
);

create index ix_fragment_page on fragment (page_id);

ALTER TABLE fragment
	ADD CONSTRAINT fk_fragment_document_id
		FOREIGN KEY (page_id)
			REFERENCES page (id)
			ON DELETE CASCADE;

ALTER TABLE fragment
	ADD CONSTRAINT fk_fragment_fragment_template_id
		FOREIGN KEY (fragment_template_id)
			REFERENCES fragment_template (id)
			ON DELETE CASCADE
			ON UPDATE NO ACTION;

