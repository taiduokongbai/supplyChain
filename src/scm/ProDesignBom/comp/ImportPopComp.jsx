import React, { Component, PropTypes } from "react";
import {Button , Upload, Progress, message} from '../../../base/components/AntdComp.js';
import FormModalComp from '../../../base/mobxComps/FormModalComp';
import { Urls } from '../../../base/consts/Urls';
import {jsonHead} from '../../../base/services/ReqApi'
import ImportPopErrorComp from './ImportPopErrorComp';
import {prefixPub} from "../../../base/consts/UrlsConfig";
import { deignTypeStore, popStore, popErrorStore, importTableStore } from '../store/ImportProDesignBomStore';


class ImportPopComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = popStore;
        this.state={
            importFile:{
                fileUrl:""
            },
            fileList:[],
            beginUpDisabled:true,
            uploadDialogButton:"upload-dialog-button",
        };
        this.files = {
            name: 'file',
            action: Urls.COMMON_UPLOAD_FILE_EXcel,//'http://10.99.2.70:9098/pub/common/uploadfile',//Urls
            onChange:this.handleChange,
            showUploadList:{ showPreviewIcon: false, showRemoveIcon: false },
            accept:".xls,.xlsx",
            beforeUpload: this.beforeUpload,
            headers: {
                authorization: 'authorization-text',
                tokenId: jsonHead.tokenId,
            },
            data:{
                module:"importexcel"
            }
        }
    };

    setInit = () => {
        this.setState ({
                importFile: {
                    fileUrl: "",
                },
                fileList: [],
                beginUpDisabled: true,
                uploadDialogButton: "upload-dialog-button",
        });
        this.setState({
                name: 'file',
                action: Urls.COMMON_UPLOAD_FILE_EXcel,// 'http://10.99.2.70:9098/pub/common/uploadfile',//Urls.COMMON_UPLOAD_FILE_EXcel,
                onChange: this.handleChange,
                showUploadList: { showPreviewIcon: false, showRemoveIcon: false },
                accept: ".xls,.xlsx",
                headers: {
                    authorization: 'authorization-text',
                    tokenId: jsonHead.tokenId,
                },
                data: {
                    module: "importexcle"
                }
        });
    };

    beforeUpload = (file) => {
        const isFile = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (isFile == '.xls' || isFile == '.xlsx') {
            return true;
        } else {
            message.error('选择的文件格式不正确!');
            return false;
        }
    };

    handleChange = (info) => {
        if(info.file.status=="done"){
            this.setState({
                importFile:{
                    // ...this.state.importFile,
                    ...info.file.response.data,
                    // fileUrl: info.file.response.data.fileURL,
                },
                beginUpDisabled:false,
                uploadDialogButton:"",

            });
        }
        if (info.file.status) {
            let fileList = info.fileList;
            fileList = fileList.slice(-1);
            this.setState({fileList: fileList});
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
            let file = {
                fileId: this.state.importFile.id,
                prefix: this.state.importFile.prefix,
                fileURL: this.state.importFile.fileURL,
                filetype: this.state.importFile.filetype,
                filesize: this.state.importFile.filesize,
                fileName: this.state.importFile.fileName,
                
                // fileId: "6119",
                // prefix: "window.LUX_FILEUP/importexcle",
                // fileURL: "window.LUX_FILEUP/importexcle/1p5O6vKXAqAe514962512796.XLSX",
                // filetype: "XLS",
                // filesize: "35112.0",
                // fileName: "测试导入ExcelError - 副本.XLSX",
            };
        let Ids = importTableStore.Ids.bomTypeId ? importTableStore.Ids:'';
        this.store.handleSubmit({...file,
            ...{importTypeCode:importTableStore.editingRecord.importTypeName},
            ...{importTypeName:importTableStore.editingRecord.importTypeCode},
            ...{id:importTableStore.editingRecord.id},
            ...{designTypeCode:deignTypeStore.designLabel},
            ...Ids
        }).then((json) => {
                if(json.status === 2000){
                    this.setInit();
                }
            });
    };

    getFooter = () => ([
        <Button key="submit" type="primary" size="large"
                className={this.state.uploadDialogButton}
                loading={this.store.loading}
                onClick={this.handleSubmit}
                disabled={this.state.beginUpDisabled}
        >
            {this.props.okText || "确定"}
        </Button>
    ]);

    handleCancel = () => {
        if (!this.store.loading) {
            this.setInit();
            this.store.setVisible(false);
        }
    };

    getComp = () => {
        return (
            <div className="upload-dialog">
                <div className="upload-tiitle">
                    <p>请选择需要导入的文件</p>
                    {/*<a href={prefixPub+"window.LUX_FILEUP/importexcle/1x0GO57z9BSw516332755021.rar&fileName=产品设计BOM导入模板.rar"}>下载《产品设计物料清单导入模板》</a>*/}
                    <a href={prefixPub+"/common/downloadFile?fileUrl="+window.LUX_FILEUP+"/importexcel/产品设计BOM导入模板.rar&fileName=产品设计BOM导入模板.rar"}>下载《产品设计物料清单导入模板》</a>
                </div>
                <div className="dialog-inner">
                    <Upload {...this.files} fileList={this.state.fileList}>
                    <Button type="upload" className="upload-through"><span className='c2mfont c2m-shangchuan1'></span>选择文件</Button>
                    </Upload>
                    {this.props.progressVisible?
                        <Progress percent={this.props.percent} strokeWidth={8} />:null
                    }

                </div>
                <div className="upload-alert">
                    <p className="upload-alert-title">温馨提示：</p>
                    <p>1.文件后缀格式为xls或者xlsx</p>
                    <p>2.文件大小必须保证在10M以内，每次导入数据不超过1000条</p>
                </div>
                { popErrorStore.visible ? <ImportPopErrorComp setInit = {this.setInit}/>: null }
            </div>
        )
    }
}
export default ImportPopComp;
