import {FormWithDeleteComponentProps} from "../../types/ComponentProps";
import {useEffect, useState} from "react";
import {FragmentStub} from "../../types/entity/Document";
import {FragmentTemplateStub} from "../../types/entity/Template";

export type DocumentTemplateFragmentProps = FormWithDeleteComponentProps<FragmentStub> & {
	isSelected: boolean;
	template?: FragmentTemplateStub;
};

export default function DocumentFragment({entity, template, onChange, onDelete, isSelected}: DocumentTemplateFragmentProps) {
	const fragment = entity;
	const [stl, setStl] = useState<object>({});

	useEffect(() => {
		if (template === undefined) return;
		setStl({
			top: `${template.top * 100}%`,
			left: `${template.left * 100}%`,
			width: `${Math.max(template.width, 0.01) * 100}%`,
			height: `${Math.max(template.height, 0.01) * 100}%`
		});
	}, [template]);

	return (
		<div
			className="document-fragment-editor position-absolute"
			style={stl}
			onMouseDown={(e) => e.stopPropagation()}
		>
			{
				isSelected && (
					<div className="position-relative pb-2" style={{top: '-2rem'}}>
						{template?.name}
					</div>
				)
			}
			<div
				className="fragment-frame position-absolute border bg-dark-subtle opacity-25"
				style={{left: 0, top: 0, right: 0, bottom: 0}}
				onClick={(e) => onChange(fragment)}
			>
				{fragment.text}
			</div>
		</div>
	);
}
