import React from 'react';
import {Stack} from "react-bootstrap";
import {BsFileImage} from "react-icons/bs";
import {DocumentStub} from "../../types/entity/Document";
import StorageImage from "../general/StorageImage";

export type DocumentImagePreviewProps = {
	document: DocumentStub;
	onMouseOver?: () => any;
	onMouseOut?: () => any;
	size?: string;
};

function DocumentImagePreview({document, size, onMouseOut, onMouseOver}: DocumentImagePreviewProps) {
	return (
		<div>
			{
				document.imagePath ?
					<StorageImage path={document.imagePath} size={size || "thumb"} onMouseOver={onMouseOver} onMouseOut={onMouseOut}/>
					: (
						<Stack direction="horizontal" className="align-items-center" gap={2}>
							<BsFileImage/>
							<div>no image</div>
						</Stack>
					)
			}
		</div>
	);
}

export default DocumentImagePreview;
