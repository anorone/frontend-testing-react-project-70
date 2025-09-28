// @ts-check

import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';

import init from '@hexlet/react-todo-app-with-backend';
import { screen, render } from '@testing-library/react';

import server from '../mocks/server';

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

  test('task manipulation', () => {
    const initialState = {};
    render(init(initialState));
  });
});
