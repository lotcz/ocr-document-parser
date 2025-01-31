import {DocumentTemplateStub, FragmentTemplateStub} from "../../types/entity/Template";
import {MouseEvent, MouseEventHandler, useCallback, useContext, useRef, useState} from "react";
import StorageImage from "../image/StorageImage";
import DocumentTemplateFragment from "./DocumentTemplateFragment";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext} from "../dialog/ConfirmDialogContext";
import {BasicFormComponentProps} from "../../types/ComponentProps";

export type DocumentTemplateFragmentsProps = BasicFormComponentProps<Array<FragmentTemplateStub>> & {
	documentTemplate: DocumentTemplateStub;
};

export default function DocumentTemplateFragments({entity, onChange, documentTemplate}: DocumentTemplateFragmentsProps) {
	const fragments = entity;
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [editingFragment, setEditingFragment] = useState<FragmentTemplateStub>()
	const [isResizing, setIsResizing] = useState<boolean>(false)
	const ref = useRef<HTMLDivElement>(null);

	const deleteFragment = useCallback(
		(fragment: FragmentTemplateStub) => {
			onChange(fragments.filter((f) => f !== fragment));
		},
		[fragments, onChange]
	);

	const updateFragment = useCallback(
		(old: FragmentTemplateStub, updated: FragmentTemplateStub) => {
			if (old !== updated) {
				deleteFragment(old);
				fragments.push(updated);
				setEditingFragment(updated);
			} else {
				for (let i = 0; i < fragments.length; i++) {
					if (fragments[i] === updated) {
						fragments[i] = {...updated};
						setEditingFragment(fragments[i]);
						break;
					}
				}
			}
			onChange(fragments);
		},
		[deleteFragment, fragments, onChange]
	);

	const getNewFragmentName = useCallback(
		() => {
			let i = 0;
			let name = 'fragment';
			let exists = true;
			while (exists) {
				name = `fragment-${i}`;
				exists = fragments.some((f) => f.name === name);
				i++;
			}
			return name;

		},
		[fragments]
	);

	const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			if (!ref.current) return;
			if (e.buttons !== 1) return;
			const newFragment: FragmentTemplateStub = {
				name: getNewFragmentName(),
				language: undefined,
				documentTemplateId: Number(documentTemplate.id),
				top: e.nativeEvent.offsetY / ref.current.clientHeight,
				left: e.nativeEvent.offsetX / ref.current.clientWidth,
				width: 0,
				height: 0,
				created_on: new Date(),
				last_update_on: new Date()
			}
			fragments.push(newFragment);
			onChange(fragments);
			setEditingFragment(newFragment);
			setIsResizing(true);
		},
		[fragments, ref, documentTemplate, onChange, getNewFragmentName]
	);

	const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			if (!ref.current) return;
			if (e.buttons !== 1) return;
			if (!editingFragment) return;
			if (!isResizing) return;
			editingFragment.width = (e.nativeEvent.offsetX / ref.current.clientWidth) - editingFragment.left;
			editingFragment.height = (e.nativeEvent.offsetY / ref.current.clientHeight) - editingFragment.top;
			updateFragment(editingFragment, editingFragment);
		},
		[ref, isResizing, editingFragment, updateFragment]
	);

	const onMouseUp: MouseEventHandler<HTMLDivElement> = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			if (!ref.current) return;
			if (e.buttons === 1 || e.buttons === 3) return;
			setIsResizing(false);
		},
		[ref]
	);

	return (
		<div className="document-template-fragments position-relative">
			<StorageImage path={documentTemplate.previewImg} size="preview"/>
			<div
				ref={ref}
				className="position-absolute"
				style={{left: 0, top: 0, right: 0, bottom: 0}}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
			>
				{
					fragments && fragments.map(
						(f, i) => <DocumentTemplateFragment
							key={i}
							entity={f}
							onDelete={() => deleteFragment(f)}
							onChange={(u) => updateFragment(f, u)}
							isSelected={f === editingFragment}
						/>
					)
				}
			</div>
		</div>
	);
}
