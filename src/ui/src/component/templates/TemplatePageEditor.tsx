import {Form} from "react-bootstrap";
import {DocumentTemplatePage, DocumentTemplateStub} from "../../types/entity/Template";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {Localize, LookupSelect} from "zavadil-react-common";
import {BsPencil} from "react-icons/bs";
import {OcrNavigateContext} from "../../util/OcrNavigation";
import StorageImage from "../general/StorageImage";

export type TemplatePageEditorProps = {
	page: DocumentTemplatePage;
	onChanged: (p: DocumentTemplatePage) => any;
}

export default function TemplatePageEditor({page, onChanged}: TemplatePageEditorProps) {
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const ocrNavigate = useContext(OcrNavigateContext);
	const [documentTemplates, setDocumentTemplates] = useState<Array<DocumentTemplateStub>>();
	const [documentTemplate, setDocumentTemplate] = useState<DocumentTemplateStub>();

	const loadDocumentTemplates = useCallback(
		() => {
			restClient.documentTemplates.loadAllNonMulti()
				.then(setDocumentTemplates)
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, userAlerts]
	);

	useEffect(loadDocumentTemplates, []);

	const documentTemplateId = useMemo(
		() => page.documentTemplateId,
		[page]
	);

	useEffect(
		() => {
			restClient
				.documentTemplates
				.loadSingle(documentTemplateId)
				.then(setDocumentTemplate)
				.catch((e) => userAlerts.err(e))
		},
		[documentTemplateId]
	);

	return (
		<div className="document-template-editor">
			<div className="d-flex gap-2">
				<div>
					<div className="d-flex gap-2 align-items-center">
						<Form.Label><Localize text="Template"/>:</Form.Label>
						<LookupSelect
							showEmptyOption={false}
							id={page.documentTemplateId}
							options={documentTemplates}
							onChange={(e) => {
								page.documentTemplateId = Number(e);
								onChanged({...page});
							}}
						/>
						{
							(page.documentTemplateId) &&
							<a
								href={ocrNavigate.templates.detail(page.documentTemplateId)}
								className="text-nowrap d-flex align-items-center gap-2"
								title="Upravit šablonu"
							>
								<BsPencil/>
							</a>
						}
					</div>
				</div>
				<div>
					{
						documentTemplate && <StorageImage path={documentTemplate.previewImg} size="preview"/>
					}
				</div>
			</div>
		</div>
	);
}
