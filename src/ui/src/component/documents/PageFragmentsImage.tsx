import StorageImage from "../general/StorageImage";
import {FragmentStub, PageStubWithFragments} from "../../types/entity/Document";
import FragmentImage from "./FragmentImage";
import {PageTemplateStubWithFragments} from "../../types/entity/Template";

export type DocumentFragmentsImageProps = {
	page: PageStubWithFragments;
	template?: PageTemplateStubWithFragments;
	onSelected: (f: FragmentStub) => any;
	selectedFragment?: FragmentStub;
};

export default function PageFragmentsImage({template, onSelected, page, selectedFragment}: DocumentFragmentsImageProps) {
	return (
		<div className="document-fragments-image p-3">
			<div className="position-relative">
				<StorageImage path={page.imagePath} size="preview"/>
				<div
					className="position-absolute"
					style={{left: 0, top: 0, right: 0, bottom: 0}}
				>
					{
						page.fragments.map(
							(f, i) => <FragmentImage
								key={i}
								fragment={f}
								template={template?.fragments.find(t => t.id === f.fragmentTemplateId)}
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
