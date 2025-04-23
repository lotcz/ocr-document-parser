import {FragmentTemplateStub, PageTemplateStubWithFragments} from "../../types/entity/Template";
import {useMemo} from "react";
import PageTemplateFragment from "./PageTemplateFragment";
import {BasicFormComponentProps} from "../../types/ComponentProps";
import {Table} from "react-bootstrap";

export type PageTemplateFragmentsProps = BasicFormComponentProps<PageTemplateStubWithFragments> & {
	selectedFragment?: FragmentTemplateStub;
	onSelected: (f: FragmentTemplateStub) => any;
	updateFragment: (old: FragmentTemplateStub, updated: FragmentTemplateStub) => any;
	deleteFragment: (f: FragmentTemplateStub) => any;
};

export default function PageTemplateFragments({
	entity,
	updateFragment,
	onSelected,
	selectedFragment,
	deleteFragment
}: PageTemplateFragmentsProps) {
	const fragments = useMemo(
		() => entity?.fragments,
		[entity]
	);

	return (
		<div className="document-template-fragments position-relative">
			<Table size="sm" className="text-small overflow-auto">
				<thead>
				<tr>
					<th>Název</th>
					<th>Jazyk</th>
					<th>Top</th>
					<th>Left</th>
					<th>Width</th>
					<th>Height</th>
				</tr>
				</thead>
				<tbody>
				{
					fragments && fragments.map(
						(f, i) => <PageTemplateFragment
							key={i}
							entity={f}
							onDelete={() => deleteFragment(f)}
							onChange={(u) => updateFragment(f, u)}
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
