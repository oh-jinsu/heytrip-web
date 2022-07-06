import { writable } from 'svelte/store';

export const selectedRegions = writable<string[]>([]);
