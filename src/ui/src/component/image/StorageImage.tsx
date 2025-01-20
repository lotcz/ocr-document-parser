import {useContext} from "react";
import {OcrRestClientContext} from "../../util/OcrRestClient";

export type StorageImageProps = {
	path: string;
	size?: string;
};

export default function StorageImage({path, size}: StorageImageProps) {
	const restClient= useContext(OcrRestClientContext);
	return <img src={restClient.getImgUrl(path, size)} alt={path}/>
}
