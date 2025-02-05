import React from 'react';
import {useNavigate} from "react-router";
import {BasicComponentProps} from "../../types/ComponentProps";
import {Button, Stack} from "react-bootstrap";
import {BsFileImage} from "react-icons/bs";
import {DocumentStub} from "../../types/entity/Document";
import StorageImage from "../image/StorageImage";
import DocumentStateControl from "./DocumentStateControl";

export type FolderDocumentControlProps = BasicComponentProps & {
	document: DocumentStub;
};

function FolderDocumentControl({document}: FolderDocumentControlProps) {
	const navigate = useNavigate()

	const navigateToDocument = (id?: number | null) => {
		navigate(`/documents/detail/${id}`);
	}

	return (
		<Button
			variant="link"
			className="d-flex align-items-center gap-2 border"
			onClick={(e) => navigateToDocument(document.id)}
		>
			<DocumentStateControl state={document.state}/>
			{
				document.imagePath ? <StorageImage path={document.imagePath} size="thumb"/>
					: (
						<Stack direction="horizontal" className="align-items-center" gap={2}>
							<BsFileImage/>
							<div>no image</div>
						</Stack>
					)
			}
		</Button>
	);
}

export default FolderDocumentControl;
