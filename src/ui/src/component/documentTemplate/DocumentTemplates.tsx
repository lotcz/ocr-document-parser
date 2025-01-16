import React, {useCallback, useContext, useEffect, useState} from 'react';
import {BasicComponentProps} from "../../types/ComponentProps";
import DocumentTemplateEditor from "./DocumentTemplateEditor";
import DocumentTemplateList from "./DocumentTemplateList";
import {OcrRestClientContext} from "../../util/OcrRestClient";
import {DocumentTemplate} from "../../types/entity/DocumentTemplate";
import {Page, PagingRequest} from "zavadil-ts-common";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";

export type DocumentTemplatesProps = BasicComponentProps & {};

function DocumentTemplates() {
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const [paging, setPaging] = useState<PagingRequest>({page: 0, size: 50})
	const [documentTemplates, setDocumentTemplates] = useState<Page<DocumentTemplate> | null>(null);
	const [documentTemplate, setDocumentTemplate] = useState<DocumentTemplate | null>(null);
	const [previewImg, setPreviewImg] = useState<File>();

	const loadTemplatesHandler = useCallback(
		() => {
			restClient
				.loadDocumentTemplates(paging)
				.then(setDocumentTemplates)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
		},
		[paging, restClient, userAlerts]
	);

	const saveHandler = useCallback(
		(dt: DocumentTemplate) => {
			restClient.saveDocumentTemplate(dt)
				.then(() => setDocumentTemplate(null))
				.then(loadTemplatesHandler)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
		},
		[restClient, userAlerts, loadTemplatesHandler]
	);

	const deleteHandler = useCallback(
		() => {
			if (documentTemplate && documentTemplate.id) {
				restClient.deleteDocumentTemplate(documentTemplate.id)
					.then(() => setDocumentTemplate(null))
					.then(loadTemplatesHandler)
					.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
			} else {
				setDocumentTemplate(null);
			}
		},
		[restClient, userAlerts, documentTemplate, loadTemplatesHandler]
	);

	useEffect(loadTemplatesHandler, [loadTemplatesHandler]);

	return (
		<div className="document-templates">
			{
				documentTemplate ? (
					<DocumentTemplateEditor
						entity={documentTemplate}
						onClose={() => setDocumentTemplate(null)}
						onSave={saveHandler}
						onDelete={deleteHandler}
					/>
				) : (
					documentTemplates ? (
						<DocumentTemplateList
							page={documentTemplates}
							paging={paging}
							onEditorRequested={setDocumentTemplate}
							onPagingRequested={setPaging}
						/>
					) : (
						<>loading...</>
					)
				)
			}
		</div>
	);
}

export default DocumentTemplates;
