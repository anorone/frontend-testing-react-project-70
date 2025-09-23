// @ts-check

import { expect, test } from '@jest/globals';

import init from '@hexlet/react-todo-app-with-backend';
import { screen, render } from '@testing-library/react';

test('initiating the app', () => {
  const initialState = {};
  render(init(initialState));
  expect(screen.getByText(/hexlet todos/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /lists/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /tasks/i })).toBeInTheDocument();
});
