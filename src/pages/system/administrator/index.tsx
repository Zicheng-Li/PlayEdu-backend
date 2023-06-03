import React, { useState, useEffect } from "react";
import { Typography, Input, Button, Space, Table, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { adminUser, adminRole } from "../../../api/index";
import { dateFormat } from "../../../utils/index";
import { useNavigate } from "react-router-dom";
import { TreeAdminroles, PerButton } from "../../../compenents";
import { SystemAdministratorCreate } from "./compenents/create";
import { SystemAdministratorUpdate } from "./compenents/update";
import { SystemAdminrolesCreate } from "../adminroles/compenents/create";
import { SystemAdminrolesUpdate } from "../adminroles/compenents/update";

const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
  email: string;
  login_at: string;
  login_ip: string;
  is_ban_login: number;
}

const SystemAdministratorPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [list, setList] = useState<any>([]);
  const [roles, setRoles] = useState<any>([]);
  const [userRoleIds, setUserRoleIds] = useState<any>({});
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [createRoleVisible, setCreateRoleVisible] = useState<boolean>(false);
  const [updateRoleVisible, setUpdateRoleVisible] = useState<boolean>(false);
  const [cid, setCid] = useState<number>(0);
  const [role_ids, setRoleIds] = useState<any>([]);
  const [selLabel, setLabel] = useState<string>("All Admin");
  const [roleDelSuccess, setRoleDelSuccess] = useState(false);

  const [name, setName] = useState<string>("");

  const columns: ColumnsType<DataType> = [
    {
      title: "Admin",
      dataIndex: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Roles",
      dataIndex: "id",
      render: (id: number) => (
        <div className="float-left">
          {userRoleIds[id] &&
            userRoleIds[id].map((item: any, index: number) => {
              return roles[item] ? (
                <span key={index}>
                  {index === userRoleIds[id].length - 1
                    ? roles[item][0].name
                    : roles[item][0].name + "、"}
                </span>
              ) : (
                ""
              );
            })}
        </div>
      ),
    },
    {
      title: "Login Email",
      dataIndex: "email",
    },
    {
      title: "LoginIP",
      dataIndex: "login_ip",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Last Login Time",
      dataIndex: "login_at",
      render: (text: string) => <span>{text && dateFormat(text)}</span>,
    },
    {
      title: "Disable Login",
      dataIndex: "is_ban_login",
      render: (text: number) =>
        text === 0 ? <span>NO</span> : <span>YES</span>,
    },
    {
      title: "Operation",
      key: "action",
      fixed: "right",
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <PerButton
            type="link"
            text="Edit"
            class="b-link c-red"
            icon={null}
            p="admin-user-cud"
            onClick={() => {
              setCid(Number(record.id));
              setUpdateVisible(true);
            }}
            disabled={null}
          />
          <div className="form-column"></div>
          <PerButton
            type="link"
            text="Delete"
            class="b-link c-red"
            icon={null}
            p="admin-user-cud"
            onClick={() => delUser(record.id)}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, [refresh, page, size, role_ids]);

  const getData = () => {
    setLoading(true);
    adminUser.adminUserList(page, size, name, role_ids[0]).then((res: any) => {
      setList(res.data.data);
      setRoles(res.data.roles);
      setUserRoleIds(res.data.user_role_ids);
      setTotal(res.data.total);
      setLoading(false);
    });
  };

  const resetData = () => {
    setName("");
    setPage(1);
    setSize(10);
    setList([]);
    setRefresh(!refresh);
  };

  const paginationProps = {
    current: page, //当前页码
    pageSize: size,
    total: total, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange(page, pageSize), //改变页码的函数
    showSizeChanger: true,
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  const delUser = (id: any) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "OperationConfirmed ",
      icon: <ExclamationCircleFilled />,
      content: "Confirmed delete this person?",
      centered: true,
      okText: "Confirmed ",
      cancelText: "Cancel",
      onOk() {
        adminUser.destroyAdminUser(id).then((res: any) => {
          message.success("Successful operation");
          setRefresh(!refresh);
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const delAdminRole = () => {
    if (role_ids.length === 0) {
      return;
    }
    confirm({
      title: "OperationConfirmed ",
      icon: <ExclamationCircleFilled />,
      content: "Delete this role will simultaneously DeleteAdmin corresponding to the associated permissions, Confirmed Delete?",
      centered: true,
      okText: "Confirmed ",
      cancelText: "Cancel",
      onOk() {
        adminRole.destroyAdminRole(role_ids[0]).then((res: any) => {
          message.success("Successful operation");
          setRefresh(!refresh);
          setRoleDelSuccess(!roleDelSuccess);
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <>
      <div className="tree-main-body">
        <div className="left-box">
          <TreeAdminroles
            roleDelSuccess={roleDelSuccess}
            refresh={refresh}
            type=""
            text={" Admin"}
            onUpdate={(keys: any, title: any) => {
              setRoleIds(keys);
              setLabel(title);
            }}
          />
        </div>
        <div className="right-box">
          <div className="d-flex playedu-main-title float-left mb-24">
            {selLabel}
          </div>
          <div className="float-left j-b-flex mb-24">
            <div className="d-flex">
              <PerButton
                type="primary"
                text="AddAdmin"
                class="mr-16"
                icon={<PlusOutlined />}
                p="admin-user-cud"
                onClick={() => setCreateVisible(true)}
                disabled={null}
              />
              {role_ids.length === 0 && (
                <PerButton
                  text="Create a new role"
                  icon={null}
                  class="mr-16"
                  type="default"
                  p="admin-role"
                  onClick={() => setCreateRoleVisible(true)}
                  disabled={null}
                />
              )}
              {role_ids.length > 0 && (
                <>
                  <PerButton
                    text="Role Permissions"
                    icon={null}
                    class="mr-16"
                    type="default"
                    p="admin-role"
                    onClick={() => {
                      setUpdateRoleVisible(true);
                    }}
                    disabled={null}
                  />
                  <PerButton
                    text="Delete Role"
                    icon={null}
                    class="mr-16"
                    type="default"
                    p="admin-role"
                    onClick={() => {
                      delAdminRole();
                    }}
                    disabled={null}
                  />
                </>
              )}
            </div>
            <div className="d-flex">
              <div className="d-flex mr-24">
                <Typography.Text>AdminName：</Typography.Text>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  allowClear
                  style={{ width: 160 }}
                  placeholder="Please enterAdminName"
                />
              </div>
              <div className="d-flex">
                <Button className="mr-16" onClick={resetData}>
                  reset
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setPage(1);
                    setRefresh(!refresh);
                  }}
                >
                  search
                </Button>
              </div>
            </div>
          </div>
          <div className="float-left">
            <Table
              columns={columns}
              dataSource={list}
              loading={loading}
              pagination={paginationProps}
              rowKey={(record) => record.id}
            />
            <SystemAdministratorCreate
              refresh={refresh}
              roleId={role_ids[0]}
              open={createVisible}
              onCancel={() => {
                setCreateVisible(false);
                setRefresh(!refresh);
              }}
            />
            <SystemAdministratorUpdate
              id={cid}
              refresh={refresh}
              open={updateVisible}
              onCancel={() => {
                setUpdateVisible(false);
                setRefresh(!refresh);
              }}
            />
            <SystemAdminrolesCreate
              open={createRoleVisible}
              onCancel={() => {
                setCreateRoleVisible(false);
                setRefresh(!refresh);
              }}
            />
            <SystemAdminrolesUpdate
              id={role_ids[0]}
              open={updateRoleVisible}
              onCancel={() => {
                setUpdateRoleVisible(false);
                setRefresh(!refresh);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemAdministratorPage;
