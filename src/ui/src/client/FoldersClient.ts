import {EntityCachedClient, HashCacheAsync, HashCacheStats, Page, PagingRequest, RestClient} from "zavadil-ts-common";
import {FolderChain, FolderStub} from "../types/entity/Folder";
import {DocumentStub} from "../types/entity/Document";

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

	loadFolderDocuments(folderId?: number | null, pr?: PagingRequest): Promise<Page<DocumentStub>> {
		if (!folderId) return Promise.resolve({content: [], totalItems: 0, pageNumber: 0, pageSize: 0});
		return this.client.getJson(`${this.name}/${folderId}/documents`, RestClient.pagingRequestToQueryParams(pr));
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
