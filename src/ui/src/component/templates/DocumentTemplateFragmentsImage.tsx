import {DocumentTemplateStub, FragmentTemplateStub} from "../../types/entity/Template";
import {MouseEvent, MouseEventHandler, useCallback, useContext, useRef, useState} from "react";
import StorageImage from "../general/StorageImage";
import {BasicFormComponentProps} from "../../types/ComponentProps";
import {StringUtil, Vector2} from "zavadil-ts-common";
import DocumentTemplateFragmentImage from "./DocumentTemplateFragmentImage";
import {ConfirmDialogContext} from "zavadil-react-common";

export type DocumentTemplateFragmentsImageProps = BasicFormComponentProps<Array<FragmentTemplateStub>> & {
	documentTemplate: DocumentTemplateStub;
	selectedFragment?: FragmentTemplateStub;
	onSelected: (f?: FragmentTemplateStub) => any;
};

export default function DocumentTemplateFragmentsImage({
	entity,
	onChange,
	onSelected,
	selectedFragment,
	documentTemplate
}: DocumentTemplateFragmentsImageProps) {
	const fragments = entity;
	const confirmDialog = useContext(ConfirmDialogContext);
	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [isMoving, setIsMoving] = useState<boolean>(false);
	const [lastMousePos, setLastMousePos] = useState<Vector2>();
	const ref = useRef<HTMLDivElement>(null);

	const removeFragment = useCallback(
		(fragment: FragmentTemplateStub) => fragments.filter((f) => f !== fragment),
		[fragments]
	);

	const deleteFragmentInternal = useCallback(
		(fragment: FragmentTemplateStub) => {
			onChange(removeFragment(fragment));
		},
		[removeFragment, onChange]
	);

	const deleteFragment = useCallback(
		(fragment: FragmentTemplateStub) => {
			if (fragment.id) {
				confirmDialog.confirm(
					'Delete Fragment Template?',
					'All existing parsed fragments of this template be deleted, too. Really delete this template fragment?',
					() => deleteFragmentInternal(fragment)
				)
			} else {
				deleteFragmentInternal(fragment);
			}
		},
		[deleteFragmentInternal, confirmDialog]
	);

	const updateFragment = useCallback(
		(old: FragmentTemplateStub, updated: FragmentTemplateStub) => {
			if (old !== updated) {
				const nf = removeFragment(old);
				nf.push(updated);
				onChange([...nf]);
				onSelected(updated);
				return;
			} else {
				const nf = [];
				for (let i = 0; i < fragments.length; i++) {
					if (fragments[i] === updated) {
						const n = {...updated};
						nf.push(n);
						onSelected(n);
					} else {
						nf.push(fragments[i]);
					}
					onChange(nf);
				}
			}
		},
		[removeFragment, fragments, onChange, onSelected]
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

			onSelected(undefined);
			setIsResizing(true);
			setLastMousePos(new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY));
		},
		[ref, onSelected]
	);

	const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			if (!ref.current) return;
			if (e.buttons !== 1) return;

			if (isResizing) {
				if (!selectedFragment) {
					const newFragment: FragmentTemplateStub = {
						name: getNewFragmentName(),
						language: undefined,
						documentTemplateId: Number(documentTemplate.id),
						top: e.nativeEvent.offsetY / ref.current.clientHeight,
						left: e.nativeEvent.offsetX / ref.current.clientWidth,
						width: 0,
						height: 0,
						createdOn: new Date(),
						lastUpdatedOn: new Date()
					}
					fragments.push(newFragment);
					onChange(fragments);
					onSelected(newFragment);
					return;
				}
				const nf = {...selectedFragment};
				nf.width = (e.nativeEvent.offsetX / ref.current.clientWidth) - selectedFragment.left;
				nf.height = (e.nativeEvent.offsetY / ref.current.clientHeight) - selectedFragment.top;
				updateFragment(selectedFragment, nf);
				return;
			}
			if (isMoving) {
				if (!selectedFragment) {
					onSelected(undefined);
					return;
				}
				const pos = new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
				if (lastMousePos === undefined) {
					setLastMousePos(pos);
					return;
				}
				const dist = pos.sub(lastMousePos);
				const nf = {...selectedFragment};
				nf.left += dist.x / ref.current.clientWidth;
				nf.top += dist.y / ref.current.clientHeight;
				updateFragment(selectedFragment, nf);
				setLastMousePos(pos);
				return;
			}
		},
		[ref, isResizing, isMoving, selectedFragment, updateFragment, lastMousePos, fragments, getNewFragmentName, documentTemplate, onChange, onSelected]
	);

	const onMouseUp: MouseEventHandler<HTMLDivElement> = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			if (!ref.current) return;
			setIsResizing(false);
			setIsMoving(false);
		},
		[ref]
	);

	return (
		<div
			className={`document-template-fragments-image position-relative ${isMoving ? 'cursor-move' : (isResizing ? 'cursor-resize' : 'cursor-crosshair')}`}>
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
						(f, i) => <DocumentTemplateFragmentImage
							key={i}
							entity={f}
							onDelete={() => deleteFragment(f)}
							onChange={(u) => updateFragment(f, u)}
							onSelected={() => onSelected(f)}
							isSelected={f === selectedFragment}
							onMoveStarted={
								() => {
									onSelected(f);
									setLastMousePos(undefined);
									setIsResizing(false);
									setIsMoving(true);
								}
							}
							onResizeStarted={
								() => {
									onSelected(f);
									setLastMousePos(undefined);
									setIsMoving(false);
									setIsResizing(true);
								}
							}
							isLocked={isMoving || isResizing}
						/>
					)
				}
			</div>
		</div>
	);
}
