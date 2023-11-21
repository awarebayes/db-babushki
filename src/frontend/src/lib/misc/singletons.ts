import { writable } from 'svelte/store';
import type { User } from '../../../../node_service/entities/generated_models';
import { localStorageWritable } from '@babichjacob/svelte-localstorage';

import type { FrontEndMealClaim } from './types';

export const cart = localStorageWritable<Array<FrontEndMealClaim>>('cart', []);
export const loggedInUser = writable<null | User>(null);
export const jwtLoaded = writable<boolean>(false);
// export const fileServerUrl = 'http://127.0.0.1:8090';
export const fileServerUrl = '';

export default { cart };
