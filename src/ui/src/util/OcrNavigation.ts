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

	add(folderId?: number | null): string {
		return `${super.add()}/${folderId ? folderId : ''}`;
	}
}

export class OcrNavigate {
	templates = new OcrNavigateEntity('templates');
	documents = new OcrNavigateDocument('documents');
	folders = new OcrNavigateEntity('documents/folders');
}

export const OcrNavigateContext = createContext(new OcrNavigate());
