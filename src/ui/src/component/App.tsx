import {useState} from "react";
import {Alert, Container, Stack} from "react-bootstrap";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import {ObjectUtil, StringUtil, UserAlert, UserAlerts} from "incomaker-react-ts-commons";

export default function App() {
	const [pluginId, setPluginId] = useState<bigint | null>(getPluginIdFromUrl());
	const [userAlerts, setUserAlerts] = useState<UserAlerts>(new UserAlerts());
	const [renderedAlerts, setRenderedAlerts] = useState<UserAlert[]>([]);

	if (pluginId === null) {
		return (
			<>No plugin ID provided!</>
		)
	}

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
			<Main pluginId={pluginId} userAlerts={userAlerts}/>
			<Footer/>
		</Container>
	)
}
