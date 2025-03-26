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
		return `/${this.name}/detail/${id}`;
	}

	add() {
		return `/${this.name}/detail/add`;
	}
}

export class OcrNavigate {
	templates = new OcrNavigateEntity('templates');
	documents = new OcrNavigateEntity('documents');
	folders = new OcrNavigateEntity('documents/folders');
}

export const OcrNavigateContext = createContext(new OcrNavigate());
