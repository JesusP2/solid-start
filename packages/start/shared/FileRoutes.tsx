/* @refresh skip */
import { getRequestEvent, isServer } from "solid-js/web";
import lazyRoute from "./lazyRoute";

import type { Route } from "vinxi/fs-router";
import type { PageEvent } from "../server/types";
import { pageRoutes as routeConfigs } from "./routes";

export function createRoutes() {
  function createRoute(route: Route) {
    return {
      ...route,
      ...(route.$$route ? route.$$route.require().route : undefined),
      info: {
        ...(route.$$route ? route.$$route.require().route.info : {}),
        filesystem: true
      },
      component: lazyRoute(
        route.$component,
        import.meta.env.START_ISLANDS
          ? import.meta.env.MANIFEST["ssr"]
          : import.meta.env.MANIFEST["client"],
        import.meta.env.MANIFEST["ssr"]
      ),
      children: route.children ? route.children.map(createRoute) : undefined
    };
  }
  const routes = routeConfigs.map(createRoute);
  return routes;
}

let routes: any[];
export const FileRoutes = () => {
  return isServer ? (getRequestEvent() as PageEvent).routes : routes || (routes = createRoutes());
};
