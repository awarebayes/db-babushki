import {writable} from "svelte/store";
import type {User} from "@prisma/client";
import type { MealClaim } from "../../../../node_service/entities/models";
import type { FrontEndMealClaim } from "./types";

export const cart = writable<Array<FrontEndMealClaim>>([]);
export const loggedInUser = writable<null | User>(null);
export const jwtLoaded = writable(false);
export const fileServerUrl = "http://127.0.0.1:8090"
export default {cart, jwtLoaded};