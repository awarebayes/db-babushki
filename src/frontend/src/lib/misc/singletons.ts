import {writable} from "svelte/store";
export const cart = writable([]);
export const jwtLoaded = writable(false);
export default {cart, jwtLoaded};