import { useState, useEffect, useRef } from "react";
import styles from "./learn.module.less";
import { Row, Image, Table, Button, Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { BackBartment, DurationText } from "../../compenents";
import { dateFormat } from "../../utils/index";
import { user as member } from "../../api/index";
import * as echarts from "echarts";
import type { ColumnsType } from "antd/es/table";
import { MemberLearnProgressDialog } from "./compenents/progress";

interface DataType {
  id: React.Key;
  title: string;
  type: string;
  created_at: string;
  total_duration: number;
  finished_duration: number;
  is_finished: boolean;
}

const MemberLearnPage = () => {
  let chartRef = useRef(null);
  const navigate = useNavigate();
  const result = new URLSearchParams(useLocation().search);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [list2, setList2] = useState<any>([]);
  const [courses, setCourses] = useState<any>({});
  const [deps, setDeps] = useState<any>([]);
  const [depValue, setDepValue] = useState<number>(0);
  const [currentCourses, setCurrentCourses] = useState<any>([]);
  const [openCourses, setOpenCourses] = useState<any>([]);
  const [records, setRecords] = useState<any>({});
  const [hourCount, setHourCount] = useState<any>({});
  const [total2, setTotal2] = useState(0);
  const [refresh2, setRefresh2] = useState(false);
  const [uid, setUid] = useState(Number(result.get("id")));
  const [userName, setUserName] = useState<string>(String(result.get("name")));
  const [visiable, setVisiable] = useState(false);
  const [courseId, setcourseId] = useState<number>(0);

  useEffect(() => {
    setUid(Number(result.get("id")));
    setUserName(String(result.get("name")));
    setLoading2(false);
    setRefresh2(!refresh2);
  }, [result.get("id"), result.get("name")]);

  useEffect(() => {
    getZxtData();
    return () => {
      window.onresize = null;
    };
  }, [uid]);

  useEffect(() => {
    getLearnCourses();
  }, [refresh2, uid]);

  useEffect(() => {
    if (depValue === 0) {
      return;
    }
    let arr = [...courses[depValue]];
    let arr2 = [...openCourses];
    if (arr2.length > 0) {
      var data = arr.concat(arr2);
      setCurrentCourses(data);
    } else {
      setCurrentCourses(arr);
    }
  }, [depValue]);

  const getZxtData = () => {
    member.learnStats(uid).then((res: any) => {
      renderView(res.data);
    });
  };

  const minuteFormat = (duration: number) => {
    if (duration === 0) {
      return "0小时0分0秒";
    }
    let h = Math.trunc(duration / 3600);
    let m = Math.trunc((duration % 3600) / 60);
    let s = Math.trunc((duration % 3600) % 60);
    return h + "小时" + m + "分" + s + "秒";
  };

  const renderView = (params: any) => {
    const timeData: any = [];
    const valueData: any = [];
    params.map((item: any) => {
      timeData.push(item.key);
      valueData.push(item.value / 1000);
    });
    let dom: any = chartRef.current;
    let myChart = echarts.init(dom);
    myChart.setOption({
      tooltip: {
        trigger: "axis",
        formatter: function (params: any) {
          //  只粘贴formatter了
          let relVal = params[0].axisValueLabel;
          for (let i = 0; i < params.length; i++) {
            relVal +=
              "<br/>" +
              params[i].marker +
              params[i].seriesName +
              ":  " +
              minuteFormat(params[i].value);
          }
          return relVal;
        },
      },
      legend: {
        data: ["每日Study时长"],
        x: "right",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: timeData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "每日Study时长",
          type: "line",
          data: valueData,
          color: "#ff4d4f",
        },
      ],
    });
    window.onresize = () => {
      myChart.resize();
    };
  };

  const getLearnCourses = () => {
    if (loading2) {
      return;
    }
    setLoading2(true);
    member.learnAllCourses(uid).then((res: any) => {
      setList2(res.data.departments);
      setCourses(res.data.dep_courses);
      setOpenCourses(res.data.open_courses);
      setHourCount(res.data.user_course_hour_count);
      setRecords(res.data.user_course_records);
      if (res.data.departments.length > 0) {
        let box: any = [];
        res.data.departments.map((item: any) => {
          box.push({
            label: item.name,
            value: String(item.id),
          });
        });
        setDepValue(Number(box[0].value));
        setDeps(box);
      } else {
        setDepValue(0);
        setDeps([]);
      }
      setLoading2(false);
    });
  };

  const column2: ColumnsType<DataType> = [
    {
      title: "Course Name",
      dataIndex: "title",
      render: (_, record: any) => (
        <div className="d-flex">
          <Image
            src={record.thumb}
            preview={false}
            width={80}
            height={60}
            style={{ borderRadius: 6 }}
          />
          <span className="ml-8">{record.title}</span>
        </div>
      ),
    },
    {
      title: "Class Progress",
      dataIndex: "total_duration",
      render: (_, record: any) => (
        <>
          <span>
          Completed Class:
            {(records[record.id] && records[record.id].finished_count) ||
              0} / {record.class_hour}
          </span>
        </>
      ),
    },
    {
      title: "第一次Study时间",
      dataIndex: "created_at",
      render: (_, record: any) => (
        <>
          {records[record.id] ? (
            <span>{dateFormat(records[record.id].created_at)}</span>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "Study完成时间",
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
      dataIndex: "is_finished",
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
          ) : hourCount[record.id] && hourCount[record.id] > 0 ? (
            <span className="c-red">1%</span>
          ) : (
            <span className="c-red">0%</span>
          )}
        </>
      ),
    },
    {
      title: "Operation",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record: any) => (
        <Button
          type="link"
          className="b-link c-red"
          onClick={() => {
            setcourseId(record.id);
            setVisiable(true);
          }}
        >
          明细
        </Button>
      ),
    },
  ];

  return (
    <>
      <Row className="playedu-main-top mb-24">
        <MemberLearnProgressDialog
          open={visiable}
          uid={uid}
          id={courseId}
          onCancel={() => {
            setVisiable(false);
            setRefresh2(!refresh2);
          }}
        ></MemberLearnProgressDialog>
        <div className="float-left mb-24">
          <BackBartment title={userName + "的Study明细"} />
        </div>
        <div className={styles["charts"]}>
          <div
            ref={chartRef}
            style={{
              width: "100% !important",
              height: 300,
              position: "relative",
            }}
          ></div>
        </div>
        <div className="float-left mt-24">
          {list2.length > 1 && (
            <div className="d-flex mb-24">
              <span>切换Department：</span>
              <Select
                style={{ width: 160 }}
                allowClear
                placeholder="Please selectDepartment"
                value={String(depValue)}
                onChange={(value: string) => setDepValue(Number(value))}
                options={deps}
              />
            </div>
          )}
          <Table
            columns={column2}
            dataSource={currentCourses}
            loading={loading2}
            pagination={false}
            rowKey={(record) => record.id}
          />
        </div>
      </Row>
    </>
  );
};
export default MemberLearnPage;
