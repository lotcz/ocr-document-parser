import {useEffect, useState} from "react";
import {FragmentStub} from "../../types/entity/Document";
import {FragmentTemplateStub} from "../../types/entity/Template";

export type DocumentFragmentImageProps = {
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
			className={`document-fragment-image position-absolute border ${isSelected ? 'border-3 border-primary' : 'border-secondary'}`}
			style={stl}
			onClick={onSelected}
		>
			<div className={`position-relative ${isSelected ? 'bg-primary' : 'bg-secondary'}`} style={{top: isSelected ? '-1.4rem' : 0}}>
				<small>
					<pre>{template?.name}</pre>
				</small>
			</div>
		</div>
	);
}
