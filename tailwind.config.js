/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				dg: "#009ba3",
				ole: "#00dde7",
				ear: "#a68061",
				nose: "#404b55",
			}
		},
	},
	safelist: [
		{
			pattern: /z-/,
		},
	],
	plugins: [],
};
