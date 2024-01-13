import { IMedia } from '@/lib/types';
import { Schema, model, models } from 'mongoose';

const MediaSchema = new Schema<IMedia>(
  {
    userId: String,
    eventId: String,
    type: String,
    url: String,
  },
  { collection: 'medias' }
);

const Media = models.Media || model('Media', MediaSchema);

export default Media;
