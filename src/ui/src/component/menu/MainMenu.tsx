import React from 'react';
import {NavLink} from "react-router-dom";

function MainMenu() {
	return (
		<div className="px-3 border-end border-secondary">
			<div>
				<NavLink to="/">Dashboard</NavLink>
			</div>
			<div>
				<NavLink to="templates">Templates</NavLink>
			</div>
			<div>
				<NavLink to="documents">Documents</NavLink>
			</div>
		</div>
	);
}

export default MainMenu;
