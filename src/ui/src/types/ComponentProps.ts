export type BasicComponentProps = {}

export type BasicListComponentProps<Entity> = BasicComponentProps & {
	pagingString?: string;
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

export type BasicDialogProps = BasicComponentProps & {
	name?: string;
	text?: string;
	onClose: () => any;
}
