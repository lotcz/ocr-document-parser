import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {FolderChain, FolderStub} from "../../types/entity/Folder";
import FolderControl from "./FolderControl";
import {Page} from 'zavadil-ts-common';

export type FolderSelectListParams = {
	selectedFolderId?: number | null;
	onSelected: (id: number) => any;
	chain: FolderChain[];
	isRoot?: boolean;
}

function FolderSelectList({chain, isRoot, selectedFolderId, onSelected}: FolderSelectListParams) {
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const [folders, setFolders] = useState<Page<FolderStub>>();

	const next = useMemo(
		() => {
			const n = [...chain];
			if (isRoot === false) n.shift();
			return n;
		},
		[chain, isRoot]
	);

	const loadFolders = useCallback(
		() => {
			if (isRoot !== false) {
				restClient.folders.loadFolders(null, {page: 0, size: 100})
					.then(setFolders)
					.catch((e: Error) => userAlerts.err(e));
				return;
			}
			if (chain.length === 0) return;
			restClient.folders.loadFolders(chain[0].id, {page: 0, size: 100})
				.then(setFolders)
				.catch((e: Error) => userAlerts.err(e));
		},
		[isRoot, chain, restClient, userAlerts]
	);

	useEffect(loadFolders, [chain, isRoot]);

	return (
		<div>
			{
				folders ? (
					(folders.content.length > 0) && <div className="gap-2">
						{
							folders.content.map(
								(folder, index) => (
									<div className="my-2">
										<FolderControl
											key={index}
											folder={folder}
											border={true}
											isActive={selectedFolderId === folder.id}
											onClick={
												(f) => {
													onSelected(Number(f.id));
												}
											}
										/>
										{
											(next.length > 0 && folder.id === next[0].id) && <div className="ps-4">
												<FolderSelectList
													isRoot={false}
													onSelected={onSelected}
													chain={next}
													selectedFolderId={selectedFolderId}
												/>
											</div>
										}
									</div>
								)
							)
						}
					</div>) : <Spinner size="sm"/>
			}
		</div>
	);
}

export default FolderSelectList;
