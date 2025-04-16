import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {DateUtil, Page, PagingRequest} from "zavadil-ts-common";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {DocumentStub, DocumentStubWithFragments} from "../../types/entity/Document";
import {FolderChain, FolderStub} from "../../types/entity/Folder";
import FolderControl from "./FolderControl";
import FolderDocumentControl from "./FolderDocumentControl";
import {LocalizationContext, SelectableTableHeader, TableWithSelect} from "zavadil-react-common";
import {OcrUserSessionContext} from '../../util/OcrUserSession';
import {FragmentTemplateStub} from "../../types/entity/Template";
import DocumentImagePreview from "../documents/DocumentImagePreview";
import DocumentStateControl from "../documents/DocumentStateControl";

export type FolderBrowserProps = {
	reloadCounter?: number;
	folderId?: number | null;
	onMouseOver?: (d?: DocumentStub) => any;
	onMouseOnLeft?: (left: boolean) => any;
	onSelectedDocumentsChanged?: (selected: Array<DocumentStubWithFragments>) => any;
	onDocumentClicked?: (clicked: DocumentStub) => any;
	onFolderClicked?: (clicked: FolderStub) => any;
}

const DEFAULT_PAGING = {page: 0, size: 10};

function FolderBrowser({
	reloadCounter,
	folderId,
	onMouseOver,
	onMouseOnLeft,
	onSelectedDocumentsChanged,
	onDocumentClicked,
	onFolderClicked
}: FolderBrowserProps) {
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const session = useContext(OcrUserSessionContext);
	const localization = useContext(LocalizationContext);
	const [folder, setFolder] = useState<FolderChain>();
	const [fragments, setFragments] = useState<Array<FragmentTemplateStub>>();
	const [folders, setFolders] = useState<Page<FolderStub>>();
	const [documents, setDocuments] = useState<Page<DocumentStubWithFragments>>();
	const [documentsPaging, setDocumentsPaging] = useState<PagingRequest>(DEFAULT_PAGING);
	const [selectedDocuments, setSelectedDocuments] = useState<Array<DocumentStubWithFragments>>([]);

	const templateId = useMemo(
		() => folder ? folder.documentTemplateId : null,
		[folder]
	);

	const defaultHeader: SelectableTableHeader<DocumentStub> = useMemo(
		() => {
			return [
				{
					name: 'imagePath',
					label: 'Image',
					renderer: (d) => <DocumentImagePreview
						document={d}
						size="tiny"
						onMouseOver={onMouseOver}
						onMouseOut={() => {
							if (onMouseOver) onMouseOver(undefined);
						}}
					/>
				},
				{name: 'state', label: 'State', renderer: (d) => <DocumentStateControl state={d.state}/>},
				{name: 'createdOn', label: 'Date', renderer: (d) => DateUtil.formatDateForHumans(d.createdOn)}
			];
		},
		[onMouseOver]
	);

	const translatedHeader: SelectableTableHeader<DocumentStubWithFragments> = useMemo(
		() => defaultHeader.map(
			(f) => {
				return {
					name: f.name,
					label: (typeof f.label === 'string') ? localization.translate(f.label) : f.label,
					renderer: f.renderer
				}
			}),
		[localization, defaultHeader]
	);

	const header: SelectableTableHeader<DocumentStubWithFragments> = useMemo(
		() => {
			const h: SelectableTableHeader<DocumentStubWithFragments> = [...translatedHeader];
			if (fragments) {
				fragments.forEach(
					(f) => h.push(
						{
							name: `fields.${f.name}`,
							label: f.name,
							renderer: (d) => d.fragments.find(df => df.fragmentTemplateId === f.id)?.text
						}
					)
				);
			}
			return h;
		},
		[fragments, translatedHeader]
	);

	const loadFragments = useCallback(
		() => {
			setFragments(undefined);
			if (!templateId) {
				return;
			}
			restClient
				.documentTemplates
				.loadDocumentTemplateFragments(templateId)
				.then(setFragments)
				.catch((e: Error) => userAlerts.err(e));
		},
		[templateId, restClient, userAlerts]
	);

	useEffect(loadFragments, [templateId]);

	const loadFolderChain = useCallback(
		() => {
			if (!folderId) return;
			restClient.folders.loadFolderChain(folderId)
				.then(setFolder)
				.catch((e: Error) => userAlerts.err(e));
		},
		[folderId, restClient, userAlerts]
	);

	const loadFolders = useCallback(
		() => {
			restClient.folders.loadFolders(folderId, {page: 0, size: 100})
				.then(setFolders)
				.catch((e: Error) => userAlerts.err(e));
		},
		[folderId, restClient, userAlerts]
	);

	const loadDocuments = useCallback(
		() => {
			if (!folderId) {
				setDocuments({content: [], totalItems: 0, pageSize: 0, pageNumber: 0});
				return;
			}
			setDocuments(undefined);
			restClient.folders.loadFolderDocumentsWithFragments(folderId, documentsPaging)
				.then(setDocuments)
				.catch((e: Error) => userAlerts.err(e));
		},
		[folderId, restClient, userAlerts, documentsPaging]
	);

	useEffect(loadDocuments, [documentsPaging]);

	const reload = useCallback(
		() => {
			loadFolderChain();
			loadFolders();
			loadDocuments();
		},
		[loadFolderChain, loadFolders, loadDocuments]
	);

	useEffect(reload, [folderId, reloadCounter]);

	useEffect(
		() => {
			if (onSelectedDocumentsChanged) onSelectedDocumentsChanged(selectedDocuments);
		},
		[selectedDocuments]
	);

	return (
		<div
			className="folder-browser"
			onMouseMove={
				(e) => {
					if (onMouseOnLeft) onMouseOnLeft(e.clientX < (window.innerWidth / 2));
				}
			}
		>
			{
				folders ? (
					(folders.content.length > 0) && <div className="d-flex flex-wrap p-2 gap-2">
						{
							folders.content.map(
								(folder, index) => <FolderControl
									key={index}
									folder={folder}
									border={true}
									onClick={onFolderClicked}
								/>
							)
						}
					</div>) : <Spinner/>
			}
			{
				documents ? (
					session.displayDocumentsTable === true ?
						documents.content.length > 0 && <TableWithSelect
							showSelect={onSelectedDocumentsChanged !== undefined}
							header={header}
							paging={documentsPaging}
							totalItems={documents ? documents.totalItems : 0}
							onPagingChanged={setDocumentsPaging}
							onClick={onDocumentClicked}
							onSelect={setSelectedDocuments}
							items={documents.content}
						/>
						: <div className="d-flex flex-wrap p-2 gap-2">
							{
								documents.content.map(
									(d, i) => <FolderDocumentControl
										document={d}
										key={i}
										onMouseOver={onMouseOver}
										onMouseOut={() => {
											if (onMouseOver) onMouseOver(undefined);
										}}
									/>
								)
							}
						</div>
				) : <Spinner/>
			}
		</div>
	);
}

export default FolderBrowser;
