import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Row, Col, Select, Form } from '../../../base/components/AntdComp';
import { impWorkSheetStore, addTableLineStore, addDialogLineStore, shippingSpaceStore, materialSelectStore } from "../store/ImpWorkSheetStore";
import FormModalComp from '../../../base/mobxComps/FormModalComp';
import Validate from '../../../base/consts/ValidateList';
import { WorkSheetCheck } from '../../consts/CheckUrls';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
let FormItem = Form.Item;
let Option = Select.Option;
@observer
class AddDialogWorkSheetComp extends FormModalComp {
    constructor(props) {
        super(props);
        this.store = addDialogLineStore;
        this.impWorkSheetStore = impWorkSheetStore;
        this.onSubmitWorkSheet = addTableLineStore.onMaterialAdd;
        this.shippingSpaceStore = shippingSpaceStore;
        this.materialSelectStore = materialSelectStore;
        this.state={
            statusColor:'#999999',
            shippingColor:'#999999',
            meterialColor:'#999999'
        }

    }
    handleCancel = () => {
        if (!this.store.loading) {
            this.store.setVisible(false);
            this.setState({statusColor:'#999999',shippingColor:'#999999',meterialColor:'#999999'})
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.store.loading) {
            this.validateFds((err, data) => {
                if (!err) {
                    let pm = {
                        stockId: this.impWorkSheetStore.impDetail.warehouseId,
                        freightSpaceCode: data.locationCode,
                        materialCode: data.materialCode,
                        batchCode: data.batchCode,
                        status: Number(data.inventoryStatus)
                    }
                    WorkSheetCheck.impWorkSheetAddLine(pm).then(json => {
                        if (json.status === 2000) {
                            data.accountQty = "0"
                            data.isManual = 1
                            data.differenceQty = ""
                            data.inventoryStatus = Number(data.inventoryStatus)
                            data = Object.assign({}, this.store.detail, data);
                            this.handleCancel();
                            this.onSubmitWorkSheet(data);
                            
                        } else {
                            message.info('添加的记录已在即时库存中存在，请重新输入！')
                        }
                        
                    })
                }
            });
        }
    }
    shippingSlect = (value, option) => {
        this.setState({shippingColor:'#4c4c4c'})
        for (let i = 0; i < this.shippingSpaceStore.selectList.slice().length; i++) {
            if (this.shippingSpaceStore.selectList.slice()[i].code == value) {
                this.setFdv({ locationName: this.shippingSpaceStore.selectList.slice()[i].name})
            }
        }
    }
    meterialSlect = (value, option) => {
        this.setState({meterialColor:'#4c4c4c'})
        this.setFdv({ materialName: option.props.children })
        for (let i = 0; i < this.materialSelectStore.selectList.length; i++) {
            if (this.materialSelectStore.selectList[i].materialCode == value) {
                this.setFdv({ inventoryUnitName: this.materialSelectStore.selectList[i].materialInventory.inventoryUnitName})
                this.setFdv({ inventoryUnitCode: this.materialSelectStore.selectList[i].materialInventory.inventoryUnitCode})
                this.setFdv({ inventoryUnitId: this.materialSelectStore.selectList[i].materialInventory.id})
            }
        }
    }
    statusSelect=()=>{
      this.setState({statusColor:'#4c4c4c'})
    }
    getComp = () => {
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        return (
            <div className="add-work-sheet-line">
                <FormItem label="仓库" {...formItemLayout} >
                    {this.getFD('warehouseName', {
                        initialValue: '' || this.impWorkSheetStore.impDetail.warehouseName,
                    })(
                        <Input readOnly />
                        )}
                </FormItem>
                <FormItem label="仓位" {...formItemLayout} >
                    {this.getFD('locationCode', {
                        initialValue: '请选择仓位',
                        rules: [
                            { required: true, message: '仓位字段必填' },
                            {
                                validator: (rule, val, callback) => {
                                    if (val == '请选择仓位') {
                                        callback("仓位字段必填");
                                    } else {
                                        callback();
                                    }
                                }
                            }
                        ]
                    })(
                        <Select style={{ width: "100%",color:this.state.shippingColor }} onSelect={(value, option) => this.shippingSlect(value, option)}>{this.shippingSpaceStore.options}</Select>
                        )}
                </FormItem>
                <FormItem label="仓位" {...formItemLayout} style={{ display: 'none' }} >
                    {this.getFD('locationName', {
                        initialValue: '',
                    })(
                        <input />
                        )}
                </FormItem>
                <FormItem label="物料" {...formItemLayout} >
                    {this.getFD('materialCode', {
                        initialValue: '请选择物料',
                        rules: [
                            { required: true, message: '物料字段必填' },
                            {
                                validator: (rule, val, callback) => {
                                    if (val == '请选择物料') {
                                        callback("物料字段必填");
                                    } else {
                                        callback();
                                    }
                                }
                            }
                        ]
                    })(
                        <Select style={{ width: "100%",color:this.state.meterialColor }} onSelect={(value, option) => this.meterialSlect(value, option)}>{this.materialSelectStore.options}</Select>
                        )}
                </FormItem>
                <FormItem label="物料" {...formItemLayout} style={{ display: 'none' }} >
                    {this.getFD('materialName', {
                        initialValue: '',
                    })(
                        <input />
                        )}
                </FormItem>
                <FormItem label="批次号" {...formItemLayout} >
                    {this.getFD('batchCode', {
                        initialValue: '',
                    })(
                        <Input placeholder="请输入批次号" />
                        )}
                </FormItem>
                <FormItem label="库存状态" {...formItemLayout}>
                    {
                        this.getFD('inventoryStatus', {
                            initialValue: '请选择库存状态',
                            rules: [
                                { required: true, message: '库存状态字段必填' },
                                {
                                    validator: (rule, val, callback) => {
                                        if (val == '请选择库存状态') {
                                            callback("库存状态字段必填");
                                        } else {
                                            callback();
                                        }
                                    }
                                }
                            ]
                        })(
                            <Select style={{ width: "100%",color:this.state.statusColor }} onSelect={()=>this.statusSelect()}>
                                {
                                    window.ENUM.getEnum("newInventoryStatus").map(newInventoryStatus => {
                                        return <Select.Option value={newInventoryStatus.catCode.toString()} key={newInventoryStatus.catCode}>{newInventoryStatus.catName}</Select.Option>
                                    })
                                }
                            </Select>
                            )
                    }
                </FormItem>
                <FormItem label="实盘数量" {...formItemLayout} >
                    {this.getFD('actualStocktakeQty', {
                        initialValue: '',
                        rules: [
                            {
                                required: true,
                                type: 'gtZero',
                                label: '实盘数量字段',
                                decimal: 2
                            }
                        ]
                    })(
                        <Input placeholder="请输入实盘数量" />
                        )}
                </FormItem>
                <FormItem label="库存单位" {...formItemLayout} style={{ display: 'none' }} >
                    {this.getFD('inventoryUnitName', {
                        initialValue: '',
                    })(
                        <input />
                        )}
                </FormItem>
                <FormItem label="库存单位" {...formItemLayout} style={{ display: 'none' }} >
                    {this.getFD('inventoryUnitCode', {
                        initialValue: '',
                    })(
                        <input />
                        )}
                </FormItem>
                <FormItem label="库存单位" {...formItemLayout} style={{ display: 'none' }} >
                    {this.getFD('inventoryUnitId', {
                        initialValue: '',
                    })(
                        <input />
                        )}
                </FormItem>
            </div>
        )
    }
}
export default Form.create()(AddDialogWorkSheetComp);
export { AddDialogWorkSheetComp }