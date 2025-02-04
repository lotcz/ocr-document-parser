import React from 'react';
import {useNavigate} from "react-router";
import {Button, Stack} from "react-bootstrap";
import {BsHouse} from "react-icons/bs";

function FolderHomeControl() {
	const navigate = useNavigate()

	const navigateToFolder = () => {
		navigate('/documents');
	}

	return (
		<Button
			className="btn-link"
			onClick={(e) => navigateToFolder()}
			size="sm"
		>
			<Stack direction="horizontal" className="align-items-center" gap={2}>
				<BsHouse/>
			</Stack>
		</Button>
	);
}

export default FolderHomeControl;
