import {useContext, useEffect, useMemo, useState} from "react";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import {OcrUserAlertsContext} from "../util/OcrUserAlerts";
import {OcrUserSession, OcrUserSessionContext, OcrUserSessionUpdateContext} from "../util/OcrUserSession";
import {ConfirmDialog, ConfirmDialogContext, ConfirmDialogContextData, ConfirmDialogProps, Spread, UserAlertsWidget} from "zavadil-react-common";
import {OcrRestClientContext} from "../client/OcrRestClient";
import {Spinner} from "react-bootstrap";

export default function App() {
	const userAlerts = useContext(OcrUserAlertsContext);
	const restClient = useContext(OcrRestClientContext);
	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>();
	const [session, setSession] = useState<OcrUserSession>(new OcrUserSession());
	const [initialized, setInitialized] = useState<boolean>(false);

	useEffect(() => {
		restClient
			.initialize()
			.then(setInitialized)
			.catch((e) => userAlerts.err(e));
	}, []);

	useEffect(() => {
		document.documentElement.dataset.bsTheme = session.theme;
	}, [session]);

	const confirmDialogContext = useMemo<ConfirmDialogContextData>(
		() => new ConfirmDialogContextData(setConfirmDialog),
		[setConfirmDialog]
	);

	return (
		<OcrUserSessionContext.Provider value={session}>
			<OcrUserSessionUpdateContext.Provider value={setSession}>
				<ConfirmDialogContext.Provider value={confirmDialogContext}>
					<div className="min-h-100 d-flex flex-column align-items-stretch">
						<Header/>
						{
							initialized ? <Main/> : <Spread>
								<div className="d-flex flex-column align-items-center">
									<div><Spinner/></div>
									<div>Initializing</div>
								</div>
							</Spread>
						}
						<Footer/>
						{
							userAlerts.alerts.length > 0 && <UserAlertsWidget userAlerts={userAlerts}/>
						}
						{
							confirmDialog && <ConfirmDialog {...confirmDialog} />
						}
					</div>
				</ConfirmDialogContext.Provider>
			</OcrUserSessionUpdateContext.Provider>
		</OcrUserSessionContext.Provider>
	)
}
