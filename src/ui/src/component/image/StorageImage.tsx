import {useContext} from "react";
import {OcrRestClientContext} from "../../util/OcrRestClient";

export type StorageImageProps = {
	path: string;
};

export default function StorageImage({path}: StorageImageProps) {
	const restClient = useContext(OcrRestClientContext);
	return <img src={restClient.getImgUrl(path)} alt={path}/>
}
