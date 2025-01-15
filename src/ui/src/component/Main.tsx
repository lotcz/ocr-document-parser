import React from 'react';
import {BasicComponentProps} from "../types/ComponentProps";
import DocumentTemplates from "./documentTemplate/DocumentTemplates";

export type MainProps = BasicComponentProps & {

};

function Main({}: MainProps) {

	return (
		<main>
			<DocumentTemplates />
		</main>
	);
}

export default Main;
