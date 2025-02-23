"use client";
import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FaBars, FaProjectDiagram, FaSignOutAlt, FaTachometerAlt, FaCog } from "react-icons/fa";
import { logout } from "@/app/store/slices/authSlice"; // Import logout action

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Logout function
  const handleLogout = () => {
    dispatch(logout()); // Call Redux logout action
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className={`d-flex flex-column bg-dark text-white vh-100 p-3 ${collapsed ? "collapsed" : ""}`} style={{ width: collapsed ? "80px" : "250px", transition: "width 0.3s" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {!collapsed && <h4 className="ms-2">Jira Clone</h4>}
        <FaBars className="text-white cursor-pointer" size={20} onClick={() => setCollapsed(!collapsed)} />
      </div>

      <nav className="nav flex-column">
        <Link href="/dashboard" className="nav-link text-white d-flex align-items-center">
          <FaTachometerAlt className="me-2" /> {!collapsed && "Dashboard"}
        </Link>
        <Link href="/projects" className="nav-link text-white d-flex align-items-center">
          <FaProjectDiagram className="me-2" /> {!collapsed && "Projects"}
        </Link>
        <Link href="/settings" className="nav-link text-white d-flex align-items-center">
          <FaCog className="me-2" /> {!collapsed && "Settings"}
        </Link>
      </nav>

      <div className="mt-auto">
        <button className="btn btn-danger w-100 d-flex align-items-center" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
