import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import AppBar from './appBar';

// Mock the useRouter hook
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock the Image component
jest.mock('react-native/Libraries/Image/Image', () => 'Image');

describe('AppBar', () => {
  const mockRouter = {
    back: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders correctly without leading prop', () => {
    const { getByText, queryByTestId } = render(<AppBar leading={false} />);
    expect(getByText('SPLITSAVVY')).toBeTruthy();
    expect(queryByTestId('back-button')).toBeNull();
  });

  it('renders correctly with leading prop', () => {
    const { getByText, getByTestId } = render(<AppBar leading={true} />);
    expect(getByText('SPLITSAVVY')).toBeTruthy();
    expect(getByTestId('back-button')).toBeTruthy();
  });

  it('calls router.back when back button is pressed', () => {
    const { getByTestId } = render(<AppBar leading={true} />);
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('displays the logo', () => {
    const { getByTestId } = render(<AppBar leading={false} />);
    expect(getByTestId('app-logo')).toBeTruthy();
  });

  it('has correct styling for the container', () => {
    const { getByTestId } = render(<AppBar leading={false} />);
    const container = getByTestId('app-bar-container');
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ flexDirection: 'row' }),
        expect.objectContaining({ paddingTop: 8 })
      ])
    );
  });

  it('has correct styling for the title', () => {
    const { getByTestId } = render(<AppBar leading={false} />);
    const title = getByTestId('app-bar-title');
    expect(title.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontWeight: '800' }),
        expect.objectContaining({ color: '#e5e7eb' })
      ])
    );
  });
});
