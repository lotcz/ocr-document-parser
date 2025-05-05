import {LookupClient, RestClient} from "zavadil-ts-common";
import {FolderChain} from "../types/entity/Folder";
import {DocumentTemplateStubWithPages, PageTemplateStubWithFragments} from "../types/entity/Template";

export class DocumentTemplatesClient extends LookupClient<DocumentTemplateStubWithPages> {

	constructor(client: RestClient) {
		super(client, 'admin/document-templates');
	}

	loadPageTemplate(pageTemplateId: number): Promise<PageTemplateStubWithFragments | undefined> {
		return this.loadAll().then(
			(templates) => {
				const pt = templates
					.flatMap(t => t.pages)
					.find(p => p.id === pageTemplateId);
				return this.loadFinalPageTemplate(pt);
			}
		);
	}

	loadFinalPageTemplate(pageTemplate?: PageTemplateStubWithFragments): Promise<PageTemplateStubWithFragments | undefined> {
		if (!pageTemplate) return Promise.resolve(undefined);
		if (!pageTemplate.inheritFromPageTemplateId) return Promise.resolve(pageTemplate);
		return this.loadPageTemplate(pageTemplate.inheritFromPageTemplateId);
	}

	loadDocumentTemplateForFolder(folder: FolderChain): Promise<DocumentTemplateStubWithPages | null> {
		if (folder.documentTemplateId) {
			return this.loadSingle(folder.documentTemplateId);
		}
		if (folder.parent) {
			return this.loadDocumentTemplateForFolder(folder.parent);
		}
		return Promise.resolve(null);
	}

	private uploadDocumentTemplatePreviewInternal(documentTemplateId: number, f: File): Promise<DocumentTemplateStubWithPages> {
		let formData = new FormData();
		formData.append("file", f);
		return this.client.postFormJson(`${this.name}/${documentTemplateId}/preview-img`, formData);
	}

	uploadDocumentTemplatePreview(documentTemplateId: number, f: File): Promise<DocumentTemplateStubWithPages> {
		return this
			.uploadDocumentTemplatePreviewInternal(documentTemplateId, f)
			.then((saved) => {
				this.reset();
				return saved;
			});
	}

}
