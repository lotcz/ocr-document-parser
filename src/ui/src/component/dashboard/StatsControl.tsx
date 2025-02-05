import React, {useCallback, useContext, useEffect, useState} from 'react';
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {OcrRestClientContext} from "../../util/OcrRestClient";
import {OkarinaStats} from "../../types/entity/OkarinaStats";
import CacheStatsControl from "./CacheStatsControl";
import {Card, Placeholder} from "react-bootstrap";
import QueueStatsControl from "./QueueStatsControl";
import JavaHeapControl from "./JavaHeapControl";

function StatsControl() {
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);
	const [stats, setStats] = useState<OkarinaStats>();

	const loadStats = useCallback(
		() => {
			restClient.stats()
				.then(setStats)
				.catch((e: Error) => userAlerts.err(`${e.cause}: ${e.message}`))
		},
		[restClient, userAlerts]
	);

	useEffect(() => {
		loadStats();
		const h = setInterval(loadStats, 2000);
		return () => clearInterval(h);
	}, []);

	return (
		<Card>
			<Card.Header>
				<Card.Title>Stats</Card.Title>
			</Card.Header>
			<Card.Body>
				{
					stats ? <JavaHeapControl stats={stats.javaHeap}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
				{
					stats ? <CacheStatsControl name="Templates Cache" stats={stats.templateCache}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
				{
					stats ? <CacheStatsControl name="Folder Chain Cache" stats={stats.folderChain}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
				{
					stats ? <QueueStatsControl name="Document Processing" stats={stats.documentQueue}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
			</Card.Body>
		</Card>
	);
}

export default StatsControl;
