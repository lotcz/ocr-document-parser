import React from 'react';
import {OverlayTrigger, Popover, Stack} from "react-bootstrap";
import {BsFileImage} from "react-icons/bs";
import {DocumentStub} from "../../types/entity/Document";
import StorageImage from "../general/StorageImage";

export type DocumentImagePreviewProps = {
	document: DocumentStub;
};

function DocumentImagePreview({document}: DocumentImagePreviewProps) {

	return (
		<OverlayTrigger
			trigger={["hover", "focus"]}
			placement="auto"

			overlay={
				<Popover placement="auto" body={true}>
					<div><small className="text-nowrap">{document.imagePath}</small></div>
					<div style={{width: 900}}>
						<StorageImage path={document.imagePath} size="preview"/>
					</div>
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

export default DocumentImagePreview;
