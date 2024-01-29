import Event from '@/lib/mongodb/models/Event';
import HostProfile from '@/lib/mongodb/models/HostProfile';
import Venue from '@/lib/mongodb/models/Venue';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const location = searchParams.get('location');
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
      const venues = await Venue.find({});
      venueList.push(...venues);
    }

    if (startDate) {
      eventList = eventList.filter((event) => new Date(event.datetime) >= new Date(startDate));
    }
    if (endDate) {
      eventList = eventList.filter((event) => new Date(event.datetime) <= new Date(endDate));
    }

    // TODO: filter venues and events by location OR latitude and longitude
    // TODO: will need to add latitude and longitude as fields in Venue schema
    // const venueIdsOfEvents = eventList.map((event) => event.venueId);
    // const venuesOfEvents = await Venue.find({ venueId: { $in: venueIdsOfEvents } });

    // if (location) {
    // }

    eventList = eventList.map((event) => {
      return {
        ...event._doc,
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

    hostProfileList = hostProfileList.map((host) => {
      const { _id, __v, password, ...rest } = host._doc;
      return {
        ...rest,
      };
    });

    return NextResponse.json({ events: eventList, venues: venueList, hostProfiles: hostProfileList }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error (/api/search): ${error}` }, { status: 500 });
  }
}
