import {EventManager, UserAlert} from "incomaker-react-ts-commons";

export class OcrEventManager extends EventManager {

	userAlert(alert: UserAlert) {
		this.triggerEvent('user-alert', alert);
	}

	customUserAlert(type: string, title: string, message: string) {
		this.userAlert({
			time: new Date(),
			type: type,
			title: title,
			message: message
		});
	}

	err(message: string) {
		this.customUserAlert('danger', 'Error', message);
	}

	warn(message: string) {
		this.customUserAlert('warning', 'Warning', message);
	}

	info(message: string) {
		this.customUserAlert('info', 'Warning', message);
	}
}
