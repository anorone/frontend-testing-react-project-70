import { http, HttpResponse } from 'msw';
import { StatusCodes } from 'http-status-codes';

const baseUrl = process.env.API_URL;

let nextId = 101;
let lists = [];

const buildList = (name) => ({
  id: nextId++,
  name,
  removable: true,
});

const listHandlers = [
  http.post(`${baseUrl}/lists`, async ({ request }) => {
    const requestBody = await request.json();
    const list = buildList(requestBody.name);
    lists = lists.concat(list);
    const options = { status: StatusCodes.CREATED };
    return HttpResponse.json(list, options);
  }),
  http.delete(`${baseUrl}/lists/:listId`, ({ params }) => {
    lists = lists.filter((list) => list.id !== Number(params.listId));
    const options = { status: StatusCodes.NO_CONTENT };
    return new HttpResponse(null, options);
  }),
];

export default listHandlers;
