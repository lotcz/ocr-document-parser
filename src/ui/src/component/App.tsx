import {useContext, useState} from "react";
import {Alert, Container, Stack} from "react-bootstrap";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import {UserAlert} from "zavadil-ts-common";
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
						(a, i) => (
							<Alert variant={a.type} key={i}>
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
