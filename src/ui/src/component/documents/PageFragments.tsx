import {PageTemplateStubWithFragments} from "../../types/entity/Template";
import Fragment from "./Fragment";
import {FragmentStub, PageStubWithFragments} from "../../types/entity/Document";
import {Table} from "react-bootstrap";

export type PageFragmentsProps = {
	page: PageStubWithFragments;
	onSelected: (f: FragmentStub) => any;
	selectedFragment?: FragmentStub;
	template?: PageTemplateStubWithFragments;
};

export default function PageFragments({page, selectedFragment, template, onSelected}: PageFragmentsProps) {
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
					page.fragments.map(
						(f, i) => <Fragment
							key={i}
							fragment={f}
							template={template?.fragments.find(t => t.id === f.fragmentTemplateId)}
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
