import React, {useContext} from 'react';
import {useNavigate} from "react-router";
import {FolderBase} from "../../types/entity/Folder";
import {Button, Stack} from "react-bootstrap";
import {BsFolder} from "react-icons/bs";
import {OcrNavigateContext} from "../../util/OcrNavigation";

export type FolderControlProps = {
	size?: "sm" | "lg";
	folder: FolderBase;
	isActive?: boolean;
	border?: boolean;
};

function FolderControl({folder, size, isActive, border}: FolderControlProps) {
	const navigate = useNavigate();
	const ocrNavigate = useContext(OcrNavigateContext);
	const active = isActive === true;
	
	return (
		<Button
			className={border ? 'border' : ''}
			variant="link"
			onClick={(e) => navigate(ocrNavigate.folders.detail(folder.id))}
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
