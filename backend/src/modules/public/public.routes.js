import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { createRoomBooking, listPgImages } from './public.controller.js';
import { bookRoomSchema } from './public.validation.js';

const router = Router();

router.get('/pg-images', listPgImages);
router.post('/book-room', validate(bookRoomSchema), createRoomBooking);

export default router;
