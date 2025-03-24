import React, {useContext} from 'react';
import {useNavigate} from "react-router";
import {Stack} from "react-bootstrap";
import {BsFileImage} from "react-icons/bs";
import {DocumentStub} from "../../types/entity/Document";
import DocumentStateControl from "../documents/DocumentStateControl";
import DocumentImagePreview from "./DocumentImagePreview";
import {OcrNavigateContext} from "../../util/OcrNavigation";

export type FolderDocumentControlProps = {
	document: DocumentStub;
};

function FolderDocumentControl({document}: FolderDocumentControlProps) {
	const navigate = useNavigate()
	const ocrNavigate = useContext(OcrNavigateContext);

	const navigateToDocument = (id?: number | null) => {
		navigate(ocrNavigate.documents.detail(id));
	}

	return (
		<div
			onClick={(e) => navigateToDocument(document.id)}
			className="border rounded cursor-pointer p-2"
		>
			<div>
				{
					document.imagePath ? <DocumentImagePreview document={document}/>
						: (
							<Stack direction="horizontal" className="align-items-center" gap={2}>
								<BsFileImage/>
								<div>no image</div>
							</Stack>
						)
				}
			</div>
			<div className="pt-2">
				<DocumentStateControl state={document.state}/>
			</div>
		</div>
	);
}

export default FolderDocumentControl;
