import {FragmentTemplateStub, PageTemplateStubWithFragments} from "../../types/entity/Template";
import {MouseEvent, MouseEventHandler, useCallback, useMemo, useRef, useState} from "react";
import StorageImage from "../general/StorageImage";
import {BasicFormComponentProps} from "../../types/ComponentProps";
import {Vector2} from "zavadil-ts-common";
import DocumentTemplateFragmentImage from "./PageTemplateFragmentImage";

export type DocumentTemplateFragmentsImageProps = BasicFormComponentProps<PageTemplateStubWithFragments> & {
	selectedFragment?: FragmentTemplateStub;
	onSelected: (f?: FragmentTemplateStub) => any;
	updateFragment: (old: FragmentTemplateStub | null, updated: FragmentTemplateStub) => any;
	deleteFragment: (f: FragmentTemplateStub) => any;
};

export default function PageTemplateFragmentsImage({
	entity,
	onChange,
	onSelected,
	selectedFragment,
	updateFragment,
	deleteFragment
}: DocumentTemplateFragmentsImageProps) {
	const fragments = useMemo(
		() => entity?.fragments,
		[entity]
	);

	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [isMoving, setIsMoving] = useState<boolean>(false);
	const [lastMousePos, setLastMousePos] = useState<Vector2>();
	const ref = useRef<HTMLDivElement>(null);

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
						languageId: undefined,
						pageTemplateId: Number(entity.id),
						top: e.nativeEvent.offsetY / ref.current.clientHeight,
						left: e.nativeEvent.offsetX / ref.current.clientWidth,
						width: 0,
						height: 0,
						createdOn: new Date(),
						lastUpdatedOn: new Date()
					}
					updateFragment(null, newFragment);
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
		[ref, isResizing, isMoving, selectedFragment, updateFragment, lastMousePos, getNewFragmentName, entity, onSelected]
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
			<StorageImage path={entity.previewImg} size="preview"/>
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
