import {Button, Form, Stack} from "react-bootstrap";
import {FormWithDeleteComponentProps} from "../../types/ComponentProps";
import {FragmentTemplateStub} from "../../types/entity/Template";
import {useEffect, useState} from "react";
import {BsTrash} from "react-icons/bs";

export type DocumentTemplateFragmentProps = FormWithDeleteComponentProps<FragmentTemplateStub> & {
	isSelected: boolean;
	onSelected: () => any;
};

export default function DocumentTemplateFragment({entity, onChange, onDelete, onSelected, isSelected}: DocumentTemplateFragmentProps) {
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
		>
			{
				isSelected ? (
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
							<Button size="sm" onClick={onDelete} variant="danger">
								<BsTrash/>
							</Button>
						</Stack>
					</div>
				) : (
					<div
						className="position-relative bg-primary opacity-75"
						style={{top: '-1.3rem'}}
						onClick={onSelected}
					>
						<small>
							<pre>{fragment.name}</pre>
						</small>
					</div>
				)
			}
			<div
				className={`fragment-frame position-absolute border ${isSelected ? 'border-danger border-3' : 'border-primary'}`}
				style={{left: 0, top: 0, right: 0, bottom: 0}}
				onClick={onSelected}
			>

			</div>
		</div>
	);
}
