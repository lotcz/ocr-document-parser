import {BasicComponentProps} from "../../types/ComponentProps";
import {useEffect, useState} from "react";
import {FragmentStub} from "../../types/entity/Document";
import {FragmentTemplateStub} from "../../types/entity/Template";

export type DocumentFragmentImageProps = BasicComponentProps & {
	fragment: FragmentStub;
	template?: FragmentTemplateStub;
	isSelected: boolean;
	onSelected: () => any;
};

export default function DocumentFragmentImage({fragment, template, isSelected, onSelected}: DocumentFragmentImageProps) {
	const [stl, setStl] = useState<object>({});

	useEffect(() => {
		if (template === undefined) return;
		setStl({
			top: `${template.top * 100}%`,
			left: `${template.left * 100}%`,
			width: `${template.width * 100}%`,
			height: `${template.height * 100}%`,
			zIndex: isSelected ? 10000 : undefined,
			opacity: isSelected ? 1 : 0.75
		});
	}, [template, isSelected]);

	return (
		<div
			className={`document-fragment-image position-absolute border ${isSelected ? 'border-3 border-danger' : 'border-primary'}`}
			style={stl}
			onClick={onSelected}
		>
			<div className={`position-relative bg-primary ${isSelected ? 'bg-danger' : ''}`} style={{top: '-1.4rem'}}>
				<small>
					<pre>{template?.name}</pre>
				</small>
			</div>
		</div>
	);
}
