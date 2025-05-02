import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';

// ROUTE IMPORTS
import projectRoutes from './routes/ProjectRoutes';
import taskRoutes from './routes/TaskRoutes';
import searchRoutes from './routes/SearchRoutes';
import userRoutes from './routes/UserRoutes';
import teamRoutes from './routes/TeamRoutes';

// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ROUTES
app.get("/", (req, res) => { 
    res.send("This is home route");
});

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);

// SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});