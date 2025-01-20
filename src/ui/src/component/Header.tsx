import React, {useContext} from 'react';
import {Form, Stack} from "react-bootstrap";
import {BsLightbulb, BsLightbulbOff} from "react-icons/bs";
import {OcrUserSessionContext, OcrUserSessionUpdateContext} from "../util/OcrUserSession";

function Header() {
	const session = useContext(OcrUserSessionContext);
	const sessionUpdate = useContext(OcrUserSessionUpdateContext);
	const isDark = session.theme === 'dark';

	return (
		<header className="p-3 bg-primary text-bg-primary">
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h1>OKARINA</h1>
				<Stack
					direction="horizontal"
					className="align-items-center"
					onClick={
						() => {
							session.theme = isDark ? "light" : "dark";
							sessionUpdate && sessionUpdate(session);
						}
					}
				>
					<Form.Switch
						type="switch"
						id="darkOrNot"
						checked={isDark}
					/>
					{
						(isDark) ? <BsLightbulb/> : <BsLightbulbOff/>
					}
				</Stack>
			</Stack>
		</header>
	);
}

export default Header;
