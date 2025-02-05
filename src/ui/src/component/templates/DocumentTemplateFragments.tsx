import {DocumentTemplateStub, FragmentTemplateStub} from "../../types/entity/Template";
import {MouseEvent, MouseEventHandler, useCallback, useContext, useRef, useState} from "react";
import StorageImage from "../image/StorageImage";
import DocumentTemplateFragment from "./DocumentTemplateFragment";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {ConfirmDialogContext} from "../dialog/ConfirmDialogContext";
import {BasicFormComponentProps} from "../../types/ComponentProps";
import {StringUtil, Vector2} from "zavadil-ts-common";

export type DocumentTemplateFragmentsProps = BasicFormComponentProps<Array<FragmentTemplateStub>> & {
	documentTemplate: DocumentTemplateStub;
	selectedFragment?: FragmentTemplateStub;
	onSelected: (f: FragmentTemplateStub) => any;
};

export default function DocumentTemplateFragments({
	entity,
	onChange,
	onSelected,
	selectedFragment,
	documentTemplate
}: DocumentTemplateFragmentsProps) {
	const fragments = entity;
	const userAlerts = useContext(OcrUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [isMoving, setIsMoving] = useState<boolean>(false);
	const [lastMousePos, setLastMousePos] = useState<Vector2>();
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
				onChange([...fragments]);
				onSelected(updated);
			} else {
				for (let i = 0; i < fragments.length; i++) {
					if (fragments[i] === updated) {
						fragments[i] = {...updated};
						onSelected(fragments[i]);
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
			if (!selectedFragment) {
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
				onSelected(newFragment);
				setIsResizing(true);
			} else {
				setIsMoving(true);
				setLastMousePos(new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY));
			}
		},
		[fragments, ref, documentTemplate, onChange, onSelected, getNewFragmentName, selectedFragment]
	);

	const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			if (!ref.current) return;
			if (e.buttons !== 1) return;
			if (!selectedFragment) return;
			if (isResizing) {
				selectedFragment.width = (e.nativeEvent.offsetX / ref.current.clientWidth) - selectedFragment.left;
				selectedFragment.height = (e.nativeEvent.offsetY / ref.current.clientHeight) - selectedFragment.top;
				updateFragment(selectedFragment, selectedFragment);
				return;
			}
			if (isMoving) {
				const pos = new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
				if (lastMousePos === undefined) {
					setLastMousePos(pos);
					return;
				}
				const dist = pos.sub(lastMousePos);
				selectedFragment.left += dist.x / ref.current.clientWidth;
				selectedFragment.top += dist.y / ref.current.clientHeight;
				updateFragment(selectedFragment, selectedFragment);
				setLastMousePos(pos);
				return;
			}
		},
		[ref, isResizing, isMoving, selectedFragment, updateFragment, lastMousePos]
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
			{
				StringUtil.notEmpty(documentTemplate.previewImg) ? <StorageImage path={documentTemplate.previewImg} size="preview"/>
					: <div style={{width: documentTemplate.width, height: documentTemplate.height}}></div>
			}
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
							onSelected={() => onSelected(f)}
							isSelected={f === selectedFragment}
						/>
					)
				}
			</div>
		</div>
	);
}
