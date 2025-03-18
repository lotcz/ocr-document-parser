import {EntityClientWithStub, Page, PagingRequest, RestClient} from "zavadil-ts-common";

export class PermissionsClient extends EntityClientWithStub<Permission, PermissionStub> {

	constructor(client: RestClient) {
		super(client, 'admin/permissions');
	}

	loadPageByAudience(audienceId: number, pr: PagingRequest): Promise<Page<Permission>> {
		return this.client.getJson(`${this.name}/by-audience/${audienceId}`, RestClient.pagingRequestToQueryParams(pr));
	}

	loadPageByUser(userId: number, pr: PagingRequest): Promise<Page<Permission>> {
		return this.client.getJson(`${this.name}/by-user/${userId}`, RestClient.pagingRequestToQueryParams(pr));
	}

}
