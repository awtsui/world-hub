import { config } from '@/lib/config';
import Event from '@/lib/mongodb/models/Event';
import HostProfile from '@/lib/mongodb/models/HostProfile';
import Venue from '@/lib/mongodb/models/Venue';
import { calculateDistance } from '@/lib/server/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    let eventList = [];
    let venueList = [];
    let hostProfileList = [];

    if (keyword) {
      const events = await Event.find({
        title: { $regex: keyword, $options: 'i' },
        datetime: { $gte: new Date() },
      });
      eventList.push(...events);
      const venues = await Venue.find({ name: { $regex: keyword, $options: 'i' } });
      venueList.push(...venues);
      const hostProfiles = await HostProfile.find({ name: { $regex: '^' + keyword, $options: 'i' } });
      hostProfileList.push(...hostProfiles);
    } else {
      const events = await Event.find({ datetime: { $gte: new Date() } });
      eventList.push(...events);
    }

    if (startDate) {
      eventList = eventList.filter((event) => new Date(event.datetime) >= new Date(startDate));
    }
    if (endDate) {
      eventList = eventList.filter((event) => new Date(event.datetime) <= new Date(endDate));
    }

    // Filter venues and events by location OR latitude and longitude

    if (lat && lng) {
      const venueIdsOfEvents = eventList.map((event) => event.venueId);
      let eventVenues = await Venue.find({ venueId: { $in: venueIdsOfEvents } });
      const searchLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      };
      eventVenues = eventVenues.filter(
        (venue) => calculateDistance(searchLocation, venue.location) <= config.NEAR_DISTANCE_IN_MILES,
      );

      const validVenueIds = new Set<string>(eventVenues.map((venue) => venue.venueId));

      eventList = eventList.filter((event) => validVenueIds.has(event.venueId));

      venueList = venueList.filter(
        (venue) => calculateDistance(searchLocation, venue.location) <= config.NEAR_DISTANCE_IN_MILES,
      );
    }

    eventList = eventList.map((event) => {
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

    venueList = venueList.map((venue) => {
      const { _id, __v, ...rest } = venue._doc;
      return {
        ...rest,
      };
    });

    hostProfileList = hostProfileList.map((profile) => {
      const { _id, __v, ...rest } = profile._doc;
      return {
        ...rest,
      };
    });

    return NextResponse.json({ events: eventList, venues: venueList, hostProfiles: hostProfileList }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error (/api/search): ${error}` }, { status: 500 });
  }
}
