import {BasicFormComponentProps} from "../../types/ComponentProps";
import {Form} from "react-bootstrap";
import {DocumentTemplateStub} from "../../types/entity/Template";
import {useContext, useEffect, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {Localize, Switch} from "zavadil-react-common";

export type DocumentTemplateFormProps = BasicFormComponentProps<DocumentTemplateStub> & {};

export default function DocumentTemplateForm({entity, onChange}: DocumentTemplateFormProps) {
	const restClient = useContext(OcrRestClientContext);
	const [languages, setLanguages] = useState<Array<string>>();

	useEffect(() => {
		restClient.loadLanguages()
			.then(setLanguages);
	}, []);

	return (
		<div className="d-flex flex-column gap-2">
			<div>
				<Form.Label><Localize text="Name" tag="neutral"/>:</Form.Label>
				<Form.Control
					type="text"
					value={entity.name}
					onChange={(e) => {
						entity.name = e.target.value;
						onChange(entity);
					}}
				/>
			</div>
			<div>
				<Form.Label><Localize text="Language"/>:</Form.Label>
				<Form.Select
					value={entity.language}
					onChange={(e) => {
						entity.language = e.target.value;
						onChange(entity);
					}}
				>
					{
						languages ? (
							<>
								<option key={""} value={""}>(bez jazyka)</option>
								{
									languages.map((l) => <option key={l} value={l}>{l}</option>)
								}
							</>
						) : <option>loading...</option>
					}
				</Form.Select>
			</div>
			<div className="d-flex justify-content-between">
				<Form.Label htmlFor="mpages"><Localize text="Multiple pages"/>:</Form.Label>
				<Switch
					id="mpages"
					checked={entity.isMulti}
					onChange={(e) => {
						entity.isMulti = e;
						onChange(entity);
					}}
				/>
			</div>
		</div>
	)
}
