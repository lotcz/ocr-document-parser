import {useContext, useEffect, useState} from "react";
import {Spinner} from "react-bootstrap";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";
import {OkarinaRestClientContext} from "../../client/OkarinaAppRestClient";

export type StorageImageProps = {
	path?: string | null;
	size?: string;
	onMouseOver?: () => any;
	onMouseOut?: () => any;
};

export default function StorageImage({path, size, onMouseOut, onMouseOver}: StorageImageProps) {
	const [url, setUrl] = useState<string | null>();
	const restClient = useContext(OkarinaRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);

	useEffect(() => {
		if (!path) return;
		restClient
			.loadImage(path, size).then(setUrl)
			.catch(
				(e) => {
					userAlerts.err(e);
					setUrl(null);
				}
			);
	}, [path, size]);

	if (!path) return <span>no image</span>;

	if (url === null) return <span>image lost</span>;

	if (url === undefined) return <Spinner size="sm"/>;

	return <img src={url} alt={path} onMouseOver={onMouseOver} onMouseOut={onMouseOut}/>
}
