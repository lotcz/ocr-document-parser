import {Page, PagingRequest, RestClient} from "incomaker-react-ts-commons";
import conf from "../config/conf.json";
import {createContext} from "react";
import {DocumentTemplate} from "../types/entity/DocumentTemplate";

export class OcrRestClient extends RestClient {

	constructor() {
		super(conf.API_URL, {'Content-Type': 'application/json', 'Authorization': conf.API_KEY});
	}

	static create(): OcrRestClient {
		return new OcrRestClient()
	}

	status(): Promise<string> {
		return this.get('status').then((r) => r.text());
	}

	loadDocumentTemplates(pr: PagingRequest): Promise<Page<DocumentTemplate>> {
		return this.getJson(`document-templates/${OcrRestClient.pagingRequestToQueryParams(pr)}`);
	}

	loadDocumentTemplate(documentTemplateId: number): Promise<DocumentTemplate> {
		return this.getJson(`document-templates/${documentTemplateId}`);
	}

	saveDocumentTemplate(dt: DocumentTemplate): Promise<DocumentTemplate> {
		if (dt.id) {
			return this.putJson(`document-templates/${dt.id}`, dt);
		} else {
			return this.postJson('document-templates', dt);
		}
	}

	deleteDocumentTemplate(documentTemplateId: number): Promise<any> {
		return this.del(`document-templates/${documentTemplateId}`);
	}
}

export const OcrRestClientContext= createContext(OcrRestClient.create());
