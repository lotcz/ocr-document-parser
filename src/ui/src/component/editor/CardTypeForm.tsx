import {BasicComponentProps} from "../../types/BasicComponentProps";
import {CardType} from "../../types/TemplateType";
import {Form, Stack} from "react-bootstrap";

export type CardTypeFormProps = BasicComponentProps & {
	cardType: CardType;
	onPropChanged: () => any;
};

export default function CardTypeForm({cardType, onPropChanged}: CardTypeFormProps) {
	return (
		<Form className="p-3">
			<Stack direction="vertical" gap={2}>
				<div>
					<Form.Label>Barva pozadí:</Form.Label>
					<Stack direction="horizontal" gap={2}>
						<Form.Control
							type="text"
							value={cardType.settings.background_color}
							onChange={(e) => {
								cardType.settings.background_color = e.target.value;
								onPropChanged();
							}}
						/>
						<Form.Control
							type="color"
							value={cardType.settings.background_color}
							onChange={(e) => {
								cardType.settings.background_color = e.target.value;
								onPropChanged();
							}}
						/>
					</Stack>
				</div>
				<div>
					<Form.Label>Barva textu:</Form.Label>
					<Stack direction="horizontal" gap={2}>
						<Form.Control
							type="text"
							value={cardType.settings.foreground_color}
							onChange={(e) => {
								cardType.settings.foreground_color = e.target.value;
								onPropChanged();
							}}
						/>
						<Form.Control
							type="color"
							value={cardType.settings.foreground_color}
							onChange={(e) => {
								cardType.settings.foreground_color = e.target.value;
								onPropChanged();
							}}
						/>
					</Stack>
				</div>
				<div>
					<Form.Label>Název společnosti:</Form.Label>
					<Form.Control
						type="text"
						value={cardType.settings.company_name}
						onChange={(e) => {
							cardType.settings.company_name = e.target.value;
							onPropChanged();
						}}
					/>
				</div>
				<div>
					<Form.Label>Logo společnosti:</Form.Label>
					<Form.Control
						type="text"
						value={cardType.settings.logo_image}
						onChange={(e) => {
							cardType.settings.logo_image = e.target.value;
							onPropChanged();
						}}
					/>
				</div>
				<div>
					<Form.Label>Název věrnostního programu:</Form.Label>
					<Form.Control
						type="text"
						value={cardType.settings.program_name}
						onChange={(e) => {
							cardType.settings.program_name = e.target.value;
							onPropChanged();
						}}
					/>
				</div>
				<div>
					<Form.Label>Hlavní obrázek:</Form.Label>
					<Form.Control
						type="text"
						value={cardType.settings.main_image}
						onChange={(e) => {
							cardType.settings.main_image = e.target.value;
							onPropChanged();
						}}
					/>
				</div>
				<div>
					<Form.Label>Popisek stavu bodového konta:</Form.Label>
					<Form.Control
						type="text"
						value={cardType.settings.points_label}
						onChange={(e) => {
							cardType.settings.points_label = e.target.value;
							onPropChanged();
						}}
					/>
				</div>
				<div>
					<Form.Label>Typ čárového kódu:</Form.Label>
					<Form.Control
						type="text"
						value={cardType.settings.barcode_type}
						onChange={(e) => {
							cardType.settings.barcode_type = e.target.value;
							onPropChanged();
						}}
					/>
				</div>
				<div>
					<Form.Label>Odkazy:</Form.Label>

				</div>
			</Stack>
		</Form>
	)
}
