import { createContext, useContext } from "react";

const AppContext = createContext<any>(null);

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppContext, useAppContext };