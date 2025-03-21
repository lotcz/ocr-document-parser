import {HashCacheAsync, LazyAsync, RestClientWithOAuth} from "zavadil-ts-common";
import conf from "../config/conf.json";
import {createContext} from "react";
import {DocumentTemplateStub, FragmentTemplateStub} from "../types/entity/Template";
import {DocumentStub} from "../types/entity/Document";
import {ClientStats, OkarinaStats} from "../types/OkarinaStats";
import {DocumentTemplatesClient} from "./DocumentTemplatesClient";
import {DocumentsClient} from "./DocumentsClient";
import {FoldersClient} from "./FoldersClient";

export class OcrRestClient extends RestClientWithOAuth {

	private languages: LazyAsync<Array<string>>;

	private fragmentTemplates: HashCacheAsync<number, Array<FragmentTemplateStub>>;

	folders: FoldersClient;

	documentTemplates: DocumentTemplatesClient;

	documents: DocumentsClient;

	constructor() {
		super(conf.API_URL);
		this.languages = new LazyAsync<Array<string>>(() => this.loadLanguagesInternal());
		this.fragmentTemplates = new HashCacheAsync<number, Array<FragmentTemplateStub>>((id) => this.loadDocumentTemplateFragmentsInternal(id));
		this.folders = new FoldersClient(this);
		this.documentTemplates = new DocumentTemplatesClient(this);
		this.documents = new DocumentsClient(this);
	}

	getClientStats(): ClientStats {
		return {
			documentTemplatesCache: this.documentTemplates.getStats(),
			fragmentTemplatesCache: this.fragmentTemplates.getStats(),
			folderChainCache: this.folders.folderChainStats()
		}
	}

	version(): Promise<string> {
		return this.get('status/version').then((r) => r.text());
	}

	stats(): Promise<OkarinaStats> {
		return this.getJson('status/stats');
	}

	// LANGUAGES

	loadLanguagesInternal(): Promise<Array<string>> {
		return this.getJson('admin/enumerations/languages');
	}

	loadLanguages(): Promise<Array<string>> {
		return this.languages.get();
	}

	// IMAGES

	loadImage(path: string, size?: string): Promise<string> {
		const params = {path: path, size: size};
		return this.get('admin/images', params)
			.then(
				(res) => res.blob().then((b) => URL.createObjectURL(b))
			);
	}

	// TEMPLATES

	loadDocumentTemplateForDocument(document: DocumentStub): Promise<DocumentTemplateStub | null> {
		if (!document.documentTemplateId) {
			return this.folders.loadFolderChain(document.folderId)
				.then((folder) => this.documentTemplates.loadDocumentTemplateForFolder(folder));
		}
		return this.documentTemplates.loadSingle(document.documentTemplateId);
	}

	private loadDocumentTemplateFragmentsInternal(documentTemplateId: number): Promise<Array<FragmentTemplateStub>> {
		return this.getJson(`admin/document-templates/${documentTemplateId}/fragments`);
	}

	loadDocumentTemplateFragments(documentTemplateId: number): Promise<Array<FragmentTemplateStub>> {
		return this.fragmentTemplates.get(documentTemplateId);
	}

	saveDocumentTemplateFragmentsInternal(documentTemplateId: number, fragments: Array<FragmentTemplateStub>): Promise<Array<FragmentTemplateStub>> {
		return this.putJson(`admin/document-templates/${documentTemplateId}/fragments`, fragments);
	}

	saveDocumentTemplateFragments(documentTemplateId: number, fragments: Array<FragmentTemplateStub>): Promise<Array<FragmentTemplateStub>> {
		return this
			.saveDocumentTemplateFragmentsInternal(documentTemplateId, fragments)
			.then((saved) => {
				this.fragmentTemplates.set(documentTemplateId, saved);
				return saved;
			});
	}

}

export const OcrRestClientContext = createContext(new OcrRestClient());
