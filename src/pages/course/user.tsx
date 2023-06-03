import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Typography,
  Input,
  Table,
  message,
  Image,
} from "antd";
import { course as Course } from "../../api";
import { useParams, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { BackBartment } from "../../compenents";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PerButton } from "../../compenents";
import { dateFormat } from "../../utils/index";

const { confirm } = Modal;

interface DataType {
  id: React.Key;
  title: string;
  created_at: string;
  thumb: string;
  charge: number;
  is_show: number;
}

const CourseUserPage = () => {
  const params = useParams();
  const result = new URLSearchParams(useLocation().search);
  const [list, setList] = useState<any>([]);
  const [course, setCourse] = useState<any>({});
  const [records, setRecords] = useState<any>({});
  const [hourCount, setHourCount] = useState<any>({});
  const [userDepIds, setUserDepIds] = useState<any>({});
  const [departments, setDepartments] = useState<any>({});
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [idCard, setIdCard] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [title, setTitle] = useState<string>(String(result.get("title")));

  const columns: ColumnsType<DataType> = [
    {
      title: "student",
      render: (_, record: any) => (
        <div className="d-flex">
          <Image
            style={{ borderRadius: "50%" }}
            preview={false}
            width={40}
            height={40}
            src={record.avatar}
          ></Image>
          <span className="ml-8">{record.name}</span>
        </div>
      ),
    },
    {
      title: "Email",
      render: (_, record: any) => <span>{record.email}</span>,
    },
    {
      title: "Department",
      render: (_, record: any) => (
        <div className="float-left">
          {userDepIds[record.id] &&
            userDepIds[record.id].map((item: any, index: number) => {
              return (
                <span key={index}>
                  {index === userDepIds[record.id].length - 1
                    ? departments[item]
                    : departments[item] + "、"}
                </span>
              );
            })}
        </div>
      ),
    },
    {
      title: "Class Progress",
      dataIndex: "progress",
      render: (_, record: any) => (
        <span>
          Completed Class:
          {(records[record.id] && records[record.id].finished_count) ||
            0} /{" "}
          {(records[record.id] && records[record.id].hour_count) ||
            course.class_hour}
        </span>
      ),
    },
    {
      title: "First Study time",
      dataIndex: "created_at",
      render: (_, record: any) => (
        <>
          {records[record.id] ? (
            <span>{dateFormat(records[record.id].created_at)}</span>
          ) : hourCount[record.id] ? (
            <span>{dateFormat(hourCount[record.id])}</span>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "Study completion time",
      dataIndex: "finished_at",
      render: (_, record: any) => (
        <>
          {records[record.id] ? (
            <span>{dateFormat(records[record.id].finished_at)}</span>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "Study Progress",
      dataIndex: "progress",
      render: (_, record: any) => (
        <>
          {records[record.id] ? (
            <span
              className={
                Math.floor(
                  (records[record.id].finished_count /
                    records[record.id].hour_count) *
                    100
                ) >= 100
                  ? "c-green"
                  : "c-red"
              }
            >
              {Math.floor(
                (records[record.id].finished_count /
                  records[record.id].hour_count) *
                  100
              )}
              %
            </span>
          ) : hourCount[record.id] ? (
            <span className="c-red">1%</span>
          ) : (
            <span className="c-red">0%</span>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    getList();
  }, [params.courseId, refresh, page, size]);

  const getList = () => {
    setLoading(true);
    Course.courseUser(
      Number(params.courseId),
      page,
      size,
      "",
      "",
      name,
      email,
      idCard
    )
      .then((res: any) => {
        setTotal(res.data.total);
        setList(res.data.data);
        setHourCount(res.data.user_course_hour_user_first_at);
        setRecords(res.data.user_course_records);
        setCourse(res.data.course);
        setDepartments(res.data.departments);
        setUserDepIds(res.data.user_dep_ids);
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
    setName("");
    setEmail("");
    setIdCard("");
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

  // Deletestudent
  const delItem = () => {
    if (selectedRowKeys.length === 0) {
      message.error("Please select student to reset");
      return;
    }
    confirm({
      title: "OperationConfirmed ",
      icon: <ExclamationCircleFilled />,
      content: "Confirmed Reset selected student record?",
      centered: true,
      okText: "Confirmed ",
      cancelText: "Cancel",
      onOk() {
        Course.destroyCourseUser(Number(params.courseId), selectedRowKeys).then(
          () => {
            message.success("Delete Successfully");
            resetList();
          }
        );
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <>
      <Row className="playedu-main-body">
        <Col span={24}>
          <div className="float-left mb-24">
            <BackBartment title={title || "Online class student"} />
          </div>
          <div className="float-left j-b-flex mb-24">
            <div className="d-flex">
              <PerButton
                type="primary"
                text="Reset Study records"
                class="mr-16"
                icon={null}
                p="course"
                onClick={() => delItem()}
                disabled={selectedRowKeys.length === 0}
              />
            </div>
            <div className="d-flex">
              <div className="d-flex mr-24">
                <Typography.Text>studentName：</Typography.Text>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  allowClear
                  style={{ width: 160 }}
                  placeholder="Please enter Name keyword"
                />
              </div>
              <div className="d-flex mr-24">
                <Typography.Text>studentEmail：</Typography.Text>
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  allowClear
                  style={{ width: 160 }}
                  placeholder="Please enter student Email"
                />
              </div>
              {/* <div className="d-flex mr-24">
                <Typography.Text>ID：</Typography.Text>
                <Input
                  value={idCard}
                  onChange={(e) => {
                    setIdCard(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="Please enterID"
                />
              </div> */}
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
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              columns={columns}
              dataSource={list}
              loading={loading}
              pagination={paginationProps}
              rowKey={(record) => record.id}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};
export default CourseUserPage;
