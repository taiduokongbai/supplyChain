import React, { Component, PropTypes } from "react";
import { Form, Input, Button, message, Select } from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/mobxComps/FormModalComp';
import { addStorageBinStore, wareHouseStore, storageBinListStore } from '../store/StorageBinListStore';
let FormItem = Form.Item;
let formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
};
let { observer } = mobxReact;

@observer
class AddStorageBin extends FormModalComp {
    constructor(props){
        super(props);
        this.store = addStorageBinStore;
        this.props.form.getFieldDecorator('keys', { initialValue: [1] });
        this.number = 1;
    };

    handleCancel = () => {
        if (!this.store.loading) {
            this.store.setVisible(false);
            this.props.form.setFieldsValue({
                keys: [1],
            });
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.validateFds((err, values) => {
            if (!err) {
                let arr = [], splitArr = [],endArr = [];
                for ( let i in values ){
                    let str = i + "=" + values[ i ];
                    if( i != 'keys'){
                        arr.push( str );
                    }
                }
                for(let i = 0, len = arr.length; i<len; i+=4){
                    splitArr.push(arr.slice(i,i+4))
                }
                for(let i=0; i<splitArr.length; i++){
                    let obj = {};
                    for (let j=0; j<splitArr[i].length; j++) {
                        let k,v;
                        [k, v] = splitArr[i][j].split(/\+\d=/);
                        obj[k] = v;
                    }
                    endArr.push(obj)
                }
                if(endArr.some((firstItem,index) => {
                    return endArr.some((lastItem,pIndex) => {
                        if(index != pIndex && firstItem.stockId == lastItem.stockId){
                            return firstItem.locationCode == lastItem.locationCode && firstItem.locationName == lastItem.locationName;
                        }
                    })
                })){
                    message.error('仓库编码和仓库名称已存在!');
                } else if(endArr.some((firstItem,index) => {
                        return endArr.some((lastItem,pIndex) => {
                            if(index != pIndex && firstItem.stockId == lastItem.stockId){
                                return firstItem.locationCode == lastItem.locationCode ;
                            }
                        })
                    })){
                    message.error('仓库编码已存在!');
                } else if(endArr.some((firstItem,index) => {
                        return endArr.some((lastItem,pIndex) => {
                            if(index != pIndex && firstItem.stockId == lastItem.stockId){
                                return firstItem.locationName == lastItem.locationName;
                            }
                        })
                    })){
                    message.error('仓库名称已存在!');
                }else {
                    addStorageBinStore.save({list:endArr}).then(json => {
                        if (json.status === 2000) {
                            message.success('新建成功');
                            this.props.form.setFieldsValue({
                                keys: [1],
                            });
                            storageBinListStore.fetchTableList();
                        } else {
                            this.props.form.setFieldsValue({
                                keys: [1],
                            });
                        }
                    })
                }
            }
        });
    };

    add = () => {
        this.number++;
        let keys = this.props.form.getFieldValue('keys');
        let nextKeys = keys.concat(this.number);
        this.props.form.setFieldsValue({
            keys: nextKeys,
        });
    };
    remove = (k) => {
        let keys = this.props.form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        this.props.form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    getFormItems = () => {
        let keys = this.props.form.getFieldValue('keys');
        return keys.map((k) => {
            return (
                <div key={k}>

                    {keys.length > 1 && keys[0] != k ? (
                        <div className="group-line"></div>
                    ) : null}

                    {keys.length > 1 ? (
                        <div className="delete">
                            <i className="c2mfont c2m-shanchu1"></i>
                            <a onClick={() => this.remove(k)}>删除</a>
                        </div>
                    ) : null}

                    <FormItem label='编码：'  {...formItemLayout}>
                        {this.getFD(`locationCode+${k}`, {
                            initialValue: "",
                            rules: [{required: true, message: '编码不能为空'}]
                        })(
                            <Input placeholder="请输入编码"/>
                        )}
                    </FormItem>
                    <FormItem label='名称：'  {...formItemLayout}>
                        {this.getFD(`locationName+${k}`, {
                            initialValue: "",
                            rules: [{required: true, message: '名称不能为空'}]
                        })(
                            <Input placeholder="请输入名称"/>
                        )}
                    </FormItem>
                    <FormItem label='所属仓库：'  {...formItemLayout}>
                        {this.getFD(`stockId+${k}`, {
                            initialValue: "",
                            rules: [{required: true, message: '所属仓库不能为空'}]
                        })(
                            <Select>
                                {wareHouseStore.options}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='备注：'  {...formItemLayout}>
                        {this.getFD(`remark+${k}`, {
                            initialValue: "",
                        })(
                            <Input type="textarea" placeholder="请输入备注"/>
                        )}
                    </FormItem>
                </div>
            )
        })
    };

    getComp = () => {

        return(
                <div className="add-storage">
                    <Form>
                        {this.getFormItems()}
                        <div className="add-line">
                            <a className="add" onClick={this.add}>新建仓位</a>
                        </div>
                    </Form>
                </div>
            )
    }
}

let AddStorageBinComp = Form.create()(AddStorageBin);

export default AddStorageBinComp