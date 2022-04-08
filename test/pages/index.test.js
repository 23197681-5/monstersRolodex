/**
 * @jest-environment jsdom
 */
// Using render and screen from test-utils.js instead of
// @testing-library/react
import { render, screen } from '../test-utils';
import HomePage from '@pages/index';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('HomePage', () => {
  let wrapper;
  let monsters;

  beforeEach(() => {
    const mockResponseData = [{ id: 1 }, { id: 2 }, { id: 3 }];
    monsters = mockResponseData.map((e) => ({ ...e }));
    jest.clearAllMocks();
    global.fetch = jest.fn(async () => ({
      json: async () => mockResponseData,
    }));
    //   wrapper = mount(<Monsters />);
  });
  it('should render the heading', () => {
    render(<HomePage />);

    const loading = screen.getByText(/Looking for/i);

    // we can only use toBeInTheDocument because it was imported
    // in the jest.setup.js and configured in jest.config.js
    expect(loading).toBeInTheDocument();
  });
});
