import {UserAlerts} from "zavadil-ts-common";
import {createContext} from "react";

export class OcrUserAlerts extends UserAlerts {

}

export const OcrUserAlertsContext= createContext(new OcrUserAlerts());
