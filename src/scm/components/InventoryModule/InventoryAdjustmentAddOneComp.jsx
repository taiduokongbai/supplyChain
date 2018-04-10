/**
 * Created by MW on 2017/7/19.
 * 其他出库单_列表
 */

import React, {Component} from 'react'
import {Spin, message, Button, Select, Form, Row, Col, Input,TreeSelect} from 'antd';


import {siteStore} from "../../InventoryAdjustment/stores/Stores";
const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
};


class InventoryAdjustmentAddOneComp extends Component {
    constructor(props) {
        super(props)
    }

    handleNext = (e) => {
        this.props.form.validateFields(
            (err,values) => {
                if (!err) {
                    this.props.actions.createAdjustBill(values).then((json)=>{
                        if(json.status === 2000){
                            this.props.onNext && this.props.onNext(values);
                            this.props.actions.stepNext();
                        }
                    });
                }
            },
        );
    }
    componentWillMount(){
        siteStore.fetchSelectList();
    }

    render() {
        let getFieldDecorator = this.props.form.getFieldDecorator;
        return (
            <div className="adjustment-container-one">

                <div className="adjustment-one-bar">

                    <div className="step-con">

                        <div className="title-warp">
                            <div className="step-title step-select">
                                <lable><i>1.</i>选择类型</lable>
                                <label className="ant-select-arrow"></label>
                            </div>
                            <div className="step-title">
                                <lable><i>2.</i>筛选范围</lable>
                                <label className="ant-select-arrow"></label>
                            </div>
                            <div className="step-title">
                                <lable><i>3.</i>确认</lable>
                            </div>
                        </div>

                        {/*          <div className="information-warp">
                            <span className="sel-tip">所属仓库：成品库</span>
                            <span className="sel-tip">调整类型：仓位移动</span>
                        </div>*/}
                    </div>

                    <Button type="primary" ghost onClick={this.handleNext}>下一步</Button>

                </div>


                <div className="adjustment-one-form">
                    <div className="form-tip">
                        请选择所属仓库和调整类型
                    </div>

                    <div className="form-tip-controller">
                        <Row>
                            <Col className="gutter-row" span={6}>

                                <FormItem
                                    {...formItemLayout}
                                    label="所属仓库"
                                    hasFeedback
                                >
                                    {getFieldDecorator('warehouseCode', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                message: '请从下拉列表中选择一项',
                                            }
                                        ],
                                    })(
                                        <TreeSelect
                                            className="asdasdasd11"
                                            style={{display: "block"}}
                                            {...siteStore.Props}
                                        />
                                    )}
                                </FormItem>

                                {/*<FormItem*/}
                                    {/*{...formItemLayout}*/}
                                    {/*label="所属仓库"*/}
                                    {/*hasFeedback*/}
                                {/*>*/}


                                   {/*{*/}
                                        {/*getFieldDecorator('warehouseCode', {*/}
                                                {/*rules: [{*/}
                                                    {/*required: true,*/}
                                                    {/*message: '请选择所属仓库!',*/}
                                                {/*}],*/}
                                                {/*initialValue: "",*/}
                                            {/*}*/}
                                        {/*)(*/}
                                            {/*<Select*/}
                                                {/*placeholder="请选择"*/}
                                                {/*style={{display: "block"}}*/}
                                            {/*>*/}
                                                {/*{*/}
                                                    {/*this.props.warehouseCodeEnum.map((item, index) => {*/}
                                                        {/*return (<Option key={index}*/}
                                                                        {/*value={item.siteCode + ""}>{item.siteName}</Option>);*/}
                                                    {/*})*/}
                                                {/*}*/}
                                            {/*</Select>*/}
                                        {/*)*/}
                                    {/*}*/}
                                {/*</FormItem>*/}
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem
                                    {...formItemLayout}
                                    label="调整类型"
                                    hasFeedback
                                >
                                    {
                                        getFieldDecorator('adjustTypeCode', {
                                                rules: [{
                                                    required: true,
                                                    message: '请选择调整类型!',
                                                }],
                                                initialValue: "",
                                            }
                                        )(
                                            <Select
                                                placeholder="请选择"
                                                style={{display: "block"}}
                                            >
                                                {
                                                    this.props.adjustTypeCodeEnum.map((item, index) => {
                                                        return (<Option key={index}
                                                                        value={item.busCode + ""}>{item.busName}</Option>);
                                                    })
                                                }
                                            </Select>
                                        )
                                    }

                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}
InventoryAdjustmentAddOneComp.defaultProps = {
    adjustTypeCodeEnum:[],
    warehouseCodeEnum:[],
    onNext:function (values) {

    }
}

export default InventoryAdjustmentAddOneComp;
