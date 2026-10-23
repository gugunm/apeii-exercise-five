import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-white text-slate-900">
      <Outlet />
    </div>
  ),
});
