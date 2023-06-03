import { useEffect, useState } from "react";
import { Checkbox, Row, Col, Empty, message, Pagination } from "antd";
import { resource } from "../../api";
import styles from "./index.module.less";
import { UploadVideoButton } from "../upload-video-button";
import { DurationText, TreeCategory } from "../../compenents";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

const CheckboxGroup = Checkbox.Group;

interface VideoItem {
  id: number;
  category_id: number;
  name: string;
  duration: number;
}

interface PropsInterface {
  defaultCheckedList: any[];
  label: string;
  open: boolean;
  onSelected: (arr: any[], videos: []) => void;
}

export const UploadVideoSub = (props: PropsInterface) => {
  const [category_ids, setCategoryIds] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [videosExtra, setVideoExtra] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [plainOptions, setPlainOptions] = useState<any>([]);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  // 获取列表
  const getvideoList = (defaultKeys: any[]) => {
    let categoryIds = category_ids.join(",");
    resource
      .resourceList(page, size, "", "", "", "VIDEO", categoryIds)
      .then((res: any) => {
        setTotal(res.data.result.total);
        setVideoExtra(res.data.videos_extra);
        setVideoList(res.data.result.data);
        let data = res.data.result.data;
        const arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push({
            label: (
              <div className="d-flex">
                <i
                  className="iconfont icon-icon-video"
                  style={{
                    fontSize: 16,
                    color: "rgba(0,0,0,0.3)",
                  }}
                />
                <div className="video-title ml-8">{data[i].name}</div>
                <div className="video-time">
                  <DurationText
                    duration={res.data.videos_extra[data[i].id].duration}
                  ></DurationText>
                </div>
              </div>
            ),
            value: data[i].id,
            disabled: false,
          });
        }
        if (defaultKeys.length > 0 && arr.length > 0) {
          for (let i = 0; i < defaultKeys.length; i++) {
            for (let j = 0; j < arr.length; j++) {
              if (arr[j].value === defaultKeys[i]) {
                arr[j].disabled = true;
              }
            }
          }
        }
        setPlainOptions(arr);
      })
      .catch((err) => {
        console.log("error,", err);
      });
  };
  // 重置列表
  const resetVideoList = () => {
    setPage(1);
    setVideoList([]);
    setRefresh(!refresh);
  };

  // 加载列表
  useEffect(() => {
    const arr = [...props.defaultCheckedList];
    setCheckedList(arr);
    if (arr.length === 0) {
      setIndeterminate(false);
      setCheckAll(false);
    }
    getvideoList(arr);
  }, [props.open, props.defaultCheckedList, category_ids, refresh, page, size]);

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    const defalut = [...props.defaultCheckedList];
    let localKeys: any = [];
    list.map((item: any) => {
      if (defalut.indexOf(item) === -1) {
        localKeys.push(item);
      }
    });

    let arrVideos: any = [];

    for (let i = 0; i < localKeys.length; i++) {
      videoList.map((item: any, index: number) => {
        if (item.id === localKeys[i]) {
          arrVideos.push({
            name: item.name,
            type: item.type,
            rid: item.id,
            duration: videosExtra[item.id].duration,
            disabled: plainOptions[index].disabled,
          });
        }
      });
    }
    props.onSelected(localKeys, arrVideos);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const arr = plainOptions.map((item: any) => item.value);
    setCheckedList(e.target.checked ? arr : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    const defalut = [...props.defaultCheckedList];
    let localKeys: any = [];
    arr.map((item: any) => {
      if (defalut.indexOf(item) === -1) {
        localKeys.push(item);
      }
    });
    let arrVideos: any = [];
    for (let i = 0; i < localKeys.length; i++) {
      videoList.map((item: any, index: number) => {
        if (item.id === localKeys[i]) {
          arrVideos.push({
            name: item.name,
            type: item.type,
            rid: item.id,
            duration: videosExtra[item.id].duration,
            disabled: plainOptions[index].disabled,
          });
        }
      });
    }
    if (e.target.checked) {
      props.onSelected(localKeys, arrVideos);
    } else {
      props.onSelected([], []);
    }
  };

  return (
    <>
      <Row style={{ width: 752, minHeight: 520 }}>
        <Col span={7}>
          <TreeCategory
            type="no-cate"
            text={props.label}
            onUpdate={(keys: any) => setCategoryIds(keys)}
          />
        </Col>
        <Col span={17}>
          <Row style={{ marginBottom: 24, paddingLeft: 10 }}>
            <Col span={24}>
              <UploadVideoButton
                categoryIds={category_ids}
                onUpdate={() => {
                  resetVideoList();
                }}
              ></UploadVideoButton>
            </Col>
          </Row>
          <div className={styles["video-list"]}>
            {videoList.length === 0 && (
              <Col span={24} style={{ marginTop: 150 }}>
                <Empty description="No video yet" />
              </Col>
            )}
            {videoList.length > 0 && (
              <div className="list-select-column-box c-flex">
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                >
                  Select All
                </Checkbox>
                <CheckboxGroup
                  className="c-flex"
                  options={plainOptions}
                  value={checkedList}
                  onChange={onChange}
                />
              </div>
            )}
          </div>
          <Row
            style={{
              paddingLeft: 10,
            }}
          >
            {videoList.length > 0 && total > 10 && (
              <Col
                span={24}
                style={{ display: "flex", flexDirection: "row-reverse" }}
              >
                <Pagination
                  onChange={(currentPage, currentSize) => {
                    setPage(currentPage);
                    setSize(currentSize);
                  }}
                  defaultCurrent={page}
                  total={total}
                />
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </>
  );
};
