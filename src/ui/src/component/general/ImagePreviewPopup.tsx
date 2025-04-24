import React from 'react';
import StorageImage from "./StorageImage";

export type ImagePreviewPopupProps = {
	path?: string | null;
	left: boolean;
};

function ImagePreviewPopup({left, path}: ImagePreviewPopupProps) {
	return (
		<div className={`bg-body p-2 doc-preview ${left ? "left" : ""}`}>
			<div>{path}</div>
			<div>
				<StorageImage path={path} size="preview"/>
			</div>
		</div>

	);
}

export default ImagePreviewPopup;
