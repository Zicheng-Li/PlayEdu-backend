import { useEffect, useState } from "react";
import { Modal, Table, message, Space } from "antd";
import { resource } from "../../../api";
// import styles from "./index.module.less";
import { ExclamationCircleFilled } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { dateFormat } from "../../../utils/index";
import { TreeCategory, DurationText, PerButton } from "../../../compenents";
import { UploadVideoButton } from "../../../compenents/upload-video-button";

const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
  created_at: string;
  disk: string;
}

const ResourceVideosPage = () => {
  const [videoList, setVideoList] = useState<any>([]);
  const [videosExtra, setVideoExtra] = useState<any>([]);
  const [adminUsers, setAdminUsers] = useState<any>({});
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [category_ids, setCategoryIds] = useState<any>([]);
  const [selLabel, setLabel] = useState<string>("All Videos");

  const columns: ColumnsType<DataType> = [
    // {
    //   title: "封面",
    //   dataIndex: "id",
    //   render: (id: string) => (
    //     <Image
    //       preview={false}
    //       width={120}
    //       height={80}
    //       src={videosExtra[id].poster}
    //     ></Image>
    //   ),
    // },
    {
      title: "Video Name",
      dataIndex: "name",
      render: (text: string) => (
        <div className="d-flex">
          <i
            className="iconfont icon-icon-video"
            style={{
              fontSize: 16,
              color: "rgba(0,0,0,0.3)",
            }}
          />
          <span className="ml-8">{text}</span>
        </div>
      ),
    },
    {
      title: "Video Duration",
      dataIndex: "id",
      render: (id: string) => (
        <DurationText duration={videosExtra[id].duration}></DurationText>
      ),
    },
    {
      title: "Creator",
      dataIndex: "admin_id",
      render: (text: number) =>
        JSON.stringify(adminUsers) !== "{}" && <span>{adminUsers[text]}</span>,
    },
    {
      title: "Video Duration",
      dataIndex: "created_at",
      render: (text: string) => <span>{dateFormat(text)}</span>,
    },
    {
      title: "Operation",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record: any) => (
        <Space size="small">
          <PerButton
            type="link"
            text="Delete"
            class="b-link c-red"
            icon={null}
            p="resource-destroy"
            onClick={() => removeResource(record.id)}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  // DeletePictures 
  const removeResource = (id: number) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "Operation Confirmed",
      icon: <ExclamationCircleFilled />,
      content: "Confirmed delete this video?",
      centered: true,
      okText: "Confirmed ",
      cancelText: "Cancel",
      onOk() {
        resource.destroyResource(id).then(() => {
          message.success("Deleted successfully");
          resetVideoList();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // 获取视频列表
  const getVideoList = () => {
    setLoading(true);
    let categoryIds = category_ids.join(",");
    resource
      .resourceList(page, size, "", "", "", "VIDEO", categoryIds)
      .then((res: any) => {
        setTotal(res.data.result.total);
        setVideoList(res.data.result.data);
        setVideoExtra(res.data.videos_extra);
        setAdminUsers(res.data.admin_users);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log("error,", err);
      });
  };
  // 重置列表
  const resetVideoList = () => {
    setPage(1);
    setSize(10);
    setVideoList([]);
    setRefresh(!refresh);
  };

  // 加载视频列表
  useEffect(() => {
    getVideoList();
  }, [category_ids, refresh, page, size]);

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

  return (
    <>
      <div className="tree-main-body">
        <div className="left-box">
          <TreeCategory
            type="no-cate"
            text={" Video"}
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
        <div className="right-box">
          <div className="d-flex playedu-main-title float-left mb-24">
          Video | {selLabel}
          </div>
          <div className="float-left mb-24">
            <UploadVideoButton
              categoryIds={category_ids}
              onUpdate={() => {
                resetVideoList();
              }}
            ></UploadVideoButton>
          </div>
          <div className="float-left">
            <Table
              columns={columns}
              dataSource={videoList}
              loading={loading}
              pagination={paginationProps}
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceVideosPage;
