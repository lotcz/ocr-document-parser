import {LookupTableEntity} from "zavadil-ts-common";

export type Language = LookupTableEntity & {
	tesseractCode?: string | null;
	description?: string | null;
}
