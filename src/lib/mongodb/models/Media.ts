import { IMedia } from '@/lib/types';
import { Schema, model, models } from 'mongoose';

const MediaSchema = new Schema<IMedia>(
  {
    description: String,
    type: String,
    fileName: String,
    url: String,
  },
  { collection: 'medias' },
);

const Media = models.Media || model('Media', MediaSchema);

export default Media;
