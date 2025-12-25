import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import { useEffect } from "react";
import { fetchAccountAPI } from "./services/api";
import { useCurrentApp } from "./components/context/app.context";

const Layout = () => {

  const {setUser, setIsAuthenticated, isAppLoading, setIsAppLoading} = useCurrentApp(); 

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetchAccountAPI();
      if(res.data) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
      setIsAppLoading(false);
    }
    fetchUser();
  },[]);

  return (
    <>
        <AppHeader/>

        <Outlet/>
    </>
  )
}
export default Layout;
