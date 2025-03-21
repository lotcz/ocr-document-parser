export type BasicDialogProps = {
	name?: string;
	text?: string;
	onClose: () => any;
}

export type BasicListComponentProps = {
	pagingString?: string;
}

export type BasicFormComponentProps<Entity> = {
	entity: Entity;
	onChange: (e: Entity) => any;
}

export type FormWithDeleteComponentProps<Entity> = BasicFormComponentProps<Entity> & {
	onDelete: () => any;
}
