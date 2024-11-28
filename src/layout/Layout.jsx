import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const Layout = () => {
    const [username, setUsername] = useState(localStorage.getItem('name') || '');

    return (
        <>
            
            <Outlet context={{ setUsername }} />
            
        </>
    );
};

export default Layout;