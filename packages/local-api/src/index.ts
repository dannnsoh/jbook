import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { createCellsRouter } from "./routes/cells";

// serve function to be used in the CLI
export const serve = (port: number, filename: string, dir: string, useProxy: boolean) => {
	const app = express();

	// for fetching and saving files
	app.use(createCellsRouter(filename, dir));

	if (useProxy) {
		app.use(
			createProxyMiddleware({
				target: "http://localhost:3000",
				ws: true,
				logLevel: "silent"
			})
		);
	} else {
		const packagePath = require.resolve("@jsnote-dan/local-client/build/index.html");
		app.use(express.static(path.dirname(packagePath)));
	}

	return new Promise<void>((resolve, reject) => {
		app.listen(port, resolve).on("error", reject);
	});
};
