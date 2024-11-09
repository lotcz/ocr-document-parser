import React, {useEffect, useState} from 'react';
import {CardType} from "../../types/TemplateType";
import {OcrRestClient} from "../../util/OcrRestClient";
import {BasicComponentProps} from "../../types/BasicComponentProps";
import {Button, Card, Stack} from 'react-bootstrap';

export type CardTypesListProps = BasicComponentProps & {
	pluginId: bigint;
	onEditorRequested: (suffix: string | null) => any
};

function CardTypesList({userAlerts, pluginId, onEditorRequested}: CardTypesListProps) {
	const [list, setList] = useState<Array<CardType> | null>(null);

	useEffect(() => {
		OcrRestClient.create().loadCardTypes(pluginId)
			.then((l) => setList(l))
			.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
	}, [pluginId]);

	return (
		<div>
			<Stack direction="horizontal">
				<Button onClick={() => onEditorRequested(null)}>+ Nový typ kartičky</Button>
			</Stack>
			<div>
				{
					(list === null) ? <span>loading...</span>
						: (list.length === 0) ? (
							<tr>
								<td colSpan={3}>No card types available</td>
							</tr>
						) : (
							<div className="d-flex pt-2 gap-3">
								{
									list.map(
										(ct: CardType) => (
											<Card
												key={ct.suffix}
												className="card-list-preview"
												style={{
													backgroundColor: ct.settings.background_color,
													color: ct.settings.foreground_color
												}}
												onClick={() => onEditorRequested(ct.suffix)}
											>
												<Card.Body>
													<Stack direction="horizontal" className="gap-2">
														<img src={ct.settings.logo_image} alt="logo"/>
														<div>
															<h3>{ct.settings.program_name}</h3>
															<span>{ct.suffix}</span>
														</div>
													</Stack>
												</Card.Body>
											</Card>
										)
									)
								}
							</div>
						)
				}
			</div>
		</div>
	);
}

export default CardTypesList;
