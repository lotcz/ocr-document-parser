import React, {useState} from 'react';
import {DocumentTemplate} from "../../types/entity/DocumentTemplate";
import {BasicListComponentProps} from "../../types/ComponentProps";
import {Button, Stack} from 'react-bootstrap';
import AdvancedTable from "../basic/AdvancedTable";
import {PagingRequest} from "incomaker-react-ts-commons";

const HEADER = [
	{name: 'id', label: 'ID'},
	{name: 'name', label: 'Name'}
];

export type DocumentTemplateListProps = BasicListComponentProps<DocumentTemplate> & {

}

function DocumentTemplateList({page, onEditorRequested}: DocumentTemplateListProps) {
	const [paging, setPaging] = useState<PagingRequest>()
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
			<div>
				{
					(page === null) ? <span>loading...</span>
						: (page.content.length === 0) ? (
							<tr>
								<td colSpan={3}>No templates available</td>
							</tr>
						) : (
							<div className="d-flex pt-2 gap-3">
								{
									page.content.map(
										(dt: DocumentTemplate) => (
											<AdvancedTable
												header={HEADER}
												paging={page}
												totalPages={}
												totalItems={}
												onPagingChanged={}
											>
												{
													(callbacks === null) ? <tr>
															<td colSpan={header.length}><Loading/></td>
														</tr> :
														callbacks.content.map((data, index) => {
															return (
																<tr key={index}>
																	<td>{data.id}</td>
																	<td>{data.execution.schedule.job.name}</td>
																	<td><ExecutionStateControl state={data.execution.result.executionState}/></td>
																	<td>{data.execution.worker?.name}</td>
																	<td>{formatDateForHumans(data.createTime)}</td>
																	<td><DurationControl ms={data.durationMs}/></td>
																	<td><AsyncCallbackStateControl state={data.state}/></td>
																	<td className="long-col">
																		<SmartTextBox text={data.result}/>
																	</td>
																</tr>
															);
														})
												}
											</AdvancedTable>
										)
									)
								}
							</div>
						)
				}
			</div>
		</div>
	);
}

export default DocumentTemplateList;
