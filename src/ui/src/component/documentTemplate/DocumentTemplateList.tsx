import React from 'react';
import {DocumentTemplate} from "../../types/entity/DocumentTemplate";
import {BasicListComponentProps} from "../../types/ComponentProps";
import {Button, Spinner, Stack} from 'react-bootstrap';
import {AdvancedTable} from "zavadil-react-common";

const HEADER = [
	{name: 'id', label: 'ID'},
	{name: 'name', label: 'Name'}
];

export type DocumentTemplateListProps = BasicListComponentProps<DocumentTemplate> & {}

function DocumentTemplateList({page, paging, onEditorRequested, onPagingRequested}: DocumentTemplateListProps) {

	const createNewTemplate = () => onEditorRequested({
		id: null,
		name: '',
		language: 'ces',
		fragments: []
	});

	return (
		<div>
			<Stack direction="horizontal">
				<Button onClick={createNewTemplate}>+ Nový</Button>
			</Stack>
			<div className="d-flex pt-2 gap-3">
				{
					(page === null) ? <span><Spinner /></span>
						: (
							page.content.map(
								(dt: DocumentTemplate) => (
									<AdvancedTable
										header={HEADER}
										paging={paging}
										totalPages={page.pageNumber}
										totalItems={page.totalItems}
										onPagingChanged={onPagingRequested}
									>
										{
											(page.totalItems === 0) ? <tr>
													<td colSpan={HEADER.length}>No templates</td>
												</tr> :
												page.content.map((template, index) => {
													return (
														<tr key={index}>
															<td>{template.id}</td>
															<td>{template.name}</td>
														</tr>
													);
												})
										}
									</AdvancedTable>
								)
							)

						)
				}
			</div>
		</div>
	);
}

export default DocumentTemplateList;
