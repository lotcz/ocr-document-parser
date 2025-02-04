import {HashCacheAsync, LazyAsync, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import conf from "../config/conf.json";
import {createContext} from "react";
import {DocumentTemplateStub, FragmentTemplateStub} from "../types/entity/Template";
import {DocumentStub, FragmentStub} from "../types/entity/Document";
import {FolderChain, FolderStub} from "../types/entity/Folder";

export class OcrRestClient extends RestClient {

	private languages: LazyAsync<Array<string>>;

	private folderChain: HashCacheAsync<number, FolderChain>;

	private documentTemplates: HashCacheAsync<number, DocumentTemplateStub>;

	private documentTemplatesPages: HashCacheAsync<string, Page<DocumentTemplateStub>>;

	private fragmentTemplates: HashCacheAsync<number, Array<FragmentTemplateStub>>;

	constructor() {
		super(conf.API_URL);
		this.languages = new LazyAsync<Array<string>>(() => this.loadLanguagesInternal());
		this.folderChain = new HashCacheAsync<number, FolderChain>((id: number) => this.loadFolderChainInternal(id));
		this.documentTemplates = new HashCacheAsync<number, DocumentTemplateStub>((id) => this.loadDocumentTemplateInternal(id));
		this.documentTemplatesPages = new HashCacheAsync<string, Page<DocumentTemplateStub>>((pr) => this.loadDocumentTemplatesInternal(PagingUtil.pagingRequestFromString(pr)));
		this.fragmentTemplates = new HashCacheAsync<number, Array<FragmentTemplateStub>>((id) => this.loadDocumentTemplateFragmentsInternal(id));
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

	// TEMPLATES

	loadDocumentTemplateForFolder(folder: FolderChain): Promise<DocumentTemplateStub | null> {
		if (folder.documentTemplateId) {
			return this.loadDocumentTemplate(folder.documentTemplateId);
		}
		if (folder.parent) {
			return this.loadDocumentTemplateForFolder(folder.parent);
		}
		return Promise.resolve(null);
	}

	loadDocumentTemplateForDocument(document: DocumentStub): Promise<DocumentTemplateStub | null> {
		if (!document.documentTemplateId) {
			return this.folderChain.get(document.folderId)
				.then((folder) => this.loadDocumentTemplateForFolder(folder));
		}
		return this.loadDocumentTemplate(document.documentTemplateId);
	}

	loadDocumentTemplatesInternal(pr: PagingRequest): Promise<Page<DocumentTemplateStub>> {
		return this.getJson('document-templates', OcrRestClient.pagingRequestToQueryParams(pr));
	}

	loadDocumentTemplates(pr: PagingRequest): Promise<Page<DocumentTemplateStub>> {
		return this.documentTemplatesPages.get(PagingUtil.pagingRequestToString(pr));
	}

	loadDocumentTemplateInternal(documentTemplateId: number): Promise<DocumentTemplateStub> {
		return this.getJson(`document-templates/${documentTemplateId}`);
	}

	loadDocumentTemplate(documentTemplateId: number): Promise<DocumentTemplateStub> {
		return this.documentTemplates.get(documentTemplateId);
	}

	saveDocumentTemplateInternal(dt: DocumentTemplateStub): Promise<DocumentTemplateStub> {
		if (dt.id) {
			return this.putJson(`document-templates/${dt.id}`, dt);
		} else {
			return this.postJson('document-templates', dt);
		}
	}

	saveDocumentTemplate(dt: DocumentTemplateStub): Promise<DocumentTemplateStub> {
		return this
			.saveDocumentTemplateInternal(dt)
			.then((dt) => {
				this.documentTemplatesPages.reset();
				this.documentTemplates.set(Number(dt?.id), dt);
				return dt;
			});
	}

	uploadDocumentTemplatePreviewInternal(documentTemplateId: number, f: File): Promise<string> {
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

	uploadDocumentTemplatePreview(documentTemplateId: number, f: File): Promise<string> {
		return this
			.uploadDocumentTemplatePreviewInternal(documentTemplateId, f)
			.then((saved) => {
				this.documentTemplates.reset(documentTemplateId);
				this.documentTemplatesPages.reset();
				return saved;
			});
	}

	deleteDocumentTemplateInternal(documentTemplateId: number): Promise<any> {
		return this.del(`document-templates/${documentTemplateId}`);
	}

	deleteDocumentTemplate(documentTemplateId: number): Promise<any> {
		return this
			.deleteDocumentTemplateInternal(documentTemplateId)
			.then(() => {
					this.documentTemplates.reset(documentTemplateId);
					this.documentTemplatesPages.reset();
				}
			);
	}

	private loadDocumentTemplateFragmentsInternal(documentTemplateId: number): Promise<Array<FragmentTemplateStub>> {
		return this.getJson(`document-templates/${documentTemplateId}/fragments`);
	}

	loadDocumentTemplateFragments(documentTemplateId: number): Promise<Array<FragmentTemplateStub>> {
		return this.fragmentTemplates.get(documentTemplateId);
	}

	saveDocumentTemplateFragmentsInternal(documentTemplateId: number, fragments: Array<FragmentTemplateStub>): Promise<Array<FragmentTemplateStub>> {
		return this.putJson(`document-templates/${documentTemplateId}/fragments`, fragments);
	}

	saveDocumentTemplateFragments(documentTemplateId: number, fragments: Array<FragmentTemplateStub>): Promise<Array<FragmentTemplateStub>> {
		return this
			.saveDocumentTemplateFragmentsInternal(documentTemplateId, fragments)
			.then((saved) => {
				this.fragmentTemplates.set(documentTemplateId, saved);
				return saved;
			});
	}

	// FOLDERS

	loadFolder(folderId: number): Promise<FolderStub> {
		return this.getJson(`folders/${folderId}`);
	}

	saveFolderInternal(folder: FolderStub): Promise<FolderStub> {
		if (folder.id) {
			return this.putJson(`folders/${folder.id}`, folder);
		} else {
			return this.postJson('folders', folder);
		}
	}

	saveFolder(folder: FolderStub): Promise<FolderStub> {
		return this.saveFolderInternal(folder)
			.then((folder) => {
				this.folderChain.reset();
				return folder;
			});
	}

	loadFolders(parentId?: number | null, pr?: PagingRequest): Promise<Page<FolderStub>> {
		if (parentId) {
			return this.getJson(`folders/${parentId}/children`, OcrRestClient.pagingRequestToQueryParams(pr));
		} else {
			return this.getJson(`folders`, OcrRestClient.pagingRequestToQueryParams(pr));
		}
	}

	loadFolderDocuments(folderId?: number | null, pr?: PagingRequest): Promise<Page<DocumentStub>> {
		if (!folderId) return Promise.resolve({content: [], totalItems: 0, pageNumber: 0, pageSize: 0});
		return this.getJson(`folders/${folderId}/documents`, OcrRestClient.pagingRequestToQueryParams(pr));
	}

	loadFolderChainInternal(folderId: number): Promise<FolderChain> {
		return this.getJson(`folders/${folderId}/chain`);
	}

	loadFolderChain(folderId: number): Promise<FolderChain> {
		return this.folderChain.get(folderId);
	}

	// DOCUMENTS

	loadDocument(documentId: number): Promise<DocumentStub> {
		return this.getJson(`documents/${documentId}`);
	}

	saveDocument(dt: DocumentStub): Promise<DocumentStub> {
		if (dt.id) {
			return this.putJson(`documents/${dt.id}`, dt);
		} else {
			return this.postJson('documents', dt);
		}
	}

	uploadDocumentImage(documentId: number, f: File): Promise<string> {
		let formData = new FormData();
		formData.append("file", f);
		return this.processRequest(
			`documents/${documentId}/image`,
			{
				method: 'POST',
				body: formData,
				headers: {}
			}
		).then((r) => r.text());
	}

	deleteDocument(documentId: number): Promise<any> {
		return this.del(`documents/${documentId}`);
	}

	loadDocumentFragments(documentId: number): Promise<Array<FragmentStub>> {
		return this.getJson(`documents/${documentId}/fragments`);
	}

	saveDocumentFragments(documentId: number, fragments: Array<FragmentStub>): Promise<Array<FragmentStub>> {
		return this.putJson(`documents/${documentId}/fragments`, fragments);
	}
}

export const OcrRestClientContext = createContext(new OcrRestClient());
