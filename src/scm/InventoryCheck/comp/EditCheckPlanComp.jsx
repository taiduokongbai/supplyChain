/**
 * 编辑盘点方案 modal
 */
import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Form, Checkbox, TreeSelect, Row, Col, Select } from '../../../base/components/AntdComp';
import FormModalComp from "../../../base/mobxComps/FormModalComp";
import { AddCheckPlanComp } from "./AddCheckPlanComp";
import { checkplan_store } from "../store/CheckPlanStore";
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

@observer
class EditCheckPlanComp extends AddCheckPlanComp {
    constructor(props, context) {
        super(props, context)
        this.store = this.props.store;
    }

    handleSubmit = (e) => {
        let { details } = this.store;
        e.preventDefault();
        if (!this.store.loading) {
            this.validateFds((err, data) => {
                const isBlindPlate = ['isBlindStocktake'];
                for (var i = 0; i < isBlindPlate.length; i++) {
                    if (data.isBlindStocktake && data.isBlindStocktake.includes(isBlindPlate[i])) {
                        data[isBlindPlate[i]] = 1;
                    } else {
                        data[isBlindPlate[i]] = 0;
                    }
                }
                data.warehouseCode = this.state.stockCode ? this.state.stockCode : details.warehouseCode;
                if (data.locationCodeStart && !data.locationCodeEnd) {
                    this.setState({ corning_end: 1 })
                } else if (data.locationCodeEnd && !data.locationCodeStart) {
                    this.setState({ corning_start: 1 })
                } else {
                    this.setState({
                        corning_end: 0,
                        corning_start: 0,
                    })
                    if (!err) {
                        data.id = data.id ? data.id : null;
                        this.store.save(data).then(json => {
                            if (json.status === 2000) {
                                this.store.setLoading(false)
                                this.handleCancel();
                                message.success("编辑方案成功！")
                                checkplan_store.fetchTableList();
                            }
                        })
                    }
                }

            });
        }
    }
    
}

export default Form.create()(EditCheckPlanComp);