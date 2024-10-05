import express from "express";
import httpProxy from "http-proxy";
import env from "dotenv";
import cors from "cors";
env.config();

const app = express();
const proxy = httpProxy.createProxyServer();
app.use(cors());

function rewrite(options) {
    return (req, res) => {
        console.log(`rewriting "${req.hostname}${req.url}" to "${options.target}"`);
        proxy.web(req, res, options)
    }
}

app.use('/api', rewrite({
    target: process.env.API_URL,
    ws: true
}));
app.use('/', rewrite({
    target: process.env.CLIENT_URL
}));

proxy.on("error", (err) => {
    console.log("\nproxy error:\n");
    console.log(err);
})

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});