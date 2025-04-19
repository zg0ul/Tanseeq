import { Router } from 'express';
import { createProject, getProjects } from '../controllers/ProjectController';

const router = Router();

// In the index we define the project route to be /projects, so when we put '/' here, it will be /projects/ instead of doing to something like '/projects/something'
router.get('/', getProjects);
router.post('/', createProject); 

export default router;