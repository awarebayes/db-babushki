import {writable} from "svelte/store";
import type { User } from "../../../../node_service/entities/generated_models";
import type { FrontEndMealClaim } from "./types";

export const cart = writable<Array<FrontEndMealClaim>>([]);
export const loggedInUser = writable<null | User>(null);
export const jwtLoaded = writable(false);
export const fileServerUrl = "http://127.0.0.1:8090"
export default {cart, jwtLoaded};