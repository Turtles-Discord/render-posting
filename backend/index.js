import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import tiktokRoutes from './routes/tiktok.route.js';
import tiktokRouter from './routes/tiktok.route.js';
import { TIKTOK_TOKENS } from './config/tokens.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ 
	origin: process.env.NODE_ENV === "production" 
		? "https://render-posting.onrender.com"
		: "http://localhost:5173",
	credentials: true 
}));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use('/api/tiktok', tiktokRoutes);
app.use('/api/auth/tiktok', tiktokRouter);

// Initialize TikTok service with tokens
tiktokService.initializeWithTokens(
	TIKTOK_TOKENS.ACCESS_TOKEN,
	TIKTOK_TOKENS.REFRESH_TOKEN
);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});
