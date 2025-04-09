import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {findInChain, FolderChain} from "../../types/entity/Folder";
import FolderChainControl from "./FolderChainControl";
import FolderSelectList from "./FolderSelectList";

export type FolderSelectParams = {
	selectedFolderId?: number | null;
	onSelected: (id: number) => any;
}

function FolderSelect({selectedFolderId, onSelected}: FolderSelectParams) {
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const [folder, setFolder] = useState<FolderChain>();

	const loadFolderChain = useCallback(
		() => {
			if (!selectedFolderId) return;
			if (folder) {
				const inChain = findInChain(folder, selectedFolderId);
				if (inChain) {
					setFolder(inChain);
					return;
				}
			}
			restClient.folders.loadFolderChain(selectedFolderId)
				.then(setFolder)
				.catch((e: Error) => userAlerts.err(e));
		},
		[folder, selectedFolderId, restClient, userAlerts]
	);

	useEffect(loadFolderChain, [selectedFolderId]);

	const prepChain = useMemo(
		() => {
			const prep = [];
			let f: FolderChain | null | undefined = folder;
			while (f) {
				prep.unshift(f);
				f = f.parent;
			}
			return prep;
		},
		[folder]
	);

	return (
		<div>
			<div className="">
				<div className="border-bottom mb-2">
					<FolderChainControl folder={folder}/>
				</div>
				{
					<FolderSelectList
						isRoot={true}
						selectedFolderId={selectedFolderId}
						onSelected={onSelected}
						chain={prepChain}
					/>
				}
			</div>
		</div>
	);
}

export default FolderSelect;
