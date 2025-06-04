import React, {useContext, useEffect, useState} from 'react';
import {OkarinaRestClientContext} from "../client/OkarinaAppRestClient";

function Footer() {
	const restClient = useContext(OkarinaRestClientContext);
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		restClient
			.version()
			.then((s) => setStatus(s))
			.catch((e) => setStatus(String(e)));
	}, []);

	return (
		<footer className="flex-fill p-3 small bg-body-secondary">
			{status}
		</footer>
	);
}

export default Footer;
