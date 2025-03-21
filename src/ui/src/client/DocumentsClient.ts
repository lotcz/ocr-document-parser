import {EntityClient, RestClient} from "zavadil-ts-common";
import {DocumentStub, FragmentStub} from "../types/entity/Document";

export class DocumentsClient extends EntityClient<DocumentStub> {

	constructor(client: RestClient) {
		super(client, 'admin/documents');
	}

	// FRAGMENTS

	loadDocumentFragments(documentId: number): Promise<Array<FragmentStub>> {
		return this.client.getJson(`${this.name}/${documentId}/fragments`);
	}

	saveDocumentFragments(documentId: number, fragments: Array<FragmentStub>): Promise<Array<FragmentStub>> {
		return this.client.putJson(`${this.name}/${documentId}/fragments`, fragments);
	}

	// IMAGES

	uploadDocumentImage(documentId: number, f: File): Promise<string> {
		let formData = new FormData();
		formData.append("file", f);
		return this.client.postForm(`${this.name}/${documentId}/upload-image`, formData)
			.then((r) => r.text());
	}

	uploadImageToFolder(folderId: number, f: File): Promise<Array<DocumentStub>> {
		let formData = new FormData();
		formData.append("file", f);
		return this.client.postForm(`admin/documents/upload-image/${folderId}`, formData)
			.then((r) => r.json());
	}

}
