import React, { useState, useEffect } from "react";
import {
  Space,
  Radio,
  Button,
  Drawer,
  Form,
  TreeSelect,
  Input,
  Modal,
  message,
  Image,
} from "antd";
import styles from "./update.module.less";
import { useSelector } from "react-redux";
import { course, department } from "../../../api/index";
import { UploadImageButton } from "../../../compenents";

const { confirm } = Modal;

interface PropInterface {
  id: number;
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  title: string;
  children?: Option[];
}

export const CourseUpdate: React.FC<PropInterface> = ({
  id,
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

  useEffect(() => {
    if (open) {
      getParams();
      getCategory();
    }
  }, [form, open]);

  useEffect(() => {
    if (id === 0) {
      return;
    }
    getDetail();
  }, [id, open]);

  const getCategory = () => {
    course.createCourse().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: any = checkArr(categories, 0, null);
        setCategories(new_arr);
      }
    });
  };
  const getParams = () => {
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;
      const departCount = res.data.dep_user_count;
      if (JSON.stringify(departments) !== "{}") {
        const new_arr: any = checkArr(departments, 0, departCount);
        setDepartments(new_arr);
      }
    });
  };

  const getDetail = () => {
    course.course(id).then((res: any) => {
      let type = res.data.dep_ids.length > 0 ? "elective" : "open";

      let chapterType = res.data.chapters.length > 0 ? 1 : 0;
      form.setFieldsValue({
        title: res.data.course.title,
        thumb: res.data.course.thumb,
        dep_ids: res.data.dep_ids,
        category_ids: res.data.category_ids,
        isRequired: res.data.course.is_required,
        type: type,
        short_desc: res.data.course.short_desc,
        hasChapter: chapterType,
      });
      setType(type);
      setThumb(res.data.course.thumb);
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
    course
      .updateCourse(
        id,
        values.title,
        values.thumb,
        values.short_desc,
        1,
        values.isRequired,
        dep_ids,
        values.category_ids,
        [],
        []
      )
      .then((res: any) => {
        message.success("Save Successfully！");
        onCancel();
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const getType = (e: any) => {
    setType(e.target.value);
  };

  return (
    <>
      <Drawer
        title="EditClass "
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
          <Form
            form={form}
            name="update-basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Class categories"
              name="category_ids"
              rules={[{ required: true, message: "Please selectClass categories!" }]}
            >
              <TreeSelect
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                allowClear
                multiple
                style={{ width: 424 }}
                treeData={categories}
                placeholder="Please selectClass categories"
                treeDefaultExpandAll
              />
            </Form.Item>
            <Form.Item
              label="Course Name"
              name="title"
              rules={[{ required: true, message: "Please enter Course Name here!" }]}
            >
              <Input
                allowClear
                style={{ width: 424 }}
                placeholder="Please enter Course Name here"
              />
            </Form.Item>
            <Form.Item
              label="Compulsory"
              name="isRequired"
              rules={[{ required: true, message: "Please select compulsory!" }]}
            >
              <Radio.Group>
                <Radio value={1}>Mandatory</Radio>
                <Radio value={0} style={{ marginLeft: 22 }}>
                  Elective
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Department"
              name="type"
              rules={[{ required: true, message: "Please select Department!" }]}
            >
              <Radio.Group onChange={getType}>
                <Radio value="open">All Department</Radio>
                <Radio value="elective">Select Department</Radio>
              </Radio.Group>
            </Form.Item>

            {type === "elective" && (
              <Form.Item
                label="Select Department"
                name="dep_ids"
                rules={[
                  {
                    required: true,
                    message: "Please selectDepartment!",
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
                  placeholder="Please selectDepartment"
                />
              </Form.Item>
            )}

            <Form.Item
              label="Class Cover"
              name="thumb"
              rules={[{ required: true, message: "Please Upload Class Cover!" }]}
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
                    (Recommended size: 400x300px)
                    </span>
                  </div>
                </div>
              </div>
            </Form.Item>
            <Form.Item label="Class Introduction" name="short_desc">
              <Input.TextArea
                style={{ width: 424, minHeight: 80 }}
                allowClear
                placeholder="Please enterClass Introduction (max 200 words)"
                maxLength={200}
              />
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </>
  );
};
