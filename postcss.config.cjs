const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const config = {
	plugins: [
		// first load Tailwind CSS
		// then run autoprefixer
		tailwindcss(), //Some plugins, like tailwindcss/nesting, need to run before Tailwind, tailwindcss(), //But others, like autoprefixer, need to run after, autoprefixer(), !dev && // optimize the code for production
		cssnano({
			preset: 'default'
		}),
		autoprefixer
	]
};

module.exports = config;
