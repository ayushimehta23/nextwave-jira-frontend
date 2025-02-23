import Sidebar from "@/components/sidebar";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3">{children}</div>
    </div>
  );
};

export default DashboardLayout;
