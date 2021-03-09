/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
const SPACE = 4;
export const stringify = (object: Object) => JSON.stringify(object, null, SPACE);
