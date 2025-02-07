import {Button, Form, Stack} from "react-bootstrap";
import {FormWithDeleteComponentProps} from "../../types/ComponentProps";
import {FragmentTemplateStub} from "../../types/entity/Template";
import {useEffect, useRef, useState} from "react";
import {BsTrash} from "react-icons/bs";
import {FiMenu} from "react-icons/fi";
import {Vector2} from "zavadil-ts-common";

export type DocumentTemplateFragmentImageProps = FormWithDeleteComponentProps<FragmentTemplateStub> & {
	isSelected: boolean;
	isLocked: boolean;
	onSelected: () => any;
	onMoveStarted: () => any;
	onResizeStarted: () => any;
};

export default function DocumentTemplateFragmentImage({
	entity,
	onChange,
	onDelete,
	onSelected,
	isSelected,
	isLocked,
	onMoveStarted,
	onResizeStarted
}: DocumentTemplateFragmentImageProps) {
	const fragment = entity;
	const ref = useRef<HTMLDivElement>(null);
	const [stl, setStl] = useState<object>({});
	const [isInResizeArea, setIsInResizeArea] = useState<boolean>(false);

	useEffect(() => {
		setStl({
			top: `${fragment.top * 100}%`,
			left: `${fragment.left * 100}%`,
			width: `${fragment.width * 100}%`,
			height: `${fragment.height * 100}%`,
			zIndex: isSelected ? 10000 : undefined,
			pointerEvents: isLocked ? 'none' : 'auto'
		});
	}, [fragment, isSelected, isLocked]);

	return (
		<div
			className="document-template-fragment-editor position-absolute"
			style={stl}
			onClick={(e) => e.stopPropagation()}
			onMouseDown={
				(e) => {
					e.stopPropagation();
					onSelected();
				}
			}
			onMouseMove={
				(e) => {
					e.stopPropagation();
					if (!ref.current) return;
					const fragmentSize = new Vector2(ref.current.clientWidth, ref.current.clientHeight);
					const mousePos = new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
					const delta = fragmentSize.sub(mousePos).multiply(-1);
					const inResizeArea = delta.size() < 25;
					setIsInResizeArea(inResizeArea);
					if (e.buttons === 1) {
						if (isInResizeArea) {
							onResizeStarted();
						} else {
							onMoveStarted();
						}
					}
				}
			}
		>
			{
				isSelected ? (
					<div
						className="position-relative overflow-visible bg-primary p-1 text-small cursor-move"
						style={{top: '-2.4rem', minWidth: '150px'}}
						onClick={
							(e) => {
								e.stopPropagation();
							}
						}
						onMouseDown={
							(e) => {
								e.stopPropagation();
							}
						}
					>
						<Stack direction="horizontal" className="align-items-center" gap={2}>
							<div className="d-flex p-1 align-items-center">
								<FiMenu/>
							</div>
							<Form.Control
								type="text"
								size="sm"
								className="bg-light text-dark"
								defaultValue={fragment.name}
								onChange={
									(e) => {
										fragment.name = e.target.value;
										onChange(fragment);
									}
								}
							>
							</Form.Control>
							<Button
								size="sm"
								onMouseDown={
									(e) => {
										e.stopPropagation();
										onDelete();
									}
								}
								variant="danger"
							>
								<BsTrash/>
							</Button>
						</Stack>
					</div>
				) : (
					<div
						className="position-relative bg-secondary text-bg-secondary opacity-75 cursor-move"
						style={{top: '-1.3rem', minWidth: '100px'}}
						onClick={
							(e) => {
								e.stopPropagation();
								onSelected();
							}
						}
					>
						<small>
							<pre>{fragment.name}</pre>
						</small>
					</div>
				)
			}
			<div
				className={`fragment-frame cursor-move position-absolute border ${isSelected ? 'border-primary border-3' : 'border-secondary'} ${isInResizeArea ? 'cursor-resize' : 'cursor-move'}`}
				style={{left: 0, top: 0, right: 0, bottom: 0}}
				ref={ref}
				onClick={
					(e) => {
						e.stopPropagation();
						onSelected();
					}
				}
			>

			</div>
		</div>
	);
}
