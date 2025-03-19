import {EntityCachedClient, RestClient} from "zavadil-ts-common";
import {DocumentStub, FragmentStub} from "../types/entity/Document";

export class DocumentsClient extends EntityCachedClient<DocumentStub> {

	constructor(client: RestClient) {
		super(client, 'admin/documents');
	}

	uploadDocumentImage(documentId: number, f: File): Promise<string> {
		let formData = new FormData();
		formData.append("file", f);
		return this.client.processRequest(
			`${this.name}/${documentId}/upload-image`,
			{
				method: 'POST',
				body: formData,
				headers: {}
			}
		).then((r) => r.text());
	}

	loadDocumentFragments(documentId: number): Promise<Array<FragmentStub>> {
		return this.client.getJson(`${this.name}/${documentId}/fragments`);
	}

	saveDocumentFragments(documentId: number, fragments: Array<FragmentStub>): Promise<Array<FragmentStub>> {
		return this.client.putJson(`${this.name}/${documentId}/fragments`, fragments);
	}

}
