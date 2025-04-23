import {BasicFormComponentProps} from "../../types/ComponentProps";
import {Form} from "react-bootstrap";
import {DocumentTemplateStubWithPages} from "../../types/entity/Template";
import {useContext, useEffect, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {Localize, LookupSelect} from "zavadil-react-common";
import {Language} from "../../types/entity/Language";
import {StringUtil} from "zavadil-ts-common";

export type DocumentTemplateFormProps = BasicFormComponentProps<DocumentTemplateStubWithPages> & {};

export default function DocumentTemplateForm({entity, onChange}: DocumentTemplateFormProps) {
	const restClient = useContext(OcrRestClientContext);
	const [languages, setLanguages] = useState<Array<Language>>();

	useEffect(() => {
		restClient.languages.loadAll()
			.then(setLanguages);
	}, []);

	return (
		<div className="d-flex flex-column gap-2">
			<div>
				<Form.Label><Localize text="Name" tag="neutral"/>:</Form.Label>
				<Form.Control
					type="text"
					value={StringUtil.getNonEmpty(entity.name)}
					onChange={(e) => {
						entity.name = e.target.value;
						onChange(entity);
					}}
				/>
			</div>
			<div>
				<Form.Label><Localize text="Language"/>:</Form.Label>
				<LookupSelect
					id={entity.languageId}
					options={languages}
					onChange={(n) => {
						entity.languageId = n;
						onChange(entity);
					}}
				/>
			</div>
		</div>
	)
}
