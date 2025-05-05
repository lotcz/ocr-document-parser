import {Form} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import PageFragments from "./PageFragments";
import {FragmentStub, PageStubWithFragments} from "../../types/entity/Document";
import PageFragmentsImage from "./PageFragmentsImage";
import DocumentStateControl from "./DocumentStateControl";
import {Localize} from "zavadil-react-common";
import {BasicFormComponentProps} from "../../types/ComponentProps";
import {PageTemplateStubWithFragments} from "../../types/entity/Template";
import {OcrRestClientContext} from "../../client/OcrRestClient";

export type DocumentPageEditorProps = BasicFormComponentProps<PageStubWithFragments> & {
	template?: PageTemplateStubWithFragments;
}

export default function PageEditor({entity, template, onChange}: DocumentPageEditorProps) {
	const restClient = useContext(OcrRestClientContext);
	const [selectedFragment, setSelectedFragment] = useState<FragmentStub>();
	const [finalPageTemplate, setFinalPageTemplate] = useState<PageTemplateStubWithFragments>();

	useEffect(
		() => {
			restClient.documentTemplates
				.loadFinalPageTemplate(template)
				.then(setFinalPageTemplate);
		},
		[template]
	);

	return (
		<div className="page-editor">
			<Form>
				<div className="d-flex gap-2 align-items-sm-start">
					<div className="d-flex flex-column gap-2 w-50">
						<div className="d-flex gap-2 align-items-center justify-content-start">
							<Form.Label><Localize text="State"/>:</Form.Label>
							<div className="d-flex align-items-center gap-2">
								<DocumentStateControl state={entity.state}/>
							</div>
						</div>
						<div className="mt-3">
							{
								entity && <PageFragments
									page={entity}
									template={finalPageTemplate}
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
								template={finalPageTemplate}
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
