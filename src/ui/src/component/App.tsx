import {useContext, useEffect, useState} from "react";
import {Alert, Stack} from "react-bootstrap";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import {UserAlert} from "zavadil-ts-common";
import {OcrUserAlertsContext} from "../util/OcrUserAlerts";
import {OcrUserSession, OcrUserSessionContext, OcrUserSessionUpdateContext} from "../util/OcrUserSession";

export default function App() {
	const userAlerts = useContext(OcrUserAlertsContext);
	const [renderedAlerts, setRenderedAlerts] = useState<UserAlert[]>([]);

	userAlerts.addOnChangeHandler(() => {
		setRenderedAlerts([...userAlerts.alerts]);
	});

	const [session, setSession] = useState<OcrUserSession>(new OcrUserSession());

	useEffect(() => {
		document.documentElement.dataset.bsTheme = session.theme;
	}, [session]);

	return (
		<OcrUserSessionContext.Provider value={session}>
			<OcrUserSessionUpdateContext.Provider value={setSession}>
				<div className="min-h-100 d-flex flex-column align-items-stretch justify-content-start">
					<Header/>
					<div>
						<Stack direction="vertical">
							{
								renderedAlerts.map(
									(a, i) => (
										<Alert variant={a.type} key={i}>
											{a.message}
										</Alert>
									)
								)
							}
						</Stack>
					</div>
					<Main/>
					<Footer/>
				</div>
			</OcrUserSessionUpdateContext.Provider>
		</OcrUserSessionContext.Provider>
	)
}
