import React, { Component } from 'react';
import { Table, Button, Divider, Tag, message, Form, Modal, Input, Radio, Select } from 'antd';
import axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';

const { Option } = Select;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Thumb',
    dataIndex: 'thumb',
    key: 'thumb',
    render: (src: string) => {
      if (src) {
        return <img src={src} width={120} />
      } else {
        return '-'
      }
    }
  },
  {
    title: 'type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: string, record: any) => (
      <span>
        <a>Edit</a>
        <Divider type="vertical" />
        <a>Delete</a>
      </span>
    ),
  },
];

export interface group {
  ctime: string;
  name: string;
  status: number
  thumb: string
  type: string
  utime: string
  _id: string
}

let groupList: group[] = [];
let getting = false;
async function loadGroups () {
  getting = true;
  return axios({
    url: '/resgroup',
    params: {}
  }).then(res => {
    getting = false
    const { data = {} } = res;
    if (data.code === 0) {
      return data.data;
    } else {
      message.error(data.msg);
    }
  }).catch(err => {
    getting = false
    message.error(err.message);
  })
}

// 如果在请求中，直接等待上一次的promise
let lastPromise: any = null
export async function getGroups () {
  if (groupList && groupList.length > 0) {
    return groupList;
  } else {
    if (!lastPromise && !getting) {
      lastPromise = loadGroups()
    }
    const data = await lastPromise;
    if (data && data.data) {
      setGroups(data.data);
      return data.data;
    } else {
      return [];
    }
  }
}

export function setGroups (list: group[]) {
  groupList = list;
}

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  }
}

interface props {

}

interface state {
  groupList: group[];
  modalVisible: boolean;
}

class ResGroup extends Component<props, state> {

  state: state = {
    groupList: [],
    modalVisible: false
  }

  handleOk () {

  }

  handleCancel () {
    this.setState({modalVisible: false})
  }

  async componentDidMount () {
    let groupList = await getGroups()
    this.setState({groupList})
  }

  render () {
    return (
      <div>
        <Button style={{marginRight: 8}} onClick={() => this.setState({modalVisible: true})}>新增</Button>
        <div style={{ paddingTop: 12 }}></div>
        <Table columns={columns} dataSource={this.state.groupList} />

        <Modal
          centered
          maskClosable={false}
          width={600}
          title="修改"
          okText="确定"
          cancelText="取消"
          visible={this.state.modalVisible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}>
            <Form {...formItemLayout}>
              <Form.Item label="名称">
                <Input />
              </Form.Item>
              <Form.Item label="类型">
                <Select defaultValue="lucy" style={{ width: 120 }}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </Form.Item>
              <Form.Item label="描述">
                <TextArea />
              </Form.Item>
              <Form.Item label="封面">
                <Input />
              </Form.Item>
              <Form.Item label="是否展示">
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Modal>
      </div>
    )
  }
}

export default ResGroup
