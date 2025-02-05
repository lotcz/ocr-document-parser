import React from 'react';
import {QueueStats} from "../../types/OkarinaStats";
import {ProgressBar} from "react-bootstrap";
import QueueStateControl from "./QueueStateControl";

export type QueueStatsControlProps = {
	name: string;
	stats: QueueStats;
}

function QueueStatsControl({name, stats}: QueueStatsControlProps) {
	return (
		<div className="d-flex align-items-center gap-2">
			<pre>{name}</pre>
			<pre>[{stats.loaded} / {stats.remaining}]</pre>
			<QueueStateControl state={stats.state}/>
			<div className="flex-grow-1">
				<ProgressBar
					now={stats.loaded}
					min={0}
					max={stats.remaining > 0 ? stats.remaining : 1}
				/>
			</div>
		</div>
	);
}

export default QueueStatsControl;
