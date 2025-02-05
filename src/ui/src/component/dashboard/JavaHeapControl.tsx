import React from 'react';
import {JavaHeapStats} from "../../types/OkarinaStats";
import {Badge, ProgressBar} from "react-bootstrap";
import {ByteUtil} from "zavadil-ts-common";

export type WorkerJavaHeapControlProps = {
	stats: JavaHeapStats;
};

function JavaHeapControl({stats}: WorkerJavaHeapControlProps) {
	const size = stats.heapSize;
	const max = stats.heapMaxSize;
	const free = stats.heapFreeSize;
	const used = size - free;

	return (
		<div className="d-flex align-items-center gap-2">
			<pre>Java Heap</pre>
			<pre>[{ByteUtil.formatByteSize(size)} / {ByteUtil.formatByteSize(max)}]</pre>
			<pre>Used:</pre>
			<Badge className="bg-warning text-bg-warning">
				{ByteUtil.formatByteSize(used)}
			</Badge>
			<pre>Free:</pre>
			<Badge className="bg-success text-white">
				{ByteUtil.formatByteSize(free)}
			</Badge>
			<div className="flex-grow-1">
				<ProgressBar min={0} max={max}>
					<ProgressBar variant="warning" min={0} now={used} max={max}/>
					<ProgressBar variant="success" min={0} now={free} max={max}/>
				</ProgressBar>
			</div>
		</div>
	);
}

export default JavaHeapControl;
