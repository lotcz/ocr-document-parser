import {useContext} from "react";
import {OcrRestClientContext} from "../../util/OcrRestClient";

export type StorageImageProps = {
	path?: string;
	size?: string;
};

export default function StorageImage({path, size}: StorageImageProps) {
	const restClient = useContext(OcrRestClientContext);
	if (!path) return <span>no image</span>
	return <img src={restClient.getImgUrl(path, size)} alt={path}/>
}
