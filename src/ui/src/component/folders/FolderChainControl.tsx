import React from 'react';
import {FolderChain} from "../../types/entity/Folder";
import {BasicComponentProps} from "../../types/ComponentProps";
import {Stack} from "react-bootstrap";
import FolderControl from "./FolderControl";
import {BsCaretRight} from "react-icons/bs";
import FolderHomeControl from "./FolderHomeControl";

export type FolderChainControlProps = BasicComponentProps & {
	folder?: FolderChain;
	isActive?: boolean;
};

function FolderChainControl({folder, isActive}: FolderChainControlProps) {
	const active = isActive === undefined || isActive;
	return (
		<Stack direction="horizontal" gap={0} className="align-items-center">
			{
				folder ? (
					<>
						{
							folder.parent ? (
								<FolderChainControl folder={folder.parent} isActive={false}/>
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

export default FolderChainControl;
