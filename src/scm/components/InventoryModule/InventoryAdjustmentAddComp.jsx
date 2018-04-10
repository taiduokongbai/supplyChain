/**
 * Created by MW on 2017/7/19.
 * 其他出库单_列表
 */

import React, {Component} from 'react'
import {Spin, message, Button, Select, Form, Row, Col, Input, Checkbox, Icon, Table,InputNumber} from 'antd'
import InventoryAdjustmentAddOneComp from "./InventoryAdjustmentAddOneComp";
import InventoryAdjustmentAddThreeComp from "./InventoryAdjustmentAddThreeComp";
import InventoryAdjustmentAddTwoComp from "./InventoryAdjustmentAddTwoComp";


const InventoryAdjustmentAddTwoForm = Form.create()(InventoryAdjustmentAddTwoComp);
const InventoryAdjustmentAddOneForm = Form.create()(InventoryAdjustmentAddOneComp);
const InventoryAdjustmentAddThreeForm = Form.create()(InventoryAdjustmentAddThreeComp);
export default class InventoryAdjustmentAddComp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //第一步选择值
            oneSelectVal:{
                adjustTypeCode:"",
                warehouseCode:""
            },
            moveInventoryQtyAll:false,
            newLocationCodeAllCode:"",
            twoSelRows: [],
            threeSelRows: [],


        }
    }



    handleOneNext=(oneSelectVal)=>{
        this.setState({
            oneSelectVal
        });
    }



    componentWillUnmount(){
        this.props.actions.init();
    }

    renderStep = () => {
        switch (this.props.stepEnum[this.props.stepIndex]) {
            case "one":

                return (
                    <InventoryAdjustmentAddOneForm
                        adjustTypeCodeEnum = {this.props.adjustTypeCodeEnum}
                        warehouseCodeEnum={this.props.warehouseCodeEnum}
                        actions={this.props.actions}
                        onNext={this.handleOneNext}
                    />
                );
            case "two":
                return (
                    <InventoryAdjustmentAddTwoForm
                        startLocationCodeEnum={this.props.startLocationCodeEnum}
                        endLocationCodeEnum={this.props.endLocationCodeEnum}
                        tableLocationCodeEnum = {this.props.tableLocationCodeEnum}
                        dataSource = {this.props.dataSource}
                        stepEnum = {this.props.stepEnum}
                        stepIndex = {this.props.stepIndex}
                        oneSelectVal = {this.state.oneSelectVal}
                        actions = {this.props.actions}
                    />
                );


            case "three":
                return  (
                    <InventoryAdjustmentAddThreeForm
                        startLocationCodeEnum={this.props.startLocationCodeEnum}
                        stepIndex = {this.props.stepIndex}
                        stepEnum = {this.props.stepEnum}
                        oneSelectVal = {this.state.oneSelectVal}
                        dataSource = {this.props.tempDataSource}
                        actions = {this.props.actions}
                    />
                )
            default :
                return null;
        }
    }


    render() {

        return (
            <div className="inventory-adjustment-add">
                <Spin spinning={this.props.loading}>
                    <div className="adjustment-container">
                        {
                            this.renderStep()
                        }
                    </div>
                </Spin>
            </div>
        )
    }
}
