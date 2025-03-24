import React, {useContext} from 'react';
import {useNavigate} from "react-router";
import {Spinner} from "react-bootstrap";
import {DocumentStub} from "../../types/entity/Document";
import StorageImage from "../image/StorageImage";
import DocumentStateControl from "../documents/DocumentStateControl";
import {DateUtil, Page, PagingRequest} from "zavadil-ts-common";
import {AdvancedTable} from "zavadil-react-common";
import {OcrNavigateContext} from "../../util/OcrNavigation";

export type FolderDocumentsTableProps = {
	page?: Page<DocumentStub>;
	paging: PagingRequest;
	onPagingChanged: (p: PagingRequest) => any;
};

const HEADER = [
	{name: 'imagePath', label: 'Image'},
	{name: 'state', label: 'State'},
	{name: 'createdOn', label: 'Date'}
];

function FolderDocumentsTable({page, paging, onPagingChanged}: FolderDocumentsTableProps) {
	const navigate = useNavigate()
	const ocrNavigate = useContext(OcrNavigateContext);

	if (page === undefined) {
		return <Spinner/>
	}

	if (page.content.length === 0) {
		return <></>
	}

	return <AdvancedTable
		header={HEADER}
		paging={paging}
		totalItems={page.totalItems}
		onPagingChanged={onPagingChanged}
	>
		{
			page.content.map(
				(d, index) => <tr key={index} role="button" onClick={() => navigate(ocrNavigate.documents.detail(d.id))}>
					<td>
						<StorageImage path={d.imagePath} size="thumb"/>
						<small>{d.imagePath}</small>
					</td>
					<td><DocumentStateControl state={d.state}/></td>
					<td>{DateUtil.formatDateTimeForHumans(d.createdOn)}</td>
				</tr>
			)
		}
	</AdvancedTable>
}

export default FolderDocumentsTable;
