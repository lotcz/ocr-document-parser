import {EntityClient, RestClient} from "zavadil-ts-common";
import {DocumentStubWithPages} from "../types/entity/Document";

export class DocumentsClient extends EntityClient<DocumentStubWithPages> {

	constructor(client: RestClient) {
		super(client, 'admin/documents');
	}

	// IMAGES

	uploadDocumentImage(documentId: number, f: File): Promise<DocumentStubWithPages> {
		let formData = new FormData();
		formData.append("file", f);
		return this.client.postFormJson(`${this.name}/${documentId}/upload-image`, formData);
	}

	uploadImageToFolder(folderId: number, f: File): Promise<DocumentStubWithPages> {
		let formData = new FormData();
		formData.append("file", f);
		return this.client.postFormJson(`${this.name}/upload-image/${folderId}`, formData);
	}

}
