import { useState, useEffect, useRef } from "react";
import styles from "./index.module.less";
import { Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import banner from "../../assets/images/dashboard/img-a1.png";
import icon from "../../assets/images/dashboard/icon-more.png";
import iconN1 from "../../assets/images/dashboard/icon-n1.png";
import iconN2 from "../../assets/images/dashboard/icon-n2.png";
import iconN3 from "../../assets/images/dashboard/icon-n3.png";
import { Footer } from "../../compenents/footer";
import { dashboard } from "../../api/index";
import { timeFormat } from "../../utils/index";
import * as echarts from "echarts";

const DashboardPage = () => {
  let chartRef = useRef(null);
  const navigate = useNavigate();
  const [basicData, setBasicData] = useState<any>([]);

  const getData = () => {
    dashboard.dashboardList().then((res: any) => {
      setBasicData(res.data);
      renderPieView({
        videos_count: res.data.resource_video_total,
        images_count: res.data.resource_image_total,
      });
      return () => {
        window.onresize = null;
      };
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const renderPieView = (params: any) => {
    let num = params.videos_count + params.images_count;
    let data = [
      {
        name: "Number of Videos",
        value: params.videos_count,
      },
      {
        name: "Number of Pictures",
        value: params.images_count,
      },
    ];
    let dom: any = chartRef.current;
    let myChart = echarts.init(dom);
    myChart.setOption({
      title: {
        textAlign: "center",
        x: "49.5%",
        y: "29%",
        text: num, //主Title
        subtext: "Number of Resources", //副Title
        textStyle: {
          //Title样式
          fontSize: 24,
          fontWeight: "bolder",
          color: "#333",
        },
        subtextStyle: {
          //副Title样式
          fontSize: 10.3,
          fontWeight: "bolder",
          color: "rgba(0, 0, 0, 0.45)",
          formatter: "",
        },
      },
      legend: [
        {
          selectedMode: true, // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭。
          bottom: "10%",
          left: "center",
          textStyle: {
            // 图例的公用文本样式。
            fontSize: 14,
            color: " #333333",
          },
          data: ["视频数", "Pictures 数"],
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: " {b}: {c} ",
      },
      label: {
        formatter: " {b}: {c} ",
        rich: {
          per: {
            color: "#000",
          },
        },
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "60%"], // 环比 圈的大小
          center: ["50%", "40%"], // 图形在整个canvas中的位置
          color: ["#FE8650", "#FFB504"], // item的取色盘
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: "#fff", // 白边
            borderWidth: 2,
          },
          emphasis: {
            // 高亮item的样式
            disabled: true,
          },
          label: {
            normal: {
              show: true,
              color: "#4c4a4a",
              formatter: "{active|{c}}\n\r{total| {b} }",
              rich: {
                total: {
                  fontSize: 15,
                  color: "#454c5c",
                },
                active: {
                  fontSize: 15,
                  color: "#6c7a89",
                  lineHeight: 30,
                },
              },
            },
          },
          data: data,
        },
      ],
    });
    window.onresize = () => {
      myChart.resize();
    };
  };

  const compareNum = (today: number, yesterday: number) => {
    let num = today - yesterday || 0;
    if (num < 0) {
      return (
        <span className="c-green">
          <i className={styles["down"]}>&#9660;</i>
          {Math.abs(num)}
        </span>
      );
    }
    return (
      <span className="c-red">
        <i className={styles["up"]}>&#9650;</i>
        {Math.abs(num)}
      </span>
    );
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={12}>
          <div className="playedu-main-top">
            <div className="j-b-flex">
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>Today's Learners</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>
                    {basicData.user_learn_today}
                  </div>
                  <div className={styles["compare"]}>
                    <span className="mr-5">Compared to Yesterday</span>
                    {compareNum(
                      basicData.user_learn_today,
                      basicData.user_learn_yesterday
                    )}
                  </div>
                </div>
              </div>
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>Total Participants</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>{basicData.user_total}</div>
                  <div className={styles["compare"]}>
                    <span className="mr-5">Compared to Yesterday</span>
                    {compareNum(basicData.user_today, 0)}
                  </div>
                </div>
              </div>
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>Online Classes</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>{basicData.course_total}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="playedu-main-top mt-24">
            <div className={styles["large-title"]}>Shortcut Operation</div>
            <div className={styles["mode-box"]}>
              <div
                className={styles["link-mode"]}
                onClick={() => {
                  navigate("/member/index");
                }}
              >
                <i
                  className="iconfont icon-adduser"
                  style={{ color: "#FF9F32", fontSize: 36 }}
                ></i>
                <span>Add Student</span>
              </div>
              <div
                className={styles["link-mode"]}
                onClick={() => {
                  navigate("/videos");
                }}
              >
                <i
                  className="iconfont icon-upvideo"
                  style={{ color: "#419FFF", fontSize: 36 }}
                ></i>
                <span>Upload Video</span>
              </div>
              <div
                className={styles["link-mode"]}
                onClick={() => {
                  navigate("/course");
                }}
              >
                <i
                  className="iconfont icon-onlinelesson"
                  style={{ color: "#B284FF", fontSize: 36 }}
                ></i>
                <span>Online Classes</span>
              </div>
              <div
                className={styles["link-mode"]}
                onClick={() => {
                  navigate("/department");
                }}
              >
                <i
                  className="iconfont icon-department"
                  style={{ color: "#21C785", fontSize: 36 }}
                ></i>
                <span>New Departments</span>
              </div>
            </div>
          </div>
          <div className="playedu-main-top mt-24" style={{ minHeight: 376 }}>
            <div className={styles["large-title"]}>Today's Learning Ranking</div>
            <div className={styles["rank-list"]}>
              {basicData.user_learn_top10 && (
                <div className={styles["half-list"]}>
                  <div className={styles["rank-item"]}>
                    <div className={styles["left-item"]}>
                      <img
                        className={styles["item-icon"]}
                        src={iconN1}
                        alt=""
                      />
                      {basicData.user_learn_top10[0] && (
                        <div className={styles["item-name"]}>
                          {
                            basicData.user_learn_top10_users[
                              basicData.user_learn_top10[0].user_id
                            ]?.name
                          }
                        </div>
                      )}
                    </div>
                    {basicData.user_learn_top10[0] && (
                      <div className={styles["item-time"]}>
                        {timeFormat(
                          Number(basicData.user_learn_top10[0].duration) / 1000
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles["rank-item"]}>
                    <div className={styles["left-item"]}>
                      <img
                        className={styles["item-icon"]}
                        src={iconN2}
                        alt=""
                      />
                      {basicData.user_learn_top10[1] && (
                        <div className={styles["item-name"]}>
                          {
                            basicData.user_learn_top10_users[
                              basicData.user_learn_top10[1].user_id
                            ]?.name
                          }
                        </div>
                      )}
                    </div>
                    {basicData.user_learn_top10[1] && (
                      <div className={styles["item-time"]}>
                        {timeFormat(
                          Number(basicData.user_learn_top10[1].duration) / 1000
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles["rank-item"]}>
                    <div className={styles["left-item"]}>
                      <img
                        className={styles["item-icon"]}
                        src={iconN3}
                        alt=""
                      />
                      {basicData.user_learn_top10[2] && (
                        <div className={styles["item-name"]}>
                          {
                            basicData.user_learn_top10_users[
                              basicData.user_learn_top10[2].user_id
                            ]?.name
                          }
                        </div>
                      )}
                    </div>
                    {basicData.user_learn_top10[2] && (
                      <div className={styles["item-time"]}>
                        {timeFormat(
                          Number(basicData.user_learn_top10[2].duration) / 1000
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles["rank-item"]}>
                    <div className={styles["left-item"]}>
                      <div className={styles["item-num"]}>4</div>
                      {basicData.user_learn_top10[3] && (
                        <div className={styles["item-name"]}>
                          {
                            basicData.user_learn_top10_users[
                              basicData.user_learn_top10[3].user_id
                            ]?.name
                          }
                        </div>
                      )}
                    </div>
                    {basicData.user_learn_top10[3] && (
                      <div className={styles["item-time"]}>
                        {timeFormat(
                          Number(basicData.user_learn_top10[3].duration) / 1000
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles["rank-item"]}>
                    <div className={styles["left-item"]}>
                      <div className={styles["item-num"]}>5</div>
                      {basicData.user_learn_top10[4] && (
                        <div className={styles["item-name"]}>
                          {
                            basicData.user_learn_top10_users[
                              basicData.user_learn_top10[4].user_id
                            ]?.name
                          }
                        </div>
                      )}
                    </div>
                    {basicData.user_learn_top10[4] && (
                      <div className={styles["item-time"]}>
                        {timeFormat(
                          Number(basicData.user_learn_top10[4].duration) / 1000
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {basicData.user_learn_top10 && (
                <div className={styles["half-list"]}>
                  <div className={styles["rank-item"]}>
                    <div className={styles["left-item"]}>
                      <div className={styles["item-num"]}>6</div>
                      {basicData.user_learn_top10[5] && (
                        <div className={styles["item-name"]}>
                          {
                            basicData.user_learn_top10_users[
                              basicData.user_learn_top10[5].user_id
                            ]?.name
                          }
                        </div>
                      )}
                    </div>
                    {basicData.user_learn_top10[5] && (
                      <div className={styles["item-time"]}>
                        {timeFormat(
                          Number(basicData.user_learn_top10[5].duration) / 1000
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles["rank-item"]}>
                    <div className={styles["left-item"]}>
                      <div className={styles["item-num"]}>7</div>
                      {basicData.user_learn_top10[6] && (
                        <div className={styles["item-name"]}>
                          {
                            basicData.user_learn_top10_users[
                              basicData.user_learn_top10[6].user_id
                            ]?.name
                          }
                        </div>
                      )}
                    </div>
                    {basicData.user_learn_top10[6] && (
                      <div className={styles["item-time"]}>
                        {timeFormat(
                          Number(basicData.user_learn_top10[6].duration) / 1000
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles["rank-item"]}>
                    <div className={styles["left-item"]}>
                      <div className={styles["item-num"]}>8</div>
                      {basicData.user_learn_top10[7] && (
                        <div className={styles["item-name"]}>
                          {
                            basicData.user_learn_top10_users[
                              basicData.user_learn_top10[7].user_id
                            ]?.name
                          }
                        </div>
                      )}
                    </div>
                    {basicData.user_learn_top10[7] && (
                      <div className={styles["item-time"]}>
                        {timeFormat(
                          Number(basicData.user_learn_top10[7].duration) / 1000
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles["rank-item"]}>
                    <div className={styles["left-item"]}>
                      <div className={styles["item-num"]}>9</div>
                      {basicData.user_learn_top10[8] && (
                        <div className={styles["item-name"]}>
                          {
                            basicData.user_learn_top10_users[
                              basicData.user_learn_top10[8].user_id
                            ]?.name
                          }
                        </div>
                      )}
                    </div>
                    {basicData.user_learn_top10[8] && (
                      <div className={styles["item-time"]}>
                        {timeFormat(
                          Number(basicData.user_learn_top10[8].duration) / 1000
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles["rank-item"]}>
                    <div className={styles["left-item"]}>
                      <div className={styles["item-num"]}>10</div>
                      {basicData.user_learn_top10[9] && (
                        <div className={styles["item-name"]}>
                          {
                            basicData.user_learn_top10_users[
                              basicData.user_learn_top10[9].user_id
                            ]?.name
                          }
                        </div>
                      )}
                    </div>
                    {basicData.user_learn_top10[9] && (
                      <div className={styles["item-time"]}>
                        {timeFormat(
                          Number(basicData.user_learn_top10[9].duration) / 1000
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="playedu-main-top">
            <div className="j-b-flex">
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>Number of Departments</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>
                    {basicData.department_total}
                  </div>
                </div>
              </div>
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>Number of Categories</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>
                    {basicData.resource_category_total}
                  </div>
                </div>
              </div>
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>Administrators</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>
                    {basicData.admin_user_total}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="playedu-main-top mt-24">
            <div className={styles["large-title"]}>Documentation</div>
            <div className={styles["usage-guide"]}>
              <img className={styles["banner"]} src={banner} alt="" />
              <Link
                to="https://www.playedu.xyz/docs/docs/guide/"
                target="blank"
                className={styles["link"]}
              >
                
                <img className={styles["icon"]} src={icon} alt="" />
              </Link>
            </div>
          </div>
          <div className="playedu-main-top mt-24">
            <div className={styles["large-title"]}>Resource Statistics</div>
            <div className={styles["charts"]}>
              <div
                ref={chartRef}
                style={{ width: "100%", height: 280, position: "relative" }}
              ></div>
            </div>
          </div>
        </Col>
        <Footer></Footer>
      </Row>
    </>
  );
};

export default DashboardPage;
