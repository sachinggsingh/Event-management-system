import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    "/auth",
    createProxyMiddleware({
        target: "http://localhost:8001",
        changeOrigin: true,
    })
);

app.use(
    "/event",
    createProxyMiddleware({
        target: "http://localhost:8002",
        changeOrigin: true,
    })
);

app.use(
    "/profile",
    createProxyMiddleware({
        target: "http://localhost:8003",
        changeOrigin: true,
    })
);

app.use(
    "/remainder",
    createProxyMiddleware({
        target: "http://localhost:8004",
        changeOrigin: true,
    })
);



const port = process.env.PORT || 8000;

app.listen(port, () =>
    console.log(`Server is running on http://localhost:8000`)
);