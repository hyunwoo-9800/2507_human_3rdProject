import React, {useState} from 'react';
import Sidebar from "./components/Sidebar";
import AdminContent from "./components/AdminContent";
import './Admin.css'


const Admin=() => {
    const [activeItem, setActiveItem] = useState(null);

    return (
        <div className="admin-container">
            <Sidebar
                activeItem={activeItem}
                setActiveItem={setActiveItem}
            />
            <AdminContent
                activeItem={activeItem}
            />
        </div>
    );
};

export default Admin;