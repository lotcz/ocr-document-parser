import {IconButton} from "zavadil-react-common";
import {BsRepeat} from "react-icons/bs";

export type BackIconButtonProps = {
	onClick: () => any;
};

function BackIconButton({onClick}: BackIconButtonProps) {
	return <IconButton onClick={onClick} icon={<BsRepeat size={24}/>}/>
}

export default BackIconButton;
