/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			transitionProperty: {
				width: 'width'
			}
		}
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'class'
};
