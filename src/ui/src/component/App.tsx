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

export default function App() {
	const userAlerts = useContext(OcrUserAlertsContext);
	const restClient = useContext(OcrRestClientContext);
	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>();
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
			setSession(s);
		},
		[]
	);

	const confirmDialogContext = useMemo<ConfirmDialogContextData>(
		() => new ConfirmDialogContextData(setConfirmDialog),
		[setConfirmDialog]
	);

	const folderSelectDialogContext = useMemo<SelectFolderContextContent>(
		() => {
			return {
				selectFolder: (onSelected, defaultFolderId) => {
					setFolderDialog({defaultFolderId: defaultFolderId, onSelected: onSelected, onClose: () => setFolderDialog(undefined)})
				}
			}
		},
		[setFolderDialog]
	);

	return (
		<LocalizationContext.Provider value={localization}>
			<OcrUserSessionContext.Provider value={session}>
				<OcrUserSessionUpdateContext.Provider value={updateSession}>
					<ConfirmDialogContext.Provider value={confirmDialogContext}>
						<SelectFolderContext.Provider value={folderSelectDialogContext}>
							<BrowserRouter>
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
									{
										folderDialog && <FolderSelectDialog {...folderDialog} />
									}
								</div>
							</BrowserRouter>
						</SelectFolderContext.Provider>
					</ConfirmDialogContext.Provider>
				</OcrUserSessionUpdateContext.Provider>
			</OcrUserSessionContext.Provider>
		</LocalizationContext.Provider>
	)
}
