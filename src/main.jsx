import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import About from './About.jsx';
import Admin from './Admin.jsx';
import MyPost from './MyPost.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement:Notification,
    children: [
      {
        path:'/',
        element: <About></About>
      },
      {
        path:'/admin01748662245',
        element:<Admin/>
      },
      {
        path:'/mypost01748662245',
        element:<MyPost/>
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    </StrictMode>,
)
