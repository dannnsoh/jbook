import express, { response } from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
	id: string;
	content: string;
	type: "code" | "text";
}

export const createCellsRouter = (filename: string, dir: string) => {
	const router = express.Router();

	router.use(express.json());
	const fullPath = path.join(dir, filename);

	router.get("/cells", async (req, res) => {
		try {
			// Read the file
			const result = await fs.readFile(fullPath, { encoding: "utf-8" });
			// Parse a list of cells out of it
			// Send list of cells back to browser
			res.send(JSON.parse(result));
		} catch (err) {
			// If read throws an error, inspect the error and see if it says that the file doesn't exist
			if (err instanceof Error && err.message.includes("ENOENT")) {
				// Create file and add default cells
				await fs.writeFile(fullPath, "[]", "utf-8");
				res.send([]);
			} else {
				throw err;
			}
		}
	});

	router.post("/cells", async (req, res) => {
		// Take list of cells from the request object
		// Serialize them
		const { cells }: { cells: Cell[] } = req.body;

		// Write the cells into the file
		await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

		res.send({ status: "OK 👍" });
	});

	return router;
};
