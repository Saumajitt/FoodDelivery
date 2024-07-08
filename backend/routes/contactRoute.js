import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';

const contactRouter = express.Router();

contactRouter.post('/submit', submitContactForm);

export default contactRouter;
