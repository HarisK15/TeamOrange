import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import RegisterForm from '../../src/components/RegisterForm';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('RegisterForm', () => {
  let data;
  let setData;
  let registerUser;

  beforeEach(() => {
    data = { userName: '', email: '', password: '' };
    setData = vi.fn(); 
    registerUser = vi.fn();
  });

  it('renders input fields for username, email, and password', () => {
    const { getByPlaceholderText } = render(
      <RegisterForm data={data} setData={setData} registerUser={registerUser} />
    );

    expect(getByPlaceholderText('User Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('updates state on input change', async () => {
    const { getByPlaceholderText } = render(
      <RegisterForm data={data} setData={setData} registerUser={registerUser} />
    );

    fireEvent.change(getByPlaceholderText('User Name'), { target: { value: 'newUser' } });
    fireEvent.change(getByPlaceholderText('Email Address'), { target: { value: 'user@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

    expect(setData).toHaveBeenCalledTimes(3);
  });

  it('submits the form with correct data', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <RegisterForm data={data} setData={setData} registerUser={registerUser} />
    );

    fireEvent.change(getByPlaceholderText('User Name'), { target: { value: 'newUser' } });
    fireEvent.change(getByPlaceholderText('Email Address'), { target: { value: 'user@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(getByRole('button', { name: 'Register' }));

    expect(registerUser).toHaveBeenCalled();
  });
});
