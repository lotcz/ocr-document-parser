import React from 'react';
import {useNavigate} from "react-router";
import {Stack} from "react-bootstrap";
import {BsFileImage} from "react-icons/bs";
import {DocumentStub} from "../../types/entity/Document";
import StorageImage from "../image/StorageImage";
import DocumentStateControl from "../documents/DocumentStateControl";
import {DateUtil} from "zavadil-ts-common";

export type FolderDocumentControlProps = {
	document: DocumentStub;
};

function FolderDocumentControl({document}: FolderDocumentControlProps) {
	const navigate = useNavigate()

	const navigateToDocument = (id?: number | null) => {
		navigate(`/documents/detail/${id}`);
	}

	return (
		<div
			onClick={(e) => navigateToDocument(document.id)}
			className="border rounded"
		>
			<div className="d-flex align-items-start cursor-pointer">
				<div className="p-2 d-flex flex-column align-items-start justify-content-between">
					<DocumentStateControl state={document.state}/>
					<small>{document.imagePath}</small>
					<small>{DateUtil.formatDateTimeForHumans(document.createdOn)}</small>
				</div>
				<div className="p-2">
					{
						document.imagePath ? <StorageImage path={document.imagePath} size="thumb"/>
							: (
								<Stack direction="horizontal" className="align-items-center" gap={2}>
									<BsFileImage/>
									<div>no image</div>
								</Stack>
							)
					}
				</div>
			</div>
		</div>
	);
}

export default FolderDocumentControl;
