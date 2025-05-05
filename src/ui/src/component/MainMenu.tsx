import React, {useCallback, useContext} from 'react';
import {NavLink, useNavigate} from "react-router";
import {OcrRestClientContext} from '../client/OcrRestClient';
import {OcrUserAlertsContext} from '../util/OcrUserAlerts';
import {Localize} from "zavadil-react-common";

function MainMenu() {
	const navigate = useNavigate();
	const restClient = useContext(OcrRestClientContext);
	const userAlerts = useContext(OcrUserAlertsContext);

	const logOut = useCallback(
		() => {
			restClient
				.logout()
				.then(
					() => {
						userAlerts.info("Logged out");
						navigate("/");
					}
				);
		},
		[navigate, restClient, userAlerts]
	);

	return (
		<div className="pt-2 pb-5 px-5">
			<h3 className="mt-2">Manage</h3>
			<div className="ps-3">
				<div>
					<NavLink to="/templates"><Localize text="Templates"/></NavLink>
				</div>
				<div>
					<NavLink to="/documents"><Localize text="Documents"/></NavLink>
				</div>

			</div>
			<h3 className="mt-2"><Localize text="System"/></h3>
			<div className="ps-3">
				<div className="text-nowrap">
					<NavLink to="/"><Localize text="System State"/></NavLink>
				</div>
				<div>
					<a
						href="/"
						onClick={
							(e) => {
								e.stopPropagation();
								e.preventDefault();
								logOut();
							}
						}
					><Localize text="Log out"/></a>
				</div>
			</div>
		</div>
	);
}

export default MainMenu;
