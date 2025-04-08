import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {DocumentTemplateStub} from "../../types/entity/Template";
import {Button, Spinner, Stack} from 'react-bootstrap';
import {AdvancedTable, Localize} from "zavadil-react-common";
import StorageImage from "../general/StorageImage";
import {Page, PagingRequest, PagingUtil} from "zavadil-ts-common";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";

const HEADER = [
	{name: 'id', label: 'ID'},
	{name: 'name', label: 'Název'},
	{name: 'language', label: 'Jazyk'},
	{name: 'previewImg', label: 'Náhled'}
];

function DocumentTemplatesList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const [documentTemplates, setDocumentTemplates] = useState<Page<DocumentTemplateStub> | null>(null);

	const paging = useMemo(
		() => PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const createNewTemplate = () => {
		navigate("/templates/detail/add")
	};

	const navigateToPage = (p: PagingRequest) => {
		navigate(`/templates/${PagingUtil.pagingRequestToString(p)}`);
	}

	const navigateToDetail = (d: DocumentTemplateStub) => {
		navigate(`/templates/detail/${d.id}`);
	}

	const loadTemplatesHandler = useCallback(
		() => {
			restClient
				.documentTemplates.loadPage(paging)
				.then(setDocumentTemplates)
				.catch((e) => userAlerts.err(e));
		},
		[paging, restClient, userAlerts]
	);

	useEffect(loadTemplatesHandler, [loadTemplatesHandler]);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal">
					<Button onClick={createNewTemplate}>+ <Localize text="New" tag="feminine"/></Button>
				</Stack>
			</div>

			<div className="d-flex pt-2 px-3 gap-3">
				{
					(documentTemplates === null) ? <span><Spinner/></span>
						: (
							<AdvancedTable
								header={HEADER}
								paging={paging}
								totalItems={documentTemplates.totalItems}
								onPagingChanged={navigateToPage}
								hover={true}
								striped={true}
							>
								{
									(documentTemplates.totalItems === 0) ? <tr>
											<td colSpan={HEADER.length}>No templates</td>
										</tr> :
										documentTemplates.content.map((template, index) => {
											return (
												<tr key={index} role="button" onClick={() => navigateToDetail(template)}>
													<td>{template.id}</td>
													<td>{template.name}</td>
													<td>{template.language}</td>
													<td><StorageImage path={template.previewImg} size="thumb"/></td>
												</tr>
											);
										})
								}
							</AdvancedTable>
						)
				}
			</div>
		</div>
	);
}

export default DocumentTemplatesList;
