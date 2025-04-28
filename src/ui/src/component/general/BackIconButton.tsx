import {IconButton} from "zavadil-react-common";
import {BsArrow90DegUp} from "react-icons/bs";

export type BackIconButtonProps = {
	onClick: () => any;
};

function BackIconButton({onClick}: BackIconButtonProps) {
	return <IconButton onClick={onClick} icon={<BsArrow90DegUp size={24}/>}/>
}

export default BackIconButton;
