import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	server: {
		port: 3000,
		open: true,
	},

	build: {
		outDir: "dist",
		sourcemap: true,
		chunkSizeWarningLimit: 150,

		rollupOptions: {
			output: {
				// Split every dependency into its own chunk
				manualChunks(id) {
					if (id.includes("node_modules")) {
						const parts = id.split("node_modules/")[1].split("/");

						// Handle scoped packages like @firebase/app or @firebase/firestore.
						if (parts[0].startsWith("@")) {
							return `${parts[0]}/${parts[1]}`;
						}

						return parts[0];
					}
				},
			},
		},
	},

	plugins: [react()],
});
