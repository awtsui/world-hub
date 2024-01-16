'use server';

import dbConnect from './mongodb/utils/mongoosedb';
import Order from './mongodb/models/Order';
import User from './mongodb/models/User';
import UserProfile from './mongodb/models/UserProfile';
import Host from './mongodb/models/Host';
import HostProfile from './mongodb/models/HostProfile';
import Venue from './mongodb/models/Venue';
import Event from './mongodb/models/Event';

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
          return {
            label: tier.label,
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

export async function getEventsByCategory(categoryName: string) {
  await dbConnect();
  try {
    const data = await Event.find({
      category: categoryName,
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

export async function getEventsBySubCategory(subCategoryName: string) {
  await dbConnect();
  try {
    const data = await Event.find({
      subCategory: subCategoryName,
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
    throw new Error(`Unable to fetch host by id: ${error}`);
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
    throw new Error(`Unable to fetch host by id: ${error}`);
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
      const { _id, __v, ...rest } = host._doc;
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