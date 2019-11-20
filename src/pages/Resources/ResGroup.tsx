import React, { Component } from 'react';
import { Table, Button, Divider, Tag, message, Form, Modal, Input, Radio, Select } from 'antd';
import axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';

const { Option } = Select;

export interface group {
  ctime?: string;
  utime?: string
  name: string;
  description: string;
  status: number
  thumb: string
  type: string
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
    
    if (!lastPromise || !getting) {
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

class GroupForm extends Component<{form: any}, {}> {
  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...formItemLayout}>
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '必填' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="类型">
          {getFieldDecorator('type', {
            initialValue: 'albums',
          })(
            <Select style={{ width: 120 }}>
              <Option value="albums">相册</Option>
              <Option value="words">文章</Option>
              <Option value="type1">type1</Option>
              <Option value="type2">type2</Option>
              <Option value="type3">type3</Option>
              <Option value="type4">type4</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator('description', {
            rules: [{ required: true, message: '必填' }]
          })(<TextArea />)}
        </Form.Item>
        <Form.Item label="封面">
          {getFieldDecorator('thumb', {
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item label="是否展示">
          {getFieldDecorator('status', {
            initialValue: 1,
          })(
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Form>
    )
  }
}

const GroupFormI = Form.create({})(GroupForm);

interface props {

}

interface state {
  groupList: group[];
  modalVisible: boolean;
  isEdit: boolean;
}

class ResGroup extends Component<props, state> {

  state: state = {
    groupList: [],
    modalVisible: false,
    isEdit: false
  }

  editId: string = '';

  form: any;

  columns = [
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
          <a onClick={() => this.openEdit(record)}>Edit</a>
          <Divider type="vertical" />
          <a>Delete</a>
        </span>
      ),
    },
  ];

  openAdd () {
    this.setState({modalVisible: true, isEdit: false});
    setTimeout(() => {
      this.form.props.form.resetFields();
    }, 10);
  }

  openEdit (record: group) {
    this.setState({modalVisible: true, isEdit: true});
    this.editId = record._id;
    setTimeout(() => {
      this.form.props.form.setFields({
        name: {value: record.name},
        type: {value: record.type},
        description: {value: record.description},
        thumb: {value: record.thumb},
        status: {value: record.status}
      });
    }, 10);
  }

  handleOk () {
    const form = this.form.props.form;
    form.validateFields((error: any, values: any) => {
      if (error) {
        return;
      }
      this.setState({modalVisible: false});
      if (this.state.isEdit) {
        axios({
          url: '/resgroup/' + this.editId,
          method: 'put',
          data: values
        }).then(res => {
          const { data = {} } = res;
          if (data.code === 0) {
            message.success('修改成功');
            this.reloadList();
          } else {
            message.error(data.msg);
          }
        }).catch(err => {
          message.error(err.message);
        })
      } else {
        axios({
          url: '/resgroup',
          method: 'post',
          data: values
        }).then(res => {
          const { data = {} } = res;
          if (data.code === 0) {
            message.success('添加成功');
            this.reloadList();
          } else {
            message.error(data.msg);
          }
        }).catch(err => {
          message.error(err.message);
        })
      }
    })
  }

  async reloadList () {
    setGroups([])
    let groupList = await getGroups()
    this.setState({groupList})
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
        <Button style={{marginRight: 8}} onClick={() => this.openAdd()}>新增</Button>
        <div style={{ paddingTop: 12 }}></div>
        <Table columns={this.columns} dataSource={this.state.groupList} />

        <Modal
          centered
          maskClosable={false}
          width={600}
          title={this.state.isEdit ? '修改' : '新增'}
          okText="确定"
          cancelText="取消"
          visible={this.state.modalVisible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}>
            <GroupFormI wrappedComponentRef={(form: any) => this.form = form}></GroupFormI>
          </Modal>
      </div>
    )
  }
}


export default ResGroup
