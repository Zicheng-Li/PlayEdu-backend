import { useEffect, useState } from "react";
import { Button, Row, Modal, message, Tabs } from "antd";
import styles from "./index.module.less";
import { UploadVideoSub } from "../../compenents";
import type { TabsProps } from "antd";

interface VideoItem {
  id: number;
  category_id: number;
  name: string;
  duration: number;
}

interface PropsInterface {
  defaultKeys: any[];
  open: boolean;
  onSelected: (arr: any[], videos: any[]) => void;
  onCancel: () => void;
}

export const SelectResource = (props: PropsInterface) => {
  const [refresh, setRefresh] = useState(true);
  const [tabKey, setTabKey] = useState(1);
  const [selectKeys, setSelectKeys] = useState<any>([]);
  const [selectVideos, setSelectVideos] = useState<any>([]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Video`,
      children: (
        <div className="float-left">
          <UploadVideoSub
            label="Video"
            defaultCheckedList={props.defaultKeys}
            open={refresh}
            onSelected={(arr: any[], videos: any[]) => {
              setSelectKeys(arr);
              setSelectVideos(videos);
            }}
          />
        </div>
      ),
    },
  ];

  const onChange = (key: string) => {
    setTabKey(Number(key));
  };

  return (
    <>
      <Modal
        title="Resource Library"
        centered
        closable={false}
        onCancel={() => {
          setSelectKeys([]);
          setSelectVideos([]);
          props.onCancel();
        }}
        open={props.open}
        width={800}
        maskClosable={false}
        onOk={() => {
          props.onSelected(selectKeys, selectVideos);
          setSelectKeys([]);
          setSelectVideos([]);
        }}
      >
        <Row>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </Row>
      </Modal>
    </>
  );
};
