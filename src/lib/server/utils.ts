import Admin from '../mongodb/models/Admin';
import Event from '../mongodb/models/Event';
import Host from '../mongodb/models/Host';
import dbConnect from '../mongodb/utils/mongoosedb';

let hostId = -1;
let eventId = -1;
let adminId = -1;

async function getLargestHostId() {
  dbConnect();
  const host = await Host.findOne({}).sort({ hostId: -1 }).exec();
  return host ? host.hostId : 0;
}

async function getLargestEventId() {
  dbConnect();
  const event = await Event.findOne({}).sort({ eventId: -1 }).exec();
  return event ? event.eventId : 0;
}

async function getLargestAdminId() {
  dbConnect();
  const admin = await Admin.findOne({}).sort({ adminId: -1 }).exec();
  return admin ? admin.adminId : 0;
}

export async function getUniqueHostId() {
  if (hostId === -1) {
    hostId = await getLargestHostId();
  }
  hostId++;
  return hostId + '';
}

export async function getUniqueEventId() {
  if (eventId === -1) {
    eventId = await getLargestEventId();
  }
  eventId++;
  return eventId + '';
}

export async function getUniqueAdminId() {
  if (adminId === -1) {
    adminId = await getLargestAdminId();
  }
  adminId++;
  return adminId + '';
}
