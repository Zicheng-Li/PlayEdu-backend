import { Tree } from "antd";
import { useState, useEffect } from "react";
import { adminRole } from "../../api/index";

interface Option {
  key: string | number;
  title: any;
  children: any[];
}

interface PropInterface {
  refresh: boolean;
  roleDelSuccess: boolean;
  type: string;
  text: string;
  onUpdate: (keys: any, title: any) => void;
}

export const TreeAdminroles = (props: PropInterface) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectKey, setSelectKey] = useState<any>([]);

  useEffect(() => {
    onSelect([], "");
  }, [props.roleDelSuccess]);

  useEffect(() => {
    adminRole.adminRoleList().then((res: any) => {
      let adminrole = res.data;
      if (adminrole.length > 0) {
        const new_arr: Option[] = [];
        for (let i = 0; i < adminrole.length; i++) {
          new_arr.push({
            title: adminrole[i].name,
            key: adminrole[i].id,
            children: [],
          });
        }
        setTreeData(new_arr);
      }
    });
  }, [props.refresh]);

  const onSelect = (selectedKeys: any, info: any) => {
    let label = "All" + props.text;
    if (info) {
      label = info.node.title;
    }
    props.onUpdate(selectedKeys, label);
    setSelectKey(selectedKeys);
  };

  return (
    <div>
      <div
        className={
          selectKey.length === 0
            ? "mb-8 category-label active"
            : "mb-8 category-label"
        }
        onClick={() => {
          onSelect([], "");
        }}
      >
        <div className="j-b-flex">
          <span>All{props.text}</span>
        </div> 
      </div>
      <Tree
        onSelect={onSelect}
        selectedKeys={selectKey}
        treeData={treeData}
        switcherIcon={<i className="iconfont icon-icon-fold c-gray" />}
      />
    </div>
  );
};
