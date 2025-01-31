import {BasicFormComponentProps} from "../../types/ComponentProps";
import {useEffect, useState} from "react";
import {FragmentStub} from "../../types/entity/Document";
import {FragmentTemplateStub} from "../../types/entity/Template";

export type DocumentFragmentImageProps = BasicFormComponentProps<FragmentStub> & {
	template?: FragmentTemplateStub;
	isSelected: boolean;
};

export default function DocumentFragmentImage({entity, template, isSelected, onChange}: DocumentFragmentImageProps) {
	const fragment = entity;
	const [stl, setStl] = useState<object>({});

	useEffect(() => {
		if (template === undefined) return;
		setStl({
			top: `${template.top * 100}%`,
			left: `${template.left * 100}%`,
			width: `${template.width * 100}%`,
			height: `${template.height * 100}%`
		});
	}, [template]);

	return (
		<div
			className="document-fragment-image position-absolute"
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
				className="fragment-frame-image position-absolute border bg-dark-subtle opacity-25"
				style={{left: 0, top: 0, right: 0, bottom: 0}}
				onClick={(e) => onChange(fragment)}
			>

			</div>
		</div>
	);
}
