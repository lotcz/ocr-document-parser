import {BasicFormComponentProps} from "../../types/ComponentProps";
import {Form, Stack} from "react-bootstrap";
import {DocumentTemplate} from "../../types/entity/DocumentTemplate";

export type CardTypeFormProps = BasicFormComponentProps<DocumentTemplate> & {

};

export default function DocumentTemplateForm({entity, onChange}: CardTypeFormProps) {
	return (
		<Form className="p-3">
			<Stack direction="vertical" gap={2}>
				<div>
					<Form.Label>Název:</Form.Label>
					<Stack direction="horizontal" gap={2}>
						<Form.Control
							type="text"
							value={entity.name}
							onChange={(e) => {
								entity.name = e.target.value;
								onChange();
							}}
						/>
					</Stack>
				</div>
			</Stack>
		</Form>
	)
}
