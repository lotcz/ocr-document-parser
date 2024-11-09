import React, {useState} from 'react';
import CardTypesList from "./list/CardTypesList";
import CardTypeEditor from "./editor/CardTypeEditor";
import {BasicComponentProps} from "../types/BasicComponentProps";

export type MainProps = BasicComponentProps & {
	pluginId: bigint;
};

function Main({pluginId, userAlerts}: MainProps) {
	const [isDetail, setIsDetail] = useState<boolean>(false);
	const [cardTypeKeySuffix, setCardTypeKeySuffix] = useState<string | null>(null);

	const openEditor = (suffix: string | null) => {
		setCardTypeKeySuffix(suffix);
		setIsDetail(true);
	}

	const closeEditor = () => {
		setIsDetail(false);
		setCardTypeKeySuffix(null);
	}

	return (
		<main>
			{
				isDetail ?
					<CardTypeEditor
						pluginId={pluginId}
						userAlerts={userAlerts}
						suffix={cardTypeKeySuffix}
						onEditorClosed={closeEditor}
					/>
					: <CardTypesList
						pluginId={pluginId}
						userAlerts={userAlerts}
						onEditorRequested={openEditor}
					/>
			}
		</main>
	);
}

export default Main;
