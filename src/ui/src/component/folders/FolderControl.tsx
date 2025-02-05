import React from 'react';
import {useNavigate} from "react-router";
import {FolderBase} from "../../types/entity/Folder";
import {BasicComponentProps} from "../../types/ComponentProps";
import {Button, Stack} from "react-bootstrap";
import {BsFolder} from "react-icons/bs";

export type FolderControlProps = BasicComponentProps & {
	size?: "sm" | "lg";
	folder: FolderBase;
	isActive?: boolean;
	border?: boolean;
};

function FolderControl({folder, size, isActive, border}: FolderControlProps) {
	const navigate = useNavigate()
	const active = isActive === true;

	const navigateToFolder = (folderId?: number | null) => {
		navigate(`/documents/folders/${folderId}`);
	}

	return (
		<Button
			className={border ? 'border' : ''}
			variant="link"
			onClick={(e) => navigateToFolder(folder.id)}
			size={size}
			disabled={active}
		>
			<Stack direction="horizontal" className="align-items-center" gap={2}>
				<BsFolder/>
				<span>{folder.name}</span>
			</Stack>
		</Button>
	);
}

export default FolderControl;
