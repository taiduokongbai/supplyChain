import React, { Component } from "react";
import { Modal } from '../../../base/components/AntdComp.js';
import {prefixPub} from '../../../base/consts/UrlsConfig'

import {popErrorStore} from '../store/ImportProDesignBomStore'

class ImportEmployeeComp extends Component {
    constructor(props, context) {
        super(props, context);
    }

    handleCancel = () => {
        popErrorStore.setVisible(false);
        this.props.setInit();
    };

    render() {
        return (
           <Modal
                title="验证失败"
                visible={popErrorStore.visible}
                width={442}
                footer={null}
                style={{marginTop:73}}
                onCancel={this.handleCancel}
            >
                <div className="upload-dialog-alert">
                    <p>请下载错误报表，根据错误提示修复文件后重新上传</p>
                    <a href={prefixPub+"/common/downloadFile?fileUrl="+ popErrorStore.errorExcelUrl +"&fileName="+popErrorStore.errorExcelName}>下载错误报表</a>
                </div>
            </Modal>
            
        );
    }
}

export default ImportEmployeeComp;
