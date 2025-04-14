import {LazyAsync, RestClientWithOAuth} from "zavadil-ts-common";
import conf from "../config/conf.json";
import {createContext} from "react";
import {ClientStats, OkarinaStats} from "../types/OkarinaStats";
import {DocumentTemplatesClient} from "./DocumentTemplatesClient";
import {DocumentsClient} from "./DocumentsClient";
import {FoldersClient} from "./FoldersClient";

export class OcrRestClient extends RestClientWithOAuth {

	private languages: LazyAsync<Array<string>>;

	folders: FoldersClient;

	documentTemplates: DocumentTemplatesClient;

	documents: DocumentsClient;

	constructor() {
		super(conf.API_URL);
		this.languages = new LazyAsync<Array<string>>(() => this.loadLanguagesInternal());
		this.folders = new FoldersClient(this);
		this.documentTemplates = new DocumentTemplatesClient(this);
		this.documents = new DocumentsClient(this);
	}

	getClientStats(): ClientStats {
		return {
			documentTemplatesCache: this.documentTemplates.getStats(),
			fragmentTemplatesCache: this.documentTemplates.fragmentTemplates.getStats(),
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

}

export const OcrRestClientContext = createContext(new OcrRestClient());
