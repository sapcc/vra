/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { HttpStatusCode } from "./enums/HttpStatusCode";

const SPACE = 4;
export const stringify = (object: Object) => JSON.stringify(object, null, SPACE);

const STATUS_KEY = "status";
const isSuccessfulResponse = (response: any): boolean =>
    !(response[STATUS_KEY] < HttpStatusCode.OK || response[STATUS_KEY] >= HttpStatusCode.MULTIPLE_CHOICES);

export const validateResponse = (response: any): void => {
    if (!isSuccessfulResponse(response)) {
        const errorMessage = `HTTP Error: ${stringify(response)}`;

        throw new Error(errorMessage);
    }
};
