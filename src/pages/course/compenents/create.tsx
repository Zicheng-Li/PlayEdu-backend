import React, { useState, useEffect } from "react";
import {
  Space,
  Radio,
  Button,
  Drawer,
  Form,
  Input,
  Modal,
  message,
  Image,
  TreeSelect,
} from "antd";
import styles from "./create.module.less";
import { useSelector } from "react-redux";
import { course, department } from "../../../api/index";
import { UploadImageButton, SelectResource } from "../../../compenents";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { TreeHours } from "./hours";

const { confirm } = Modal;

interface PropInterface {
  cateIds: any;
  depIds: any;
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  title: string;
  children?: Option[];
}

export const CourseCreate: React.FC<PropInterface> = ({
  cateIds,
  depIds,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const courseDefaultThumbs = useSelector(
    (state: any) => state.systemConfig.value.courseDefaultThumbs
  );
  const defaultThumb1 = courseDefaultThumbs[0];
  const defaultThumb2 = courseDefaultThumbs[1];
  const defaultThumb3 = courseDefaultThumbs[2];
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [thumb, setThumb] = useState<string>("");
  const [type, setType] = useState<string>("open");
  const [chapterType, setChapterType] = useState(0);
  const [chapters, setChapters] = useState<any>([]);
  const [hours, setHours] = useState<any>([]);
  const [chapterHours, setChapterHours] = useState<any>([]);
  const [videoVisible, setVideoVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [addvideoCurrent, setAddvideoCurrent] = useState(0);

  useEffect(() => {
    if (open) {
      getParams();
      getCategory();
    }
  }, [open, cateIds, depIds]);

  useEffect(() => {
    form.setFieldsValue({
      title: "",
      thumb: defaultThumb1,
      isRequired: 1,
      short_desc: "",
      hasChapter: 0,
    });
    setThumb(defaultThumb1);
    setChapterType(0);
    setChapters([]);
    setChapterHours([]);
    setHours([]);
    setTreeData([]);
  }, [form, open]);

  const getParams = () => {
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;
      const departCount = res.data.dep_user_count;
      if (JSON.stringify(departments) !== "{}") {
        const new_arr: any = checkArr(departments, 0, departCount);
        setDepartments(new_arr);
      }
      let type = "open";
      if (depIds.length !== 0 && depIds[0] !== 0) {
        type = "elective";
        let item = checkChild(res.data.departments, depIds[0]);
        let arr: any[] = [];
        if (item === undefined) {
          arr.push(depIds[0]);
        } else if (item.parent_chain === "") {
          arr.push(depIds[0]);
        } else {
          let new_arr = item.parent_chain.split(",");
          new_arr.map((num: any) => {
            arr.push(Number(num));
          });
          arr.push(depIds[0]);
        }
        form.setFieldsValue({
          dep_ids: arr,
        });
      } else {
        form.setFieldsValue({
          dep_ids: depIds,
        });
      }
      form.setFieldsValue({
        type: type,
      });
      setType(type);
    });
  };

  const checkChild = (departments: any[], id: number) => {
    for (let key in departments) {
      for (let i = 0; i < departments[key].length; i++) {
        if (departments[key][i].id === id) {
          return departments[key][i];
        }
      }
    }
  };

  const getCategory = () => {
    course.createCourse().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: any = checkArr(categories, 0, null);
        setCategories(new_arr);
      }

      if (cateIds.length !== 0 && cateIds[0] !== 0) {
        let item = checkChild(res.data.categories, cateIds[0]);
        let arr: any[] = [];
        if (item === undefined) {
          arr.push(cateIds[0]);
        } else if (item.parent_chain === "") {
          arr.push(cateIds[0]);
        } else {
          let new_arr = item.parent_chain.split(",");
          new_arr.map((num: any) => {
            arr.push(Number(num));
          });
          arr.push(cateIds[0]);
        }
        form.setFieldsValue({
          category_ids: arr,
        });
      } else {
        form.setFieldsValue({
          category_ids: cateIds,
        });
      }
    });
  };

  const getNewTitle = (title: any, id: number, counts: any) => {
    if (counts) {
      let value = counts[id] || 0;
      return title + "(" + value + ")";
    } else {
      return title;
    }
  };

  const checkArr = (departments: any[], id: number, counts: any) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          title: getNewTitle(
            departments[id][i].name,
            departments[id][i].id,
            counts
          ),
          value: departments[id][i].id,
        });
      } else {
        const new_arr: any = checkArr(
          departments,
          departments[id][i].id,
          counts
        );
        arr.push({
          title: getNewTitle(
            departments[id][i].name,
            departments[id][i].id,
            counts
          ),
          value: departments[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onFinish = (values: any) => {
    let dep_ids: any[] = [];
    if (type === "elective") {
      dep_ids = values.dep_ids;
    }
    if (chapters.length === 0 && treeData.length === 0) {
      message.error("Please configure class time");
      return;
    }
    course
      .storeCourse(
        values.title,
        values.thumb,
        values.short_desc,
        1,
        values.isRequired,
        dep_ids,
        values.category_ids,
        chapters,
        treeData
      )
      .then((res: any) => {
        message.success("Save successfully！");
        onCancel();
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const getType = (e: any) => {
    setType(e.target.value);
  };

  const selectData = (arr: any, videos: any) => {
    if (arr.length === 0) {
      message.error("Please select video");
      return;
    }
    let keys = [...hours];
    let data = [...treeData];
    keys = keys.concat(arr);
    data = data.concat(videos);
    setHours(keys);
    setTreeData(data);
    setVideoVisible(false);
  };

  const selectChapterData = (arr: any, videos: any) => {
    if (arr.length === 0) {
      message.error("Please select video");
      return;
    }
    const data = [...chapters];
    const keys = [...chapterHours];
    keys[addvideoCurrent] = keys[addvideoCurrent].concat(arr);
    data[addvideoCurrent].hours = data[addvideoCurrent].hours.concat(videos);
    setChapters(data);
    setChapterHours(keys);
    setVideoVisible(false);
  };

  const getChapterType = (e: any) => {
    const arr = [...chapters];
    if (arr.length > 0) {
      confirm({
        title: "Operation Confirmation",
        icon: <ExclamationCircleFilled />,
        content: "The toggle list option will clear the added lesson time, confirm the toggle?",
        centered: true,
        okText: "Confirmed",
        cancelText: "Cancel",
        onOk() {
          setChapterType(e.target.value);
          setChapters([]);
          setHours([]);
          setChapterHours([]);
          setTreeData([]);
        },
        onCancel() {
          form.setFieldsValue({
            hasChapter: chapterType,
          });
        },
      });
    } else {
      setChapterType(e.target.value);
    }
  };

  const delHour = (id: number) => {
    const data = [...treeData];
    const index = data.findIndex((i: any) => i.rid === id);
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
  };

  const transHour = (arr: any) => {
    setHours(arr);
    const data = [...treeData];
    const newArr: any = [];
    for (let i = 0; i < arr.length; i++) {
      data.map((item: any) => {
        if (item.rid === arr[i]) {
          newArr.push(item);
        }
      });
    }
    setTreeData(newArr);
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

  const delChapter = (index: number) => {
    const arr = [...chapters];
    const keys = [...chapterHours];
    confirm({
      title: "Operation Confirmation",
      icon: <ExclamationCircleFilled />,
      content: "Deleting a chapter will clear the added hours, confirm the deletion?",
      centered: true,
      okText: "Confirmed",
      cancelText: "Cancel",
      onOk() {
        arr.splice(index, 1);
        keys.splice(index, 1);
        setChapters(arr);
        setChapterHours(keys);
      },
      onCancel() {},
    });
  };

  const delChapterHour = (index: number, id: number) => {
    const keys = [...chapterHours];
    const data = [...chapters];
    const current = data[index].hours.findIndex((i: any) => i.rid === id);
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
  };

  const transChapterHour = (index: number, arr: any) => {
    const keys = [...chapterHours];
    keys[index] = arr;
    setChapterHours(keys);

    const data = [...chapters];
    const newArr: any = [];
    for (let i = 0; i < arr.length; i++) {
      data[index].hours.map((item: any) => {
        if (item.rid === arr[i]) {
          newArr.push(item);
        }
      });
    }
    data[index].hours = newArr;
    setChapters(data);
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
        title="New Course"
        onClose={onCancel}
        maskClosable={false}
        open={open}
        footer={
          <Space className="j-r-flex">
            <Button onClick={() => onCancel()}>Cancel</Button>
            <Button onClick={() => form.submit()} type="primary">
            Confirmed
            </Button>
          </Space>
        }
        width={634}
      >
        <div className="float-left mt-24">
          <SelectResource
            defaultKeys={
              chapterType == 0 ? hours : changeChapterHours(chapterHours)
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
            name="create-basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Course Categories"
              name="category_ids"
              rules={[{ required: true, message: "Please select a course category!" }]}
            >
              <TreeSelect
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                allowClear
                multiple
                style={{ width: 424 }}
                treeData={categories}
                placeholder="Please select a course category"
                treeDefaultExpandAll
              />
            </Form.Item>
            <Form.Item
              label="Course Name"
              name="title"
              rules={[{ required: true, message: "Please enter the course name here!" }]}
            >
              <Input
                style={{ width: 424 }}
                placeholder="Please enter the course name here"
                allowClear
              />
            </Form.Item>
            <Form.Item
              label="Mandatory"
              name="isRequired"
              rules={[{ required: true, message: "Please select the Mandatory!" }]}
            >
              <Radio.Group>
                <Radio value={1}>Mandatory</Radio>
                <Radio value={0} style={{ marginLeft: 22 }}>
                Elective
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Assigned Department"
              name="type"
              rules={[{ required: true, message: "Please select the assigned department!" }]}
            >
              <Radio.Group onChange={getType}>
                <Radio value="open">All Departments</Radio>
                <Radio value="elective">Select department</Radio>
              </Radio.Group>
            </Form.Item>

            {type === "elective" && (
              <Form.Item
                label="Select department"
                name="dep_ids"
                rules={[
                  {
                    required: true,
                    message: "Please select department!",
                  },
                ]}
              >
                <TreeSelect
                  showCheckedStrategy={TreeSelect.SHOW_ALL}
                  style={{ width: 424 }}
                  treeData={departments}
                  multiple
                  allowClear
                  treeDefaultExpandAll
                  placeholder="Please select department"
                />
              </Form.Item>
            )}

            <Form.Item
              label="Course Cover"
              name="thumb"
              rules={[{ required: true, message: "Please upload the course cover!" }]}
            >
              <div className="d-flex">
                <Image
                  src={thumb}
                  width={160}
                  height={120}
                  style={{ borderRadius: 6 }}
                  preview={false}
                />
                <div className="c-flex ml-8 flex-1">
                  <div className="d-flex mb-28">
                    <div
                      className={
                        thumb === defaultThumb1
                          ? styles["thumb-item-avtive"]
                          : styles["thumb-item"]
                      }
                      onClick={() => {
                        setThumb(defaultThumb1);
                        form.setFieldsValue({
                          thumb: defaultThumb1,
                        });
                      }}
                    >
                      <Image
                        src={defaultThumb1}
                        width={80}
                        height={60}
                        style={{ borderRadius: 6 }}
                        preview={false}
                      />
                    </div>
                    <div
                      className={
                        thumb === defaultThumb2
                          ? styles["thumb-item-avtive"]
                          : styles["thumb-item"]
                      }
                      onClick={() => {
                        setThumb(defaultThumb2);
                        form.setFieldsValue({
                          thumb: defaultThumb2,
                        });
                      }}
                    >
                      <Image
                        src={defaultThumb2}
                        width={80}
                        height={60}
                        style={{ borderRadius: 6 }}
                        preview={false}
                      />
                    </div>
                    <div
                      className={
                        thumb === defaultThumb3
                          ? styles["thumb-item-avtive"]
                          : styles["thumb-item"]
                      }
                      onClick={() => {
                        setThumb(defaultThumb3);
                        form.setFieldsValue({
                          thumb: defaultThumb3,
                        });
                      }}
                    >
                      <Image
                        src={defaultThumb3}
                        width={80}
                        height={60}
                        style={{ borderRadius: 6 }}
                        preview={false}
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <UploadImageButton
                      text="Change Cover"
                      onSelected={(url) => {
                        setThumb(url);
                        form.setFieldsValue({ thumb: url });
                      }}
                    ></UploadImageButton>
                    <span className="helper-text ml-16">
                      (Recommended Size:400x300px)
                    </span>
                  </div>
                </div>
              </div>
            </Form.Item>
            <Form.Item label="Course Introduction" name="short_desc">
              <Input.TextArea
                style={{ width: 424, minHeight: 80 }}
                allowClear
                placeholder="Please enter course description (max 200 words)"
                maxLength={200}
              />
            </Form.Item>
            <Form.Item
              label="Class List"
              name="hasChapter"
              rules={[{ required: true, message: "Please select class list!" }]}
            >
              <Radio.Group onChange={getChapterType}>
                <Radio value={0}>No Chapter</Radio>
                <Radio value={1} style={{ marginLeft: 22 }}>
                With Chapters
                </Radio>
              </Radio.Group>
            </Form.Item>
            {chapterType === 0 && (
              <div className="c-flex">
                <Form.Item>
                  <div className="ml-120">
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
                          Chapter{index + 1}:
                          </div>
                          <Input
                            value={item.name}
                            className={styles["input"]}
                            onChange={(e) => {
                              setChapterName(index, e.target.value);
                            }}
                            allowClear
                            placeholder="Please enter the chapter name here"
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
                          Delete section
                          </Button>
                        </div>
                        <div className={styles["chapter-hous-box"]}>
                          {item.hours.length === 0 && (
                            <span className={styles["no-hours"]}>
                              Please click the button above to add a class
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
                  <div className="ml-120">
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
