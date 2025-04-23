import {Dropdown, Form, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import DocumentTemplateForm from "./DocumentTemplateForm";
import {DocumentTemplateStubWithPages, PageTemplateStubWithFragments} from "../../types/entity/Template";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";
import {ConfirmDialogContext, IconButton, Localize, SaveButton} from "zavadil-react-common";
import {NumberUtil} from "zavadil-ts-common";
import PageTemplateEditor from "./PageTemplateEditor";
import {BsArrow90DegUp, BsFileImage, BsPlusCircle, BsTrash} from "react-icons/bs";
import {SelectDocumentContext} from "../../util/SelectDocumentContext";
import {OcrNavigateContext} from "../../util/OcrNavigation";
import StorageImage from "../general/StorageImage";

const NEW_TEMPLATE: DocumentTemplateStubWithPages = {
	name: '',
	languageId: null,
	previewImg: '',
	createdOn: new Date(),
	lastUpdatedOn: new Date(),
	pages: [
		{
			pageNumber: 0,
			fragments: []
		}
	]
};

export default function DocumentTemplateEditor() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const ocrNavigate = useContext(OcrNavigateContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const documentDialog = useContext(SelectDocumentContext);
	const [documentTemplate, setDocumentTemplate] = useState<DocumentTemplateStubWithPages>();
	const [stubChanged, setStubChanged] = useState<boolean>(false);
	const [previewImg, setPreviewImg] = useState<File>();
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const navigateBack = useCallback(() => navigate(-1), [navigate]);

	// DOCUMENT TEMPLATE

	const documentTemplateId = useMemo(
		() => NumberUtil.parseNumber(id),
		[id]
	);

	const loadDocumentTemplate = useCallback(
		() => {
			if (!documentTemplateId) {
				setDocumentTemplate({...NEW_TEMPLATE});
				return;
			}
			setIsLoading(true);
			restClient.documentTemplates
				.loadSingle(documentTemplateId)
				.then(setDocumentTemplate)
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setIsLoading(false));
		},
		[restClient, userAlerts, documentTemplateId]
	);

	useEffect(loadDocumentTemplate, [id]);

	const saveDocumentTemplateStub = useCallback(
		() => {
			if (documentTemplate === undefined) return Promise.reject("No template to save!");
			if (stubChanged) {
				return restClient.documentTemplates.save(documentTemplate)
					.then(
						(dt) => {
							setStubChanged(false);
							return dt;
						}
					);
			} else {
				return Promise.resolve(documentTemplate);
			}
		},
		[restClient, documentTemplate, stubChanged]
	);

	const uploadPreviewImage = useCallback(
		() => {
			if (documentTemplate === undefined) return Promise.reject("No template to save!");
			if (previewImg) {
				return restClient.documentTemplates
					.uploadDocumentTemplatePreview(Number(documentTemplate.id), previewImg)
					.then(
						(saved) => {
							setPreviewImg(undefined);
							return saved;
						}
					);
			} else {
				return Promise.resolve(documentTemplate);
			}
		},
		[restClient, documentTemplate, previewImg]
	);

	const saveDocumentTemplate = useCallback(
		() => {
			if (documentTemplate === undefined) return;

			setIsSaving(true);
			saveDocumentTemplateStub()
				.then(uploadPreviewImage)
				.then(
					(dt) => {
						if (dt.id && !documentTemplate.id) {
							navigate(ocrNavigate.templates.detail(dt.id));
						} else {
							setDocumentTemplate(dt);
						}
					}
				)
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setIsSaving(false));
		},
		[navigate, ocrNavigate, userAlerts, documentTemplate, saveDocumentTemplateStub, uploadPreviewImage]
	);

	const deleteDocumentTemplate = useCallback(
		() => {
			if (documentTemplateId) {
				confirmDialog.confirm(
					'Smazat?',
					'Opravdu si přejete smazat tuto šablonu?',
					() => {
						restClient.documentTemplates.delete(documentTemplateId)
							.then(navigateBack)
							.catch((e: Error) => userAlerts.err(e));
					}
				);
			} else {
				navigateBack();
			}
		},
		[restClient, userAlerts, confirmDialog, documentTemplateId, navigateBack]
	);

	const stubOnChanged = useCallback(
		(dt: DocumentTemplateStubWithPages) => {
			setStubChanged(true);
			setDocumentTemplate({...dt});
		},
		[]
	)

	// PAGES

	const getNewPage = (parentDocumentId?: number | null, page?: number): PageTemplateStubWithFragments => {
		return {
			pageNumber: page || 0,
			documentTemplateId: Number(parentDocumentId),
			createdOn: new Date(),
			lastUpdatedOn: new Date(),
			fragments: []
		}
	};

	const deletePage = useCallback(
		(p: PageTemplateStubWithFragments) => {
			if (!documentTemplate) return;
			documentTemplate.pages = documentTemplate.pages.filter(pg => p !== pg);
			stubOnChanged(documentTemplate);
		},
		[documentTemplate, stubOnChanged]
	);

	const useDocumentAsPreview = useCallback(
		() => {
			documentDialog.selectDocument(
				(d) => {
					if (!(d && documentTemplate)) return;
					documentTemplate.previewImg = d.imagePath;
					setDocumentTemplate({...documentTemplate});
				}
			);
		},
		[documentDialog, documentTemplate]
	);

	if (!documentTemplate) {
		return <Spinner/>
	}

	return (
		<div className="document-template-editor">
			<div className="p-2">
				<Stack direction="horizontal" gap={2}>
					<IconButton onClick={navigateBack} icon={<BsArrow90DegUp/>}/>
					<SaveButton
						onClick={saveDocumentTemplate}
						isChanged={stubChanged || previewImg !== undefined}
						loading={isSaving}
						disabled={isLoading}
					>
						<Localize text="Save"/>
					</SaveButton>
					<Dropdown>
						<Dropdown.Toggle variant="link" id="dropdown-basic">
							<Localize text="Více..."/>
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item onClick={deleteDocumentTemplate}><Localize text="Delete"/></Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Stack>
			</div>
			<div className="d-flex">
				<div className="px-2 col-md-3">
					<DocumentTemplateForm entity={documentTemplate} onChange={stubOnChanged}/>
				</div>
				<div className="d-flex flex-column gap-2">
					<div>
						<Form.Label><Localize text="Example"/>:</Form.Label>
						<div className="d-flex align-items-center gap-2">
							<Form.Control
								type="file"
								onChange={(e) => {
									const files = (e.target as HTMLInputElement).files
									const f = files ? files[0] : undefined;
									setPreviewImg(f);
								}}
							/>
							<IconButton
								icon={<BsFileImage/>}
								onClick={useDocumentAsPreview}
							/>
						</div>
					</div>
					<div>
						<Form.Label><Localize text="Preview"/>:</Form.Label>
						<div>
							<small><code>{documentTemplate.previewImg}</code></small>
						</div>
						<div className="d-flex gap-1">
							{
								documentTemplate.pages.map((p) => <StorageImage path={p.previewImg} size="tiny"/>)
							}
						</div>
					</div>
				</div>
			</div>

			<div>
				<div className="p-2">
					<strong><Localize text="Pages"/></strong>
				</div>
				<div className="m-2 d-flex align-items-center">
					{
						documentTemplate && <IconButton
							size="sm"
							icon={<BsPlusCircle/>}
							onClick={
								() => {
									const p = getNewPage(documentTemplate.id, documentTemplate.pages.length);
									documentTemplate.pages = [...documentTemplate.pages, p];
									stubOnChanged(documentTemplate);
								}
							}
						><Localize text="Add"/></IconButton>
					}
				</div>
				<div className="p-2">
					<Tabs
						defaultActiveKey="0"
						id="pages-tabs"
					>
						{
							documentTemplate && documentTemplate.pages.map(
								(p, index) => <Tab
									key={index}
									eventKey={String(p.pageNumber)}
									title={
										<div className="d-flex align-items-center gap-2">
											<Localize text="Page"/>
											<div>{p.pageNumber}</div>
											<IconButton
												size="sm"
												variant="danger"
												icon={<BsTrash/>}
												onClick={() => deletePage(p)}
											/>
										</div>
									}
								>
									<div className="border-bottom border-start border-end p-3 rounded-bottom">
										<PageTemplateEditor
											page={p}
											onChanged={
												(changed) => {
													documentTemplate.pages = documentTemplate.pages.map((pa) => pa === p ? {...changed} : pa);
													stubOnChanged(documentTemplate);
												}
											}
										/>
									</div>
								</Tab>
							)
						}
					</Tabs>
				</div>
			</div>


		</div>
	);
}
