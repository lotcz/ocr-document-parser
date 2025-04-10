import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import {OcrUserAlertsContext} from "../util/OcrUserAlerts";
import {OcrUserSession, OcrUserSessionContext, OcrUserSessionUpdateContext} from "../util/OcrUserSession";
import {
	ConfirmDialog,
	ConfirmDialogContext,
	ConfirmDialogContextData,
	ConfirmDialogProps,
	LocalizationContext,
	Localize,
	Spread,
	UserAlertsWidget
} from "zavadil-react-common";
import {OcrRestClientContext} from "../client/OcrRestClient";
import {Spinner} from "react-bootstrap";
import {BasicLocalization, Localization, MemoryDictionary} from "zavadil-ts-common";
import OcrCzech from "../lang/dictionary.cs.json";
import {SelectFolderContext, SelectFolderContextContent} from "../util/SelectFolderContext";
import FolderSelectDialog, {FolderSelectDialogProps} from "./folders/FolderSelectDialog";
import {BrowserRouter} from "react-router";
import {WaitingDialogContext, WaitingDialogContextContent} from "../util/WaitingDialogContext";
import WaitingDialog, {WaitingDialogProps} from "./general/WaitingDialog";

export default function App() {
	const userAlerts = useContext(OcrUserAlertsContext);
	const restClient = useContext(OcrRestClientContext);
	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>();
	const [waitingDialog, setWaitingDialog] = useState<WaitingDialogProps>();
	const [folderDialog, setFolderDialog] = useState<FolderSelectDialogProps>();
	const [session, setSession] = useState<OcrUserSession>(new OcrUserSession());
	const [initialized, setInitialized] = useState<boolean>(false);

	const language = useMemo<string>(
		() => session.language,
		[session]
	);

	const localization = useMemo<Localization>(
		() => {
			const l = new BasicLocalization(language);
			l.addDictionary("cs", new MemoryDictionary(OcrCzech));
			return l;
		},
		[language]
	);

	useEffect(() => {
		const sessionRaw = localStorage.getItem('okarina-session');
		if (sessionRaw) {
			updateSession(JSON.parse(sessionRaw));
		}
		restClient
			.initialize()
			.then(setInitialized)
			.catch((e) => userAlerts.err(e));
	}, []);

	const updateSession = useCallback(
		(s: OcrUserSession) => {
			document.documentElement.dataset.bsTheme = s.theme;
			localStorage.setItem('okarina-session', JSON.stringify(s));
			setSession({...s});
		},
		[]
	);

	const confirmDialogContext = useMemo<ConfirmDialogContextData>(
		() => new ConfirmDialogContextData(setConfirmDialog),
		[]
	);

	const folderSelectDialogContext = useMemo<SelectFolderContextContent>(
		() => {
			return {
				selectFolder: (onSelected, defaultFolderId) => {
					setFolderDialog({defaultFolderId: defaultFolderId, onSelected: onSelected, onClose: () => setFolderDialog(undefined)})
				}
			}
		},
		[]
	);

	const waitingDialogContext = useMemo<WaitingDialogContextContent>(
		() => {
			return {
				show: (text, onCancel) => {
					setWaitingDialog({text: text, onCancel: onCancel, onClose: () => onCancel ? onCancel() : null});
				},
				progress: (progress?: number, max?: number) => {
					if (!waitingDialog) return;
					waitingDialog.progress = progress;
					waitingDialog.max = max;
					setWaitingDialog({...waitingDialog});
				},
				hide: () => {
					setWaitingDialog(undefined);
				}
			}
		},
		[waitingDialog]
	);

	return (
		<OcrUserSessionContext.Provider value={session}>
			<OcrUserSessionUpdateContext.Provider value={updateSession}>
				<LocalizationContext.Provider value={localization}>
					<WaitingDialogContext.Provider value={waitingDialogContext}>
						<ConfirmDialogContext.Provider value={confirmDialogContext}>
							<SelectFolderContext.Provider value={folderSelectDialogContext}>
								<BrowserRouter>
									<div className="min-h-100 d-flex flex-column align-items-stretch">
										<Header/>
										{
											initialized ? <Main/> : <Spread>
												<div className="d-flex flex-column align-items-center">
													<div><Spinner/></div>
													<div><Localize text="Initializing"/></div>
												</div>
											</Spread>
										}
										<Footer/>
										{
											folderDialog && <FolderSelectDialog {...folderDialog} />
										}
										{
											confirmDialog && <ConfirmDialog {...confirmDialog} />
										}
										{
											waitingDialog && <WaitingDialog {...waitingDialog} />
										}
										{
											userAlerts.alerts.length > 0 && <UserAlertsWidget userAlerts={userAlerts}/>
										}
									</div>
								</BrowserRouter>
							</SelectFolderContext.Provider>
						</ConfirmDialogContext.Provider>
					</WaitingDialogContext.Provider>
				</LocalizationContext.Provider>
			</OcrUserSessionUpdateContext.Provider>
		</OcrUserSessionContext.Provider>
	)
}
