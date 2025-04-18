import React from 'react';
import {Route, Routes} from 'react-router';
import Dashboard from "./dashboard/Dashboard";
import MainMenu from "./MainMenu";
import {Stack} from "react-bootstrap";
import DocumentTemplateEditor from "./templates/DocumentTemplateEditor";
import DocumentTemplatesList from "./templates/DocumentTemplatesList";
import DocumentEditor from "./documents/DocumentEditor";
import FolderEdit from './folders/FolderEdit';
import FolderBrowserTab from "./folders/FolderBrowserTab";

function Main() {
	return (
		<main>

			<Stack direction="horizontal" className="align-items-stretch">
				<MainMenu/>
				<div className="flex-grow-1">
					<Routes>
						<Route path="/" element={<Dashboard/>}/>
						<Route path="templates">
							<Route path="" element={<DocumentTemplatesList/>}/>
							<Route path="detail">
								<Route path="add" element={<DocumentTemplateEditor/>}/>
								<Route path=":id" element={<DocumentTemplateEditor/>}/>
							</Route>
							<Route path=":pagingString" element={<DocumentTemplatesList/>}/>
						</Route>
						<Route path="documents">
							<Route path="" element={<FolderBrowserTab/>}/>
							<Route path="detail">
								<Route path="add/:folderId" element={<DocumentEditor/>}/>
								<Route path=":id" element={<DocumentEditor/>}/>
							</Route>
							<Route path="folders">
								<Route path="" element={<FolderBrowserTab/>}/>
								<Route path="detail">
									<Route path="add" element={<FolderEdit/>}/>
									<Route path="add/:parentId" element={<FolderEdit/>}/>
									<Route path=":id/edit" element={<FolderEdit/>}/>
									<Route path=":id" element={<FolderBrowserTab/>}/>
								</Route>
							</Route>
						</Route>
						<Route path="*" element={<span>404</span>}/>
					</Routes>
				</div>
			</Stack>
		</main>
	);
}

export default Main;
