import React from 'react';
import {useNavigate} from "react-router";
import {FolderBase} from "../../types/entity/Folder";
import {BasicComponentProps} from "../../types/ComponentProps";
import {Button, Stack} from "react-bootstrap";
import {BsFolder} from "react-icons/bs";

export type FolderControlProps = BasicComponentProps & {
	size?: "sm" | "lg";
	folder: FolderBase;
};

function FolderControl({folder, size}: FolderControlProps) {
	const navigate = useNavigate()

	const navigateToFolder = (folderId?: number | null) => {
		navigate(`/documents/folders/${folderId}`);
	}

	return (
		<Button
			className="btn-link"
			onClick={(e) => navigateToFolder(folder.id)}
			size={size}
		>
			<Stack direction="horizontal" className="align-items-center" gap={2}>
				<BsFolder/>
				<span>{folder.name}</span>
			</Stack>
		</Button>
	);
}

export default FolderControl;
