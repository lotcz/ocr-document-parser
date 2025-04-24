import {Form} from "react-bootstrap";
import React, {useState} from "react";
import PageFragments from "./PageFragments";
import {FragmentStub, PageStubWithFragments} from "../../types/entity/Document";
import PageFragmentsImage from "./PageFragmentsImage";
import DocumentStateControl from "./DocumentStateControl";
import {Localize} from "zavadil-react-common";
import {BasicFormComponentProps} from "../../types/ComponentProps";
import {PageTemplateStubWithFragments} from "../../types/entity/Template";

export type DocumentPageEditorProps = BasicFormComponentProps<PageStubWithFragments> & {
	template?: PageTemplateStubWithFragments;
}

export default function PageEditor({entity, template, onChange}: DocumentPageEditorProps) {
	const [selectedFragment, setSelectedFragment] = useState<FragmentStub>();

	return (
		<div className="page-editor">
			<Form>
				<div className="d-flex gap-2 align-items-center">
					<div className="d-flex flex-column gap-2">
						<div className="d-flex gap-2 align-items-center justify-content-between">
							<Form.Label><Localize text="State"/>:</Form.Label>
							<div className="d-flex align-items-center gap-2">
								<DocumentStateControl state={entity.state}/>
							</div>
						</div>
						<div className="mt-3">
							{
								entity && <PageFragments
									page={entity}
									template={template}
									selectedFragment={selectedFragment}
									onSelected={setSelectedFragment}
								/>
							}
						</div>
					</div>

					<div className="d-flex flex-column gap-2">
						<div className="d-flex gap-2 align-items-center">
							<Form.Label><Localize text="File"/>:</Form.Label>
							<Form.Control
								disabled={true}
								readOnly={true}
								defaultValue={entity.imagePath}
							/>
						</div>
						<div className="d-flex gap-2 align-items-center">
							<Form.Label><Localize text="Upload"/>:</Form.Label>
							<Form.Control
								type="file"
								disabled={true}
								onChange={(e) => {
									const files = (e.target as HTMLInputElement).files
									const f = files ? files[0] : undefined;
									//setImageUpload(f);
								}}
							/>
						</div>
						{
							<PageFragmentsImage
								page={entity}
								template={template}
								selectedFragment={selectedFragment}
								onSelected={setSelectedFragment}
							/>
						}
					</div>
				</div>
			</Form>
		</div>
	)
}
