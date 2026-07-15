import { Outlet, NavLink } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Article Dashboard</h1>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink
            to="/posts"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md transition-colors ${
                isActive ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            All Posts
          </NavLink>
          <NavLink
            to="/posts/new"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md transition-colors ${
                isActive ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            Add New
          </NavLink>
          <NavLink
            to="/preview"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md transition-colors ${
                isActive ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            Preview
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
