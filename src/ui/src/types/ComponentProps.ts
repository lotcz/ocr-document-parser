import { Page } from "incomaker-react-ts-commons";

export type BasicComponentProps = {

}

export type BasicListComponentProps<Entity> = BasicComponentProps & {
	onEditorRequested: (entity: Entity) => any;
	page: Page<Entity>;
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
