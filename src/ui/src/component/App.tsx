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
import {Button, Spinner} from "react-bootstrap";
import {BasicLocalization, Localization, MemoryDictionary} from "zavadil-ts-common";
import OcrCzech from "../lang/dictionary.cs.json";
import {SelectFolderContext, SelectFolderContextContent} from "../util/SelectFolderContext";
import FolderSelectDialog, {FolderSelectDialogProps} from "./folders/FolderSelectDialog";
import {BrowserRouter} from "react-router";
import {WaitingDialogContext, WaitingDialogContextContent} from "../util/WaitingDialogContext";
import WaitingDialog, {WaitingDialogProps} from "./general/WaitingDialog";
import {SelectDocumentContext, SelectDocumentContextContent} from "../util/SelectDocumentContext";
import DocumentSelectDialog, {DocumentSelectDialogProps} from "./documents/DocumentSelectDialog";

export default function App() {
	const userAlerts = useContext(OcrUserAlertsContext);
	const restClient = useContext(OcrRestClientContext);
	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>();
	const [waitingDialog, setWaitingDialog] = useState<WaitingDialogProps>();
	const [folderDialog, setFolderDialog] = useState<FolderSelectDialogProps>();
	const [documentDialog, setDocumentDialog] = useState<DocumentSelectDialogProps>();
	const [session, setSession] = useState<OcrUserSession>(new OcrUserSession());
	const [initialized, setInitialized] = useState<boolean>();
	const [showAlerts, setShowAlerts] = useState<boolean>();

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

	const documentSelectDialogContext = useMemo<SelectDocumentContextContent>(
		() => {
			return {
				selectDocument: (onSelected, defaultFolderId) => {
					setDocumentDialog({defaultFolderId: defaultFolderId, onSelected: onSelected, onClose: () => setDocumentDialog(undefined)})
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

	const restInitialize = useCallback(
		() => {
			setInitialized(undefined);
			try {
				restClient
					.initialize()
					.then(
						(success) => {
							if (!success) {
								userAlerts.err("Rest initialization failed!");
							}
							setInitialized(success);
						})
					.catch(
						(e) => {
							userAlerts.err("Rest initialization failed!");
							userAlerts.err(e);
							setInitialized(false);
						});
			} catch (e: any) {
				userAlerts.err("Rest initialization failed!");
				userAlerts.err(e);
				setInitialized(false);
			}
		},
		[restClient, userAlerts]
	);

	const alertsChanged = useCallback(
		() => {
			setShowAlerts(userAlerts.alerts.length > 0);
		},
		[]
	);

	useEffect(() => {
			userAlerts.addOnChangeHandler(alertsChanged);

			// session
			const sessionRaw = localStorage.getItem('okarina-session');
			if (sessionRaw) {
				updateSession(JSON.parse(sessionRaw));
			}

			// rest client
			restInitialize();

			return () => {
				userAlerts.removeOnChangeHandler(alertsChanged);
			}
		},
		[]
	);

	return (
		<OcrUserSessionContext.Provider value={session}>
			<OcrUserSessionUpdateContext.Provider value={updateSession}>
				<LocalizationContext.Provider value={localization}>
					<WaitingDialogContext.Provider value={waitingDialogContext}>
						<ConfirmDialogContext.Provider value={confirmDialogContext}>
							<SelectFolderContext.Provider value={folderSelectDialogContext}>
								<SelectDocumentContext.Provider value={documentSelectDialogContext}>
									<BrowserRouter>
										<div className="min-h-100 d-flex flex-column align-items-stretch">
											{
												(initialized === undefined) && <Spread>
													<div className="d-flex flex-column align-items-center">
														<div><Spinner/></div>
														<div><Localize text="Initializing"/></div>
													</div>
												</Spread>
											}
											{
												(initialized === false) && <Spread>
													<div className="d-flex flex-column align-items-center">
														<div className="p-3"><Localize text="Initialization failed!"/></div>
														<div><Button onClick={restInitialize}>Try again</Button></div>
													</div>
												</Spread>
											}
											{
												(initialized === true) && <>
													<Header/>
													<Main/>
													<Footer/>
												</>
											}
											{
												folderDialog && <FolderSelectDialog {...folderDialog} />
											}
											{
												documentDialog && <DocumentSelectDialog {...documentDialog} />
											}
											{
												confirmDialog && <ConfirmDialog {...confirmDialog} />
											}
											{
												waitingDialog && <WaitingDialog {...waitingDialog} />
											}
											{
												showAlerts && <UserAlertsWidget userAlerts={userAlerts}/>
											}
										</div>
									</BrowserRouter>
								</SelectDocumentContext.Provider>
							</SelectFolderContext.Provider>
						</ConfirmDialogContext.Provider>
					</WaitingDialogContext.Provider>
				</LocalizationContext.Provider>
			</OcrUserSessionUpdateContext.Provider>
		</OcrUserSessionContext.Provider>
	)
}
