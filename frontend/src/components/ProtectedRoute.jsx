import React from 'react'
import { useAuth } from '../context/auth/AuthContext'
import { Container, Spinner } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <Container className='d-flex justify-content-center align-items-center min-vh-100'>
                <Spinner animation='border' variant='primary' />
            </Container>
        )
    }

    if (!user) return <Navigate to='/login' replace />

    return <Outlet />
}
