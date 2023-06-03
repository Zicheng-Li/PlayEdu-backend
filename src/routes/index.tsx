import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { login, system } from "../api";

import InitPage from "../pages/init";
import { getToken } from "../utils";
import KeepAlive from "../compenents/keep-alive";

import LoginPage from "../pages/login";
import HomePage from "../pages/home";
import DashboardPage from "../pages/dashboard";
import ChangePasswordPage from "../pages/change-password";
import ResourceCategoryPage from "../pages/resource/resource-category";
import ResourceImagesPage from "../pages/resource/images";
import ResourceVideosPage from "../pages/resource/videos";
import CoursePage from "../pages/course/index";
import CourseUserPage from "../pages/course/user";
import MemberPage from "../pages/member";
import MemberImportPage from "../pages/member/import";
import MemberLearnPage from "../pages/member/learn";
import MemberDepartmentProgressPage from "../pages/member/departmentUser";
import SystemConfigPage from "../pages/system/config";
import SystemAdministratorPage from "../pages/system/administrator";
import SystemAdminrolesPage from "../pages/system/adminroles";
import DepartmentPage from "../pages/department";
import TestPage from "../pages/test";
import ErrorPage from "../pages/error";
import PrivateRoute from "../compenents/private-route";

// const LoginPage = lazy(() => import("../pages/login"));

let RootPage: any = null;
if (getToken()) {
  RootPage = lazy(async () => {
    return new Promise<any>(async (resolve) => {
      try {
        let configRes: any = await system.getSystemConfig();
        let userRes: any = await login.getUser();

        resolve({
          default: (
            <InitPage configData={configRes.data} loginData={userRes.data} />
          ),
        });
      } catch (e) {
        console.error("System initialization failure", e);
        resolve({
          default: <ErrorPage />,
        });
      }
    });
  });
} else {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
  RootPage = <InitPage />;
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: RootPage,
    children: [
      {
        path: "/",
        element: <PrivateRoute Component={<HomePage />} />,
        children: [
          {
            path: "/",
            element: <PrivateRoute Component={<DashboardPage />} />,
          },
          {
            path: "/change-password",
            element: <PrivateRoute Component={<ChangePasswordPage />} />,
          },
          {
            path: "/resource-category",
            element: <PrivateRoute Component={<ResourceCategoryPage />} />,
          },
          {
            path: "/images",
            element: <PrivateRoute Component={<ResourceImagesPage />} />,
          },
          {
            path: "/videos",
            element: <PrivateRoute Component={<ResourceVideosPage />} />,
          },
          {
            path: "/course",
            element: <PrivateRoute Component={<CoursePage />} />,
          },
          {
            path: "/course/user/:courseId",
            element: <PrivateRoute Component={<CourseUserPage />} />,
          },
          {
            path: "/member",
            element: <KeepAlive />,
            children: [
              {
                path: "/member/index",
                element: <PrivateRoute Component={<MemberPage />} />,
              },
              {
                path: "/member/import",
                element: <PrivateRoute Component={<MemberImportPage />} />,
              },
              {
                path: "/member/learn",
                element: <PrivateRoute Component={<MemberLearnPage />} />,
              },
              {
                path: "/member/departmentUser",
                element: (
                  <PrivateRoute Component={<MemberDepartmentProgressPage />} />
                ),
              },
            ],
          },
          {
            path: "/system/config/index",
            element: <PrivateRoute Component={<SystemConfigPage />} />,
          },
          {
            path: "/system/administrator",
            element: <PrivateRoute Component={<SystemAdministratorPage />} />,
          },
          {
            path: "/system/adminroles",
            element: <PrivateRoute Component={<SystemAdminrolesPage />} />,
          },
          {
            path: "/department",
            element: <PrivateRoute Component={<DepartmentPage />} />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
];

export default routes;
