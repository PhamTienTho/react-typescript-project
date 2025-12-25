import { useCurrentApp } from "../context/app.context";

const AppHeader = () => {

    const {user, isAuthenticated} = useCurrentApp();
    return (
        <div>
            header
            <div>{JSON.stringify(user)}</div>
        </div>
    )
}

export default AppHeader;