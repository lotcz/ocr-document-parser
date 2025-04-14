import {HashCacheAsync, LookupClient, Page, PagingRequest, RestClient} from "zavadil-ts-common";
import {FolderChain} from "../types/entity/Folder";
import {DocumentTemplatePage, DocumentTemplateStub, FragmentTemplateStub} from "../types/entity/Template";
import {DocumentStubWithFragments} from "../types/entity/Document";

export class DocumentTemplatesClient extends LookupClient<DocumentTemplateStub> {

	fragmentTemplates: HashCacheAsync<number, Array<FragmentTemplateStub>>;

	constructor(client: RestClient) {
		super(client, 'admin/document-templates');
		this.fragmentTemplates = new HashCacheAsync<number, Array<FragmentTemplateStub>>((id) => this.loadDocumentTemplateFragmentsInternal(id));
	}

	loadAllSingle(): Promise<Array<DocumentTemplateStub>> {
		return this.loadAll().then((templates) => templates.filter(t => !t.isMulti));
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
		return this.client.postForm(`${this.name}/${documentTemplateId}/preview-img`, formData)
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

	// FRAGMENTS

	private loadDocumentTemplateFragmentsInternal(documentTemplateId: number): Promise<Array<FragmentTemplateStub>> {
		return this.client.getJson(`${this.name}/${documentTemplateId}/fragments`);
	}

	loadDocumentTemplateFragments(documentTemplateId: number): Promise<Array<FragmentTemplateStub>> {
		return this.fragmentTemplates.get(documentTemplateId);
	}

	saveDocumentTemplateFragmentsInternal(documentTemplateId: number, fragments: Array<FragmentTemplateStub>): Promise<Array<FragmentTemplateStub>> {
		return this.client.putJson(`${this.name}/${documentTemplateId}/fragments`, fragments);
	}

	saveDocumentTemplateFragments(documentTemplateId: number, fragments: Array<FragmentTemplateStub>): Promise<Array<FragmentTemplateStub>> {
		return this
			.saveDocumentTemplateFragmentsInternal(documentTemplateId, fragments)
			.then((saved) => {
				this.fragmentTemplates.set(documentTemplateId, saved);
				return saved;
			});
	}

	// WITH FRAGMENTS

	loadDocumentsWithFragments(templateId: number, p?: PagingRequest): Promise<Page<DocumentStubWithFragments>> {
		return this.client.getJson(`${this.name}/${templateId}/documents/with-fragments`, RestClient.pagingRequestToQueryParams(p));
	}

	createTemplateWithFragments(documentTemplate: DocumentTemplateStub, fragments: Array<FragmentTemplateStub>): Promise<DocumentTemplateStub> {
		return this.save(documentTemplate)
			.then(
				(dt) => {
					return this.saveDocumentTemplateFragments(Number(dt.id), fragments).then(() => dt);
				}
			);
	}

	// PAGES

	loadTemplatePages(templateId: number): Promise<Array<DocumentTemplatePage>> {
		return this.client.getJson(`${this.name}/${templateId}/pages`);
	}

	saveDocumentTemplatePages(documentTemplateId: number, pages: Array<DocumentTemplatePage>): Promise<Array<DocumentTemplatePage>> {
		return this.client.putJson(`${this.name}/${documentTemplateId}/pages`, pages);
	}
}
