import React, {useContext, useState} from 'react';
import {BasicComponentProps} from "../../types/ComponentProps";
import DocumentTemplateEditor from "./DocumentTemplateEditor";
import DocumentTemplateList from "./DocumentTemplateList";
import {OcrRestClientContext} from "../../util/OcrRestClient";
import {DocumentTemplate} from "../../types/entity/DocumentTemplate";
import {Page} from "incomaker-react-ts-commons";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";

export type DocumentTemplatesProps = BasicComponentProps & {

};

function DocumentTemplates({}: DocumentTemplatesProps) {
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const [pageNumber, setPageNumber] = useState<number>(0);
	const [documentTemplates, setDocumentTemplates] = useState<Page<DocumentTemplate> | null>(null);
	const [documentTemplate, setDocumentTemplate] = useState<DocumentTemplate | null>(null);

	const loadDocumentTemplates = () => {
		restClient
			.loadDocumentTemplates(
				{
					page: pageNumber,
					size: 10
				}
			)
			.then(setDocumentTemplates)
			.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
	}

	const saveDocumentTemplate = (dt: DocumentTemplate) => {
		restClient.saveDocumentTemplate(dt)
			.then(loadDocumentTemplates)
			.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
	}

	const deleteDocumentTemplate = (id: number) => {
		restClient.deleteDocumentTemplate(id)
			.then(loadDocumentTemplates)
			.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
	}

	return (
		<div className="document-templates">
			{
				documentTemplate ? (
					<DocumentTemplateEditor
						entity={documentTemplate}
						onClose={() => setDocumentTemplate(null)}
						onSave={(e) => saveDocumentTemplate(e)}
						onDelete={() => documentTemplate.id && deleteDocumentTemplate(documentTemplate.id)}
					/>
				) : (
					documentTemplates ? (
						<DocumentTemplateList
							page={documentTemplates}
							onEditorRequested={setDocumentTemplate}
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
