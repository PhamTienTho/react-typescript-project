import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import { useEffect } from "react";
import { fetchAccountAPI } from "./services/api";
import { useCurrentApp } from "./components/context/app.context";
import { SyncLoader } from "react-spinners";

const Layout = () => {

  const { isAppLoading } = useCurrentApp();

  return (
    <>
      {isAppLoading === false ?
        <div>
          <AppHeader />

          <Outlet />
        </div>
        :
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <SyncLoader
            loading={isAppLoading}
            size={"20px"}
            color="#5f8cef"
            speedMultiplier={1.5}
          />
        </div>
      }
    </>
  )
}
export default Layout;
