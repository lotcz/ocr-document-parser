import React, {useCallback, useContext, useEffect, useState} from 'react';
import {DocumentTemplateStub} from "../../types/entity/Template";
import {BasicListComponentProps} from "../../types/ComponentProps";
import {Button, Spinner, Stack} from 'react-bootstrap';
import {AdvancedTable} from "zavadil-react-common";
import StorageImage from "../image/StorageImage";
import {Page, PagingRequest, PagingUtil} from "zavadil-ts-common";
import {OcrRestClientContext} from "../../util/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate} from "react-router";

const HEADER = [
	{name: 'id', label: 'ID'},
	{name: 'name', label: 'Název'},
	{name: 'language', label: 'Jazyk'},
	{name: 'previewImg', label: 'Náhled'}
];

export type DocumentTemplateListProps = BasicListComponentProps & {}

function DocumentTemplatesList({pagingString}: DocumentTemplateListProps) {
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const paging = PagingUtil.pagingRequestFromString(pagingString);
	const [documentTemplates, setDocumentTemplates] = useState<Page<DocumentTemplateStub> | null>(null);

	const createNewTemplate = () => {
		navigate("/templates/detail/add")
	};

	const navidateToPage = (p: PagingRequest) => {
		navigate(`/templates/${PagingUtil.pagingRequestToString(p)}`);
	}

	const navidateToDetail = (d: DocumentTemplateStub) => {
		navigate(`/templates/detail/${d.id}`);
	}

	const loadTemplatesHandler = useCallback(
		() => {
			restClient
				.loadDocumentTemplates(paging)
				.then(setDocumentTemplates)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
		},
		[paging, restClient, userAlerts]
	);

	useEffect(loadTemplatesHandler, [loadTemplatesHandler]);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal">
					<Button onClick={createNewTemplate}>+ Nová</Button>
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
								onPagingChanged={navidateToPage}
								hover={true}
								striped={true}
							>
								{
									(documentTemplates.totalItems === 0) ? <tr>
											<td colSpan={HEADER.length}>No templates</td>
										</tr> :
										documentTemplates.content.map((template, index) => {
											return (
												<tr key={index} role="button" onClick={() => navidateToDetail(template)}>
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
