import React from 'react';
import {BasicComponentProps} from "../types/ComponentProps";
import DocumentTemplates from "./documentTemplate/DocumentTemplates";

export type MainProps = BasicComponentProps & {

};

function Main({eventManager}: MainProps) {

	return (
		<main>
			<DocumentTemplates eventManager={eventManager} />
		</main>
	);
}

export default Main;
