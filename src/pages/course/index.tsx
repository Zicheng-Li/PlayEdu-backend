import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Image,
  Table,
  Typography,
  Input,
  message,
  Space,
  Tabs,
  Dropdown,
} from "antd";
import { course } from "../../api";
// import styles from "./index.module.less";
import {
  PlusOutlined,
  DownOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { dateFormat } from "../../utils/index";
import { useNavigate } from "react-router-dom";
import { TreeDepartment, TreeCategory, PerButton } from "../../compenents";
import type { TabsProps } from "antd";
import { CourseCreate } from "./compenents/create";
import { CourseUpdate } from "./compenents/update";
import { CourseHourUpdate } from "./compenents/hour-update";

const { confirm } = Modal;

interface DataType {
  id: React.Key;
  title: string;
  created_at: string;
  thumb: string;
  charge: number;
  is_show: number;
}

const CoursePage = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [category_ids, setCategoryIds] = useState<any>([]);
  const [title, setTitle] = useState<string>("");
  const [dep_ids, setDepIds] = useState<any>([]);
  const [selLabel, setLabel] = useState<string>("All categories");
  const [selDepLabel, setDepLabel] = useState<string>("All Department");
  const [course_category_ids, setCourseCategoryIds] = useState<any>({});
  const [course_dep_ids, setCourseDepIds] = useState<any>({});
  const [categories, setCategories] = useState<any>({});
  const [departments, setDepartments] = useState<any>({});
  const [tabKey, setTabKey] = useState(1);

  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [updateHourVisible, setHourUpdateVisible] = useState<boolean>(false);
  const [cid, setCid] = useState<number>(0);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `categories`,
      children: (
        <div className="float-left">
          <TreeCategory
            type=""
            text={" categories"}
            onUpdate={(keys: any, title: any) => {
              setCategoryIds(keys);
              if (typeof title === "string") {
                setLabel(title);
              } else {
                setLabel(title.props.children[0]);
              }
            }}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: `Department`,
      children: (
        <div className="float-left">
          <TreeDepartment
            refresh={refresh}
            showNum={false}
            type="no-course"
            text={" Department"}
            onUpdate={(keys: any, title: any) => {
              setDepIds(keys);
              setDepLabel(title);
            }}
          />
        </div>
      ),
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: "Course Name",
      width: 350,
      render: (_, record: any) => (
        <div className="d-flex">
          <Image
            preview={false}
            width={80}
            height={60}
            style={{ borderRadius: 6 }}
            src={record.thumb}
          ></Image>
          <span className="ml-8">{record.title}</span>
        </div>
      ),
    },
    {
      title: "Course Categories",
      dataIndex: "id",
      render: (id: number) => (
        <div className="float-left">
          {course_category_ids[id].map((item: any, index: number) => {
            return (
              <span key={index}>
                {index === course_category_ids[id].length - 1
                  ? categories[item]
                  : categories[item] + "、"}
              </span>
            );
          })}
        </div>
      ),
    },
    {
      title: "assign Department",
      dataIndex: "id",
      render: (id: number) => (
        <div className="float-left">
          {course_dep_ids[id] &&
            course_dep_ids[id].map((item: any, index: number) => {
              return (
                <span key={index}>
                  {index === course_dep_ids[id].length - 1
                    ? departments[item]
                    : departments[item] + "、"}
                </span>
              );
            })}
          {!course_dep_ids[id] && <span>All Department</span>}
        </div>
      ),
    },
    {
      title: "Compulsory / Elective",
      dataIndex: "is_required",
      render: (is_required: number) => (
        <span>{is_required === 1 ? "Mandatory" : "Elective"}</span>
      ),
    },
    {
      title: "Creation time",
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
              <Button
                type="link"
                size="small"
                className="b-n-link c-red"
                onClick={() => {
                  setCid(Number(record.id));
                  setUpdateVisible(true);
                }}
              >
                Edit
              </Button>
            ),
          },
          {
            key: "2",
            label: (
              <Button
                style={{ verticalAlign: "middle" }}
                type="link"
                size="small"
                className="b-n-link c-red"
                onClick={() => {
                  setCid(Number(record.id));
                  setHourUpdateVisible(true);
                }}
              >
                Class
              </Button>
            ),
          },
          {
            key: "3",
            label: (
              <Button
                type="link"
                size="small"
                className="b-n-link c-red"
                onClick={() => delItem(record.id)}
              >
                Delete
              </Button>
            ),
          },
        ];

        return (
          <Space size="small">
            <PerButton
              type="link"
              text="student"
              class="b-link c-red"
              icon={null}
              p="course"
              onClick={() => {
                setCid(Number(record.id));
                navigate(
                  "/course/user/" + Number(record.id) + "?title=" + record.title
                );
              }}
              disabled={null}
            />
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

  // DeleteClass 
  const delItem = (id: number) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "OperationConfirmed ",
      icon: <ExclamationCircleFilled />,
      content: "Confirmed Delete this class?",
      centered: true,
      okText: "Confirmed ",
      cancelText: "Cancel",
      onOk() {
        course.destroyCourse(id).then(() => {
          message.success("Delete successfully");
          resetList();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // 获取列表
  const getList = () => {
    setLoading(true);
    let categoryIds = "";
    let depIds = "";
    if (tabKey === 1) {
      categoryIds = category_ids.join(",");
    } else {
      depIds = dep_ids.join(",");
    }
    course
      .courseList(page, size, "", "", title, depIds, categoryIds)
      .then((res: any) => {
        setTotal(res.data.total);
        setList(res.data.data);
        setCourseCategoryIds(res.data.course_category_ids);
        setCourseDepIds(res.data.course_dep_ids);
        setCategories(res.data.categories);
        setDepartments(res.data.departments);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log("error,", err);
      });
  };
  // 重置列表
  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setTitle("");
    setRefresh(!refresh);
  };

  // 加载列表
  useEffect(() => {
    getList();
  }, [category_ids, dep_ids, refresh, page, size, tabKey]);

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

  const onChange = (key: string) => {
    setTabKey(Number(key));
  };

  return (
    <>
      <div className="tree-main-body">
        <div className="left-box">
          <Tabs
            defaultActiveKey="1"
            centered
            tabBarGutter={55}
            items={items}
            onChange={onChange}
          />
        </div>
        <div className="right-box">
          <div className="playedu-main-title float-left mb-24">
            class | {tabKey === 1 ? selLabel : selDepLabel}
          </div>
          <div className="float-left j-b-flex mb-24">
            <div className="d-flex">
              <PerButton
                type="primary"
                text="New Course"
                class="mr-16"
                icon={<PlusOutlined />}
                p="course"
                onClick={() => setCreateVisible(true)}
                disabled={null}
              />
            </div>
            <div className="d-flex">
              <div className="d-flex mr-24">
                <Typography.Text>Course Name:</Typography.Text>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  allowClear
                  style={{ width: 160 }}
                  placeholder="Please enter key words"
                />
              </div>
              <div className="d-flex">
                <Button className="mr-16" onClick={resetList}>
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
            <CourseCreate
              cateIds={tabKey === 1 ? category_ids : []}
              depIds={tabKey === 2 ? dep_ids : []}
              open={createVisible}
              onCancel={() => {
                setCreateVisible(false);
                setRefresh(!refresh);
              }}
            />
            <CourseHourUpdate
              id={cid}
              open={updateHourVisible}
              onCancel={() => {
                setHourUpdateVisible(false);
                setRefresh(!refresh);
              }}
            />
            <CourseUpdate
              id={cid}
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

export default CoursePage;
