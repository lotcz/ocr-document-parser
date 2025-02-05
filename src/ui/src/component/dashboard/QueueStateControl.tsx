import React from 'react';
import {Badge} from "react-bootstrap";

export type QueueStateControlProps = {
	state: string;
}

const STATE_COLORS = new Map<string, string>([
	['Idle', 'secondary'],
	['Processing', 'success'],
	['Loading', 'warn'],
]);

function QueueStateControl({state}: QueueStateControlProps) {
	const color = STATE_COLORS.get(state) || 'primary';
	return <Badge className={`bg-${color} text-white`}>{state}</Badge>
}

export default QueueStateControl;
