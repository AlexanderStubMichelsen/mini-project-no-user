import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App.jsx';
import Images from './components/Images.jsx';
import NoMatch from './components/NoMatch.jsx';
import AdminPictures from './components/admin/AdminPictures.jsx';
import AdminUsers from './components/admin/AdminUsers.jsx';
import SavedImages from './components/SavedImages.jsx';
import AdminUserPictures from './components/admin/AdminUserPictures.jsx';
import SignUp from './components/SignUp.jsx';
import facade from './util/apiFacade.js';
import './index.css';
import Youtube from './components/Youtube.jsx';
import Help from './components/Help.jsx';

const Root = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userRoles = facade.getUserRoles(); // Assuming getUserRoles returns an array of roles

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* Pass setIsLoggedIn as a prop to the App component */}
        <Route path="/" element={<App setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
        {/* Route for sign-up, available whether logged in or not */}
        <Route path="/signup" element={<SignUp />} />
        {/* Conditional rendering of routes based on isLoggedIn */}
        {/* {isLoggedIn && ( */}
          <>
            {/* Conditional rendering of 'Images' route */}
            {/* {(userRoles.includes('admin') || userRoles.includes('user') || userRoles.includes('manager')) && ( */}
              <Route path="images" element={<Images />} />
              <Route path="youtube" element={<Youtube />} />
              <Route path="help" element={<Help />} />
            {/* )} */}
            {/* Conditional rendering of 'SavedImages' route */}
            {userRoles.includes('user') && (
              <Route path="savedImg" element={<SavedImages />} />
            )}
            {/* Conditional rendering of 'AdminPictures' route */}
            {userRoles.includes('admin') && (
              <Route path="admin/pictures" element={<AdminPictures />} />
            )}
            {/* Conditional rendering of 'AdminUsers' route */}
            {userRoles.includes('admin') && (
              <Route path="admin/users" element={<AdminUsers />} />
            )}
            {/* Conditional rendering of 'AdminUserPictures' route */}
            {userRoles.includes('admin') && (
              <Route path="admin/users/:username" element={<AdminUserPictures />} />
            )}
          </>
        {/* )} */}
       
        {/* Conditional rendering of 'AdminRoles' route */}
        {/* Route for any other unmatched paths */}
        <Route path="*" element={<NoMatch />} />
      </Route>
    )
  );

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
