import StorageImage from "../image/StorageImage";
import {DocumentStub, FragmentStub} from "../../types/entity/Document";
import DocumentFragmentImage from "./DocumentFragmentImage";
import {FragmentTemplateStub} from "../../types/entity/Template";

export type DocumentFragmentsImageProps = {
	fragments?: Array<FragmentStub>;
	document: DocumentStub;
	onSelected: (f: FragmentStub) => any;
	selectedFragment?: FragmentStub;
	fragmentTemplates?: Array<FragmentTemplateStub>;
};

export default function DocumentFragmentsImage({fragments, onSelected, fragmentTemplates, selectedFragment, document}: DocumentFragmentsImageProps) {
	return (
		<div className="document-fragments-image p-3">
			<div className="position-relative">
				<StorageImage path={document.imagePath} size="preview"/>
				<div
					className="position-absolute"
					style={{left: 0, top: 0, right: 0, bottom: 0}}
				>
					{
						fragmentTemplates && fragments && fragments.map(
							(f, i) => <DocumentFragmentImage
								key={i}
								fragment={f}
								template={fragmentTemplates.find(t => t.id === f.fragmentTemplateId)}
								isSelected={f === selectedFragment}
								onSelected={() => onSelected(f)}
							/>
						)
					}
				</div>
			</div>
		</div>
	);
}
