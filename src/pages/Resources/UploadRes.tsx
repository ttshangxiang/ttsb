import React, { Component } from 'react';
import { Upload, Icon, message, Button } from 'antd';
import { Link } from 'react-router-dom';
import Group from './GroupSelect';
import axios from 'axios'

const { Dragger } = Upload;

class UploadRes extends Component {

  state: { groupId: string } = {
    groupId: ''
  }

  render() {

    let url = axios.defaults.baseURL + '/res';
    if (this.state.groupId) {
      url += '?groupId=' + this.state.groupId;
    }
    const props = {
      name: 'file',
      multiple: true,
      action: url,
      data: (file: any) => {
        return {
          filename: file.name,
          type: file.type,
          size: file.size
        }
      },
      onChange(info: any) {
        const { status } = info.file;
        if (status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };


    return (
      <div>
        <Button style={{ marginRight: 8 }}><Link to="/resources">返回</Link></Button>
        <Group change={(value: string) => this.setState({ groupId: value })}></Group>
        <div style={{ paddingTop: 12 }}></div>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p>
        </Dragger>
      </div>
    )
  }
}

export default UploadRes;
