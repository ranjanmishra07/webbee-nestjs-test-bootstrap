import { Repository } from 'typeorm';
import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import {Workshop} from './entities/workshop.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Workshop)
    private workShopRepository : Repository<Workshop>
  ) {}

  getWarmupEvents() {
    return this.eventRepository.find();
  }

  /*
    Requirements:
    - maximum 2 sql queries
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    Hints:
    - open the `src/events/events.service` file
    - partial or not working answers also get graded so make sure you commit what you have
    Sample response on GET /events/events:
    ```json
    [
      {
        id: 1,
        name: 'Laravel convention 2021',
        createdAt: '2021-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 1,
            start: '2021-02-21 10:00:00',
            end: '2021-02-21 16:00:00',
            eventId: 1,
            name: 'Illuminate your knowledge of the laravel code base',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
      {
        id: 2,
        name: 'Laravel convention 2023',
        createdAt: '2023-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 2,
            start: '2023-10-21 10:00:00',
            end: '2023-10-21 18:00:00',
            eventId: 2,
            name: 'The new Eloquent - load more with less',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
          {
            id: 3,
            start: '2023-11-21 09:00:00',
            end: '2023-11-21 17:00:00',
            eventId: 2,
            name: 'AutoEx - handles exceptions 100% automatic',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
      {
        id: 3,
        name: 'React convention 2023',
        createdAt: '2023-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 4,
            start: '2023-08-21 10:00:00',
            end: '2023-08-21 18:00:00',
            eventId: 3,
            name: '#NoClass pure functional programming',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
          {
            id: 5,
            start: '2023-08-21 09:00:00',
            end: '2023-08-21 17:00:00',
            eventId: 3,
            name: 'Navigating the function jungle',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
    ]
    ```
     */

  @Get('events')
  async getEventsWithWorkshops() {
    // throw new Error('TODO task 1');
    const events = await this.getWarmupEvents();
    const workshops = await this.workShopRepository.find();

    const result: any = {};
    events.forEach(event => {
      result[event.id] = {
        id: event.id,
        name: event.name,
        createdAt: event.createdAt,
        workshops : []
      }
    })

    // console.log('workshops=============================', workshops);

    workshops.forEach(a=> {
      if(result[a.eventId].id == a.eventId) {
        result[a.eventId].workshops.push(
          {
            id: a.id,
            start: a.start,
            end: a.end,
            eventId: a.eventId,
            name: a.name,
            createdAt: a.createdAt,
          }
        );
      }
    })

    // console.log('result=============================', result);


    return Object.values(result);
  }

  /*
    Requirements:
    - only events that have not yet started should be included
    - the event starting time is determined by the first workshop of the event
    - the code should result in maximum 3 SQL queries, no matter the amount of events
    - all filtering of records should happen in the database
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    Hints:
    - open the `src/events/events.service.ts` file
    - partial or not working answers also get graded so make sure you commit what you have
    - join, whereIn, min, groupBy, havingRaw might be helpful
    - in the sample data set  the event with id 1 is already in the past and should therefore be excluded
    Sample response on GET /futureevents:
    ```json
    [
        {
            "id": 2,
            "name": "Laravel convention 2023",
            "createdAt": "2023-04-20T07:01:14.000000Z",
            "workshops": [
                {
                    "id": 2,
                    "start": "2023-10-21 10:00:00",
                    "end": "2023-10-21 18:00:00",
                    "eventId": 2,
                    "name": "The new Eloquent - load more with less",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                },
                {
                    "id": 3,
                    "start": "2023-11-21 09:00:00",
                    "end": "2023-11-21 17:00:00",
                    "eventId": 2,
                    "name": "AutoEx - handles exceptions 100% automatic",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                }
            ]
        },
        {
            "id": 3,
            "name": "React convention 2023",
            "createdAt": "2023-04-20T07:01:14.000000Z",
            "workshops": [
                {
                    "id": 4,
                    "start": "2023-08-21 10:00:00",
                    "end": "2023-08-21 18:00:00",
                    "eventId": 3,
                    "name": "#NoClass pure functional programming",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                },
                {
                    "id": 5,
                    "start": "2023-08-21 09:00:00",
                    "end": "2023-08-21 17:00:00",
                    "eventId": 3,
                    "name": "Navigating the function jungle",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                }
            ]
        }
    ]
    ```
     */
  @Get('futureevents')
  async getFutureEventWithWorkshops() {
    // throw new Error('TODO task 2');
    let allEvents = await this.getEventsWithWorkshops();
    allEvents.forEach((a:any)=> {
      console.log('a.created', a);
      console.log('time', new Date(a.createdAt).getTime());
    })
    allEvents =  allEvents.filter((a: any)=> new Date(a.createdAt).getTime() > new Date().getTime() )
    console.log('allevents', allEvents);
    return allEvents;
  }
}
