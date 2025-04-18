import React, {useCallback, useContext, useEffect, useState} from 'react';
import {OcrRestClientContext} from "../client/OcrRestClient";

function Footer() {
	const restClient = useContext(OcrRestClientContext);
	const [status, setStatus] = useState<string | null>(null);

	const handler = useCallback(
		() => {
			restClient
				.version()
				.then((s) => setStatus(s))
				.catch((e) => setStatus(e));
		},
		[restClient]
	);

	useEffect(() => {
		restClient.addIdTokenChangedHandler(handler);
		restClient
			.getTokenManager()
			.then(
				(tm) => {
					if (tm.hasValidIdToken()) handler();
				}
			);
		return () => restClient.removeIdTokenChangedHandler(handler);
	}, []);

	return (
		<footer className="flex-fill p-3 small bg-body-secondary">
			{status}
		</footer>
	);
}

export default Footer;
