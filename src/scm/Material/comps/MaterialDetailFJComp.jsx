import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect, Spin, Row, Col, AutoComplete, InputNumber, Checkbox, Icon, Upload } from '../../../base/components/AntdComp';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import { enumStore } from '../../../base/stores/EnumStore';
import FormComp from '../../../base/mobxComps/FormComp';
import { jsonHead } from '../../../base/services/ReqApi';
import { Urls } from '../../../base/consts/Urls';
//redux的store 和 tab标签页action
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { materialDetailStore, materialDetailFJStore } from '../stores/MaterialDetailStore';
let Option = Select.Option;
const FormItem = Form.Item;
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

class MaterialDetailFJComp extends FormComp {
    constructor() {
        super();
        this.store = materialDetailFJStore;
        this.state = {
            importFile: {
                fileUrl: "",
            },
            fileList: [],
            beginUpDisabled: true,
            uploadDialogButton: "upload-dialog-button",
        };
        this.files = {
            name: 'file',
            action: Urls.COMMON_UPLOAD_FILE,//'http://10.99.2.70:9098/pub/common/uploadfile',//Urls.COMMON_UPLOAD_FILE,
            onChange: this.handleChange,
            onRemove: this.onDelete,
            onRemove: (file) => {
                let id = file.id ? file.id : file.response.data.id;
                this.onDelete(id)
            },
            beforeUpload: this.beforeUpload,
            showUploadList: { showPreviewIcon: false, showRemoveIcon: true },
            accept: ".xls,.xlsx,.pdf,.doc,.docx,.jpg,.png,.JPEG,.BMP,.zip,.rar",
            headers: {
                authorization: 'authorization-text',
                tokenId: jsonHead.tokenId,
            },
            data: {
                module: "importexcle"
            }
        }
    };
    onMessage = () => {
        message.success('最多上传五个！');
    };
    beforeUpload = (file) => {
        let { fileList } = this.store;
        const isFile = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (isFile == '.exe' || isFile == '.bat') {
            message.error('选择的文件格式不正确!');
            return false;
        }
        if (fileList.length >= 5) {
            message.error('最多上传五个！')
            return false;
        }
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isLt20M) {
            message.error('上传的单个文件请不要超过20M')
            return isLt20M;
        }
    };
    handleChange = (info) => {
        if (info.file.status == "done") {
            let fileIds = info.file.response.data.id
            let materialCode = materialDetailStore.detail.materialCode
            materialDetailFJStore.fetchMaterialFJadd({ fileIds, materialCode });
            // fileList.splice(0, 0, info.file.response.data);
            this.setState({
                importFile: {
                    ...this.state.importFile,
                    fileUrl: info.file.response.data.fileURL,
                },
                beginUpDisabled: false,
                uploadDialogButton: "",
            })
        }
        if (info.fileList[info.fileList.length - 1].status == 'done') {
            info.fileList.length > 0 ? info.fileList.map((item, index) => {
              const mb = new RegExp('MB\\)$');
              const kb = new RegExp('KB\\)$');
              if (!mb.test(item.name) || !kb.test(item.name)) {
                  let a;
                  if (item.size / 1024 >= 1024 && !mb.test(item.name)) {
                      a = Number(item.size / 1024.0 / 1024.0).toFixed(2);
                      item.name += ' (' + a + 'MB)';
                  } else if (item.size / 1024 < 1024 && !kb.test(item.name)) {
                      a = Number(item.size / 1024.0).toFixed(2);
                      item.name += ' (' + a + 'KB)';
                  }
              }else {
              }
            }) : '';
        }
        if (info.file.status) {
            let fileList = info.fileList;
            fileList = fileList.slice(-5);
            this.store.setFilesList_upload(fileList);
        }
    };
    onDelete = (fileIds) => {
        let materialCode = materialDetailStore.detail.materialCode
        materialDetailFJStore.fetchMatrialDetele({ fileIds, materialCode }).then(json => {
            if (json.status === 2000) {
                message.success('删除成功!');
                materialDetailFJStore.fetchTableList({ materialCode });
            }
        })
    };
    render() {
        let { fileList } = this.store;
        return (
            <div>
                <div className="material-body-top-borderR material-fj-con-b">
                    <div className="material-baseInfo">
                        <span className="material-form-baseInfo"><strong>附件信息</strong></span>
                    </div>
                    <div className="material-fj-list">
                        <span>上传附件：</span>
                        <Upload {...this.files} fileList={this.store.fileList}>
                            <Button>
                                <Icon type="upload" /> 选择文件
                            </Button>
                            <p className="material-fj-p">一次只能上传一个附件，最多上传5个，支持PDF、word、excel、JPG、PNG、RAR、ZIP、BMP、JPEG格式文件，多个文件建议打包上传</p>
                        </Upload>
                    </div>
                </div>
            </div>
        )
    }
}
export default Form.create()(MaterialDetailFJComp);