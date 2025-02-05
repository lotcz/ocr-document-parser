import {FragmentTemplateStub} from "../../types/entity/Template";
import DocumentFragment from "./DocumentFragment";
import {BasicComponentProps} from "../../types/ComponentProps";
import {DocumentStub, FragmentStub} from "../../types/entity/Document";
import {Table} from "react-bootstrap";

export type DocumentFragmentsProps = BasicComponentProps & {
	document: DocumentStub;
	fragments: Array<FragmentStub>;
	onSelected: (f: FragmentStub) => any;
	selectedFragment?: FragmentStub;
	fragmentTemplates: Array<FragmentTemplateStub>;
};

export default function DocumentFragments({fragments, selectedFragment, fragmentTemplates, onSelected, document}: DocumentFragmentsProps) {
	return (
		<div className="document-fragments">
			<Table>
				<thead>
				<tr>
					<th>Název</th>
					<th>Hodnota</th>
				</tr>
				</thead>
				<tbody>
				{
					fragments && fragments.map(
						(f, i) => <DocumentFragment
							key={i}
							fragment={f}
							template={fragmentTemplates.find(t => t.id === f.fragmentTemplateId)}
							onSelected={() => onSelected(f)}
							isSelected={f === selectedFragment}
						/>
					)
				}
				</tbody>
			</Table>
		</div>
	);
}
