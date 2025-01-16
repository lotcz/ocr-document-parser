import {Page, PagingRequest} from "zavadil-ts-common";

export type BasicComponentProps = {}

export type BasicListComponentProps<Entity> = BasicComponentProps & {
	onEditorRequested: (entity: Entity) => any;
	onPagingRequested: (p: PagingRequest) => any;
	page: Page<Entity>;
	paging: PagingRequest;
}

export type BasicEditorComponentProps<Entity> = BasicComponentProps & {
	entity: Entity;
	onClose: () => any;
	onDelete: () => any;
	onSave: (e: Entity) => any;
}

export type BasicFormComponentProps<Entity> = BasicComponentProps & {
	entity: Entity;
	onChange: () => any;
}

