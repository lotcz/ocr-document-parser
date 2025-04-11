import React, {useContext, useEffect, useState} from 'react';
import {FolderChain, FolderStub, isFolderChain} from "../../types/entity/Folder";
import {Stack} from "react-bootstrap";
import FolderControl from "./FolderControl";
import {BsCaretRight} from "react-icons/bs";
import FolderHomeControl from "./FolderHomeControl";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";

export type FolderChainControlInnerProps = {
	folder?: FolderChain | null;
	isActive?: boolean;
};

function FolderChainControlInner({folder, isActive}: FolderChainControlInnerProps) {
	const active = isActive === undefined || isActive;
	return (
		<Stack direction="horizontal" gap={0} className="align-items-center">
			{
				folder ? (
					<>
						{
							folder.parent ? (
								<FolderChainControlInner folder={folder.parent} isActive={false}/>
							) : (
								<FolderHomeControl isActive={false}/>
							)
						}
						<BsCaretRight className="text-muted"/>
						<FolderControl folder={folder} isActive={active}/>
					</>
				) : (
					<FolderHomeControl/>
				)
			}
		</Stack>
	);
}

export type FolderChainControlProps = {
	folder?: FolderChain | FolderStub | number;
	isActive?: boolean;
};

function FolderChainControl({folder, isActive}: FolderChainControlProps) {
	const [chain, setChain] = useState<FolderChain>();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);

	useEffect(() => {
			if (!folder) return;
			if (isFolderChain(folder)) {
				setChain(folder);
				return;
			}
			const id = typeof folder === "number" ? folder : folder.id;
			if (!id) return;
			restClient.folders
				.loadFolderChain(id)
				.then(setChain)
				.catch((e) => userAlerts.err(e));
		},
		[folder, restClient, userAlerts]
	);

	return (
		<div>
			{
				<FolderChainControlInner folder={chain} isActive={isActive}/>
			}
		</div>
	);
}

export default FolderChainControl;
