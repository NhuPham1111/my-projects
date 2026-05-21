import { Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <div className="min-h-screen">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
