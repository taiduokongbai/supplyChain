/**
 * Created by MW on 2017/7/19.
 * 其他出库单_列表
 */

import React, {Component} from 'react'
import {Spin, message, Button, Select, Form, Row, Col, Input,Icon } from 'antd';
import InventoryAdjustmentAddTableComp from "./InventoryAdjustmentAddTableComp";
import AutoSelectComp from "../../../base/components/AutoSelectComp";
const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
};




class InventoryAdjustmentAddTwoComp extends Component {
    state = {
        isShow:true,
        selRows:[],
    }

    constructor(props) {
        super(props)
    }

    handleNext=(e)=>{
        this.props.actions.stepNext();
    }

    handlePrev = (e) => {
        this.props.actions.stepPrevious();
    }
    handleClick = (e) => {
        this.setState({
            isShow: !this.state.isShow
        })
    }





    componentWillMount=()=>{
        this.props.actions.fetchEndLocationCodeEnum("",this.props.oneSelectVal.warehouseCode);
        this.props.actions.fetchStartLocationCodeEnum("",this.props.oneSelectVal.warehouseCode);
        this.handleSearch();
    }


    handleSearch = (e) => {


        this.props.form.validateFields((err,values) => {

                if (!err) {
                    values.warehouseCode = this.props.oneSelectVal.warehouseCode;
                    values.adjustTypeCode = this.props.oneSelectVal.adjustTypeCode;
                    this.props.actions.fetchDataSource(values);
                }
            },
        );


    }


    handleRowSelection=(selectedRowKeys, selectedRows)=>{
        this.setState({selRows: selectedRowKeys});
    }



    handleStartLocationCodeOnSearch=(val)=>{
        this.props.actions.fetchStartLocationCodeEnum(val,this.props.oneSelectVal.warehouseCode);
    }
    handleEndLocationCodeOnSearch=(val)=>{
        this.props.actions.fetchEndLocationCodeEnum(val,this.props.oneSelectVal.warehouseCode);
    }

    render() {
        let getFieldDecorator = this.props.form.getFieldDecorator;

        return (
            <div className="adjustment-container-two">

                <div className="adjustment-bar">
                    <div className="step-con">

                        <div className="title-warp">
                            <div className="step-title">
                                <lable><i>1.</i>选择类型</lable>
                                <label className="ant-select-arrow"></label>
                            </div>
                            <div className="step-title step-select">
                                <lable><i>2.</i>筛选范围</lable>
                                <label className="ant-select-arrow"></label>
                            </div>
                            <div className="step-title">
                                <lable><i>3.</i>确认</lable>
                            </div>
                        </div>

                        <div className="information-warp">
                            <span className="sel-tip">所属仓库：{this.props.dataSource.warehouseName || ""}</span>
                            <span className="sel-tip">调整类型：{this.props.dataSource.adjustTypeName || ""}</span>
                        </div>
                    </div>
                    <div>
                        <Button type="primary" ghost disabled={this.props.dataSource.adjustedNumber > 0 ? true : false} onClick={this.handlePrev}>上一步</Button>
                        <Button className="last-btn next-rwo-tip" type="primary" ghost onClick={this.handleNext}><i>{this.props.dataSource.adjustedNumber}</i>下一步</Button>
                    </div>
                </div>
                <div className="down-bar">
                    <div className="down-bar-handle" onClick={this.handleClick}>收起</div>
                </div>
                <div className={`adjustment-form ${(this.state.isShow ? "" : "adjustment-form-hide")}`}>
                    <div className="adjustment-form-tip">
                        请根据条件筛选出需要调整的数据，填写新仓位和移动数量后加入至调整单中
                    </div>
                    <div className="adjustment-form-controller">
                        <Row>
                            <Col span={22}>
                                <Row>
                                    <Col className="gutter-row" span={8}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="仓位"
                                        >
                                            {
                                                getFieldDecorator('startLocationCode', {
                                                        initialValue: "",
                                                    }
                                                )(
                                                    <AutoSelectComp
                                                        className="auto-select-block"
                                                        dropdownClassName="new-sales-store-search-dropdown"
                                                        selectedList={ this.props.startLocationCodeEnum }
                                                        onChange={(val) => this.handleStartLocationCodeOnSearch(val)}
                                                        optionLabelProp="displayName"
                                                        getOptionProps={(item)=>{
                                                            return {
                                                                displayName: item.code
                                                            }
                                                        }}
                                                        labelName="name"
                                                        keyName={"code"}
                                                        format={(item) => <div>
                                                            <div className="option-code">{item.code}</div>
                                                            <div className="option-name">{item.name}</div>
                                                        </div>}
                                                    />,
                                                )
                                            }

                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={8}>
                                        <FormItem
                                            className={"gutter-row-link"}
                                            labelCol={{span: 2}}
                                            wrapperCol={{span: 22}}
                                            label="—"
                                        >
                                            {
                                                getFieldDecorator('endLocationCode', {
                                                        rules: [{
                                                            message: '请选择结束仓位编码!',
                                                        }],
                                                        initialValue: "",
                                                    }
                                                )(
                                                    <AutoSelectComp
                                                        className="auto-select-block"
                                                        dropdownClassName="new-sales-store-search-dropdown"
                                                        selectedList={ this.props.endLocationCodeEnum }
                                                        onChange={(val) => this.handleEndLocationCodeOnSearch(val)}
                                                        optionLabelProp="displayName"
                                                        getOptionProps={(item)=>{
                                                            return {
                                                                displayName: item.code
                                                            }
                                                        }}
                                                        labelName="name"
                                                        keyName={"code"}
                                                        format={(item) => <div>
                                                            <div className="option-code">{item.code}</div>
                                                            <div className="option-name">{item.name}</div>
                                                        </div>}
                                                    />
                                                )
                                            }

                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="gutter-row" span={8}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="物料编码"
                                        >
                                            {
                                                getFieldDecorator('materialCode', {
                                                        initialValue: "",
                                                    }
                                                )(
                                                    <Input/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={8}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="物料名称"
                                        >
                                            {
                                                getFieldDecorator('materialName', {
                                                        initialValue: "",
                                                    }
                                                )(
                                                    <Input/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={8}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="批次号"
                                        >
                                            {
                                                getFieldDecorator('batchCode', {
                                                        initialValue: "",
                                                    }
                                                )(
                                                    <Input/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={2}>
                                <div className="submit-btn">
                                    <Button type="primary" onClick={this.handleSearch}><i
                                        className="storage c2mfont c2m-search1"/>查询</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                <InventoryAdjustmentAddTableComp
                    addMaterialToAdjustmentBillsCallBack={this.handleSearch}
                    oneSelectVal={this.props.oneSelectVal}
                    dataSource={this.props.dataSource}
                    actions={this.props.actions}
                    startLocationCodeEnum = {this.props.startLocationCodeEnum}
                />
            </div>
        );
    }
}
InventoryAdjustmentAddTwoComp.defaultProps = {
    adjustTypeCodeEnum:[],
    warehouseCodeEnum:[],
    onNext:function (values) {

    }
}

export default  InventoryAdjustmentAddTwoComp;
