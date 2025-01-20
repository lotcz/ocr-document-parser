import {useContext, useEffect, useMemo, useState} from "react";
import {Alert, Stack} from "react-bootstrap";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import {UserAlert} from "zavadil-ts-common";
import {OcrUserAlertsContext} from "../util/OcrUserAlerts";
import {OcrUserSession, OcrUserSessionContext, OcrUserSessionUpdateContext} from "../util/OcrUserSession";
import ConfirmDialog, {ConfirmDialogProps} from "./dialog/ConfirmDialog";
import {ConfirmDialogContext, ConfirmDialogContextData} from "./dialog/ConfirmDialogContext";

export default function App() {
	const userAlerts = useContext(OcrUserAlertsContext);
	const [renderedAlerts, setRenderedAlerts] = useState<UserAlert[]>([]);
	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>();

	userAlerts.addOnChangeHandler(() => {
		setRenderedAlerts([...userAlerts.alerts]);
	});

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
