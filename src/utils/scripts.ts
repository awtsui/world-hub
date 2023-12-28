const events = [
  {
    eventId: '1',
    title: 'Insomniac Presents: Cash Cash',
    subTitle: '',
    hostId: '1',
    category: 'Concerts',
    subCategory: 'EDM',
    thumbnailUrl: 'https://i.ticketweb.com//i/00/12/60/46/48_Edp.jpg?v=11',
    datetime: new Date(),
    currency: 'USD',
    description: '',
    venueId: '1',
    lineup: ['Cash Cash'],
    ticketLimit: 1,
    ticketTiers: [
      {
        label: 'GA',
        price: 25.0,
      },
      {
        label: 'VIP',
        price: 60.0,
      },
    ],
  },
  {
    eventId: '2',
    title: 'Sacramento Kings vs. Utah Jazz',
    subTitle: '',
    hostId: '2',
    category: 'Sports',
    subCategory: 'Basketball',
    thumbnailUrl:
      'https://s1.ticketm.net/dam/a/022/6fdae8b5-6fa8-4793-8829-edef2a77a022_1339671_EVENT_DETAIL_PAGE_16_9.jpg',
    datetime: new Date(),
    currency: 'USD',
    description: '',
    venueId: '2',
    lineup: ['Sacramento Kings', 'Utah Jazz'],
    ticketLimit: 1,
    ticketTiers: [
      {
        label: 'Sec 100, Row A',
        price: 20.0,
      },
      {
        label: 'Sec 200, Row b',
        price: 30.0,
      },
      {
        label: 'Sec 300, Row C',
        price: 40.0,
      },
      {
        label: 'Sec 400, Row D',
        price: 50.0,
      },
    ],
  },
  {
    eventId: '3',
    title: 'August Hall Presents: Rock & Roll Playhouse',
    subTitle: '',
    hostId: '3',
    category: 'Arts & Theatre',
    subCategory: "Children's Theatre",
    thumbnailUrl: 'https://i.ticketweb.com//i/00/12/08/15/53_Edp.jpg?v=9',
    datetime: new Date(),
    currency: 'USD',
    description: '',
    venueId: '3',
    lineup: ['Rock & Roll Playhouse'],
    ticketLimit: 1,
    ticketTiers: [
      {
        label: 'GA',
        price: 28.0,
      },
    ],
  },
];

const hosts = [
  {
    hostId: '1',
    name: 'Insomniac',
    biography: 'A concert event planner',
    events: ['1'],
  },
  {
    hostId: '2',
    name: 'Sacramento Kings',
    biography: 'A basketball team',
    events: ['2'],
  },
  {
    hostId: '3',
    name: 'August Hall',
    biography: 'A theatre hall',
    events: ['3'],
  },
];

const venues = [
  {
    venueId: '1',
    name: 'Exchange LA',
    address: '618 S. Spring Street',
    city: 'Los Angeles',
    state: 'CA',
    zipcode: '90014',
    parking: ['Next to venue'],
  },
  {
    venueId: '2',
    name: 'Golden 1 Center',
    address: '500 David J Stern Walk',
    city: 'Sacramento',
    state: 'CA',
    zipcode: '95814',
    parking: ['Across the street'],
  },
  {
    venueId: '3',
    name: '',
    address: '420 Mason St',
    city: 'San Francisco',
    state: 'CA',
    zipcode: '94102',
    parking: ['In front of the venue'],
  },
];

async function populateEvents() {
  const url = 'http://localhost:3000/api/events';
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(events),
  });

  const data = await resp.json();
  return data;
}

async function populateHosts() {
  const url = 'http://localhost:3000/api/hosts';
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(hosts),
  });

  const data = await resp.json();
  return data;
}

async function populateVenues() {
  const url = 'http://localhost:3000/api/venues';
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(venues),
  });

  const data = await resp.json();
  return data;
}

populateEvents();
// populateHosts();
// populateVenues();
