import React, {useContext, useEffect, useState} from 'react';
import {OcrRestClientContext} from "../util/OcrRestClient";

function Footer() {
	const restClient = useContext(OcrRestClientContext);
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		restClient
			.status()
			.then((s) => setStatus(s))
			.catch((e: Error) => setStatus(`${e.cause}: ${e.message}`));
	}, []);

	return (
		<footer className="flex-fill p-3 small bg-primary text-bg-primary">
			{status}
		</footer>
	);
}

export default Footer;
