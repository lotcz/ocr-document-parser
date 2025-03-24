import React from 'react';
import {OverlayTrigger, Popover, PopoverBody, PopoverHeader, Stack} from "react-bootstrap";
import {BsFileImage} from "react-icons/bs";
import {DocumentStub} from "../../types/entity/Document";
import StorageImage from "../image/StorageImage";

export type FolderImagePreviewProps = {
	document: DocumentStub;
};

function FolderImagePreview({document}: FolderImagePreviewProps) {

	return (
		<OverlayTrigger
			trigger="hover"
			placement="auto"
			overlay={
				<Popover placement="auto">
					<PopoverHeader><small className="text-nowrap">{document.imagePath}</small></PopoverHeader>
					<PopoverBody><StorageImage path={document.imagePath} size="preview"/></PopoverBody>
				</Popover>
			}
		>
			<div>
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
		</OverlayTrigger>
	);
}

export default FolderImagePreview;
