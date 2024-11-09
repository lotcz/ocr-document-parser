import React, {useEffect, useState} from 'react';
import {OcrRestClient} from "../util/OcrRestClient";

function Footer() {
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		OcrRestClient.create()
			.status()
			.then((s) => setStatus(s))
			.catch((e: Error) => setStatus(`${e.cause}: ${e.message}`));
	}, []);

	return (
		<footer className="small text-muted border-top my-3">
			{status}
		</footer>
	);
}

export default Footer;
