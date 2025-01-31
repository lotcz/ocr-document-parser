import {Button, Form, Stack} from "react-bootstrap";
import {FormWithDeleteComponentProps} from "../../types/ComponentProps";
import {FragmentTemplateStub} from "../../types/entity/Template";
import {useEffect, useState} from "react";
import {BsTrash} from "react-icons/bs";

export type DocumentTemplateFragmentProps = FormWithDeleteComponentProps<FragmentTemplateStub> & {
	isSelected: boolean;
};

export default function DocumentTemplateFragment({entity, onChange, onDelete, isSelected}: DocumentTemplateFragmentProps) {
	const fragment = entity;
	const [stl, setStl] = useState<object>({});

	useEffect(() => {
		setStl({
			top: `${fragment.top * 100}%`,
			left: `${fragment.left * 100}%`,
			width: `${fragment.width * 100}%`,
			height: `${fragment.height * 100}%`
		});
	}, [fragment]);

	return (
		<div
			className="document-template-fragment-editor position-absolute"
			style={stl}
			onMouseDown={(e) => e.stopPropagation()}
		>
			{
				isSelected && (
					<div className="position-relative pb-2" style={{top: '-2rem'}}>
						<Stack direction="horizontal" gap={2}>
							<Form.Control
								type="text"
								size="sm"
								className="bg-light text-dark"
								defaultValue={fragment.name}
								onChange={
									(e) => {
										fragment.name = e.target.value;
										onChange(fragment);
									}
								}
							>
							</Form.Control>
							<Button size="sm" onClick={onDelete}>
								<BsTrash/>
							</Button>
						</Stack>
					</div>
				)
			}
			<div
				className="fragment-frame position-absolute border bg-dark-subtle opacity-25"
				style={{left: 0, top: 0, right: 0, bottom: 0}}
				onClick={(e) => onChange(fragment)}
			>

			</div>
		</div>
	);
}
