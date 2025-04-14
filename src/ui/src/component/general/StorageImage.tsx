import {useContext, useEffect, useState} from "react";
import {OcrRestClientContext} from "../../client/OcrRestClient";
import {Spinner} from "react-bootstrap";
import {OcrUserAlertsContext} from "../../util/OcrUserAlerts";

export type StorageImageProps = {
	path?: string | null;
	size?: string;
	onMouseOver?: () => any;
	onMouseOut?: () => any;
};

export default function StorageImage({path, size, onMouseOut, onMouseOver}: StorageImageProps) {
	const [url, setUrl] = useState<string>();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);

	useEffect(() => {
		if (!path) return;
		restClient
			.loadImage(path, size).then(setUrl)
			.catch((e) => userAlerts.err(e));
	}, [path, size]);

	if (!path) return <span>no image</span>;

	if (url === undefined) return <Spinner size="sm"/>;

	return <img src={url} alt={path} onMouseOver={onMouseOver} onMouseOut={onMouseOut}/>
}
