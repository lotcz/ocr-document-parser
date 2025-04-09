import {Button, Dropdown, Form, Spinner, Stack} from "react-bootstrap";
import {DocumentTemplateStub} from "../../types/entity/Template";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {useNavigate, useParams} from "react-router";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {FolderStub} from "../../types/entity/Folder";
import {NumberUtil} from "zavadil-ts-common";
import FolderChainControl from "./FolderChainControl";
import {FaFloppyDisk} from "react-icons/fa6";
import {WaitingDialogContext} from "../../util/WaitingDialogContext";
import {SelectFolderContext} from "../../util/SelectFolderContext";
import {Localize} from "zavadil-react-common";


export default function FolderEdit() {
	const {id, parentId} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const waitingDialog = useContext(WaitingDialogContext);
	const folderDialog = useContext(SelectFolderContext);
	const [folder, setFolder] = useState<FolderStub>();
	const [folderDocumentTemplate, setFolderDocumentTemplate] = useState<DocumentTemplateStub>();
	const [documentTemplates, setDocumentTemplates] = useState<Array<DocumentTemplateStub>>();

	// FOLDER

	const loadFolder = useCallback(
		() => {
			if (!id) {
				setFolder({
					name: 'New Folder',
					parentId: parentId ? Number(parentId) : undefined
				});
				return;
			}
			restClient.folders.loadSingle(Number(id))
				.then(setFolder)
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, id, parentId, userAlerts]
	);

	useEffect(loadFolder, [id]);

	const saveFolder = useCallback(
		() => {
			if (!folder) return;
			restClient.folders.save(folder)
				.then(setFolder)
				.then(() => navigate(-1))
				.catch((e: Error) => userAlerts.err(e));
		},
		[restClient, folder, navigate, userAlerts]
	);

	// DOCUMENT TEMPLATES

	const loadFolderDocumentTemplate = useCallback(
		() => {
			if (!folder) return;
			restClient.documentTemplates.loadDocumentTemplateForFolder(folder)
				.then((dt) => {
					if (dt) setFolderDocumentTemplate(dt);
				})
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, folder, userAlerts]
	);

	useEffect(loadFolderDocumentTemplate, [folder]);

	const loadDocumentTemplates = useCallback(
		() => {
			restClient.documentTemplates.loadAll()
				.then(setDocumentTemplates)
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, userAlerts]
	);

	useEffect(loadDocumentTemplates, []);

	const moveToFolder = useCallback(
		() => {
			folderDialog.selectFolder(
				(folderId: number) => {
					if (!folder) {
						userAlerts.warn("No folder!");
						return;
					}
					waitingDialog.show("Moving to folder...");
					folder.parentId = folderId;
					restClient.folders
						.save(folder)
						.then(
							() => {
								waitingDialog.hide();
								setFolder({...folder});
							}
						);
				},
				folder?.parentId
			)
		},
		[userAlerts, folder, restClient, folderDialog, waitingDialog]
	);

	if (!folder) {
		return <Spinner/>
	}

	return (
		<div>
			<div className="border-bottom">
				<FolderChainControl folder={folder}/>
			</div>
			<div className="d-flex justify-content-between p-2 gap-2">
				<Stack direction="horizontal" gap={2}>
					<Button size="sm" className="btn-link" onClick={() => navigate(-1)}>Zpět</Button>
					<Button size="sm" onClick={saveFolder} className="d-flex gap-2 align-items-center text-nowrap"><FaFloppyDisk/> Uložit</Button>
					<Dropdown>
						<Dropdown.Toggle size="sm" variant="link" id="dropdown-basic">
							Více...
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item onClick={moveToFolder}><Localize text="Move"/></Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Stack>
			</div>
			<Form className="p-3">
				<Stack direction="vertical" gap={2}>
					<div>
						<Form.Label>Název:</Form.Label>
						<Form.Control
							type="text"
							value={folder.name}
							onChange={(e) => {
								folder.name = e.target.value;
								setFolder({...folder});
							}}
						/>
					</div>
					<div>
						<Form.Label>Šablona:</Form.Label>
						<Form.Select
							value={folder.documentTemplateId || ''}
							onChange={(e) => {
								folder.documentTemplateId = NumberUtil.parseNumber(e.target.value);
								setFolder({...folder});
							}}
						>
							{
								<option key={""} value={""}>(výchozí) {folderDocumentTemplate ? folderDocumentTemplate.name : ''}</option>
							}
							{
								documentTemplates && documentTemplates.map(
									(dt, i) => <option key={i} value={Number(dt.id)}>{dt.name}</option>
								)
							}
						</Form.Select>
					</div>
				</Stack>
			</Form>
		</div>
	)
}
