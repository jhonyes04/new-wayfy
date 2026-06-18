import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { StoreProvider } from './context/store/StoreProvider';
import { AuthProvider } from './context/auth/AuthContext';
import './index.css';
import { ToastContainer } from 'react-toastify';

const Main = () => {
    return (
        <React.StrictMode>
            <StoreProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                    <ToastContainer
                        theme="colored"
                        position="top-center"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        rtl={false}
                        closeOnClick
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </AuthProvider>
            </StoreProvider>
        </React.StrictMode>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
