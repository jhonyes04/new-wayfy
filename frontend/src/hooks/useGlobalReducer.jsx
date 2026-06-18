import { useContext } from "react";
import { StoreContext } from "../context/store/StoreContext";

function useGlobalReducer() {
    const { state, dispatch } = useContext(StoreContext)

    return { state, dispatch }
}

export default useGlobalReducer