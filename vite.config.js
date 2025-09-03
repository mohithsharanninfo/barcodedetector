import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";


const manifestForPlugin = {
	registerType: "autoUpdate",
	devOptions: {
		enabled: true
	},
	workbox: {
		cleanupOutdatedCaches: true
	},
	includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
	manifest: {
		name: "Billing System",
		short_name: "Bill Sys",
		description: "An app that can detect barcode and list scanned items.",
		theme_color: "#171717",
		background_color: "#e8ebf2",
		display: "standalone",
		scope: "/",
		start_url: "/",
		icons: [
			{
				src: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
			{
				src: "/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
				purpose: "apple touch icon",
			},
			{
				src: "/maskable_icon.png",
				sizes: "225x225",
				type: "image/png",
				purpose: "any maskable",
			},
		],
	},
};

// https://vite.dev/config/
export default defineConfig({
	base: "./",
	plugins: [react(), tailwindcss(), VitePWA(manifestForPlugin)],
	server: {
		host: true,
		port: 5173,
	},
})
