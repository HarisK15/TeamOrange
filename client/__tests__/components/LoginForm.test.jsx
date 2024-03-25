import {  describe, expect, it, vi } from 'vitest';
import {  fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import LoginForm from '../../src/components/LoginForm';

describe('LoginForm', () => {
  it('allows a user to enter email and password and submit the form', async () => {
    const loginUser = vi.fn((e) => e.preventDefault()); 
    const setData = vi.fn(); 
    const data = { email: '', password: '' }; 

    const { getByPlaceholderText, getByRole } = render(
      <LoginForm loginUser={loginUser} data={data} setData={setData} />
    );

    fireEvent.change(getByPlaceholderText('Email Address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    expect(setData).toHaveBeenCalled({email:'test@example.com',password:'password123'});

    fireEvent.click(getByRole('button', { name: /log in/i }));

    expect(loginUser).toHaveBeenCalled();
  });
});
