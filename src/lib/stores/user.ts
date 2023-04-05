import { writable } from 'svelte/store';

export const user = writable({
    id: null as string | null,
    name: null as string | null,
    email: null as string | null,
    type: null as string | null,
});
