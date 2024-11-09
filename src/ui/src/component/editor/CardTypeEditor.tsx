import {Button, Stack} from "react-bootstrap";
import CardTypePreview from "./CardTypePreview";
import CardTypeForm from "./CardTypeForm";
import {BasicComponentProps} from "../../types/BasicComponentProps";
import {useEffect, useState} from "react";
import {CardType} from "../../types/TemplateType";
import {OcrRestClient} from "../../util/OcrRestClient";
import TempUtil from "../../util/TempUtil";
import {StringUtil} from "incomaker-react-ts-commons";

export type CardTypeEditorProps = BasicComponentProps & {
	pluginId: bigint;
	suffix?: string | null;
	onEditorClosed: () => any
};

export default function CardTypeEditor({pluginId, suffix, onEditorClosed, userAlerts}: CardTypeEditorProps) {
	const [cardType, setCardType] = useState<CardType | null>(null);

	useEffect(() => {
		if (StringUtil.isEmpty(suffix)) {
			setCardType({
				suffix: 'new-loyalty-card',
				settings: {
					google_issuer_id: '',
					apple_team_id: '',
					apple_pass_type_id: 'pass.com.incomaker.passbook',
					company_name: '',
					program_name: '',
					points_label: '',
					logo_image: '',
					main_image: '',
					background_color: '',
					foreground_color: '',
					points_custom_col: 'bonus_points',
					card_number_custom_col: 'loyalty_card',
					barcode_type: '',
					links: []
				}
			});
			return;
		}
		OcrRestClient.create().loadCardType(pluginId, String(suffix))
			.then((ct) => setCardType(ct))
			.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
	}, [pluginId, suffix]);

	if (cardType === null) {
		return <span>loading...</span>
	}

	const saveCardType = () => {
		OcrRestClient.create()
			.saveCardType(pluginId, cardType)
			.then(onEditorClosed)
			.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`));
	}

	return (
		<Stack className="card-type-editor">
			<Stack direction="horizontal">
				<CardTypeForm cardType={cardType} userAlerts={userAlerts} onPropChanged={() => setCardType(TempUtil.clone(cardType))}/>
				<CardTypePreview cardType={cardType} userAlerts={userAlerts}/>
			</Stack>
			<Stack direction="horizontal">
				<Button onClick={saveCardType}>Uložit</Button>
				<Button onClick={onEditorClosed} variant="link">Zpět</Button>
			</Stack>
		</Stack>
	)
}
