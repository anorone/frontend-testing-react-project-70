import { http, HttpResponse } from 'msw';
import { StatusCodes } from 'http-status-codes';

interface Task {
  id: number;
  completed: boolean;
  listId: number;
  text: string;
  touched: number;
}

const baseUrl = process.env.API_URL;

let nextId = 1;
let tasks: Task[] = [];

const buildTask = (listId: number, text: string): Task => ({
  id: nextId++,
  listId,
  text,
  completed: false,
  touched: Date.now(),
});

const taskHandlers = [
  http.post<{ listId: string }, Pick<Task, 'text'>>(
    `${baseUrl}/lists/:listId/tasks`,
    async ({ request, params }) => {
      const requestBody = await request.json();
      const task = buildTask(Number(params.listId), requestBody.text);
      tasks = tasks.concat(task);
      const options = { status: StatusCodes.CREATED };
      return HttpResponse.json(task, options);
    },
  ),
  http.patch<{ taskId: string }, Pick<Task, 'completed'>>(
    `${baseUrl}/tasks/:taskId`,
    async ({ request, params }) => {
      const requestBody = await request.json();
      const taskToUpdate = tasks.find((task) => task.id === Number(params.taskId));
      if (!taskToUpdate) {
        const options = { status: StatusCodes.NOT_FOUND };
        return new HttpResponse(null, options);
      }
      const updatedTask = { ...taskToUpdate, ...requestBody, touched: Date.now() };
      tasks = tasks.map((task) =>
        task.id === Number(params.taskId) ? updatedTask : task
      );
      return HttpResponse.json(updatedTask);
    },
  ),
  http.delete<{ taskId: string }>(`${baseUrl}/tasks/:taskId`, ({ params }) => {
    tasks = tasks.filter((task) => task.id !== Number(params.taskId));
    const options = { status: StatusCodes.NO_CONTENT };
    return new HttpResponse(null, options);
  }),
];

export default taskHandlers;
