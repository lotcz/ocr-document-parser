import {BasicComponentProps} from "../../types/ComponentProps";
import {Badge} from "react-bootstrap";

export type DocumentStateControlProps = BasicComponentProps & {
	state: string;
};

const STATE_COLORS = new Map<string, string>([
	['Waiting', 'secondary'],
	['Processed', 'success'],
	['NoTemplate', 'danger'],
	['NoImage', 'danger'],
	['Error', 'danger']
]);

function DocumentStateControl({state}: DocumentStateControlProps) {
	const color = STATE_COLORS.get(state) || 'primary';
	return <Badge className={`bg-${color} text-white`}>{state}</Badge>
}

export default DocumentStateControl;
