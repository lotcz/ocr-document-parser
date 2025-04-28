import {Form} from "react-bootstrap";
import {DocumentTemplateStub, DocumentTemplateStubWithPages, FragmentTemplateStub, PageTemplateStubWithFragments} from "../../types/entity/Template";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext, Localize, LookupSelect} from "zavadil-react-common";
import {OcrNavigateContext} from "../../util/OcrNavigation";
import PageTemplateFragments from "./PageTemplateFragments";
import PageTemplateFragmentsImage from "./PageTemplateFragmentsImage";

export type DocumentTemplatePageEditorProps = {
	page: PageTemplateStubWithFragments;
	onChanged: (p: PageTemplateStubWithFragments) => any;
}

export default function PageTemplateEditor({page, onChanged}: DocumentTemplatePageEditorProps) {
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const ocrNavigate = useContext(OcrNavigateContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [documentTemplates, setDocumentTemplates] = useState<Array<DocumentTemplateStubWithPages>>();
	const [documentTemplate, setDocumentTemplate] = useState<DocumentTemplateStub>();
	const [selectedFragment, setSelectedFragment] = useState<FragmentTemplateStub>();

	const loadDocumentTemplates = useCallback(
		() => {
			restClient.documentTemplates.loadAll()
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
			if (!documentTemplateId) return;
			restClient
				.documentTemplates
				.loadSingle(documentTemplateId)
				.then(setDocumentTemplate)
				.catch((e) => userAlerts.err(e))
		},
		[documentTemplateId]
	);

	const deleteFragmentInternal = useCallback(
		(fragment: FragmentTemplateStub) => {
			if (!page) return;
			page.fragments = page.fragments.filter((f) => f !== fragment);
			onChanged(page);
		},
		[page, onChanged]
	);

	const deleteFragment = useCallback(
		(fragment: FragmentTemplateStub) => {
			if (!page) return;
			if (fragment.id) {
				confirmDialog.confirm(
					'Delete Fragment Template?',
					'All existing parsed fragments of this template be deleted, too. Really delete this template fragment?',
					() => deleteFragmentInternal(fragment)
				)
			} else {
				deleteFragmentInternal(fragment);
			}
		},
		[page, deleteFragmentInternal, confirmDialog]
	);

	const updateFragment = useCallback(
		(old: FragmentTemplateStub | null, updated: FragmentTemplateStub) => {
			const uf = {...updated};
			page.fragments = page.fragments.map((p) => p === old ? uf : p);
			if (old === null) page.fragments.push(uf);
			if (selectedFragment === old || old === null) setSelectedFragment(uf);
			onChanged(page);
		},
		[page, onChanged, selectedFragment]
	);

	return (
		<div className="page-template-editor">
			<div className="d-flex gap-2">
				<div>
					<div className="d-flex gap-2 align-items-center">
						<Form.Label className="text-nowrap"><Localize text="Use another"/>:</Form.Label>
						<LookupSelect
							showEmptyOption={true}
							id={page.inheritFromPageTemplateId}
							options={documentTemplates}
							onChange={(e) => {
								page.documentTemplateId = Number(e);
								onChanged({...page});
							}}
						/>
					</div>
				</div>
			</div>
			<div className="d-flex p-2 gap-3">
				<div>
					<strong><Localize text="Fragments"/></strong>
					{
						page && <PageTemplateFragments
							entity={page}
							onChange={onChanged}
							onSelected={setSelectedFragment}
							selectedFragment={selectedFragment}
							updateFragment={updateFragment}
							deleteFragment={deleteFragment}
						/>
					}
				</div>
				<div>
					<div className="w-auto d-inline-block">
						{
							page && <PageTemplateFragmentsImage
								entity={page}
								onChange={onChanged}
								onSelected={setSelectedFragment}
								selectedFragment={selectedFragment}
								updateFragment={updateFragment}
								deleteFragment={deleteFragment}
							/>
						}
					</div>
				</div>
			</div>
		</div>
	);
}
