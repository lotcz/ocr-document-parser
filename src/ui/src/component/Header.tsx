import React, {useContext, useMemo} from 'react';
import {Stack} from "react-bootstrap";
import {BsMoonFill, BsSunFill} from "react-icons/bs";
import {OcrUserSessionContext, OcrUserSessionUpdateContext} from "../util/OcrUserSession";
import {GenericSelectOption, IconSwitch, LocalizationContext, StringSelect} from "zavadil-react-common";
import {StringUtil} from "zavadil-ts-common";

function Header() {
	const session = useContext(OcrUserSessionContext);
	const sessionUpdate = useContext(OcrUserSessionUpdateContext);
	const localization = useContext(LocalizationContext);
	const isDark = session.theme === 'dark';

	const languages: Array<GenericSelectOption<string>> = useMemo(
		() => localization.getLanguages().map(
			(l) => {
				console.log('adding lang', l);
				return {id: l, label: localization.translate('--self-name', undefined, l)};
			}),
		[localization]
	);

	return (
		<header className={`p-3 bg-body-secondary`}>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h1>OKARINA</h1>
				<div className="d-flex gap-2 p-2 rounded bg-body text-body">
					<IconSwitch
						checked={!isDark}
						onChange={
							() => {
								session.theme = isDark ? "light" : "dark";
								if (sessionUpdate) sessionUpdate({...session});
							}
						}
						iconOn={<BsSunFill/>}
						iconOff={<BsMoonFill/>}
					/>
					<StringSelect
						value={session.language}
						options={languages}
						showEmptyOption={false}
						onChange={
							(l) => {
								session.language = StringUtil.getNonEmpty(l);
								if (sessionUpdate) sessionUpdate({...session});
							}
						}
					/>
				</div>
			</Stack>
		</header>
	);
}

export default Header;
