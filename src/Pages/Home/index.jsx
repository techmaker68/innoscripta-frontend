import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Index.jsx";
import Api from "Api.js";
import { Link } from "react-router-dom";
import { Card, Input, Select, Avatar, DatePicker, Spin, Alert } from "antd";
import moment from "moment";
import { EditOutlined, EllipsisOutlined, SettingOutlined, AudioOutlined } from '@ant-design/icons';
function Product(props) {
  const [refresh, setRefresh] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { Meta } = Card;
  const { Option } = Select;
  const [preference, setPreference] = useState('guardian');
  const { Search } = Input;
  useEffect(() => {
    setFilteredData([])
    setLoader(true)
    Api.get(`/articles`, {
      params: {
        source: preference
      }
    })
      .then((res) => {
        console.log(res.data)
        setData(res.data);
        setFilteredData(res.data)
        setLoader(false)
      }).catch((err) => {
        setLoader(false)
      });

  }, [refresh]);

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  );
  function setPref(e) {
    setPreference(e)
    setRefresh(!refresh)
  }
  function onSearch(e) {
    if (e == '') {
      setFilteredData(data)
    } else {

      const articles = data.filter((article) =>
        article?.webTitle ? article?.webTitle?.toUpperCase().includes(e.toUpperCase()) : article.author ? article.author?.toUpperCase().includes(e.toUpperCase()) : article.title.toUpperCase().includes(e.toUpperCase())
      )
      setFilteredData(articles)
    }

  }
  const onChange = (date, dateString) => {
    var date = moment(dateString)
    const articles = data.filter((article) => {
      const articleDate = moment(article?.webPublicationDate ? article?.webPublicationDate : article?.publishedAt ? article?.publishedAt : article?.published_date);
      return articleDate.isSame(date, 'day');
    });
    console.log('art', articles)
    setFilteredData(articles);
  };
  return (
    <Layout title="Products" currentPage={3}>
      <div className="main-wrapper">
        <div className="row" style={{ marginBottom: "50px" }}>

          <Search
            className="col-md-4"
            placeholder="Search Articles"
            enterButton="Search"
            size="large"
            suffix={suffix}
            onSearch={onSearch}
          />

          <Select
            className=" col-md-4"
            style={{ color: "white" }}
            onSelect={(e) => setPref(e)}
            defaultValue="guardian"
          >
            <Option value={'all'} >All</Option>
            <Option value={'guardian'} >Guardian</Option>
            <Option value={'newsapi'}>News Api</Option>
            <Option value={'nytimes'}>New York Times</Option>
          </Select>
          <DatePicker className="col-md-4" onChange={onChange} />

        </div>

        <div className="cards-wrapper row flex-wrap">

          {
            loader &&
            <Spin size="large" >
            </Spin>
          }
          {filteredData?.map((article) => (

            <div className="col-md-4">
              <a href={article?.webUrl ? article?.webUrl : article?.url}>
                <Card
                  style={{
                    width: '100%',
                    marginRight: '10px',
                    marginBottom: '10px'
                  }}
                  cover={
                    <img
                      alt="example"
                      src={article.urlToImage ? article.urlToImage : "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
                    />
                  }
                  actions={[
                    <SettingOutlined key="setting" />,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                  ]}
                >
                  <Meta
                    avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
                    title={article.author ? article.author : article.title ? article.title : article.webTitle}
                    source={article?.source?.name ? article.source.name : article.byline ? article.byline : article.pillarId}
                    description={article?.description ? article.description : article.abstract ? article.abstract : article.sectionName}
                  />
                </Card>
              </a>

            </div>
          ))}
        </div>
      </div>

    </Layout>
  );
}

export default Product;
