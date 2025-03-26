import {LookupClient, Page, PagingRequest, RestClient} from "zavadil-ts-common";
import {FolderChain} from "../types/entity/Folder";
import {DocumentTemplateStub} from "../types/entity/Template";
import {DocumentStubWithFragments} from "../types/entity/Document";

export class DocumentTemplatesClient extends LookupClient<DocumentTemplateStub> {

	constructor(client: RestClient) {
		super(client, 'admin/document-templates');
	}

	loadDocumentTemplateForFolder(folder: FolderChain): Promise<DocumentTemplateStub | null> {
		if (folder.documentTemplateId) {
			return this.loadSingle(folder.documentTemplateId);
		}
		if (folder.parent) {
			return this.loadDocumentTemplateForFolder(folder.parent);
		}
		return Promise.resolve(null);
	}

	private uploadDocumentTemplatePreviewInternal(documentTemplateId: number, f: File): Promise<string> {
		let formData = new FormData();
		formData.append("file", f);
		return this.client.postForm(`admin/document-templates/${documentTemplateId}/preview-img`, formData)
			.then((r) => r.text());
	}

	uploadDocumentTemplatePreview(documentTemplateId: number, f: File): Promise<string> {
		return this
			.uploadDocumentTemplatePreviewInternal(documentTemplateId, f)
			.then((saved) => {
				this.reset();
				return saved;
			});
	}

	// WITH FRAGMENTS

	loadDocumentsWithFragments(templateId: number, p?: PagingRequest): Promise<Page<DocumentStubWithFragments>> {
		return this.client.getJson(`${this.name}/${templateId}/documents/with-fragments`, RestClient.pagingRequestToQueryParams(p));
	}

}
