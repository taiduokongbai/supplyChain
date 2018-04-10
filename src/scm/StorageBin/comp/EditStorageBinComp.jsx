import React, { Component, PropTypes } from "react";
import { Form, Input, message, Select } from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/mobxComps/FormModalComp';
import { editStorageBinStore, wareHouseStore, storageBinListStore } from '../store/StorageBinListStore';
let FormItem = Form.Item;
let formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
};
let { observer } = mobxReact;

@observer
class EditStorageBin extends FormModalComp {
    constructor(props){
        super(props);
        this.store = editStorageBinStore;
        this.number = 1;
    }

    handleCancel = () => {
        if (!this.store.loading) {
            this.store.setVisible(false);
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.validateFds((err, values) => {
            if (!err) {
                editStorageBinStore.save(Object.assign(values,{id:editStorageBinStore.detail.id})).then(json => {
                    if (json.status == 2000) {
                        message.success('编辑成功');
                        storageBinListStore.fetchTableList();
                    }
                })
            }
        });
    };

    getComp = () => {
        let { detail } = editStorageBinStore;
        return(
            <div>
                <Form>
                    <FormItem label='编码：'  {...formItemLayout}>
                        {this.getFD('locationCode', {
                            initialValue: detail.locationCode,
                            rules: [{required: true, message: '编码不能为空'}]
                        })(
                            <Input placeholder="请输入编码" disabled/>
                        )}
                    </FormItem>
                    <FormItem label='名称：'  {...formItemLayout}>
                        {this.getFD('locationName', {
                            initialValue: detail.locationName,
                            rules: [{required: true, message: '名称不能为空'}]
                        })(
                            <Input placeholder="请输入名称"/>
                        )}
                    </FormItem>
                    <FormItem label='所属仓库：'  {...formItemLayout}>
                        {this.getFD('stockId', {
                            initialValue: String(detail.stockId),
                            rules: [{required: true, message: '所属仓库不能为空'}]
                        })(
                            <Select>
                                {wareHouseStore.options}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='备注：'  {...formItemLayout}>
                        {this.getFD('remark', {
                            initialValue: detail.remark,
                        })(
                            <Input type="textarea" placeholder="请输入备注"/>
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}

let EditStorageBinComp = Form.create()(EditStorageBin);
export default EditStorageBinComp