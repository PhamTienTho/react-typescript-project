import { fetchAccountAPI } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react"

interface IAppContext {
    isAuthenticated: boolean;
    user: IUser | null;
    isAppLoading: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser | null) => void;
    setIsAppLoading: (v: boolean) => void;
}

type TProps = {
    children: React.ReactNode;
}
const CurrentUserContext = createContext<IAppContext | null>(null);
export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetchAccountAPI();
            if (res.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            }
            setIsAppLoading(false);
        }
        fetchUser();
    }, []);

    return (
        <CurrentUserContext.Provider value={{ isAuthenticated, user, isAppLoading, setIsAuthenticated, setUser, setIsAppLoading }}>
            {props.children}
        </CurrentUserContext.Provider>
    )
}

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentUserContext);

    if (!currentAppContext) {
        throw new Error("useCurrentUser has to be used within <CurrentUserContext.Provider>");
    };

    return currentAppContext;
}