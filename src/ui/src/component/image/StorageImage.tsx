export type StorageImageProps = {
	path: string;
};

export default function StorageImage({path}: StorageImageProps) {
	return <img src={`/images/${path}`} alt={path}/>
}
