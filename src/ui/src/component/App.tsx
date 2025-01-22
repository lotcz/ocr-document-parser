import {useContext, useEffect, useMemo, useState} from "react";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import {OcrUserAlertsContext} from "../util/OcrUserAlerts";
import {OcrUserSession, OcrUserSessionContext, OcrUserSessionUpdateContext} from "../util/OcrUserSession";
import ConfirmDialog, {ConfirmDialogProps} from "./dialog/ConfirmDialog";
import {ConfirmDialogContext, ConfirmDialogContextData} from "./dialog/ConfirmDialogContext";
import {UserAlertsWidget} from "zavadil-react-common";

export default function App() {
	const userAlerts = useContext(OcrUserAlertsContext);
	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>();
	const [session, setSession] = useState<OcrUserSession>(new OcrUserSession());

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
						<Main/>
						<Footer/>
						<UserAlertsWidget userAlerts={userAlerts}/>
						{
							confirmDialog && (
								<ConfirmDialog
									name={confirmDialog.name}
									text={confirmDialog.text}
									onClose={confirmDialog.onClose}
									onConfirm={confirmDialog.onConfirm}
								/>
							)
						}
					</div>
				</ConfirmDialogContext.Provider>
			</OcrUserSessionUpdateContext.Provider>
		</OcrUserSessionContext.Provider>
	)
}
