// @ts-check

import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';

import init from '@hexlet/react-todo-app-with-backend';
import { screen, render, cleanup, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import server from '../mocks/server';

beforeEach(() => {
  cleanup();
});

test('initiating the app', () => {
  const initialState = {};
  render(init(initialState));
  expect(screen.getByText(/hexlet todos/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /lists/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /tasks/i })).toBeInTheDocument();
});

describe('normal flow of using the app', () => {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'error',
    });
  });

  afterAll(() => {
    server.close();
  });

  test('task manipulation', async () => {
    const user = userEvent.setup();
    const initialState = { currentListId: 1 };
    render(init(initialState));
    expect(screen.getByText(/tasks list is empty/i)).toBeInTheDocument();

    const taskForm = screen.getByTestId('task-form');
    const taskInput = within(taskForm).getByRole('textbox');
    const submitButton = within(taskForm).getByRole('button', { name: /add/i });
    const firstTaskName = 'eat';
    await user.type(taskInput, firstTaskName);
    await user.click(submitButton);
    await screen.findByText(firstTaskName);
    const secondTaskName = 'sleep';
    await user.type(taskInput, secondTaskName);
    await user.click(submitButton);
    await screen.findByText(secondTaskName);
    expect(screen.queryByText(/tasks list is empty/i)).not.toBeInTheDocument();
    const taskList = screen.getByTestId('tasks');
    const tasks = within(taskList).getAllByRole('listitem');
    expect(tasks).toHaveLength(2);

    const firstTask = screen.getByRole('checkbox', { name: firstTaskName });
    expect(firstTask).not.toBeChecked();
    await user.click(firstTask);
    await waitFor(() => expect(firstTask).toBeChecked());
    expect(within(taskList).getAllByRole('checkbox')[1]).toBe(firstTask);
    await user.click(firstTask);
    await waitFor(() => expect(firstTask).not.toBeChecked());
    expect(within(taskList).getAllByRole('checkbox')[0]).toBe(firstTask);

    const taskToDelete = tasks[0];
    const removeButton = within(taskToDelete).getByRole('button', { name: /remove/i });
    await user.click(removeButton);
    await waitFor(() => expect(taskToDelete).not.toBeInTheDocument());
    const updatedTasks = within(taskList).getAllByRole('listitem');
    expect(updatedTasks).toHaveLength(1);
  });
});
