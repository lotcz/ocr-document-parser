import React, {useContext} from 'react';
import {Form, Stack} from "react-bootstrap";
import {BsMoonFill, BsSunFill} from "react-icons/bs";
import {OcrUserSessionContext, OcrUserSessionUpdateContext} from "../util/OcrUserSession";

function Header() {
	const session = useContext(OcrUserSessionContext);
	const sessionUpdate = useContext(OcrUserSessionUpdateContext);
	const isDark = session.theme === 'dark';

	return (
		<header className={`p-3 bg-body-secondary`}>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h1>OKARINA</h1>
				<div className="p-2 rounded bg-body text-body">
					<Stack
						direction="horizontal"
						className="align-items-center"
						onClick={
							() => {
								session.theme = isDark ? "light" : "dark";
								if (sessionUpdate) sessionUpdate({...session});
							}
						}
					>
						<Form.Switch
							type="switch"
							id="darkOrNot"
							defaultChecked={!isDark}
						/>
						{
							(isDark) ? <BsSunFill/> : <BsMoonFill/>
						}
					</Stack>
				</div>
			</Stack>
		</header>
	);
}

export default Header;
