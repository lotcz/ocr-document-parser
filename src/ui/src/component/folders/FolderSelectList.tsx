import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {FolderChain, FolderStub} from "../../types/entity/Folder";
import FolderControl from "./FolderControl";
import {LocalizationContext} from "zavadil-react-common";
import {Page} from 'zavadil-ts-common';

export type FolderSelectListParams = {
	selectedFolderId?: number;
	onSelected: (id: number) => any;
	chain: FolderChain;
}

function FolderSelectList({chain, selectedFolderId, onSelected}: FolderSelectListParams) {
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const localization = useContext(LocalizationContext);
	const [folders, setFolders] = useState<Page<FolderStub>>();
	const [next, setNext] = useState<FolderChain>(chain);

	const root = useMemo(
		() => {
			let r = chain;
			let n = r;
			while (r.parent) {
				n = r;
				r = r.parent;
			}
			setNext(n);
			return r;
		},
		[chain]
	);

	const loadFolders = useCallback(
		() => {
			restClient.folders.loadFolders(next.id, {page: 0, size: 100})
				.then(setFolders)
				.catch((e: Error) => userAlerts.err(e));
		},
		[next, restClient, userAlerts]
	);

	useEffect(loadFolders, [root]);

	return (
		<div>
			{
				folders ? (
					(folders.content.length > 0) && <div className="gap-2">
						{
							folders.content.map(
								(folder, index) => (
									<div>
										<FolderControl key={index} folder={folder} border={true}/>
										{
											(folder.id === next?.id) && <FolderSelectList onSelected={onSelected} chain={next}/>
										}
									</div>
								)
							)
						}
					</div>) : <Spinner/>
			}
		</div>
	);
}

export default FolderSelectList;
