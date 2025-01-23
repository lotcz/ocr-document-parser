export type BasicComponentProps = {}

export type BasicDialogProps = BasicComponentProps & {
	name?: string;
	text?: string;
	onClose: () => any;
}

export type BasicListComponentProps = BasicComponentProps & {
	pagingString?: string;
}

export type BasicFormComponentProps<Entity> = BasicComponentProps & {
	entity: Entity;
	onChange: (e: Entity) => any;
}

export type FormWithDeleteComponentProps<Entity> = BasicFormComponentProps<Entity> & {
	onDelete: () => any;
}
