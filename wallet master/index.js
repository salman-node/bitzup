import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import route from "./routes/api-routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
    origin: "*",
    methods: "GET,POST,DELETE,PUT",
    optionsSuccessStatus: 200,
};

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(helmet());

//Routes
app.use("/api", route);

app.listen(PORT,"0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});