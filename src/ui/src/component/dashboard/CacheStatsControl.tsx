import React from 'react';
import {CacheStats} from "../../types/OkarinaStats";
import {ProgressBar} from "react-bootstrap";

export type CacheStatsControlProps = {
	name: string;
	stats: CacheStats;
}

function CacheStatsControl({name, stats}: CacheStatsControlProps) {
	return (
		<div className="d-flex align-items-center gap-2">
			<pre>{name}</pre>
			<pre>[{stats.cachedItems} / {stats.capacity}]</pre>
			<div className="flex-grow-1">
				<ProgressBar
					now={stats.cachedItems}
					min={0}
					max={stats.capacity}
				/>
			</div>
		</div>
	);
}

export default CacheStatsControl;
