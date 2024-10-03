import { lazy, Suspense, ComponentType } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

interface RouteConfig {
  path: string;
  component: () => Promise<{ default: ComponentType<any> }>;
}

const routeConfigs: RouteConfig[] = [
  { path: "/", component: () => import("../Home") },
  { path: "/search", component: () => import("../Search") },
  { path: "/cart", component: () => import("../Cart") },
];

const createLazyComponent = (loader: () => Promise<{ default: ComponentType<any> }>) => {
  const LazyComponent = lazy(loader);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
};

export const routes: RouteObject[] = routeConfigs.map(({ path, component }) => ({
  path,
  element: createLazyComponent(component),
}));

export const router = createBrowserRouter(routes);

// Dynamically export components
export const lazyComponents = Object.fromEntries(
  routeConfigs.map(({ path, component }) => [
    path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2),
    lazy(component),
  ])
);