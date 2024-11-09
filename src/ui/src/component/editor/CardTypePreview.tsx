import {BasicComponentProps} from "../../types/BasicComponentProps";
import {CardType} from "../../types/TemplateType";
import {Card, Stack} from "react-bootstrap";
import TempUtil from "../../util/TempUtil";
import {StringUtil} from "incomaker-react-ts-commons";

export type CardTypePreviewProps = BasicComponentProps & {
	cardType: CardType;
};

export default function CardTypePreview({cardType}: CardTypePreviewProps) {
	return (
		<Card
			className="card-type-preview"
			style={{
				backgroundColor: cardType.settings.background_color,
				color: cardType.settings.foreground_color
			}}>
			<Card.Header>
				<Stack direction="horizontal" gap={2}>
					<img src={cardType.settings.logo_image} alt="logo" className="logo"/>
					<span>{cardType.settings.company_name}</span>
				</Stack>
			</Card.Header>
			<Card.Body>
				<h3>{cardType.settings.program_name}</h3>
				{
					cardType.settings.points_custom_col.length > 0 && (
						<Card.Text>
							<div>
								{
									cardType.settings.points_label.length > 0 ?
										TempUtil.replace(cardType.settings.points_label, '{contactName}', 'Jana Kartičková')
										: 'Počet bodů'
								}
							</div>
							<div>
								<strong>187</strong>
							</div>
						</Card.Text>
					)
				}
				{
					(!StringUtil.isEmpty(cardType.settings.barcode_type)) && (
						<div className="d-flex flex-column align-items-center">
							<img src="https://qr.flexigent.cz?text=12345&size=100" className="barcode" alt="barcode"/>
							<div>123456</div>
						</div>
					)
				}
			</Card.Body>
			<Card.Img variant="bottom" src={cardType.settings.main_image}/>
		</Card>
	)
}
