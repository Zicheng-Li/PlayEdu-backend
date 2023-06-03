import React, { useState, useEffect } from "react";
import { Space, Button, Drawer, Form, Input, Modal, message } from "antd";
import styles from "./hour-update.module.less";
import { course, courseHour, courseChapter } from "../../../api/index";
import { SelectResource } from "../../../compenents";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { TreeHours } from "./hours";

const { confirm } = Modal;

interface PropInterface {
  id: number;
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const CourseHourUpdate: React.FC<PropInterface> = ({
  id,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [chapterType, setChapterType] = useState(0);
  const [chapters, setChapters] = useState<any>([]);
  const [hours, setHours] = useState<any>([]);
  const [chapterHours, setChapterHours] = useState<any>([]);
  const [videoVisible, setVideoVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [addvideoCurrent, setAddvideoCurrent] = useState(0);

  useEffect(() => {
    if (id === 0) {
      return;
    }
    getDetail();
  }, [id, open]);

  const getDetail = () => {
    course.course(id).then((res: any) => {
      let chapterType = res.data.chapters.length > 0 ? 1 : 0;
      setChapterType(chapterType);
      if (chapterType === 1) {
        setTreeData([]);
        setHours([]);
        let hours = res.data.hours;
        let chapters = res.data.chapters;
        const arr: any = [];
        const keys: any = [];
        for (let i = 0; i < chapters.length; i++) {
          arr.push({
            id: chapters[i].id,
            name: chapters[i].name,
            hours: resetHours(hours[chapters[i].id]).arr,
          });
          keys.push(resetHours(hours[chapters[i].id]).keys);
        }
        setChapters(arr);
        setChapterHours(keys);
      } else {
        setChapters([]);
        setChapterHours([]);
        let hours = res.data.hours;
        if (JSON.stringify(hours) !== "{}") {
          const arr: any = resetHours(hours[0]).arr;
          const keys: any = resetHours(hours[0]).keys;
          setTreeData(arr);
          setHours(keys);
        } else {
          setTreeData([]);
          setHours([]);
        }
      }
    });
  };

  const resetHours = (data: any) => {
    const arr: any = [];
    const keys: any = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        arr.push({
          duration: data[i].duration,
          type: data[i].type,
          name: data[i].title,
          rid: data[i].rid,
          id: data[i].id,
        });
        keys.push(data[i].rid);
      }
    }
    return { arr, keys };
  };

  const onFinish = (values: any) => {};

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const selectData = (arr: any, videos: any) => {
    const hours: any = [];
    for (let i = 0; i < videos.length; i++) {
      if (videos[i].disabled === false) {
        hours.push({
          chapter_id: 0,
          sort: i,
          title: videos[i].name,
          type: videos[i].type,
          duration: videos[i].duration,
          rid: videos[i].rid,
        });
      }
    }
    if (hours.length === 0) {
      message.error("Please select video");
      return;
    }
    courseHour
      .storeCourseHourMulti(id, hours)
      .then((res: any) => {
        console.log("ok");
        setVideoVisible(false);
        getDetail();
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const selectChapterData = (arr: any, videos: any) => {
    const data = [...chapters];
    if (!data[addvideoCurrent].id) {
      message.error("Failed to add class");
      return;
    }
    const hours: any = [];
    for (let i = 0; i < videos.length; i++) {
      if (videos[i].disabled === false) {
        hours.push({
          chapter_id: data[addvideoCurrent].id,
          sort: i,
          title: videos[i].name,
          type: videos[i].type,
          duration: videos[i].duration,
          rid: videos[i].rid,
        });
      }
    }
    if (hours.length === 0) {
      message.error("Please select video");
      return;
    }
    courseHour
      .storeCourseHourMulti(id, hours)
      .then((res: any) => {
        console.log("ok");
        setVideoVisible(false);
        getDetail();
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const delHour = (hid: number) => {
    const data = [...treeData];
    confirm({
      title: "Operation Confirmation",
      icon: <ExclamationCircleFilled />,
      content: "Confirm the deletion of this lesson?",
      centered: true,
      okText: "Confirmed",
      cancelText: "Cancel",
      onOk() {
        const index = data.findIndex((i: any) => i.rid === hid);
        let delId = data[index].id;
        if (index >= 0) {
          data.splice(index, 1);
        }
        if (data.length > 0) {
          setTreeData(data);
          const keys = data.map((item: any) => item.rid);
          setHours(keys);
        } else {
          setTreeData([]);
          setHours([]);
        }
        if (delId) {
          courseHour.destroyCourseHour(id, delId).then((res: any) => {
            console.log("ok");
          });
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const transHour = (arr: any) => {
    setHours(arr);
    const data = [...treeData];
    const newArr: any = [];
    const hourIds: any = [];
    for (let i = 0; i < arr.length; i++) {
      data.map((item: any) => {
        if (item.rid === arr[i]) {
          newArr.push(item);
          hourIds.push(item.id);
        }
      });
    }
    setTreeData(newArr);
    courseHour.transCourseHour(id, hourIds).then((res: any) => {
      console.log("ok");
    });
  };

  const addNewChapter = () => {
    const arr = [...chapters];
    const keys = [...chapterHours];
    arr.push({
      name: "",
      hours: [],
    });
    keys.push([]);
    setChapters(arr);
    setChapterHours(keys);
  };

  const setChapterName = (index: number, value: string) => {
    const arr = [...chapters];
    arr[index].name = value;
    setChapters(arr);
  };

  const saveChapterName = (index: number, value: string) => {
    const arr = [...chapters];
    if (arr[index].id) {
      courseChapter
        .updateCourseChapter(id, arr[index].id, value, arr.length)
        .then((res: any) => {
          console.log("ok");
          getDetail();
        })
        .catch((err) => {
          message.error(err.message);
        });
    } else {
      courseChapter
        .storeCourseChapter(id, value, arr.length)
        .then((res: any) => {
          console.log("ok");
          getDetail();
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };

  const delChapter = (index: number) => {
    const arr = [...chapters];
    const keys = [...chapterHours];
    confirm({
      title: "Operation Confirmation",
      icon: <ExclamationCircleFilled />,
      content: "Deleting a chapter will clear the class, confirm the deletion?",
      centered: true,
      okText: "Confirmed",
      cancelText: "Cancel",
      onOk() {
        if (arr[index].id) {
          courseChapter
            .destroyCourseChapter(id, arr[index].id)
            .then((res: any) => {
              console.log("ok");
              getDetail();
            })
            .catch((err) => {
              message.error(err.message);
            });
        }
      },
      onCancel() {},
    });
  };

  const delChapterHour = (index: number, hid: number) => {
    const keys = [...chapterHours];
    const data = [...chapters];
    confirm({
      title: "Operation Confirmation",
      icon: <ExclamationCircleFilled />,
      content: "Confirm deletion of this lesson?",
      centered: true,
      okText: "Confirmed ",
      cancelText: "Cancel",
      onOk() {
        const current = data[index].hours.findIndex((i: any) => i.rid === hid);
        let delId = data[index].hours[current].id;
        if (current >= 0) {
          data[index].hours.splice(current, 1);
        }
        if (data[index].hours.length > 0) {
          setChapters(data);
          keys[index] = data[index].hours.map((item: any) => item.rid);
          setChapterHours(keys);
        } else {
          keys[index] = [];
          data[index].hours = [];
          setChapters(data);
          setChapterHours(keys);
        }

        if (delId) {
          courseHour.destroyCourseHour(id, delId).then((res: any) => {
            console.log("ok");
          });
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const transChapterHour = (index: number, arr: any) => {
    const keys = [...chapterHours];
    keys[index] = arr;
    setChapterHours(keys);

    const data = [...chapters];
    const newArr: any = [];
    const hourIds: any = [];
    for (let i = 0; i < arr.length; i++) {
      data[index].hours.map((item: any) => {
        if (item.rid === arr[i]) {
          newArr.push(item);
          hourIds.push(item.id);
        }
      });
    }
    data[index].hours = newArr;
    setChapters(data);
    courseHour.transCourseHour(id, hourIds).then((res: any) => {
      console.log("ok");
    });
  };

  const changeChapterHours = (arr: any) => {
    const newArr: any = [];
    for (let i = 0; i < arr.length; i++) {
      arr[i].map((item: any) => {
        newArr.push(item);
      });
    }
    return newArr;
  };

  return (
    <>
      <Drawer
        title="Class Management"
        onClose={onCancel}
        maskClosable={false}
        open={open}
        width={634}
      >
        <div className={styles["top-content"]}>
          <p>1.Please be cautious as the adjustment of online class takes effect in a timely manner and the operation is irreversible.</p>
          <p>2.After the class adjustment, the existing learning progress will be recalculated when the students study.</p>
        </div>
        <div className="float-left mt-24">
          <SelectResource
            defaultKeys={
              chapterType === 0 ? hours : changeChapterHours(chapterHours)
            }
            open={videoVisible}
            onCancel={() => {
              setVideoVisible(false);
            }}
            onSelected={(arr: any, videos: any) => {
              if (chapterType === 0) {
                selectData(arr, videos);
              } else {
                selectChapterData(arr, videos);
              }
            }}
          />
          <Form
            form={form}
            name="hour-update-basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {chapterType === 0 && (
              <div className="c-flex">
                <Form.Item>
                  <div className="ml-42">
                    <Button
                      onClick={() => setVideoVisible(true)}
                      type="primary"
                    >
                      Add class
                    </Button>
                  </div>
                </Form.Item>
                <div className={styles["hous-box"]}>
                  {treeData.length === 0 && (
                    <span className={styles["no-hours"]}>
                      Please click the button above to add a class
                    </span>
                  )}
                  {treeData.length > 0 && (
                    <TreeHours
                      data={treeData}
                      onRemoveItem={(id: number) => {
                        delHour(id);
                      }}
                      onUpdate={(arr: any[]) => {
                        transHour(arr);
                      }}
                    />
                  )}
                </div>
              </div>
            )}
            {chapterType === 1 && (
              <div className="c-flex">
                {chapters.length > 0 &&
                  chapters.map((item: any, index: number) => {
                    return (
                      <div
                        key={item.hours.length + "Chapter" + index}
                        className={styles["chapter-item"]}
                      >
                        <div className="d-flex">
                          <div className={styles["label"]}>
                            Chapter{index + 1}：
                          </div>
                          <Input
                            value={item.name}
                            className={styles["input"]}
                            onChange={(e) => {
                              setChapterName(index, e.target.value);
                            }}
                            onBlur={(e) => {
                              saveChapterName(index, e.target.value);
                            }}
                            placeholder="Please enter the chapter name here"
                            allowClear
                          />
                          <Button
                            className="mr-16"
                            type="primary"
                            onClick={() => {
                              setVideoVisible(true);
                              setAddvideoCurrent(index);
                            }}
                          >
                            Add class
                          </Button>
                          <Button onClick={() => delChapter(index)}>
                            DeleteChapter
                          </Button>
                        </div>
                        <div className={styles["chapter-hous-box"]}>
                          {item.hours.length === 0 && (
                            <span className={styles["no-hours"]}>
                              Please click the button above to add class
                            </span>
                          )}
                          {item.hours.length > 0 && (
                            <TreeHours
                              data={item.hours}
                              onRemoveItem={(id: number) => {
                                delChapterHour(index, id);
                              }}
                              onUpdate={(arr: any[]) => {
                                transChapterHour(index, arr);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                <Form.Item>
                  <div className="ml-42">
                    <Button onClick={() => addNewChapter()}>Add Chapter</Button>
                  </div>
                </Form.Item>
              </div>
            )}
          </Form>
        </div>
      </Drawer>
    </>
  );
};
