
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="flex h-screen bg-white w-full">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Header />
        <main className="flex-1 overflow-y-auto bg-white w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
