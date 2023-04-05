import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load(event) {
    console.log(event);
    // We want to render the same content as login page
    return {
        status: 200,
        headers: {
            'Content-Type': 'text/html'
        },
        body: ''
    };
}