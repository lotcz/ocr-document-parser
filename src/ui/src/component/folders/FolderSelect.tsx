import React, {useCallback, useContext, useEffect, useState} from 'react';
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {FolderChain} from "../../types/entity/Folder";
import FolderChainControl from "./FolderChainControl";
import {LocalizationContext} from "zavadil-react-common";
import FolderSelectList from "./FolderSelectList";

export type FolderSelectParams = {
	selectedFolderId?: number;
	onSelected: (id: number) => any;
	isRoot?: boolean;
}

function FolderSelect({selectedFolderId, onSelected, isRoot}: FolderSelectParams) {
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const localization = useContext(LocalizationContext);
	const [folder, setFolder] = useState<FolderChain>();

	const loadFolderChain = useCallback(
		() => {
			if (!selectedFolderId) return;
			restClient.folders.loadFolderChain(selectedFolderId)
				.then(setFolder)
				.catch((e: Error) => userAlerts.err(e));
		},
		[selectedFolderId, restClient, userAlerts]
	);

	useEffect(loadFolderChain, [selectedFolderId]);

	return (
		<div>
			<div className="">
				<div className="border-bottom p-1">
					<FolderChainControl folder={folder}/>
				</div>
				{
					folder && <FolderSelectList onSelected={onSelected} chain={folder}/>
				}
			</div>
		</div>
	);
}

export default FolderSelect;
