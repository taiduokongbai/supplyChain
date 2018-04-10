/**
 * Created by MW on 2017/7/19.
 * 其他出库单_列表
 */

import React, {Component} from 'react'
import {Spin, message, Button, Select, Form, Row, Col, Input,Icon ,Modal} from 'antd';
import InventoryAdjustmentAddThreeTableComp from './InventoryAdjustmentAddThreeTableComp';
const confirm = Modal.confirm;

const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
};





class InventoryAdjustmentAddThreeComp extends Component {
    state = {
        selRows:[]
    }

    constructor(props) {
        super(props)
    }



    handleRowSelection=(selectedRowKeys, selectedRows)=>{
        this.setState({selRows: selectedRowKeys});
    }


    componentWillMount=()=>{


        this.props.actions.fetchTempDataSource(this.props.oneSelectVal);
    }

    handlePrev = (e) => {
        this.props.actions.stepPrevious();
    }



    handleSubmit=(e)=> {
        let {wrappedComponent} = this.refs.InventoryAdjustmentAddThreeTableComp.refs;
        let {TableFormConObj} = wrappedComponent.refs.formWrappedComponent;
        let form = TableFormConObj.getForm();
        let tableValidate = {};
        let barValidate = {};

        form.validateFields((err, values) => {
            tableValidate.err = err;
            tableValidate.values = values;
        });




        this.props.form.validateFields(
            (err,values) => {
                barValidate.err = err;
                barValidate.values = values;
            },
        );






        if (!tableValidate.err && !barValidate.err) {
            let subData = this.reFormartSubmitDataISNull(tableValidate.values);
            if(subData.list && subData.list.length > 0){




                confirm({
                    title: '调整单一旦提交，库存数据立刻更新',
                    content: '确定要提交该调整单吗?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk:()=> {
                        let pm = {
                            adjustTypeCode: subData.adjustTypeCode,
                            warehouseCode: subData.warehouseCode,
                            adjustReason: barValidate.values.adjustReason,
                            id:this.props.dataSource.id,
                            list:subData.list
                        }
                        this.props.actions.confirmAdjustment(pm).then((json)=>{
                            if (json.status === 2000) {
                                //   this.props.actions.fetchTempDataSource(this.props.oneSelectVal);
                            }
                        });

                    },
                    onCancel() {

                    },
                });


            }else {
                message.warning("调整明细不能为空!");
            }

        }
    }

    reFormartSubmitDataISNull=(validateValues)=>{
        var objArray = {};
        for (var key in validateValues){
            var keyIndex = key.replace("select_","").split("_");
            if(!objArray[keyIndex[1]]){
                objArray[keyIndex[1]] = {};
            }

            if(keyIndex[0] == "newStatus"){
                objArray[keyIndex[1]][keyIndex[0]] =parseInt(validateValues[key],10);
            }else {
                objArray[keyIndex[1]][keyIndex[0]] = validateValues[key];
            }
        }

        var list = [];
        for (var key in objArray){
            var row = this.props.dataSource.list[parseInt(key,10)];
            list.push(Object.assign({},row,objArray[key]));
        }


        return  {
            adjustTypeCode: this.props.oneSelectVal.adjustTypeCode,
            warehouseCode: this.props.oneSelectVal.warehouseCode,
            list
        };
    }


    render() {
        let getFieldDecorator = this.props.form.getFieldDecorator;
        return (
            <div className="adjustment-container-three">
                <div className="adjustment-bar">
                    <div className="step-con">

                        <div className="title-warp">
                            <div className="step-title">
                                <lable><i>1.</i>选择类型</lable>
                                <label className="ant-select-arrow"></label>
                            </div>
                            <div className="step-title">
                                <lable><i>2.</i>筛选范围</lable>
                                <label className="ant-select-arrow"></label>
                            </div>
                            <div className="step-title step-select">
                                <lable><i>3.</i>确认</lable>
                            </div>
                        </div>

                        <div className="information-warp">
                            <span className="sel-tip">所属仓库：{this.props.dataSource.warehouseName || ""}</span>
                            <span className="sel-tip">调整类型：{this.props.dataSource.adjustTypeName || ""}</span>
                        </div>
                    </div>
                    <div>
                        <Button type="primary" ghost onClick={this.handlePrev}>上一步</Button>
                        <Button className="last-btn" type="primary" ghost onClick={this.handleSubmit}>确认</Button>
                    </div>
                </div>

                <div className="adjustment-form">
                    <div className="form-tip">请确认调整内容,一旦提交,库存数据立即更新</div>
                    <div className="form-controller">
                        <FormItem
                            labelCol={{span: 1}}
                            wrapperCol={{span: 21}}
                            label="调整原因"
                            hasFeedback
                        >
                            {
                                getFieldDecorator('adjustReason', {
                                    initialValue: "",
                                    rules: [
                                        {
                                            validator: (rule, value = "", callback) => {
                                                let length = value.length;
                                                if (!(length >= 0 && length <= 200)) {
                                                    callback('调整原因不能超过200个字符!')
                                                }
                                                callback()
                                            }
                                        }
                                    ],
                                    }
                                )(
                                    <Input type="textarea" rows={4} placeholder={"请输入调整原因"}/>
                                )
                            }
                        </FormItem>
                    </div>
                </div>
                <div className="adjustment-table">
                    <div className="table-content">
                        <InventoryAdjustmentAddThreeTableComp ref="InventoryAdjustmentAddThreeTableComp" {...this.props} />
                    </div>

                </div>
            </div>
        );
    }
}
InventoryAdjustmentAddThreeComp.defaultProps = {
    adjustTypeCodeEnum:[],
    warehouseCodeEnum:[],
    onNext:function (values) {

    }
}

export default InventoryAdjustmentAddThreeComp;
