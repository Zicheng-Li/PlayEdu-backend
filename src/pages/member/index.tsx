import React, { useState, useEffect } from "react";
import {
  Typography,
  Input,
  Modal,
  Button,
  Space,
  Table,
  message,
  Image,
  Dropdown,
} from "antd";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
// import styles from "./index.module.less";
import {
  PlusOutlined,
  DownOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { user } from "../../api/index";
import { dateFormat } from "../../utils/index";
import { Link, Navigate } from "react-router-dom";
import { TreeDepartment, PerButton } from "../../compenents";
import { MemberCreate } from "./compenents/create";
import { MemberUpdate } from "./compenents/update";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
  email: string;
  created_at: string;
  credit1: number;
  id_card: string;
  is_lock: number;
}

const MemberPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dep_ids, setDepIds] = useState<any>([]);
  const [selLabel, setLabel] = useState<string>("All Department");
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [mid, setMid] = useState<number>(0);
  const [user_dep_ids, setUserDepIds] = useState<any>({});
  const [departments, setDepartments] = useState<any>({});

  const columns: ColumnsType<DataType> = [
    {
      title: "student",
      dataIndex: "name",
      render: (_, record: any) => (
        <>
          <Image
            style={{ borderRadius: "50%" }}
            src={record.avatar}
            preview={false}
            width={40}
            height={40}
          />
          <span className="ml-8">{record.name}</span>
        </>
      ),
    },
    {
      title: "Affiliated Department",
      dataIndex: "id",
      render: (id: number) => (
        <div className="float-left">
          {user_dep_ids[id] &&
            user_dep_ids[id].map((item: any, index: number) => {
              return (
                <span key={index}>
                  {index === user_dep_ids[id].length - 1
                    ? departments[item]
                    : departments[item] + "、"}
                </span>
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
      title: "Join Time",
      dataIndex: "created_at",
      render: (text: string) => <span>{dateFormat(text)}</span>,
    },
    {
      title: "Operation",
      key: "action",
      fixed: "right",
      width: 160,
      render: (_, record: any) => {
        const items: MenuProps["items"] = [
          {
            key: "1",
            label: (
              <PerButton
                type="link"
                text="Edit"
                class="b-link c-red"
                icon={null}
                p="user-update"
                onClick={() => {
                  setMid(Number(record.id));
                  setUpdateVisible(true);
                }}
                disabled={null}
              />
            ),
          },
          {
            key: "2",
            label: (
              <PerButton
                type="link"
                text="Delete"
                class="b-link c-red"
                icon={null}
                p="user-destroy"
                onClick={() => delUser(record.id)}
                disabled={null}
              />
            ),
          },
        ];

        return (
          <Space size="small">
            <Link
              style={{ textDecoration: "none" }}
              to={`/member/learn?id=${record.id}&name=${record.name}`}
            >
              <PerButton
                type="link"
                text="Study"
                class="b-link c-red"
                icon={null}
                p="user-learn"
                onClick={() => null}
                disabled={null}
              />
            </Link>
            <div className="form-column"></div>
            <Dropdown menu={{ items }}>
              <Button
                type="link"
                className="b-link c-red"
                onClick={(e) => e.preventDefault()}
              >
                <Space size="small" align="center">
                  More
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, [refresh, page, size, dep_ids]);

  const getData = () => {
    let depIds = dep_ids.join(",");
    setLoading(true);
    user
      .userList(page, size, {
        name: nickname,
        email: email,
        id_card: "",
        dep_ids: depIds,
      })
      .then((res: any) => {
        setList(res.data.data);
        setDepartments(res.data.departments);
        setUserDepIds(res.data.user_dep_ids);
        setTotal(res.data.total);
        setLoading(false);
      });
  };

  const resetData = () => {
    setNickname("");
    setEmail("");
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

  const delUser = (id: number) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "OperationConfirmed ",
      icon: <ExclamationCircleFilled />,
      content: "Confirmed Delete此student？",
      centered: true,
      okText: "Confirmed ",
      cancelText: "Cancel",
      onOk() {
        user.destroyUser(id).then((res: any) => {
          message.success("Successful operation");
          setRefresh(!refresh);
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
          <TreeDepartment
            refresh={refresh}
            showNum={true}
            type=""
            text={"Department"}
            onUpdate={(keys: any, title: any) => {
              setDepIds(keys);
              var index = title.indexOf("(");
              if (index !== -1) {
                var resolve = title.substring(0, index);
                setLabel(resolve);
              } else {
                setLabel(title);
              }
            }}
          />
        </div>
        <div className="right-box">
          <div className="playedu-main-title float-left mb-24">
            student | {selLabel}
          </div>
          <div className="float-left j-b-flex mb-24">
            <div className="d-flex">
              <PerButton
                type="primary"
                text="Add student"
                class="mr-16"
                icon={<PlusOutlined />}
                p="user-store"
                onClick={() => setCreateVisible(true)}
                disabled={null}
              />
              {dep_ids.length === 0 && (
                <Link style={{ textDecoration: "none" }} to={`/member/import`}>
                  <PerButton
                    type="default"
                    text="Bulk Import Student"
                    class="mr-16"
                    icon={null}
                    p="user-store"
                    onClick={() => null}
                    disabled={null}
                  />
                </Link>
              )}
              {dep_ids.length > 0 && (
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/member/departmentUser?id=${dep_ids.join(
                    ","
                  )}&title=${selLabel}`}
                >
                  <PerButton
                    type="default"
                    text="DepartmentstudentProgress"
                    class="mr-16"
                    icon={null}
                    p="department-user-learn"
                    onClick={() => null}
                    disabled={null}
                  />
                </Link>
              )}
            </div>
            <div className="d-flex">
              <div className="d-flex mr-24">
                <Typography.Text>Name：</Typography.Text>
                <Input
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="Please enterName关键字"
                  allowClear
                />
              </div>
              <div className="d-flex mr-24">
                <Typography.Text>Email：</Typography.Text>
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="Please enterEmail账号"
                  allowClear
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
            <MemberCreate
              open={createVisible}
              depIds={dep_ids}
              onCancel={() => {
                setCreateVisible(false);
                setRefresh(!refresh);
              }}
            />
            <MemberUpdate
              id={mid}
              open={updateVisible}
              onCancel={() => {
                setUpdateVisible(false);
                setRefresh(!refresh);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberPage;
