import React from 'react';
import {NavLink} from "react-router";

function MainMenu() {
	return (
		<div className="pt-2 px-3">
			<div className="px-3">
				<div>
					<NavLink to="/">Dashboard</NavLink>
				</div>
				<div>
					<NavLink to="/templates">Templates</NavLink>
				</div>
				<div>
					<NavLink to="/documents">Documents</NavLink>
				</div>
			</div>
		</div>
	);
}

export default MainMenu;
