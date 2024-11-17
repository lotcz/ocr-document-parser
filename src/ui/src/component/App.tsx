import {useContext, useState} from "react";
import {Alert, Container, Stack} from "react-bootstrap";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import {UserAlert} from "incomaker-react-ts-commons";
import {OcrUserAlertsContext} from "../util/OcrUserAlerts";

export default function App() {
	const userAlerts= useContext(OcrUserAlertsContext);
	const [renderedAlerts, setRenderedAlerts] = useState<UserAlert[]>([]);

	userAlerts.addOnChangeHandler(() => {
		setRenderedAlerts([...userAlerts.alerts]);
	});

	return (
		<Container fluid>
			<Header/>
			<Stack direction="vertical">
				{
					renderedAlerts.map(
						(a) => (
							<Alert variant={a.type}>
								{a.message}
							</Alert>
						)
					)
				}
			</Stack>
			<Main/>
			<Footer/>
		</Container>
	)
}
