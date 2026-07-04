import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { RoomBooking } from '../../models/RoomBooking.js';
import { success } from '../../utils/apiResponse.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PG_IMAGES_DIR = path.join(__dirname, '../../../public/pgimages');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function sortImageFiles(files) {
  return files.sort((a, b) => {
    const numA = Number.parseInt(a, 10);
    const numB = Number.parseInt(b, 10);
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });
}

export async function listPgImages(req, res) {
  const files = await fs.readdir(PG_IMAGES_DIR).catch(() => []);
  const images = sortImageFiles(files.filter((file) => IMAGE_EXT.has(path.extname(file).toLowerCase())))
    .map((file) => ({ name: file, url: `/pgimages/${file}` }));

  return success(res, images);
}

export async function createRoomBooking(req, res) {
  const payload = {
    name: req.body.name,
    phone: req.body.phone,
    message: req.body.message,
    email: req.body.email || undefined,
    moveInDate: req.body.moveInDate ? new Date(req.body.moveInDate) : undefined
  };
  const booking = await RoomBooking.create(payload);
  return success(res, booking, 'Booking request received. We will call you shortly.', 201);
}
