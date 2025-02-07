import React from 'react';
import ClientStatsControl from './ClientStatsControl';
import OkarinaStatsControl from "./OkarinaStatsControl";

function Dashboard() {
	return (
		<div className="p-3 pt-1">
			<h1>Dashboard</h1>
			<div>
				<OkarinaStatsControl/>
			</div>
			<div className="pt-3">
				<ClientStatsControl/>
			</div>
		</div>
	);
}

export default Dashboard;
