import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {BasicComponentProps} from "../types/ComponentProps";
import DocumentTemplates from "./documentTemplate/DocumentTemplates";
import Dashboard from "./dashboard/Dashboard";
import MainMenu from "./menu/MainMenu";
import {Stack} from "react-bootstrap";

export type MainProps = BasicComponentProps & {

};

function Main() {

	return (
		<main>
			<BrowserRouter>
				<Stack direction="horizontal" className="align-items-start">
					<MainMenu/>
					<div className="ps-3">
						<Routes>
							<Route path="/" element={<Dashboard />} />
							<Route path="/templates" element={<DocumentTemplates />} />
							<Route path="/documents" element={<span>docs</span>} />
							<Route path="*" element={<span>404</span>} />
						</Routes>
					</div>
				</Stack>
			</BrowserRouter>
		</main>
	);
}

export default Main;
