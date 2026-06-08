import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "../front/routes/routes";
import { StoreProvider } from './context/store/StoreProvider';
import { AuthProvider } from './context/auth/AuthContext'


const Main = () => {
    return (
        <React.StrictMode>
            <StoreProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </StoreProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
