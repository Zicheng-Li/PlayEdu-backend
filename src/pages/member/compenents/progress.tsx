import { useState, useEffect } from "react";
import styles from "./progrss.module.less";
import { Table, Modal, message } from "antd";
import { PerButton, DurationText } from "../../../compenents";
import { user as member } from "../../../api/index";
import type { ColumnsType } from "antd/es/table";
import { dateFormat } from "../../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  title: string;
  type: string;
  created_at: string;
  duration: number;
  finished_duration: number;
  is_finished: boolean;
  finished_at: boolean;
}

interface PropInterface {
  open: boolean;
  uid: number;
  id: number;
  onCancel: () => void;
}

export const MemberLearnProgressDialog: React.FC<PropInterface> = ({
  open,
  uid,
  id,
  onCancel,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [records, setRecords] = useState<any>({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (open) {
      getData();
    }
  }, [uid, id, open, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    member.learnCoursesProgress(uid, id, {}).then((res: any) => {
      setList(res.data.hours);
      setRecords(res.data.learn_records);
      setLoading(false);
    });
  };

  const column: ColumnsType<DataType> = [
    {
      title: "ClassTitle",
      dataIndex: "title",

      render: (title: string) => (
        <>
          <span>{title}</span>
        </>
      ),
    },
    {
      title: "总时长",
      width: 120,
      dataIndex: "duration",
      render: (duration: number) => (
        <>
          <DurationText duration={duration}></DurationText>
        </>
      ),
    },
    {
      title: "已Study时长",
      width: 120,
      dataIndex: "finished_duration",
      render: (_, record: any) => (
        <>
          {records && records[record.id] ? (
            <span>
              <DurationText
                duration={records[record.id].finished_duration || 0}
              ></DurationText>
            </span>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "是否学完",
      width: 100,
      dataIndex: "is_finished",
      render: (_, record: any) => (
        <>
          {records &&
          records[record.id] &&
          records[record.id].is_finished === 1 ? (
            <span className="c-green">Studied </span>
          ) : (
            <span className="c-red">未学完</span>
          )}
        </>
      ),
    },
    {
      title: "开始时间",
      width: 150,
      dataIndex: "created_at",
      render: (_, record: any) => (
        <>
          {records && records[record.id] ? (
            <span>{dateFormat(records[record.id].created_at)}</span>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "学完时间",
      width: 150,
      dataIndex: "finished_at",
      render: (_, record: any) => (
        <>
          {records && records[record.id] ? (
            <span>{dateFormat(records[record.id].finished_at)}</span>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "Operation",
      key: "action",
      fixed: "right",
      width: 70,
      render: (_, record: any) => (
        <>
          {records && records[record.id] ? (
            <PerButton
              type="link"
              text="重置"
              class="b-link c-red"
              icon={null}
              p="user-learn-destroy"
              onClick={() => {
                clearSingleProgress(records[record.id].hour_id);
              }}
              disabled={null}
            />
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
  ];

  const clearProgress = () => {
    confirm({
      title: "OperationConfirmed ",
      icon: <ExclamationCircleFilled />,
      content: "Confirmed 重置此Class 下所有Class的Study记录？",
      centered: true,
      okText: "Confirmed ",
      cancelText: "Cancel",
      onOk() {
        member.destroyAllUserLearned(uid, id).then((res: any) => {
          message.success("Successful operation");
          setRefresh(!refresh);
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const clearSingleProgress = (hour_id: number) => {
    if (hour_id === 0) {
      return;
    }
    confirm({
      title: "OperationConfirmed ",
      icon: <ExclamationCircleFilled />,
      content: "Confirmed 重置此Class的Study记录？",
      centered: true,
      okText: "Confirmed ",
      cancelText: "Cancel",
      onOk() {
        member.destroyUserLearned(uid, id, hour_id).then((res: any) => {
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
      <Modal
        title="ClassStudy Progress"
        centered
        forceRender
        open={open}
        width={1000}
        onOk={() => onCancel()}
        onCancel={() => onCancel()}
        maskClosable={false}
        footer={null}
        okText="Confirm"
        cancelText="Cancel"
      >
        <div className="d-flex mt-24">
          <PerButton
            type="primary"
            text="重置Study记录"
            class="c-white"
            icon={null}
            p="user-learn-destroy"
            onClick={() => {
              clearProgress();
            }}
            disabled={null}
          />
        </div>
        <div
          className="d-flex mt-24"
          style={{ maxHeight: 800, overflowY: "auto" }}
        >
          <Table
            columns={column}
            dataSource={list}
            loading={loading}
            rowKey={(record) => record.id}
            pagination={false}
          />
        </div>
      </Modal>
    </>
  );
};
