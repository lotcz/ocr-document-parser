import React, {useCallback, useContext, useEffect, useState} from 'react';
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {ClientStats} from "../../types/OkarinaStats";
import {Card, Placeholder} from "react-bootstrap";
import {CacheStatsControl} from "zavadil-react-common";

function OkarinaStatsControl() {
	const restClient = useContext(OcrRestClientContext);
	const [stats, setStats] = useState<ClientStats>();

	const loadStats = useCallback(
		() => {
			setStats(restClient.getClientStats());
		},
		[restClient]
	);

	useEffect(() => {
		loadStats();
		const h = setInterval(loadStats, 2000);
		return () => clearInterval(h);
	}, []);

	return (
		<Card>
			<Card.Header>
				<Card.Title>Client Stats</Card.Title>
			</Card.Header>
			<Card.Body>
				{
					stats ? <CacheStatsControl name="Templates Cache" stats={stats.documentTemplatesCache}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
				{
					stats ? <CacheStatsControl name="Folder Chain Cache" stats={stats.folderChainCache}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
			</Card.Body>
		</Card>
	);
}

export default OkarinaStatsControl;
