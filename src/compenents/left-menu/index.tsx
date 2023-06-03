import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./index.module.less";
import logo from "../../assets/logo.png";

function getItem(label: any, key: any, icon: any, children: any, type: any) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem(
    "Home Overview",
    "/",
    <i className={`iconfont icon-icon-home`} />,
    null,
    null
  ),
  getItem(
    "Category Management",
    "/resource-category",
    <i className="iconfont icon-icon-category" />,
    null,
    null
  ),
  getItem(
    "Resource Management",
    "resource",
    <i className="iconfont icon-icon-file" />,
    [
      getItem("Video", "/videos", null, null, null),
      getItem("Pictures", "/images", null, null, null),
    ],
    null
  ),
  getItem(
    "Course Center",
    "courses",
    <i className="iconfont icon-icon-study" />,
    [getItem("Online Classes", "/course", null, null, null)],
    null
  ),
  getItem(
    "Student Management",
    "user",
    <i className="iconfont icon-icon-user" />,
    [
      getItem("Student", "/member/index", null, null, null),
      getItem("Department", "/department", null, null, null),
    ],
    null
  ),
  getItem(
    "System Settings",
    "system",
    <i className="iconfont icon-icon-setting" />,
    [
      getItem("System Configuration", "/system/config/index", null, null, null),
      getItem("Management", "/system/administrator", null, null, null),
      // getItem("角色配置", "/system/adminroles", null, null, null),
    ],
    null
  ),
];

const children2Parent: any = {
  "^/video": ["resource"],
  "^/image": ["resource"],
  "^/member": ["user"],
  "^/department": ["user"],
  "^/course": ["courses"],
  "^/system": ["system"],
};

export const LeftMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hit = (pathname: string): string[] => {
    for (let p in children2Parent) {
      if (pathname.search(p) >= 0) {
        return children2Parent[p];
      }
    }
    return [];
  };
  const openKeyMerge = (pathname: string): string[] => {
    let newOpenKeys = hit(pathname);
    for (let i = 0; i < openKeys.length; i++) {
      let isIn = false;
      for (let j = 0; j < newOpenKeys.length; j++) {
        if (newOpenKeys[j] === openKeys[i]) {
          isIn = true;
          break;
        }
      }
      if (isIn) {
        continue;
      }
      newOpenKeys.push(openKeys[i]);
    }

    return newOpenKeys;
  };

  // 选中的菜单
  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    location.pathname,
  ]);
  // 展开菜单
  const [openKeys, setOpenKeys] = useState<string[]>(hit(location.pathname));

  const onClick = (e: any) => {
    navigate(e.key);
  };

  useEffect(() => {
    if (location.pathname.indexOf("/course/user") !== -1) {
      setSelectedKeys(["/course"]);
      setOpenKeys(openKeyMerge("/course"));
    } else if (location.pathname.indexOf("/member/learn") !== -1) {
      setSelectedKeys(["/member/index"]);
      setOpenKeys(openKeyMerge("/member/index"));
    } else {
      setSelectedKeys([location.pathname]);
      setOpenKeys(openKeyMerge(location.pathname));
    }
  }, [location.pathname]);

  return (
    <div className={styles["left-menu"]}>
      <div
        style={{
          textDecoration: "none",
          cursor: "pointer",
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
        }}
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <img src={logo} className={styles["App-logo"]} />
      </div>
      <div className={styles["menu-box"]}>
        <Menu
          onClick={onClick}
          style={{
            width: 200,
            background: "#ffffff",
          }}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          mode="inline"
          items={items}
          onSelect={(data: any) => {
            setSelectedKeys(data.selectedKeys);
          }}
          onOpenChange={(keys: any) => {
            setOpenKeys(keys);
          }}
        />
      </div>
    </div>
  );
};
