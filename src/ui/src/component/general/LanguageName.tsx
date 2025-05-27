import {useContext, useEffect, useState} from "react";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {Localize} from "zavadil-react-common";
import {OkarinaRestClientContext} from "../../client/OkarinaAppRestClient";
import {Language} from "okarina-ts-client";

export type LanguageProps = {
	id?: number | null;
};

function LanguageName({id}: LanguageProps) {
	const restClient = useContext(OkarinaRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const [language, setLanguage] = useState<Language>();

	useEffect(
		() => {
			if (!id) {
				setLanguage(undefined);
				return;
			}
			restClient.languages
				.loadSingle(id)
				.then(setLanguage)
				.catch(e => userAlerts.err(e));
		},
		[id]
	);

	if (!language) return <span>--</span>

	return <Localize text={language?.name}/>

}

export default LanguageName;
