import {EntityCachedClient, HashCacheAsync, HashCacheStats, Page, PagingRequest, RestClient} from "zavadil-ts-common";
import {FolderChain, FolderStub} from "../types/entity/Folder";
import {DocumentStub, DocumentStubWithFragments} from "../types/entity/Document";

export class FoldersClient extends EntityCachedClient<FolderStub> {

	private folderChain: HashCacheAsync<number, FolderChain>;

	constructor(client: RestClient) {
		super(client, 'admin/folders');
		this.folderChain = new HashCacheAsync<number, FolderChain>((id: number) => this.loadFolderChainInternal(id));
	}

	loadFolders(parentId?: number | null, pr?: PagingRequest): Promise<Page<FolderStub>> {
		if (parentId) {
			return this.client.getJson(`${this.name}/${parentId}/children`, RestClient.pagingRequestToQueryParams(pr));
		} else {
			return this.client.getJson(this.name, RestClient.pagingRequestToQueryParams(pr));
		}
	}

	loadFolderDocuments(folderId: number, pr?: PagingRequest): Promise<Page<DocumentStub>> {
		return this.client.getJson(`${this.name}/${folderId}/documents`, RestClient.pagingRequestToQueryParams(pr));
	}

	loadFolderDocumentsWithFragments(folderId: number, pr?: PagingRequest): Promise<Page<DocumentStubWithFragments>> {
		return this.client.getJson(`${this.name}/${folderId}/documents/with-fragments`, RestClient.pagingRequestToQueryParams(pr));
	}

	save(fc: FolderStub): Promise<FolderStub> {
		return super.save(fc).then(
			(saved) => {
				this.folderChain.reset();
				return saved;
			}
		);
	}

	delete(id: number): Promise<any> {
		return super.delete(id).then(() => this.folderChain.reset());
	}

	updateDocumentsState(folderId: number, s: string): Promise<void> {
		return this.client.put(`${this.name}/${folderId}/documents/set-state?state=${s}`).then();
	}

	// FOLDER CHAIN

	private loadFolderChainInternal(folderId: number): Promise<FolderChain> {
		return this.client.getJson(`${this.name}/${folderId}/chain`);
	}

	loadFolderChain(folderId: number): Promise<FolderChain> {
		return this.folderChain.get(folderId);
	}

	folderChainStats(): HashCacheStats {
		return this.folderChain.getStats();
	}

}
