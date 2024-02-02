'use server';

import dbConnect from './mongodb/utils/mongoosedb';
import Order from './mongodb/models/Order';
import User from './mongodb/models/User';
import UserProfile from './mongodb/models/UserProfile';
import Host from './mongodb/models/Host';
import HostProfile from './mongodb/models/HostProfile';
import Venue from './mongodb/models/Venue';
import Event from './mongodb/models/Event';
import { EventApprovalStatus, HostApprovalStatus, Tier } from './types';
import { revalidatePath } from 'next/cache';
import Media from './mongodb/models/Media';
import { getTransporter, mailOptions } from './nodemailer/utils/transporter';
import { z } from 'zod';
import { ContactFormSchema } from './zod/schema';
import { generateEmailContent, isExpiredSignedUrl } from './utils';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { deleteMedia } from './mongodb/utils/medias';
import { cookies } from 'next/headers';
import mongoose, { ClientSession } from 'mongoose';

const { AWS_CLOUDFRONT_URL, AWS_CLOUDFRONT_PRIVATE_KEY, AWS_CLOUDFRONT_KEY_PAIR_ID } = process.env;
if (!AWS_CLOUDFRONT_URL) throw new Error('AWS_CLOUDFRONT_URL not defined');
if (!AWS_CLOUDFRONT_PRIVATE_KEY) throw new Error('AWS_CLOUDFRONT_PRIVATE_KEY not defined');
if (!AWS_CLOUDFRONT_KEY_PAIR_ID) throw new Error('AWS_CLOUDFRONT_KEY_PAIR_ID not defined');

const AWS_CLOUDFRONT_PRIVATE_KEY_DECODED = Buffer.from(AWS_CLOUDFRONT_PRIVATE_KEY, 'base64').toString('utf8');

type ContactForm = z.infer<typeof ContactFormSchema>;

export async function getEventsByIds(eventIds: string[]) {
  await dbConnect();
  try {
    const data = await Event.find({
      eventId: {
        $in: eventIds,
      },
    });
    const formattedData = data.map((event: any) => {
      const { _id, __v, ...rest } = event._doc;
      return {
        ...rest,
        ticketTiers: event.ticketTiers.map((tier: any) => {
          const { _id, __v, ...tierRest } = tier._doc;
          return {
            ...tierRest,
            price: tier.price.toString(),
          };
        }),
      };
    });
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch event by id: ${error}`);
  }
}

export async function getApprovedEventsByIds(eventIds: string[]) {
  await dbConnect();
  try {
    const data = await Event.find({
      eventId: {
        $in: eventIds,
      },
      approvalStatus: EventApprovalStatus.Approved,
      datetime: { $gte: new Date() },
    });
    const formattedData = data.map((event: any) => {
      const { _id, __v, ...rest } = event._doc;
      return {
        ...rest,
        ticketTiers: event.ticketTiers.map((tier: any) => {
          const { _id, __v, ...tierRest } = tier._doc;
          return {
            ...tierRest,
            price: tier.price.toString(),
          };
        }),
      };
    });
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch event by id: ${error}`);
  }
}

export async function getEventById(eventId: string) {
  await dbConnect();
  try {
    const data = await Event.findOne({
      eventId,
    }).exec();
    if (!data) {
      throw Error('Event does not exist');
    }
    const { _id, __v, ...rest } = data._doc;
    const formattedData = {
      ...rest,
      ticketTiers: data.ticketTiers.map((tier: any) => {
        const { _id, __v, ...tierRest } = tier._doc;
        return {
          ...tierRest,
          price: tier.price.toString(),
        };
      }),
    };
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch event by id: ${error}`);
  }
}

export async function getApprovedEventsByCategory(categoryName: string) {
  await dbConnect();
  try {
    const data = await Event.find({
      category: categoryName,
      approvalStatus: EventApprovalStatus.Approved,
      datetime: { $gte: new Date() },
    });
    const formattedData = data.map((event: any) => {
      const { _id, __v, ...rest } = event._doc;
      return {
        ...rest,
        ticketTiers: event.ticketTiers.map((tier: any) => {
          const { _id, __v, ...tierRest } = tier._doc;
          return {
            ...tierRest,
            price: tier.price.toString(),
          };
        }),
      };
    });
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch events by category: ${error}`);
  }
}

export async function getApprovedEventsBySubCategory(subCategoryName: string) {
  await dbConnect();
  try {
    const data = await Event.find({
      subCategory: subCategoryName,
      approvalStatus: EventApprovalStatus.Approved,
      datetime: { $gte: new Date() },
    });
    const formattedData = data.map((event: any) => {
      const { _id, __v, ...rest } = event._doc;
      return {
        ...rest,
        ticketTiers: event.ticketTiers.map((tier: any) => {
          const { _id, __v, ...tierRest } = tier._doc;
          return {
            ...tierRest,
            price: tier.price.toString(),
          };
        }),
      };
    });
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch events by category: ${error}`);
  }
}

// export async function getApprovedEvents() {
//   await dbConnect();
//   try {
//     const data = await Event.find({
//       approvalStatus: EventApprovalStatus.Approved,
//       datetime: { $gte: new Date() },
//     });
//     const formattedData = data.map((event: any) => {
//       const { _id, __v, ...rest } = event._doc;
//       return {
//         ...rest,
//         ticketTiers: event.ticketTiers.map((tier: any) => {
//           const { _id, __v, ...tierRest } = tier._doc;
//           return {
//             ...tierRest,
//             price: tier.price.toString(),
//           };
//         }),
//       };
//     });
//     return formattedData;
//   } catch (error) {
//     throw new Error(`Unable to fetch events by category: ${error}`);
//   }
// }

export async function getAllEvents() {
  const _ = cookies();
  await dbConnect();
  try {
    const data = await Event.find({});
    const formattedData = data.map((event: any) => {
      const { _id, __v, ...rest } = event._doc;
      return {
        ...rest,
        ticketTiers: event.ticketTiers.map((tier: any) => {
          return {
            label: tier.label,
            price: tier.price.toString(),
          };
        }),
      };
    });
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch events: ${error}`);
  }
}

export async function getHostProfileById(hostId: string) {
  await dbConnect();
  try {
    const data = await HostProfile.findOne({ hostId }).exec();
    const { _id, __v, ...rest } = data._doc;
    const formattedData = { ...rest };
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch host profile by id: ${error}`);
  }
}

export async function getHostProfileByIds(hostIds: string[]) {
  await dbConnect();
  try {
    const data = await HostProfile.find({ hostId: { $in: hostIds } });
    const formattedData = data.map((profile) => {
      const { _id, __v, ...rest } = profile._doc;
      return { ...rest };
    });
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch host profile by ids: ${error}`);
  }
}

export async function getVenueById(venueId: string) {
  await dbConnect();
  try {
    const data = await Venue.findOne({ venueId }).exec();
    const { _id, __v, ...rest } = data._doc;
    const formattedData = { ...rest };
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch venue by id: ${error}`);
  }
}

export async function getMediaById(mediaId: string) {
  await dbConnect();
  try {
    const data = await Media.findById(mediaId);
    const { __v, ...rest } = data._doc;

    let formattedData;
    if ((data.url && isExpiredSignedUrl(data.url)) || !data.url) {
      const newUrl = getSignedUrl({
        url: `${AWS_CLOUDFRONT_URL}/${data.fileName}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        privateKey: AWS_CLOUDFRONT_PRIVATE_KEY_DECODED!,
        keyPairId: AWS_CLOUDFRONT_KEY_PAIR_ID!,
      });
      formattedData = {
        ...rest,
        url: newUrl,
      };
      await Media.updateOne({ _id: mediaId }, { url: newUrl });
    } else {
      formattedData = { ...rest };
    }

    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch media by id: ${error}`);
  }
}

export async function getAllOrders() {
  const _ = cookies();
  await dbConnect();
  try {
    const data = await Order.find({});

    const formattedData = data.map((order) => {
      const { __v, ...rest } = order._doc;
      return {
        ...rest,
        _id: order._id.toString(),
        totalPrice: order.totalPrice.toString(),
        ticketData: order.ticketData.map((data: any) => {
          return {
            ...data._doc,
            price: data.price.toString(),
          };
        }),
      };
    });

    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch orders: ${error}`);
  }
}

export async function getAllUsers() {
  const _ = cookies();
  await dbConnect();
  try {
    const data = await User.find({});
    const formattedData = data.map((user) => {
      const { _id, __v, ...rest } = user._doc;
      return {
        ...rest,
      };
    });
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch users: ${error}`);
  }
}

export async function getAllUserProfiles() {
  const _ = cookies();
  await dbConnect();
  try {
    const data = await UserProfile.find({});
    const formattedData = data.map((userprofile) => {
      const { _id, __v, ...rest } = userprofile._doc;
      return {
        ...rest,
      };
    });
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch user profiles: ${error}`);
  }
}

export async function getAllHosts() {
  const _ = cookies();
  await dbConnect();
  try {
    const data = await Host.find({});
    const formattedData = data.map((host) => {
      const { _id, __v, password, ...rest } = host._doc;
      return {
        ...rest,
      };
    });
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch hosts: ${error}`);
  }
}

export async function getAllHostProfiles() {
  const _ = cookies();

  await dbConnect();
  try {
    const data = await HostProfile.find({});
    const formattedData = data.map((hostprofile) => {
      const { _id, __v, ...rest } = hostprofile._doc;
      return {
        ...rest,
      };
    });
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch host profiles: ${error}`);
  }
}

export async function getAllVenues() {
  const _ = cookies();
  await dbConnect();
  try {
    const data = await Venue.find({});
    const formattedData = data.map((venue) => {
      const { _id, __v, ...rest } = venue._doc;
      return {
        ...rest,
      };
    });
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch venues: ${error}`);
  }
}

export async function updateEventApprovalStatus(eventId: string, status: EventApprovalStatus) {
  await dbConnect();
  try {
    const event = await Event.findOneAndUpdate({ eventId }, { approvalStatus: status });
    if (!event) {
      throw Error(`Event (${eventId}) does not exist`);
    }

    revalidatePath('/');
  } catch (error) {
    console.error(error);
    throw Error(`Unable to update event approval status: ${error}`);
  }
}

export async function updateHostAccountApprovalStatus(hostId: string, status: HostApprovalStatus) {
  await dbConnect();
  try {
    const host = await Host.findOneAndUpdate({ hostId }, { approvalStatus: status });
    if (!host) {
      throw Error('Host does not exist');
    }

    revalidatePath('/');
  } catch (error) {
    throw Error(`Unable to update host account approval status: ${error}`);
  }
}

export async function deleteRejectedEvent(eventId: string) {
  await dbConnect();
  try {
    const event = await Event.findOne({ eventId });
    if (!event) {
      throw Error('Event does not exist');
    }
    if (event.approvalStatus !== EventApprovalStatus.Rejected) {
      throw Error('Event must be rejected before deleted');
    }
    await Event.deleteOne({ eventId });
    await deleteMedia(event.mediaId);
    revalidatePath('/');
  } catch (error) {
    throw Error(`Unable to delete rejected event: ${error}`);
  }
}

export async function deleteRejectedHost(hostId: string) {
  await dbConnect();
  try {
    const host = await Host.findOne({ hostId });
    if (!host) {
      throw Error('Host does not exist');
    }
    if (host.approvalStatus !== HostApprovalStatus.Rejected) {
      throw Error('Host must be rejected before deleted');
    }
    await Host.deleteOne({ hostId });
    const hostProfile = await HostProfile.findOneAndDelete({ hostId });
    if (hostProfile.mediaId) {
      await deleteMedia(hostProfile.mediaId);
    }
    revalidatePath('/');
  } catch (error) {
    throw Error(`Unable to delete rejected host: ${error}`);
  }
}

export async function sendContactFormMail(data: ContactForm) {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      ...mailOptions,
      ...generateEmailContent(data),
      subject: data.subject,
    });
  } catch (error) {
    throw Error(`Unable to send contact form mail: ${error}`);
  }
}

export async function deleteEvent(eventId: string) {
  await dbConnect();
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const event = await Event.findOne({ eventId }, null, { session });
    if (!event) {
      throw Error('Event does not exist');
    }
    await Event.deleteOne({ eventId }, { session });
    await deleteMedia(event.mediaId, session);
    await HostProfile.updateOne({ hostId: event.hostId }, { $pull: { events: eventId } }, { session });

    revalidatePath('/');

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw Error(`Unable to delete rejected event: ${error}`);
  } finally {
    await session.endSession();
  }
}

export async function getTrendingEvents(limit: number) {
  await dbConnect();

  try {
    if (limit <= 0) {
      throw Error('limit argument mus tbe positive');
    }

    const events = await Event.find({
      approvalStatus: EventApprovalStatus.Approved,
      datetime: { $gte: new Date() },
      totalSold: { $gte: 1 },
    })
      .sort({ totalSold: 'desc' })
      .limit(limit)
      .exec();
    return events;
  } catch (error) {
    throw Error(`Unable to retrieve trending event: ${error}`);
  }
}

export async function getTrendingEventsByCategory(category: string, limit: number) {
  await dbConnect();

  try {
    if (limit <= 0) {
      throw Error('limit argument must be positive');
    }
    const events = await Event.find({
      category,
      approvalStatus: EventApprovalStatus.Approved,
      datetime: { $gte: new Date() },
    })
      .sort({ totalSold: 'desc' })
      .limit(limit)
      .exec();
    return events;
  } catch (error) {
    throw Error(`Unable to retrieve trending event by category: ${error}`);
  }
}

export async function getTrendingEventsBySubcategory(subCategory: string, limit: number) {
  await dbConnect();

  try {
    if (limit <= 0) {
      throw Error('limit argument must be positive');
    }
    const events = await Event.find({
      subCategory,
      approvalStatus: EventApprovalStatus.Approved,
      datetime: { $gte: new Date() },
    })
      .sort({ totalSold: 'desc' })
      .limit(limit)
      .exec();
    return events;
  } catch (error) {
    throw Error(`Unable to retrieve trending event by subcategory: ${error}`);
  }
}

export async function getApprovedEventsByVenueId(venueId: String) {
  await dbConnect();

  try {
    const data = await Event.find({
      venueId,
      approvalStatus: EventApprovalStatus.Approved,
      datetime: { $gte: new Date() },
    });
    const formattedData = data.map((event: any) => {
      const { _id, __v, ...rest } = event._doc;
      return {
        ...rest,
        ticketTiers: event.ticketTiers.map((tier: any) => {
          const { _id, __v, ...tierRest } = tier._doc;
          return {
            ...tierRest,
            price: tier.price.toString(),
          };
        }),
      };
    });
    return formattedData;
  } catch (error) {
    throw Error(`Unable to retrieve trending event by subcategory: ${error}`);
  }
}
