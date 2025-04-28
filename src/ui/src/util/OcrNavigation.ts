import {createContext} from "react";

class OcrNavigateEntity {
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	list() {
		return `/${this.name}`;
	}

	detail(id?: number | null) {
		if (!id) return this.add();
		return `/${this.name}/detail/${id}`;
	}

	add() {
		return `/${this.name}/detail/add`;
	}
}

class OcrNavigateDocument extends OcrNavigateEntity {

	constructor() {
		super('documents');
	}

	add(folderId?: number | null): string {
		return `${super.add()}/${folderId ? folderId : ''}`;
	}
}

class OcrNavigateFolder extends OcrNavigateEntity {

	constructor() {
		super('documents/folders');
	}

	add(parentId?: number | null): string {
		return `${super.add()}/${parentId ? parentId : ''}`;
	}
}

export class OcrNavigate {
	templates = new OcrNavigateEntity('templates');
	documents = new OcrNavigateDocument();
	folders = new OcrNavigateFolder();
}

export const OcrNavigateContext = createContext(new OcrNavigate());
