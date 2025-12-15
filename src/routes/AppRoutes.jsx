import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import MovieDetail from '@/pages/MovieDetail';
import PersonDetail from '@/pages/PersonDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Favorites from '@/pages/Favorites';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/common/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'search', element: <Search /> },
      { path: 'movie/:id', element: <MovieDetail /> },
      { path: 'person/:id', element: <PersonDetail /> },
      {
        element: <ProtectedRoute mode="guest" />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'favorites', element: <Favorites /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
