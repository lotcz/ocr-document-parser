import {Dropdown, Form, Spinner, Stack} from "react-bootstrap";
import {DocumentTemplateStub} from "../../types/entity/Template";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {useNavigate, useParams} from "react-router";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {FolderStub} from "../../types/entity/Folder";
import {NumberUtil} from "zavadil-ts-common";
import FolderChainControl from "./FolderChainControl";
import {WaitingDialogContext} from "../../util/WaitingDialogContext";
import {SelectFolderContext} from "../../util/SelectFolderContext";
import {Localize, SaveButton} from "zavadil-react-common";
import BackIconButton from "../general/BackIconButton";
import {OcrNavigateContext} from "../../util/OcrNavigation";


export default function FolderEdit() {
	const {id, parentId} = useParams();
	const navigate = useNavigate();
	const ocrNavigate = useContext(OcrNavigateContext);
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const waitingDialog = useContext(WaitingDialogContext);
	const folderDialog = useContext(SelectFolderContext);
	const [folder, setFolder] = useState<FolderStub>();
	const [isChanged, setIsChanged] = useState<boolean>(false);
	const [folderDocumentTemplate, setFolderDocumentTemplate] = useState<DocumentTemplateStub>();
	const [documentTemplates, setDocumentTemplates] = useState<Array<DocumentTemplateStub>>();

	const navigateBack = useCallback(
		() => {
			if (folder === undefined) {
				navigate(-1);
			}
			navigate(ocrNavigate.folders.detail(folder?.id || folder?.parentId));
		},
		[navigate, ocrNavigate, folder]
	);

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
				.then(() => setIsChanged(false))
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
				.then(() => setIsChanged(false))
				.catch((e: Error) => userAlerts.err(e));
		},
		[restClient, folder, userAlerts]
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
								setIsChanged(false);
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
					<BackIconButton onClick={navigateBack}/>
					<SaveButton
						onClick={saveFolder}
						isChanged={isChanged}
					>
						<Localize text="Uložit"/>
					</SaveButton>
					<Dropdown>
						<Dropdown.Toggle variant="link" id="dropdown-basic">
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
								setIsChanged(true);
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
								setIsChanged(true);
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
