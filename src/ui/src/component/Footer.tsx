import React, {useCallback, useContext, useEffect, useState} from 'react';
import {OkarinaRestClientContext} from "../client/OkarinaAppRestClient";

function Footer() {
	const restClient = useContext(OkarinaRestClientContext);
	const [status, setStatus] = useState<string | null>(null);

	const handler = useCallback(
		() => {
			restClient
				.version()
				.then((s) => setStatus(s))
				.catch((e) => setStatus(String(e)));
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
