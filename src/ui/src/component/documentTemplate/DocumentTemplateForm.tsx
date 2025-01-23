import {BasicFormComponentProps} from "../../types/ComponentProps";
import {Form, Stack} from "react-bootstrap";
import {DocumentTemplateStub} from "../../types/entity/DocumentTemplate";
import {useContext, useEffect, useState} from "react";
import {OcrRestClientContext} from "../../util/OcrRestClient";
import {StringUtil} from "zavadil-ts-common";

export type DocumentTemplateFormProps = BasicFormComponentProps<DocumentTemplateStub> & {};

export default function DocumentTemplateForm({entity, onChange}: DocumentTemplateFormProps) {
	const restClient = useContext(OcrRestClientContext);
	const [languages, setLanguages] = useState<Array<string>>();

	useEffect(() => {
		restClient.loadLanguages()
			.then(setLanguages);
	}, []);

	return (
		<Form className="">
			<Stack direction="vertical" gap={2}>
				<div>
					<Form.Label>Název:</Form.Label>
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
					<Form.Label>Jazyk:</Form.Label>
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
									<option key={""} value={""} selected={StringUtil.isEmpty(entity.language)}>(bez jazyka)</option>
									{
										languages.map((l) => <option key={l} value={l} selected={entity.language === l}>{l}</option>)
									}
								</>
							) : <option>loading...</option>
						}
					</Form.Select>
				</div>
			</Stack>
		</Form>
	)
}
