import {UserAlerts} from "incomaker-react-ts-commons";
import {createContext} from "react";

export class OcrUserAlerts extends UserAlerts {

}

export const OcrUserAlertsContext= createContext(new OcrUserAlerts());
