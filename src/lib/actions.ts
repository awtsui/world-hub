'use server';

import dbConnect from './mongodb/utils/mongoosedb';
import Order from './mongodb/models/Order';
import User from './mongodb/models/User';
import UserProfile from './mongodb/models/UserProfile';
import Host from './mongodb/models/Host';
import HostProfile from './mongodb/models/HostProfile';
import Venue from './mongodb/models/Venue';
import Event from './mongodb/models/Event';
import { EventApprovalStatus, HostApprovalStatus } from './types';
import { revalidatePath } from 'next/cache';
import Media from './mongodb/models/Media';

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
        ticketTiers: event.ticketTiers.map((tier: any) => ({
          label: tier.label,
          price: tier.price.toString(),
          quantity: tier.quantity,
          ticketsPurchased: tier.ticketsPurchased,
        })),
      };
    });
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
    });
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
    throw new Error(`Unable to fetch events by category: ${error}`);
  }
}

export async function getApprovedEventsBySubCategory(subCategoryName: string) {
  await dbConnect();
  try {
    const data = await Event.find({
      subCategory: subCategoryName,
      approvalStatus: EventApprovalStatus.Approved,
    });
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
    throw new Error(`Unable to fetch events by category: ${error}`);
  }
}

export async function getApprovedEvents() {
  await dbConnect();
  try {
    const data = await Event.find({
      approvalStatus: EventApprovalStatus.Approved,
    });
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
    throw new Error(`Unable to fetch events by category: ${error}`);
  }
}

export async function getAllEvents() {
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
    const data = await HostProfile.findOne({ hostId });
    const { _id, __v, ...rest } = data._doc;
    const formattedData = { ...rest };
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch host profile by id: ${error}`);
  }
}

export async function getVenueById(venueId: string) {
  await dbConnect();
  try {
    const data = await Venue.findOne({ venueId });
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
    const { _id, __v, ...rest } = data._doc;
    const formattedData = { ...rest };
    return formattedData;
  } catch (error) {
    throw new Error(`Unable to fetch media by id: ${error}`);
  }
}

export async function getAllOrders() {
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

export async function updateEventApprovalStatus(
  eventId: string,
  status: EventApprovalStatus
) {
  await dbConnect();
  try {
    const event = await Event.findOneAndUpdate(
      { eventId },
      { approvalStatus: status }
    );
    if (!event) {
      throw Error(`Event (${eventId}) does not exist`);
    }

    revalidatePath('/');
  } catch (error) {
    console.error(error);
    throw Error(`Unable to update event approval status: ${error}`);
  }
}

export async function updateHostAccountApprovalStatus(
  hostId: string,
  status: HostApprovalStatus
) {
  await dbConnect();
  try {
    const host = await Host.findOneAndUpdate(
      { hostId },
      { approvalStatus: status }
    );
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
    if (event.approvalStatus !== EventApprovalStatus.Rejected) {
      throw Error('Event must be rejected before deleted');
    }
    await Event.deleteOne({ eventId });
    revalidatePath('/');
  } catch (error) {
    throw Error(`Unable to delete rejected event: ${error}`);
  }
}

export async function deleteRejectedHost(hostId: string) {
  await dbConnect();
  try {
    const host = await Host.findOne({ hostId });
    if (host.approvalStatus !== HostApprovalStatus.Rejected) {
      throw Error('Host must be rejected before deleted');
    }
    await Host.deleteOne({ hostId });
    await HostProfile.deleteOne({ hostId });
    revalidatePath('/');
  } catch (error) {
    throw Error(`Unable to delete rejected host: ${error}`);
  }
}
