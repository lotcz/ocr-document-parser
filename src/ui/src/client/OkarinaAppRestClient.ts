import {OkarinaRestClient} from "okarina-ts-client";
import {createContext} from "react";
import conf from "../config/conf.json";

export class OkarinaAppRestClient extends OkarinaRestClient {

	constructor() {
		super(conf.API_URL);
	}

}

export const OkarinaRestClientContext = createContext(new OkarinaAppRestClient());
