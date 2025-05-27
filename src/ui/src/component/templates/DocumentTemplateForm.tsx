import {BasicFormComponentProps} from "../../types/ComponentProps";
import {Form} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {Localize, LookupSelect} from "zavadil-react-common";
import {StringUtil} from "zavadil-ts-common";
import {DocumentTemplateStubWithPages, Language} from "okarina-ts-client";
import {OkarinaRestClientContext} from "../../client/OkarinaAppRestClient";

export type DocumentTemplateFormProps = BasicFormComponentProps<DocumentTemplateStubWithPages> & {};

export default function DocumentTemplateForm({entity, onChange}: DocumentTemplateFormProps) {
	const restClient = useContext(OkarinaRestClientContext);
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
