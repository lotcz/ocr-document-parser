import {RestClient} from "incomaker-react-ts-commons";
import conf from "../config/conf.json";
import {CardType, CardTypeSettings} from "../types/TemplateType";

export class OcrRestClient extends RestClient {

	constructor() {
		super(conf.API_URL, {'Content-Type': 'application/json', 'Authorization': conf.API_KEY});
	}

	static create(): OcrRestClient {
		return new OcrRestClient()
	}

	status(): Promise<string> {
		return this.get('status').then((r) => r.text());
	}

	loadCardTypes(pluginId: bigint): Promise<Array<CardType>> {
		return this.getJson(`cards/types/${pluginId}`);
	}

	loadCardType(pluginId: bigint, suffix: string): Promise<CardType> {
		return this.getJson(`cards/types/${pluginId}/${suffix}`);
	}

	saveCardType(pluginId: bigint, ct: CardType): Promise<CardType> {
		return this.putJson(`cards/types/${pluginId}/${ct.suffix}`, ct);
	}
}
