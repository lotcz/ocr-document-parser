import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Stack} from 'react-bootstrap';
import {DateUtil, NumberUtil, Page, PagingRequest} from "zavadil-ts-common";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {useNavigate, useParams} from "react-router";
import {DocumentStubWithFragments} from "../../types/entity/Document";
import {BsPencil, BsUpload} from "react-icons/bs";
import {VscRefresh} from "react-icons/vsc";
import {AdvancedTable, IconButton, LookupSelect} from "zavadil-react-common";
import MassUploadDialog from "../folders/MassUploadDialog";
import {DocumentTemplateStub, FragmentTemplateStub} from "../../types/entity/Template";
import {OcrNavigateContext} from "../../util/OcrNavigation";
import DocumentStateControl from "../documents/DocumentStateControl";
import StorageImage from "../image/StorageImage";


const DEFAULT_HEADER = [
	{name: 'imagePath', label: 'Image'},
	{name: 'state', label: 'State'},
	{name: 'createdOn', label: 'Date'}
];

function TemplateDocumentsBrowser() {
	const {defaultTemplateId} = useParams();
	const navigate = useNavigate();
	const ocrNavigate = useContext(OcrNavigateContext);
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const [templateId, setTemplateId] = useState<number | null | undefined>(NumberUtil.parseNumber(defaultTemplateId));
	const [template, setTemplate] = useState<DocumentTemplateStub>();
	const [templates, setTemplates] = useState<Array<DocumentTemplateStub>>();
	const [fragments, setFragments] = useState<Array<FragmentTemplateStub>>();
	const [documents, setDocuments] = useState<Page<DocumentStubWithFragments>>();
	const [documentsPaging, setDocumentsPaging] = useState<PagingRequest>({page: 0, size: 100});
	const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>();

	const header = useMemo(
		() => {
			const h = [...DEFAULT_HEADER];
			fragments?.forEach((f) => h.push({name: `fields.${f.name}`, label: f.name}));
			return h;
		},
		[fragments]
	);

	const loadTemplate = useCallback(
		() => {
			if (!templateId) return;
			restClient.documentTemplates.loadSingle(templateId)
				.then(setTemplate)
				.catch((e: Error) => userAlerts.err(e));
		},
		[templateId, restClient, userAlerts]
	);

	useEffect(loadTemplate, [templateId]);

	useEffect(
		() => {
			restClient.documentTemplates.loadAll()
				.then(setTemplates)
				.catch((e: Error) => userAlerts.err(e));
		},
		[]
	);

	const loadFragments = useCallback(
		() => {
			setFragments(undefined);
			if (!templateId) {
				return;
			}
			restClient.loadDocumentTemplateFragments(templateId)
				.then(setFragments)
				.catch((e: Error) => userAlerts.err(e));
		},
		[templateId, restClient, userAlerts, documentsPaging]
	);

	useEffect(loadFragments, [templateId]);

	const loadDocuments = useCallback(
		() => {
			if (!templateId) {
				setDocuments({content: [], totalItems: 0, pageSize: 0, pageNumber: 0});
				return;
			}
			setDocuments(undefined);
			restClient.documentTemplates.loadDocumentsWithFragments(templateId, documentsPaging)
				.then(setDocuments)
				.catch((e: Error) => userAlerts.err(e));
		},
		[templateId, restClient, userAlerts, documentsPaging]
	);

	useEffect(loadDocuments, [templateId, documentsPaging]);

	return (
		<div>
			<div className="d-flex justify-content-between gap-2 p-2">
				<Stack direction="horizontal" gap={2}>
					<div className="d-flex align-items-center gap-2 pt-2 p-1">
						<div>Šablona:</div>
						<div>
							<LookupSelect id={templateId} options={templates} onChange={setTemplateId}/>
						</div>
					</div>
					<IconButton
						onClick={loadDocuments}
						size="sm"
						icon={<VscRefresh/>}
					>
						Obnovit
					</IconButton>
					{
						template && <IconButton
							onClick={() => navigate(ocrNavigate.templates.detail(templateId))}
							size="sm"
							icon={<BsPencil/>}
						>
							Upravit šablonu
						</IconButton>
					}
					{
						template && <IconButton
							onClick={() => setUploadDialogOpen(true)}
							size="sm"
							icon={<BsUpload/>}
						>
							Nahrát
						</IconButton>
					}
				</Stack>
			</div>
			<div>
				{
					<AdvancedTable
						header={header}
						paging={documentsPaging}
						totalItems={documents ? documents.totalItems : 0}
						onPagingChanged={setDocumentsPaging}
						hover={true}
					>
						{
							documents?.content.map(
								(d, i) => <tr
									key={i}
									className="cursor-pointer"
									onClick={() => navigate(ocrNavigate.documents.detail(d.id))}
								>
									<td><StorageImage size="tiny" path={d.imagePath}/></td>
									<td><DocumentStateControl state={d.state}/></td>
									<td>{DateUtil.formatDateForHumans(d.createdOn)}</td>
									{
										fragments && fragments.map(
											(f, i) => <td key={i}>{d.fragments.find(df => df.fragmentTemplateId === f.id)?.text}</td>
										)
									}
								</tr>
							)
						}
					</AdvancedTable>
				}
			</div>
			{
				templateId && uploadDialogOpen && <MassUploadDialog
					onClose={
						() => {
							setUploadDialogOpen(false);
							loadDocuments();
						}
					}
					folderId={templateId}
				/>
			}
		</div>
	);
}

export default TemplateDocumentsBrowser;
