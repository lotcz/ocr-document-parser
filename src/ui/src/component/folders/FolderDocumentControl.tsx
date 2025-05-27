import React, {useContext} from 'react';
import {useNavigate} from "react-router";
import {Stack} from "react-bootstrap";
import {BsFileImage} from "react-icons/bs";
import DocumentStateControl from "../documents/DocumentStateControl";
import DocumentImagePreview from "../documents/DocumentImagePreview";
import {OkarinaNavigationContext} from "../../util/OkarinaNavigation";
import {DocumentStub} from "okarina-ts-client";

export type FolderDocumentControlProps = {
	document: DocumentStub;
	onMouseOver?: () => any;
	onMouseOut?: () => any;
};

function FolderDocumentControl({document, onMouseOut, onMouseOver}: FolderDocumentControlProps) {
	const navigate = useNavigate()
	const ocrNavigate = useContext(OkarinaNavigationContext);

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
					document.imagePath ? <DocumentImagePreview document={document} onMouseOver={onMouseOver} onMouseOut={onMouseOut}/>
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
