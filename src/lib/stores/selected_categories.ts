import { writable } from "svelte/store";

export	const selectedCategories = writable<string[]>([]);
