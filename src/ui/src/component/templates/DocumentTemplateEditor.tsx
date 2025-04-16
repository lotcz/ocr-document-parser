import {Button, Dropdown, Form, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import DocumentTemplateForm from "./DocumentTemplateForm";
import {DocumentTemplatePage, DocumentTemplateStub, FragmentTemplateStub} from "../../types/entity/Template";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";
import DocumentTemplateFragments from "./DocumentTemplateFragments";
import DocumentTemplateFragmentsImage from "./DocumentTemplateFragmentsImage";
import {ConfirmDialogContext, IconButton, Localize, SaveButton} from "zavadil-react-common";
import {NumberUtil} from "zavadil-ts-common";
import TemplatePageEditor from "./TemplatePageEditor";
import {BsFileImage, BsPlusCircle, BsX} from "react-icons/bs";
import {SelectDocumentContext} from "../../util/SelectDocumentContext";

const NEW_TEMPLATE: DocumentTemplateStub = {
	name: 'New template',
	isMulti: false,
	language: 'ces',
	previewImg: '',
	createdOn: new Date(),
	lastUpdatedOn: new Date()
};

export default function DocumentTemplateEditor() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const documentDialog = useContext(SelectDocumentContext);
	const [documentTemplate, setDocumentTemplate] = useState<DocumentTemplateStub>();
	const [pages, setPages] = useState<Array<DocumentTemplatePage> | null>();
	const [fragments, setFragments] = useState<Array<FragmentTemplateStub> | null>();
	const [selectedFragment, setSelectedFragment] = useState<FragmentTemplateStub>();
	const [stubChanged, setStubChanged] = useState<boolean>(false);
	const [fragmentsChanged, setFragmentsChanged] = useState<boolean>(false);
	const [pagesChanged, setPagesChanged] = useState<boolean>(false);
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
			restClient.documentTemplates.loadSingle(documentTemplateId)
				.then(setDocumentTemplate)
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setIsLoading(false));
		},
		[restClient, userAlerts, documentTemplateId]
	);

	useEffect(loadDocumentTemplate, [id]);

	const saveDocumentTemplate = useCallback(
		() => {
			if (documentTemplate === undefined) return;

			setIsSaving(true);
			restClient.documentTemplates.save(documentTemplate)
				.then(
					async (saved) => {
						setStubChanged(false);
						if (previewImg) {
							const img = await restClient.documentTemplates.uploadDocumentTemplatePreview(Number(saved.id), previewImg);
							setPreviewImg(undefined);
							saved.previewImg = img;
							return saved;
						} else {
							return Promise.resolve(saved);
						}
					}
				)
				.then(
					async (saved) => {
						if (fragmentsChanged && fragments) {
							return restClient
								.documentTemplates
								.saveDocumentTemplateFragments(Number(saved.id), fragments)
								.then(setFragments)
								.then(() => setFragmentsChanged(false))
								.then(() => saved);
						} else {
							return Promise.resolve(saved);
						}
					}
				)
				.then(
					async (saved) => {
						if (pagesChanged && pages) {
							return restClient
								.documentTemplates
								.saveDocumentTemplatePages(Number(saved.id), pages)
								.then(setPages)
								.then(() => setPagesChanged(false))
								.then(() => saved);
						} else {
							return Promise.resolve(saved);
						}
					}
				)
				.then(
					(dt) => {
						if (dt.id && !documentTemplate.id) {
							navigate(`/templates/detail/${dt.id}`);
						} else {
							setDocumentTemplate(dt);
						}
					}
				)
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setIsSaving(false));
		},
		[pages, pagesChanged, navigate, previewImg, restClient, userAlerts, documentTemplate, fragments, fragmentsChanged]
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
		(dt: DocumentTemplateStub) => {
			setStubChanged(true);
			setDocumentTemplate({...dt});
		},
		[]
	)

	// FRAGMENTS

	const loadFragments = useCallback(
		() => {
			if (!documentTemplateId) {
				setFragments(null);
				return;
			}
			restClient
				.documentTemplates
				.loadDocumentTemplateFragments(documentTemplateId)
				.then(setFragments)
				.catch((e: Error) => userAlerts.err(e))
		},
		[documentTemplateId, restClient, userAlerts]
	);

	useEffect(loadFragments, [documentTemplateId]);

	const fragmentsOnChanged = useCallback(
		(nf: Array<FragmentTemplateStub>) => {
			setFragmentsChanged(true);
			setFragments([...nf]);
		},
		[]
	);

	// PAGES

	const getNewPage = (parentDocumentId?: number | null, page?: number): DocumentTemplatePage => {
		return {
			page: page || 0,
			documentTemplateId: 0,
			parentDocumentId: Number(parentDocumentId),
			createdOn: new Date(),
			lastUpdatedOn: new Date()
		}
	};

	const loadPages = useCallback(
		() => {
			if (!documentTemplateId) {
				setPages(null);
				return;
			}
			restClient
				.documentTemplates
				.loadTemplatePages(documentTemplateId)
				.then(setPages)
				.catch((e: Error) => userAlerts.err(e))
		},
		[documentTemplateId, restClient, userAlerts]
	);

	useEffect(loadPages, [documentTemplateId]);

	const deletePage = useCallback(
		(p: DocumentTemplatePage) => {
			if (!pages) return;
			setPages(pages.filter(pg => p !== pg));
			setPagesChanged(true);
		},
		[pages]
	);

	const checkPages = useCallback(
		() => {
			if (isSaving || !(documentTemplate && pages && fragments)) return;

			if (documentTemplate.isMulti) {
				if (fragments.length > 0 && pages.length > 0) {
					setFragments([]);
					setFragmentsChanged(true);
					userAlerts.warn("Fragments were deleted!");
					return;
				}
				if (fragments.length > 0 && pages.length === 0) {
					confirmDialog.confirm(
						"Create template?",
						"Do you want to create a new template for the first page from current template?",
						() => {
							restClient.documentTemplates.createTemplateWithFragments(
								{
									name: `${documentTemplate.name} - page 0`,
									language: documentTemplate.language,
									previewImg: documentTemplate.previewImg,
									isMulti: false
								},
								fragments
							).then(
								(dt) => {
									setFragments([]);
									setFragmentsChanged(true);
									const page = getNewPage(Number(documentTemplate.id));
									page.documentTemplateId = Number(dt.id);
									setPages([page]);
									userAlerts.warn("Fragments were saved as template for page 0!");
								}
							);
						}
					)
					return;
				}
			} else {
				if (pages.length > 0) {
					setPages([]);
					setPagesChanged(true);
					userAlerts.warn("Pages were deleted!");
					return;
				}
			}
		},
		[isSaving, documentTemplate, pages, fragments, userAlerts, restClient, confirmDialog]
	);

	useEffect(checkPages, [pages, documentTemplate, fragments]);

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
			<div className="pt-2 px-3">
				<Stack direction="horizontal" gap={2}>
					<Button onClick={navigateBack} variant="link"><Localize text="Back"/></Button>
					<SaveButton
						onClick={saveDocumentTemplate}
						isChanged={stubChanged || fragmentsChanged || pagesChanged || previewImg !== undefined}
						loading={isSaving}
						disabled={isLoading}
						size="sm"
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
			<div className="px-2 col-md-4">
				<DocumentTemplateForm entity={documentTemplate} onChange={stubOnChanged}/>
			</div>
			{
				documentTemplate.isMulti ? (
					<div>
						<div className="p-2">
							<strong><Localize text="Pages"/></strong>
						</div>
						<div className="m-2 d-flex align-items-center">
							{
								pages && <IconButton
									size="sm"
									icon={<BsPlusCircle/>}
									onClick={
										() => {
											const np = [...pages];
											const p = getNewPage(documentTemplate.id, pages.length);
											np.push({...p});
											setPages(np);
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
									pages && pages.map(
										(p, index) => <Tab
											key={index}
											eventKey={String(p.page)}
											title={
												<div className="d-flex align-items-center gap-2">
													<Localize text="Page"/>
													<div>{p.page}</div>
													<IconButton
														size="sm"
														icon={<BsX size={20} color="red"/>}
														onClick={() => deletePage(p)}
													/>
												</div>
											}
										>
											<div className="border-bottom border-start border-end p-3 rounded-bottom">
												<TemplatePageEditor
													page={p}
													onChanged={
														(changed) => {
															const ps = pages.map((pa) => pa === p ? {...changed} : pa);
															setPages(ps);
															setPagesChanged(true);
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
				) : (
					<div className="d-flex p-2 gap-3">
						<div>
							<strong><Localize text="Fragments"/></strong>
							{
								fragments && <DocumentTemplateFragments
									entity={fragments}
									onChange={fragmentsOnChanged}
									onSelected={setSelectedFragment}
									selectedFragment={selectedFragment}
									documentTemplate={documentTemplate}
								/>
							}
						</div>
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
							<div className="w-auto d-inline-block">
								{
									fragments && <DocumentTemplateFragmentsImage
										entity={fragments}
										onChange={fragmentsOnChanged}
										onSelected={setSelectedFragment}
										selectedFragment={selectedFragment}
										documentTemplate={documentTemplate}
									/>
								}
							</div>
						</div>
					</div>
				)
			}
		</div>
	);
}
