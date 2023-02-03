import React from 'react';
import { useAuthStore } from '../../hooks/useAuthStore';

export default function Login() {
  const { loggedInUser, login, logout } = useAuthStore((state) => state);
  return (
    <div>
      <h1>LOGIN</h1>
      <h3>{loggedInUser?.name}</h3>
      <button
        onClick={() => {
          login({ email: 'tungnt@softech.vn', password: '123456789' });
        }}
      >
        Login
      </button>

      <button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    </div>
  );
}
