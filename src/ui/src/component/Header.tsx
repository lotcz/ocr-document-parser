import React, {useContext} from 'react';
import {Stack} from "react-bootstrap";
import {BsMoonFill, BsSunFill} from "react-icons/bs";
import {OcrUserSessionContext, OcrUserSessionUpdateContext} from "../util/OcrUserSession";
import {IconSwitch} from "zavadil-react-common";

function Header() {
	const session = useContext(OcrUserSessionContext);
	const sessionUpdate = useContext(OcrUserSessionUpdateContext);
	const isDark = session.theme === 'dark';

	return (
		<header className={`p-3 bg-body-secondary`}>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h1>OKARINA</h1>
				<div className="p-2 rounded bg-body text-body">
					<IconSwitch
						checked={!isDark}
						onChange={
							() => {
								session.theme = isDark ? "light" : "dark";
								if (sessionUpdate) sessionUpdate({...session});
							}
						}
						iconOn={<BsSunFill/>}
						iconOff={<BsMoonFill/>}
					/>
				</div>
			</Stack>
		</header>
	);
}

export default Header;
