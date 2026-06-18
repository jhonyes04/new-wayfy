import { useReducer } from 'react'
import { storeReducer } from './storeReducer'
import { initialState } from './initialState'
import { StoreContext } from './StoreContext'

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(storeReducer, initialState())

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    )
}
