import React, {useContext, useEffect, useState} from 'react';
import {OcrRestClientContext} from "../util/OcrRestClient";

function Footer() {
	const restClient = useContext(OcrRestClientContext);
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		restClient
			.version()
			.then((s) => setStatus(s))
			.catch((e) => setStatus(e));
	}, [restClient]);

	return (
		<footer className="flex-fill p-3 small bg-body-secondary">
			{status}
		</footer>
	);
}

export default Footer;
