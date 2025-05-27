export type BasicFormComponentProps<Entity> = {
	entity: Entity;
	onChange: (e: Entity) => any;
}

export type FormWithDeleteComponentProps<Entity> = BasicFormComponentProps<Entity> & {
	onDelete: () => any;
}
