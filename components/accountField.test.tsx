import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccountField from './accountField';

describe('AccountField', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<AccountField value="" onChangeText={() => { }} />);
    expect(getByTestId('account-field-container')).toBeTruthy();
  });

  it('displays the correct value', () => {
    const testValue = 'test@example.com';
    const { getByTestId } = render(<AccountField value={testValue} onChangeText={() => { }} />);
    expect(getByTestId('account-field-input').props.value).toBe(testValue);
  });

  it('calls onChangeText when text is entered', () => {
    const onChangeTextMock = jest.fn();
    const { getByTestId } = render(<AccountField value="" onChangeText={onChangeTextMock} />);
    const input = getByTestId('account-field-input');
    fireEvent.changeText(input, 'new value');
    expect(onChangeTextMock).toHaveBeenCalledWith('new value');
  });

  it('hides text when secureTextEntry is true', () => {
    const { getByTestId } = render(<AccountField value="" onChangeText={() => { }} secureTextEntry={true} />);
    expect(getByTestId('account-field-input').props.secureTextEntry).toBe(true);
  });

  it('shows text when secureTextEntry is false', () => {
    const { getByTestId } = render(<AccountField value="" onChangeText={() => { }} secureTextEntry={false} />);
    expect(getByTestId('account-field-input').props.secureTextEntry).toBe(false);
  });

  it('applies the correct background color', () => {
    const { getByTestId } = render(<AccountField value="" onChangeText={() => { }} />);
    const container = getByTestId('account-field-input-container');
    expect(container.props.style).toContainEqual({ backgroundColor: "#353535cc" });
  });

  it('has the correct width', () => {
    const { getByTestId } = render(<AccountField value="" onChangeText={() => { }} />);
    const container = getByTestId('account-field-input-container');
    expect(container.props.style).toContainEqual({ width: "85%" });
  });

  it('has rounded corners', () => {
    const { getByTestId } = render(<AccountField value="" onChangeText={() => { }} />);
    const container = getByTestId('account-field-input-container');
    expect(container.props.style).toContainEqual({
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6
    });
  });

  it('has correct margin bottom', () => {
    const { getByTestId } = render(<AccountField value="" onChangeText={() => { }} />);
    const container = getByTestId('account-field-container');
    expect(container.props.style).toContainEqual({ marginBottom: 16 });
  });
});
