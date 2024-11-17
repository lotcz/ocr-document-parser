import { EntityBase } from "./EntityBase";

export type TemplateBase = EntityBase & {
	name: string;
	language: string;
}
