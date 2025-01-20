import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router';
import {BasicComponentProps} from "../types/ComponentProps";
import Dashboard from "./dashboard/Dashboard";
import MainMenu from "./menu/MainMenu";
import {Stack} from "react-bootstrap";
import DocumentTemplateEditor from "./documentTemplate/DocumentTemplateEditor";
import DocumentTemplatesList from "./documentTemplate/DocumentTemplatesList";

export type MainProps = BasicComponentProps & {};

function Main() {

	return (
		<main>
			<BrowserRouter>
				<Stack direction="horizontal" className="align-items-stretch">
					<MainMenu/>
					<div className="p-3">
						<Routes>
							<Route path="/" element={<Dashboard/>}/>
							<Route path="templates">
								<Route path="" element={<DocumentTemplatesList/>}/>
								<Route path="detail">
									<Route path="" element={<DocumentTemplateEditor/>}/>
									<Route path=":id" element={<DocumentTemplateEditor/>}/>
								</Route>
								<Route path=":pagingString" element={<DocumentTemplatesList/>}/>
							</Route>
							<Route path="documents" element={<span>docs</span>}/>
							<Route path="*" element={<span>404</span>}/>
						</Routes>
					</div>
				</Stack>
			</BrowserRouter>
		</main>
	);
}

export default Main;
