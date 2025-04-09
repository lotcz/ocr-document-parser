import React from 'react';
import {Stack} from "react-bootstrap";
import {BsFileImage} from "react-icons/bs";
import {DocumentStub} from "../../types/entity/Document";
import StorageImage from "../general/StorageImage";

export type DocumentImagePreviewFullProps = {
	document: DocumentStub;
	left: boolean;
};

function DocumentImagePreviewFull({left, document}: DocumentImagePreviewFullProps) {
	return (
		<div className={`bg-body p-2 doc-preview ${left ? "left" : ""}`}>
			<div>{document.imagePath}</div>
			<div>
				{
					document.imagePath ? <StorageImage path={document.imagePath} size="preview"/>
						: (
							<Stack direction="horizontal" className="align-items-center" gap={2}>
								<BsFileImage/>
								<div>no image</div>
							</Stack>
						)
				}
			</div>
		</div>

	);
}

export default DocumentImagePreviewFull;
