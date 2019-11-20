import React, { Component } from "react";
import { Form, Input, Select, Radio, Modal, message, Button } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { res } from './index';
import { getGroups, group } from './ResGroup';
import axios from 'axios';
const { Option } = Select;

class ReadOnlyText extends Component<any, {}> {
  render () {
    return (
      <div>{this.props.value}</div>
    )
  }
}

class ReadOnlyImg extends Component<any, {}> {

  render () {
    if (!this.props.value || !this.props.value.thumb) {
      return (<div>-</div>);
    }
    let {thumb, normal, width, height} = this.props.value;
    if (!normal || thumb == normal) {
      return (
        <img src={thumb}
          style={{maxWidth: '100%'}}
          key={thumb}/>
      )
    }
    if (width > 626) {
      height = height * 626 / width;
    }
    return (
      <div style={{position: 'relative', minHeight: height}}>
        <img src={thumb} width={width}
          style={{maxWidth: '100%', position: 'absolute'}}
          key={thumb}/>
        <img src={normal}
          style={{maxWidth: '100%', position: 'relative'}}
          key={normal + '-normal'}/>
      </div>
    )
  }
}

class ReadOnlyA extends Component<any, {}> {
  render () {
    return (
      this.props.value ? (
        <a target="_blank" href={this.props.value}>{this.props.value}</a>
      ) : (
        <div>-</div>
      )
    )
  }
}

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  }
}

interface formState {
  groupList: group[]
}
class ResForm extends Component<{form: any}, formState> {

  state: formState = {
    groupList: []
  }

  async componentDidMount () {
    const list: group[] = await getGroups()
    this.setState({ groupList: list });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...formItemLayout}>
        <Form.Item label="文件名">
          {getFieldDecorator('filename', {
            rules: [{ required: true, message: '必填' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator('description', {
          })(<TextArea />)}
        </Form.Item>
        <Form.Item label="图片">
          {getFieldDecorator('thumb', {
          })(<ReadOnlyImg />)}
        </Form.Item>
        <Form.Item label="分组">
          {getFieldDecorator('groups', {
          })(
            <Select mode="multiple">
              {this.state.groupList.map(item => (
                <Option value={item._id} key={item._id}>{item.name}</Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="类型">
          {getFieldDecorator('type', {
          })(<ReadOnlyText/>)}
        </Form.Item>
        <Form.Item label="大小">
          {getFieldDecorator('size', {
          })(<ReadOnlyText/>)}
        </Form.Item>
        <Form.Item label="原文件">
          {getFieldDecorator('path', {
          })(<ReadOnlyA/>)}
        </Form.Item>
      </Form>
    )
  }
}

const ResFormI = Form.create({})(ResForm);

interface state {
  modalVisible: boolean;
}
interface props {
  reloadList?: Function;
  changeCurrent?: Function;
}

class EditResModal extends Component<props, state> {

  state: state = {
    modalVisible: false,
  }

  form: any;
  editId: string = '';

  handleOk () {
    const form = this.form.props.form;
    form.validateFields((error: any, values: any) => {
      if (error) {
        return;
      }
      this.setState({modalVisible: false});
      axios({
        url: '/res/' + this.editId,
        method: 'put',
        data: values
      }).then(res => {
        const { data = {} } = res;
        if (data.code === 0) {
          message.success('修改成功');
          this.props.reloadList && this.props.reloadList();
        } else {
          message.error(data.msg);
        }
      }).catch(err => {
        message.error(err.message);
      })
    })
  }

  handleCancel () {
    this.setState({modalVisible: false});
  }

  showEdit (record: res) {
    this.setState({modalVisible: true});
    this.editId = record._id;
    setTimeout(() => {
      this.form.props.form.setFields({
        filename: {value: record.filename},
        description: {value: record.description},
        thumb: {value: record},
        groups: {value: record.groups},
        type: {value: record.type},
        size: {value: record.size},
        path: {value: record.path}
      });
    }, 10);
  }

  changeCurrent (num: number) {
    this.props.changeCurrent && this.props.changeCurrent(num)
  }

  render () {
    return (
      <Modal
        centered
        maskClosable={false}
        width={800}
        title={'修改'}
        okText="修改"
        cancelText="取消"
        visible={this.state.modalVisible}
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}>
          <div style={{textAlign: 'right', marginTop: -6, paddingBottom: 10}}>
            <Button onClick={() => this.changeCurrent(-1)}>上一个</Button>
            <Button onClick={() => this.changeCurrent(1)}>下一个</Button>
          </div>
          <ResFormI wrappedComponentRef={(form: any) => this.form = form}></ResFormI>
        </Modal>
    )
  }
}

export default EditResModal
