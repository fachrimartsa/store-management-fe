import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SweetAlert from '../util/SweetAlert';
import { API_LINK } from '../util/Constants';
import Cookies from 'js-cookie';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const query = `
        mutation LoginUser($usr_username: String!, $usr_password: String!) {
          loginUser(usr_username: $usr_username, usr_password: $usr_password) {
            usr_id
            usr_toko
            usr_username
          }
        }
      `;

      const variables = {
        usr_username: username,
        usr_password: password,
      };

      const response = await fetch(API_LINK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json();
      const loggedInUser = result.data.loginUser;

      if (!loggedInUser) {
        SweetAlert("Login Gagal!", "Username atau password salah!", "error");
      } else {
        Cookies.set('user', JSON.stringify(loggedInUser), { expires: 7 });
        SweetAlert("Sukses!", "Login Berhasil!", "success");
        setUsername("");
        setPassword("");
        navigate("/dashboard");
      }
    } catch (err) {
      SweetAlert("Login Gagal!", "Username atau password salah!", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-xl">
        <h2 className="text-4xl font-bold text-center text-purple-800 mb-8">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-lg font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Masukkan username Anda"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Masukkan password Anda"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-700 text-white font-semibold rounded-md shadow-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}