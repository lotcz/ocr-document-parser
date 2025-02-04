import React from 'react';
import {useNavigate} from "react-router";
import {Button, Stack} from "react-bootstrap";
import {BsHouse} from "react-icons/bs";
import {BasicComponentProps} from "../../types/ComponentProps";


export type FolderHomeControlProps = BasicComponentProps & {
	isActive?: boolean;
};

function FolderHomeControl({isActive}: FolderHomeControlProps) {
	const navigate = useNavigate()

	const active = isActive === undefined || isActive;

	const navigateToFolder = () => {
		navigate('/documents');
	}

	return (
		<Button
			variant="link"
			onClick={(e) => navigateToFolder()}
			disabled={active}
		>
			<Stack direction="horizontal" className="lh-1 align-items-center" gap={2}>
				<BsHouse/>
			</Stack>
		</Button>
	);
}

export default FolderHomeControl;
