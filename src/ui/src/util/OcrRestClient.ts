import {LazyAsync, Page, PagingRequest, RestClient} from "zavadil-ts-common";
import conf from "../config/conf.json";
import {createContext} from "react";
import {DocumentTemplate, DocumentTemplateStub} from "../types/entity/DocumentTemplate";

export class OcrRestClient extends RestClient {

	private languages: LazyAsync<Array<string>>;

	constructor() {
		super(conf.API_URL);
		this.languages = new LazyAsync<Array<string>>(() => this.loadLanguagesInternal());
	}

	status(): Promise<string> {
		return this.get('status/version').then((r) => r.text());
	}

	getImgUrl(path: string, size: string = 'original') {
		return `${this.getUrl('images')}?path=${encodeURIComponent(path)}&size=${size}`;
	}

	loadLanguagesInternal(): Promise<Array<string>> {
		return this.getJson('enumerations/languages');
	}

	loadLanguages(): Promise<Array<string>> {
		return this.languages.get();
	}

	loadDocumentTemplates(pr: PagingRequest): Promise<Page<DocumentTemplateStub>> {
		return this.getJson('document-templates', OcrRestClient.pagingRequestToQueryParams(pr));
	}

	loadDocumentTemplate(documentTemplateId: number): Promise<DocumentTemplate> {
		return this.getJson(`document-templates/${documentTemplateId}`);
	}

	saveDocumentTemplate(dt: DocumentTemplateStub): Promise<DocumentTemplateStub> {
		if (dt.id) {
			return this.putJson(`document-templates/${dt.id}`, dt);
		} else {
			return this.postJson('document-templates', dt);
		}
	}

	uploadDocumentTemplatePreview(documentTemplateId: number, f: File): Promise<string> {
		let formData = new FormData();
		formData.append("file", f);
		return this.processRequest(
			`document-templates/${documentTemplateId}/preview-img`,
			{
				method: 'POST',
				body: formData,
				headers: {}
			}
		).then((r) => r.text());
	}

	deleteDocumentTemplate(documentTemplateId: number): Promise<any> {
		return this.del(`document-templates/${documentTemplateId}`);
	}
}

export const OcrRestClientContext = createContext(new OcrRestClient());
