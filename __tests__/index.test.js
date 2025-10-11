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

describe('basic flow of using the app', () => {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'error',
    });
  });

  afterAll(() => {
    server.close();
  });

  test('adding, updating and removing tasks', async () => {
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
    const taskContainer = screen.getByTestId('tasks');
    const tasks = within(taskContainer).getAllByRole('listitem');
    expect(tasks).toHaveLength(2);

    const firstTask = screen.getByRole('checkbox', { name: firstTaskName });
    expect(firstTask).not.toBeChecked();
    await user.click(firstTask);
    await waitFor(() => expect(firstTask).toBeChecked());
    expect(within(taskContainer).getAllByRole('checkbox')[1]).toBe(firstTask);
    await user.click(firstTask);
    await waitFor(() => expect(firstTask).not.toBeChecked());
    expect(within(taskContainer).getAllByRole('checkbox')[0]).toBe(firstTask);

    const taskToDelete = tasks[0];
    const removeButton = within(taskToDelete).getByRole('button', { name: /remove/i });
    await user.click(removeButton);
    await waitFor(() => expect(taskToDelete).not.toBeInTheDocument());
    const updatedTasks = within(taskContainer).getAllByRole('listitem');
    expect(updatedTasks).toHaveLength(1);
  });

  test('adding and removing lists', async () => {
    const user = userEvent.setup();
    const defaultLists = [{ id: 1, name: 'primary', removable: false }];
    const initialState = { lists: defaultLists, currentListId: 1 };
    render(init(initialState));

    const listContainer = screen.getByTestId('lists');
    const defaultList = within(listContainer).getByRole('button', { name: /primary/i });
    expect(defaultList).toBeInTheDocument();
    expect(within(listContainer).getAllByRole('listitem')).toHaveLength(1);

    const listForm = screen.getByTestId('list-form');
    const listInput = within(listForm).getByRole('textbox');
    const submitButton = within(listForm).getByRole('button', { name: /add/i });
    const customListName = 'secondary';
    await user.type(listInput, customListName);
    await user.click(submitButton);
    await within(listContainer).findByRole('button', { name: customListName });
    const lists = within(listContainer).getAllByRole('listitem');
    expect(lists).toHaveLength(2);

    const customList = lists[1];
    const removeButton = within(customList).getByRole('button', { name: /remove/i });
    await user.click(removeButton);
    await waitFor(() => expect(customList).not.toBeInTheDocument());
    expect(within(listContainer).getAllByRole('listitem')).toHaveLength(1);
  });

  test('non-removable lists do not have remove button', () => {
    const defaultLists = [{ id: 1, name: 'primary', removable: false }];
    const initialState = { lists: defaultLists, currentListId: 1 };
    render(init(initialState));
    const listContainer = screen.getByTestId('lists');
    const defaultList = within(listContainer).getByRole('listitem');
    const removeButton = within(defaultList).queryByRole('button', { name: /remove/i });
    expect(removeButton).not.toBeInTheDocument();
  });

  test('tasks from different lists do not affect each other', async () => {
    const user = userEvent.setup();
    const defaultLists = [
      { id: 1, name: 'primary', removable: false },
      { id: 2, name: 'secondary', removable: true },
    ];
    const initialState = { lists: defaultLists, currentListId: 1 };
    render(init(initialState));
    const taskForm = screen.getByTestId('task-form');
    const taskInput = within(taskForm).getByRole('textbox');
    const submitButton = within(taskForm).getByRole('button', { name: /add/i });
    const firstTaskName = 'eat';
    await user.type(taskInput, firstTaskName);
    await user.click(submitButton);
    const secondTaskName = 'sleep';
    await user.type(taskInput, secondTaskName);
    await user.click(submitButton);
    const customList = screen.getByRole('button', { name: /secondary/i });
    await user.click(customList);
    expect(screen.getByText(/tasks list is empty/i)).toBeInTheDocument();
    await user.type(taskInput, firstTaskName);
    await user.click(submitButton);
    const defaultList = screen.getByRole('button', { name: /primary/i });
    await user.click(defaultList);
    const taskContainer = screen.getByTestId('tasks');
    expect(within(taskContainer).getAllByRole('listitem')).toHaveLength(2);
    const tasks = within(taskContainer).getAllByRole('listitem');
    const removeButton = within(tasks[0]).getByRole('button', { name: /remove/i });
    await user.click(removeButton);
    const taskToComplete = within(taskContainer).getByRole('checkbox');
    await user.click(taskToComplete);
    await user.click(customList);
    expect(within(taskContainer).getByRole('checkbox')).not.toBeChecked();
  });

  test('lists are re-created with an empty state', async () => {
    const user = userEvent.setup();
    const defaultListName = 'primary';
    const defaultLists = [{ id: 1, name: defaultListName, removable: true }];
    const initialState = { lists: defaultLists, currentListId: 1 };
    render(init(initialState));
    const taskForm = screen.getByTestId('task-form');
    const taskInput = within(taskForm).getByRole('textbox');
    const taskName = 'walk';
    await user.type(taskInput, taskName);
    await user.click(within(taskForm).getByRole('button', { name: /add/i }));
    const listContainer = screen.getByTestId('lists');
    const defaultList = within(listContainer).getByRole('listitem');
    const removeButton = within(defaultList).getByRole('button', { name: /remove/i });
    await user.click(removeButton);
    const listForm = screen.getByTestId('list-form');
    const listInput = within(listForm).getByRole('textbox');
    await user.type(listInput, defaultListName);
    await user.click(within(listForm).getByRole('button', { name: /add/i }));
    expect(screen.getByText(/tasks list is empty/i)).toBeInTheDocument();
  });
});
