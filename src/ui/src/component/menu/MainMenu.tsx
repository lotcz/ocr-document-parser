import React from 'react';
import {NavLink} from "react-router";

function MainMenu() {
	return (
		<div className="p-3 bg-secondary text-bg-secondary">
			<div>
				<NavLink className="text-bg-secondary" to="/">Dashboard</NavLink>
			</div>
			<div>
				<NavLink className="text-bg-secondary" to="/templates">Templates</NavLink>
			</div>
			<div>
				<NavLink className="text-bg-secondary" to="/documents">Documents</NavLink>
			</div>
		</div>
	);
}

export default MainMenu;
