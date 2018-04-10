/**
 * Created by MW on 2017/4/20.
 * 新建采购退货出库单
 */
import React, {Component} from 'react';
import {
    Form,
    Input,
    Checkbox,
    Icon,
    InputNumber,
    AutoComplete,
    Select
} from 'antd'

const FormItem = Form.Item;

import MyAutoComplete from "./MyAutoComplete";

const Option = AutoComplete.Option;
import MTable from '../../../base/components/TableComp';


class TableFormComp extends Component {
    addBatchAdd = (pm) => {
        this.props.actions.addMaterialToAdjustmentBills(pm).then((json) => {
            this.props.addMaterialToAdjustmentBillsCallBack && this.props.addMaterialToAdjustmentBillsCallBack(json);
        });
    }
    /*    handleStartLocationCodeOnSearch = (val) => {
            this.props.actions.fetchStartLocationCodeEnum(val);
        }*/
    getColumns = () => {
        let getFieldDecorator = this.props.form.getFieldDecorator;

        /*[
            {code:"114",name:"仓位移动"},
            {code:"115",name:"数量调整"},
            {code:"116",name:"批次修改"},
            {code:"117",name:"状态调整"}
        ]*/


        switch (this.props.oneSelectVal.adjustTypeCode) {
            case "114":  //仓位移动
                return [
                    {
                        title: '物料编码',
                        dataIndex: 'materialCode',
                        key: 'materialCode',
                        width: 138,
                    },
                    {
                        title: '物料名称',
                        dataIndex: 'materialName',
                        key: 'materialName',
                    },
                    {
                        title: '仓库',
                        dataIndex: 'warehouseName',
                        key: 'warehouseName',
                    },
                    {
                        title: '批次号',
                        dataIndex: 'oldBatchCode',
                        key: 'oldBatchCode',
                    },
                    {
                        title: '库存状态',
                        dataIndex: 'oldStatusName',
                        key: 'oldStatusName',
                    },
                    {
                        title: '基本单位',
                        dataIndex: 'materialUnitName',
                        key: 'materialUnitName',
                    },
                    {
                        title: '原仓位',
                        dataIndex: 'oldLocationCode',
                        key: 'oldLocationCode',
                    },
                    {
                        title: '新仓位',
                        dataIndex: 'newLocationCode',
                        key: 'newLocationCode',
                        width: 120,
                        render: (text, record, index) => {
                            if (this.hasSelectRowByMaterialCode(record.id)) {
                                return (
                                    <FormItem>
                                        {
                                            getFieldDecorator('select_newLocationCode_' + index, {
                                                    rules: [
                                                        {required: true, message: '仓位必填!'}
                                                    ],
                                                    initialValue: this.props.newLocationCodeAllCode.code || null,
                                                }
                                            )(
                                                <Input type="hidden" style={{width: 80}}/>
                                            )
                                        }
                                        <Input style={{width: 80}} disabled
                                               value={this.props.newLocationCodeAllCode.name || null}/>
                                    </FormItem>
                                );
                            } else {
                                return (
                                    <MyAutoComplete
                                        fetchFn={this.props.actions.fetchLocationCode}
                                        warehouseCode={this.props.oneSelectVal.warehouseCode}
                                        optionLabelProp="displayName"
                                        keyName={"code"}
                                        className="input"
                                        style={{width: 80}}
                                        dropdownClassName="new-sales-store-search-dropdown"
                                        form={this.props.form}
                                        getFieldDecorator={(dataSource) => {
                                            return (
                                                getFieldDecorator('newLocationCode_' + index, {
                                                        initialValue: "",
                                                        rules: [
                                                            {required: true, message: '仓位必填!'},
                                                            {
                                                                message: '请从下拉列表中选择一项',
                                                                validator: (rule, value, callback) => {
                                                                    let result = false;
                                                                    if (value && Array.isArray(dataSource)) {
                                                                        dataSource.map(item => {
                                                                            if (item.code === value) {
                                                                                result = true;
                                                                            }
                                                                        });
                                                                    }
                                                                    if (!result) callback(rule.message || "");
                                                                    else callback();
                                                                }
                                                            }

                                                        ]
                                                    }
                                                )
                                            )
                                        }}
                                    />
                                );
                            }
                        }
                    },
                    {
                        title: '库存数量',
                        dataIndex: 'oldInventoryQty',
                        key: 'oldInventoryQty',
                    },
                    {
                        title: '移动数量',
                        dataIndex: 'newInventoryQty',
                        key: 'newInventoryQty',
                        width: 80,
                        render: (text, record, index) => {
                            if (this.hasSelectRowByMaterialCode(record.id) && this.props.moveInventoryQtyAll) {
                                return (
                                    <FormItem>
                                        {
                                            getFieldDecorator(`select_newInventoryQty_${index}`, {
                                                    rules: [
                                                        {
                                                            validator: (rule, value = "", callback) => {
                                                                if (value.length <= 0) {
                                                                    callback('必填')
                                                                } else if (!/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)) {
                                                                    callback("请输入数字。")
                                                                }
                                                                else if (!(value > 0)) {
                                                                    callback('必须大于0')
                                                                }
                                                                else if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
                                                                    callback("小数点后不能超过两位");
                                                                }
                                                                else if (value > record.oldInventoryQty) {
                                                                    callback('不能大于库存数量')
                                                                }
                                                                callback()
                                                            }
                                                        }
                                                    ],
                                                    initialValue: record.oldInventoryQty || 0,
                                                }
                                            )(
                                                <InputNumber style={{width: 60}} max={record.oldInventoryQty} min={0} step={0.01} disabled/>
                                            )
                                        }
                                    </FormItem>
                                )
                            } else {
                                return (
                                    <FormItem>
                                        {
                                            getFieldDecorator(`newInventoryQty_${index}`, {
                                                    rules: [
                                                        {
                                                            validator: (rule, value = "", callback) => {
                                                                if (value.length <= 0) {
                                                                    callback('必填')
                                                                } else if (!/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)) {
                                                                    callback("请输入数字。")
                                                                }
                                                                else if (!(value > 0)) {
                                                                    callback('必须大于0')
                                                                }
                                                                else if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
                                                                    callback("小数点后不能超过两位");
                                                                }
                                                                else if (value > record.oldInventoryQty) {
                                                                    callback('不能大于库存数量')
                                                                }
                                                                callback()
                                                            }
                                                        }
                                                    ],
                                                    initialValue: 0,
                                                }
                                            )(
                                                <InputNumber style={{width: 60}} min={0} max={record.oldInventoryQty} step={0.01}/>
                                            )
                                        }
                                    </FormItem>
                                );
                            }

                        }


                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        key: '',
                        width: 64,
                        render: (text, record, index) => {
                            return (
                                <div>
                                    <a title="加入" onClick={(e) => {
                                        this.props.form.validateFields([`select_newLocationCode_${index}`, `select_newInventoryQty_${index}`, `newLocationCode_${index}`, `newInventoryQty_${index}`], (err, values) => {
                                            if (!err) {
                                                let obj = {
                                                    newLocationCode: values["select_newLocationCode_" + index] || values["newLocationCode_" + index],
                                                    newInventoryQty: values["select_newInventoryQty_" + index] || values["newInventoryQty_" + index],
                                                }

                                                var pm = {
                                                    adjustTypeCode: this.props.oneSelectVal.adjustTypeCode,
                                                    warehouseCode: this.props.oneSelectVal.warehouseCode,
                                                    list: [Object.assign({}, record, obj)]
                                                };

                                                this.addBatchAdd(pm);
                                            }
                                        });

                                    }}><i className="c2mfont c2m-tianjia"></i></a>
                                </div>
                            );
                        }

                    }
                ];
            case "115":  //数量调整
                return [
                    {
                        title: '物料编码',
                        dataIndex: 'materialCode',
                        key: 'materialCode',
                        width: 138,
                    },
                    {
                        title: '物料名称',
                        dataIndex: 'materialName',
                        key: 'materialName',
                    }, {
                        title: '仓库',
                        dataIndex: 'warehouseName',
                        key: 'warehouseName',
                    },
                    {
                        title: '仓位',
                        dataIndex: 'oldLocationCode',
                        key: 'oldLocationCode',
                    },
                    {
                        title: '批次号',
                        dataIndex: 'oldBatchCode',
                        key: 'oldBatchCode',
                    },
                    {
                        title: '库存状态',
                        dataIndex: 'oldStatusName',
                        key: 'oldStatusName',
                    },
                    {
                        title: '基本单位',
                        dataIndex: 'materialUnitName',
                        key: 'materialUnitName',
                    },
                    {
                        title: '原库存数量',
                        dataIndex: 'oldInventoryQty',
                        key: 'oldInventoryQty',
                    },
                    {
                        title: '新库存数量',
                        dataIndex: 'newInventoryQty',
                        key: 'newInventoryQty',
                        width: 80,
                        render: (text, record, index) => {
                            if (this.hasSelectRowByMaterialCode(record.id) && this.props.moveInventoryQtyAll) {
                                return (
                                    <FormItem>
                                        {
                                            getFieldDecorator(`select_newInventoryQty_${index}`, {
                                                    rules: [
                                                        {
                                                            validator: (rule, value = "", callback) => {
                                                                if (value.length <= 0) {
                                                                    callback('必填')
                                                                } else if (!/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)) {
                                                                    callback("请输入数字。")
                                                                }
                                                                else if (!(value >= 0)) {
                                                                    callback('必须大于0等于0')
                                                                }
                                                                else if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
                                                                    callback("小数点后不能超过两位");
                                                                }
                                                                else if (value == record.oldInventoryQty) {
                                                                    callback('不能等于原库存数量')
                                                                }
                                                                callback()
                                                            }
                                                        }
                                                    ],
                                                    initialValue: record.oldInventoryQty || 0,
                                                }
                                            )(
                                                <InputNumber  style={{width: 60}} min={0} step={0.01} disabled/>
                                            )
                                        }
                                    </FormItem>
                                )
                            } else {
                                return (
                                    <FormItem>
                                        {
                                            getFieldDecorator(`newInventoryQty_${index}`, {
                                                    rules: [
                                                        {
                                                            validator: (rule, value = "", callback) => {
                                                                if (value.length <= 0) {
                                                                    callback('必填')
                                                                } else if (!/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)) {
                                                                    callback("请输入数字。")
                                                                }
                                                                else if (!(value >= 0)) {
                                                                    callback('必须大于0等于0')
                                                                }
                                                                else if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
                                                                    callback("小数点后不能超过两位");
                                                                }
                                                                else if (value == record.oldInventoryQty) {
                                                                    callback('不能等于原库存数量')
                                                                }
                                                                callback()
                                                            }
                                                        }
                                                    ],
                                                    initialValue: 0,
                                                }
                                            )(
                                                <InputNumber style={{width: 60}} min={0}  step={0.01}/>
                                            )
                                        }
                                    </FormItem>
                                );
                            }

                        }
                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        key: '',
                        width: 64,
                        render: (text, record, index) => {
                            return (
                                <div>
                                    <a title="加入" onClick={(e) => {
                                        this.props.form.validateFields([`select_newInventoryQty_${index}`, `newInventoryQty_${index}`], (err, values) => {
                                            if (!err) {

                                                let obj = {
                                                    newInventoryQty: values["select_newInventoryQty_" + index] || values["newInventoryQty_" + index],
                                                };

                                                var pm = {
                                                    adjustTypeCode: this.props.oneSelectVal.adjustTypeCode,
                                                    warehouseCode: this.props.oneSelectVal.warehouseCode,
                                                    list: [Object.assign({}, record, obj)]
                                                };

                                                this.addBatchAdd(pm);

                                            }


                                        });

                                    }}><i className="c2mfont c2m-tianjia"></i></a>
                                </div>
                            )
                        }

                    }
                ];
            case "116"://批次修改
                return [
                    {
                        title: '物料编码',
                        dataIndex: 'materialCode',
                        key: 'materialCode',
                        width: 138,
                    },
                    {
                        title: '物料名称',
                        dataIndex: 'materialName',
                        key: 'materialName',
                    },
                    {
                        title: '仓库',
                        dataIndex: 'warehouseName',
                        key: 'warehouseName',
                    },
                    {
                        title: '仓位',
                        dataIndex: 'oldLocationCode',
                        key: 'oldLocationCode',
                    },
                    {
                        title: '库存状态',
                        dataIndex: 'oldStatusName',
                        key: 'oldStatusName',
                    },
                    {
                        title: '库存数量',
                        dataIndex: 'oldInventoryQty',
                        key: 'oldInventoryQty',
                    },
                    {
                        title: '基本单位',
                        dataIndex: 'materialUnitName',
                        key: 'materialUnitName',
                    },
                    {
                        title: '原批次号',
                        dataIndex: 'oldBatchCode',
                        key: 'oldBatchCode',
                    },
                    {
                        title: '新批次号',
                        dataIndex: 'newBatchCode',
                        key: 'newBatchCode',
                        render: (text, record, index) => {
                            if (this.hasSelectRowByMaterialCode(record.id)) {
                                return (
                                    <FormItem>
                                        {
                                            getFieldDecorator(`select_newBatchCode_${index}`, {
                                                    initialValue: this.props.newBatchCodeALL || "",
                                                    rules: [
                                                        {
                                                            validator: (rule, value = "", callback) => {
                                                                if (record.oldBatchCode == value) {
                                                                    callback('原批次号不能等于新批次号')
                                                                }
                                                                callback()
                                                            }
                                                        }
                                                    ],
                                                }
                                            )(
                                                <Input style={{width: 60}} disabled/>
                                            )
                                        }
                                    </FormItem>
                                )
                            } else {
                                return (
                                    <FormItem>
                                        {
                                            getFieldDecorator(`newBatchCode_${index}`, {
                                                initialValue: record.newBatchCode || "",
                                                rules: [
                                                    {
                                                        validator: (rule, value = "", callback) => {
                                                            if (record.oldBatchCode == value) {
                                                                callback('原批次号不能等于新批次号')
                                                            }
                                                            callback()
                                                        }
                                                    }
                                                ],
                                                }
                                            )(
                                                <Input style={{width: 60}}/>
                                            )
                                        }
                                    </FormItem>
                                );
                            }
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        key: '',
                        width: 64,
                        render: (text, record, index) => {
                            return (
                                <div>
                                    <a title="加入" onClick={(e) => {
                                        this.props.form.validateFields([`select_newBatchCode_${index}`,`newBatchCode_${index}`,], (err, values) => {
                                            if (!err) {
                                                let obj = {
                                                    newBatchCode: values["select_newBatchCode_" + index] || values["newBatchCode_" + index],
                                                }

                                                var pm = {
                                                    adjustTypeCode: this.props.oneSelectVal.adjustTypeCode,
                                                    warehouseCode: this.props.oneSelectVal.warehouseCode,
                                                    list: [Object.assign({}, record, obj)]
                                                };

                                                this.addBatchAdd(pm);
                                            }
                                        });

                                    }}><i className="c2mfont c2m-tianjia"></i></a>
                                </div>
                            )
                        }

                    }
                ];
            case "117": //状态调整

                return [
                    {
                        title: '物料编码',
                        dataIndex: 'materialCode',
                        key: 'materialCode',
                        width: 138,
                    },
                    {
                        title: '物料名称',
                        dataIndex: 'materialName',
                        key: 'materialName',
                    },
                    {
                        title: '仓库',
                        dataIndex: 'warehouseName',
                        key: 'warehouseName',
                    },
                    {
                        title: '仓位',
                        dataIndex: 'oldLocationCode',
                        key: 'oldLocationCode',
                    },
                    {
                        title: '批次号',
                        dataIndex: 'oldBatchCode',
                        key: 'oldBatchCode',
                    },
                    {
                        title: '基本单位',
                        dataIndex: 'materialUnitName',
                        key: 'materialUnitName',
                    },
                    {
                        title: '原库存状态',
                        dataIndex: 'oldStatusName',
                        key: 'oldStatusName',
                    },
                    {
                        title: '新库存状态',
                        dataIndex: 'newStatus',
                        key: 'newStatus',
                        render: (text, record, index) => {


                            if (this.hasSelectRowByMaterialCode(record.id)) {

                                return (
                                    <FormItem>
                                        {
                                            getFieldDecorator('select_newStatus_' + index, {
                                                    rules: [
                                                        {required: true, message: '新状态必填!'},
                                                        {
                                                            validator: (rule, value = "", callback) => {
                                                                let oldStatus = `${record.oldStatus}`;
                                                                if (oldStatus == value) {
                                                                    callback('原库存状态不能等于新库存状态')
                                                                }
                                                                callback()
                                                            }
                                                        }
                                                    ],
                                                    initialValue: this.props.newStatusAll || "",
                                                }
                                            )(
                                                <Select style={{width: 120}} disabled>
                                                    <Select.Option value="0">可用</Select.Option>
                                                    <Select.Option value="4">冻结</Select.Option>
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                )
                            } else {
                                return (
                                    <FormItem>
                                        {
                                            getFieldDecorator(`newStatus_${index}`, {
                                                    rules: [
                                                        {required: true, message: '新状态必填!'},
                                                        {
                                                            validator: (rule, value = "", callback) => {
                                                                let oldStatus = `${record.oldStatus}`;
                                                                if (oldStatus == value) {
                                                                    callback('原库存状态不能等于新库存状态')
                                                                }
                                                                callback()
                                                            }
                                                        }
                                                    ],
                                                    initialValue: record.newStatus || "",
                                                }
                                            )(
                                                <Select style={{width: 120}}>
                                                    <Select.Option value="0">可用</Select.Option>
                                                    <Select.Option value="4">冻结</Select.Option>
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                );
                            }
                        }
                    },
                    {
                        title: '库存数量',
                        dataIndex: 'oldInventoryQty',
                        key: 'oldInventoryQty',
                    },
                    {
                        title: '调整数量',
                        dataIndex: 'newInventoryQty',
                        key: 'newInventoryQty',
                        width: 80,
                        render: (text, record, index) => {
                            if (this.hasSelectRowByMaterialCode(record.id) && this.props.moveInventoryQtyAll) {
                                return (
                                    <FormItem>
                                        {
                                            getFieldDecorator(`select_newInventoryQty_${index}`, {
                                                    rules: [
                                                        {
                                                            validator: (rule, value = "", callback) => {
                                                                if (value.length <= 0) {
                                                                    callback('必填')
                                                                } else if (!/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)) {
                                                                    callback("请输入数字。")
                                                                }
                                                                else if (!(value > 0)) {
                                                                    callback('必须大于0')
                                                                }
                                                                else if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
                                                                    callback("小数点后不能超过两位");
                                                                }
                                                                else if (value > record.oldInventoryQty) {
                                                                    callback('不能大于库存数量')
                                                                }
                                                                callback()
                                                            }
                                                        }
                                                    ],
                                                    initialValue: record.oldInventoryQty || 0,
                                                }
                                            )(
                                                <InputNumber style={{width: 60}} min={0} step={0.01} max={record.oldInventoryQty} disabled/>
                                            )
                                        }
                                    </FormItem>
                                )
                            } else {
                                return (
                                    <FormItem>
                                        {
                                            getFieldDecorator(`newInventoryQty_${index}`, {
                                                    rules: [
                                                        {
                                                            validator: (rule, value = "", callback) => {
                                                                if (value.length <= 0) {
                                                                    callback('必填')
                                                                } else if (!/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)) {
                                                                    callback("请输入数字。")
                                                                }
                                                                else if (!(value > 0)) {
                                                                    callback('必须大于0')
                                                                }
                                                                else if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
                                                                    callback("小数点后不能超过两位");
                                                                }
                                                                else if (value > record.oldInventoryQty) {
                                                                    callback('不能大于库存数量')
                                                                }
                                                                callback()
                                                            }
                                                        }
                                                    ],
                                                    initialValue: 0,
                                                }
                                            )(
                                                <InputNumber style={{width: 60}} min={0} max={record.oldInventoryQty} step={0.01}/>
                                            )
                                        }
                                    </FormItem>
                                );
                            }

                        }
                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        key: '',
                        width: 64,
                        render: (text, record, index) => {
                            return (
                                <div>
                                    <a title="加入" onClick={(e) => {

                                        this.props.form.validateFields([`select_newStatus_${index}`, `newStatus_${index}`, `select_newInventoryQty_${index}`, `newInventoryQty_${index}`], (err, values) => {

                                            if (!err) {
                                                let obj = {
                                                    newStatus: parseInt(values["select_newStatus_" + index] || values["newStatus_" + index], 10),
                                                    newInventoryQty: values["select_newInventoryQty_" + index] || values["newInventoryQty_" + index],
                                                }

                                                var pm = {
                                                    adjustTypeCode: this.props.oneSelectVal.adjustTypeCode,
                                                    warehouseCode: this.props.oneSelectVal.warehouseCode,
                                                    list: [Object.assign({}, record, obj)]
                                                };


                                                this.addBatchAdd(pm);

                                            }
                                        });


                                    }}><i className="c2mfont c2m-tianjia"></i></a>
                                </div>
                            )
                        }

                    }
                ];
        }
    }
    hasSelectRowByMaterialCode = (materialCode) => {
        let selRows = this.props.selRows;
        for (var i = 0; i < selRows.length; i++) {
            if (selRows[i] === materialCode) {
                return true;
            }
        }
        return false;
    }

    constructor(props) {
        super(props)
    }
    render() {
        return (
            <MTable
                rowKey={"id"}
                selRows={this.props.oneSelectVal.adjustTypeCode == "115" ? null : this.props.selRows}
                rowSelection={{
                    onChange: this.props.rowSelectionOnChange
                }}
                cols={this.getColumns()}
                dataSource={this.props.dataSource.list}
                pagination={false}
             />
        )
    }
}


class InventoryAdjustmentAddTableComp extends Component {
    TableFormCon = Form.create()(TableFormComp);

    state = {
        marginLeft: -1000,
        newLocationCodeAllCode: {},
        moveInventoryQtyAll: false,
        selRows: [],
        newBatchCodeALL: "",//新批次号
        newStatusAll: "",//新库存状态
    }
    addBatchAdd = (pm) => {


        this.props.actions.addMaterialToAdjustmentBills(pm).then((json) => {
            this.props.addMaterialToAdjustmentBillsCallBack && this.props.addMaterialToAdjustmentBillsCallBack(json);

            if (this.refs.tempAutoComplete && this.refs.tempAutoComplete.handleOnSearch) {
                this.refs.tempAutoComplete.handleOnSearch("");
            }

        });
    }
    /*    handleStartLocationCodeOnSearch = (val) => {
            this.props.actions.fetchStartLocationCodeEnum(val);
        }*/
    handMoveInventoryQtyAllOnChange = (e) => {
        this.setState({
            moveInventoryQtyAll: e.target.checked
        });
    }
    initState = () => {
        this.setState({
            marginLeft: -1000,
            newBatchCodeALL: "",//新批次号
            newStatusAll: "",//新库存状态
            newLocationCodeAllCode: {},
            moveInventoryQtyAll: false,
            selRows: []
        });


    }
    handleRowSelectionOnChange = (selectedRowKeys, selectedRows) => {
        if (selectedRowKeys.length > 0) {
            this.setState({
                marginLeft: 0
            });
        } else {
            this.setState({
                marginLeft: -1000
            });
        }
        this.setState({selRows: selectedRowKeys});


    }
    handleBatchAdd = (e) => {

        switch (this.props.oneSelectVal.adjustTypeCode) {
            case "114":  //仓位移动
                this.handleBatchAddByNewLocationCode();
                break;
            case "115"://数量调整
                this.handleBatchAddByNewInventoryQty();
                break;
            case "116"://批次修改
                this.handleBatchAddByNewBatchCode();
                break;
            case "117": //状态调整
                this.handleBatchAddByNewStatus();
                break;
        }

    }
    reFormartSubmitData = (validateValues) => {
        var objArray = {};
        for (var key in validateValues) {
            if (!validateValues[key]) {
                delete validateValues[key];
            } else {
                var keyIndex = key.replace("select_", "").split("_");
                if (!objArray[keyIndex[1]]) {
                    objArray[keyIndex[1]] = {};
                }

                if (keyIndex[0] == "newStatus") {
                    objArray[keyIndex[1]][keyIndex[0]] = parseInt(validateValues[key], 10);
                } else {
                    objArray[keyIndex[1]][keyIndex[0]] = validateValues[key];
                }

            }
        }

        var list = [];
        for (var key in objArray) {
            var row = this.props.dataSource.list[parseInt(key, 10)];
            list.push(Object.assign({}, row, objArray[key]));
        }


        return {
            adjustTypeCode: this.props.oneSelectVal.adjustTypeCode,
            warehouseCode: this.props.oneSelectVal.warehouseCode,
            list
        };
    }
    reFormartSubmitDataISNull = (validateValues) => {
        var objArray = {};
        for (var key in validateValues) {
            var keyIndex = key.replace("select_", "").split("_");
            if (!objArray[keyIndex[1]]) {
                objArray[keyIndex[1]] = {};
            }

            if (keyIndex[0] == "newStatus") {
                objArray[keyIndex[1]][keyIndex[0]] = parseInt(validateValues[key], 10);
            } else {
                objArray[keyIndex[1]][keyIndex[0]] = validateValues[key];
            }
        }

        var list = [];
        for (var key in objArray) {
            var row = this.props.dataSource.list[parseInt(key, 10)];
            list.push(Object.assign({}, row, objArray[key]));
        }


        return {
            adjustTypeCode: this.props.oneSelectVal.adjustTypeCode,
            warehouseCode: this.props.oneSelectVal.warehouseCode,
            list
        };
    }
    //状态调整
    handleBatchAddByNewStatus = () => {
        let form = this.TableFormConObj.getForm();
        let validateArray = [];
        let list = this.props.dataSource.list;

        for (var i = 0; i < list.length; i++) {
            if (this.hasSelectRowByMaterialCode(list[i].id)) {
                validateArray.push("newStatus_" + i);
                validateArray.push("select_newStatus_" + i);

                validateArray.push("newInventoryQty_" + i);
                validateArray.push("select_newInventoryQty_" + i);
            }
        }


        form.validateFields(validateArray, (err, values) => {
            if (!err) {
                let pm = this.reFormartSubmitData(values);

                this.addBatchAdd(pm);
            }
        });

    }
    //仓位移动
    handleBatchAddByNewLocationCode = () => {
        let form = this.TableFormConObj.getForm();
        let validateArray = [];
        let list = this.props.dataSource.list;

        for (var i = 0; i < list.length; i++) {
            if (this.hasSelectRowByMaterialCode(list[i].id)) {
                validateArray.push("newLocationCode_" + i);
                validateArray.push("select_newLocationCode_" + i);

                validateArray.push("newInventoryQty_" + i);
                validateArray.push("select_newInventoryQty_" + i);
            }
        }


        let formError = true;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                formError = false;
            }
        });

        form.validateFields(validateArray, (err, values) => {
            if (!err && (!formError)) {
                let pm = this.reFormartSubmitData(values);

                this.addBatchAdd(pm);
            }
        });


    }
    //数量调整
    handleBatchAddByNewInventoryQty = () => {
        let form = this.TableFormConObj.getForm();
        let validateArray = [];
        let list = this.props.dataSource.list;

        for (var i = 0; i < list.length; i++) {
            if (this.hasSelectRowByMaterialCode(list[i].id)) {

                validateArray.push("newInventoryQty_" + i);
                validateArray.push("select_newInventoryQty_" + i);
            }
        }

        form.validateFields(validateArray, (err, values) => {
            if (!err) {
                let pm = this.reFormartSubmitData(values);

                this.addBatchAdd(pm);
            }
        });

    }
    //批次号
    handleBatchAddByNewBatchCode = () => {
        let form = this.TableFormConObj.getForm();
        let validateArray = [];
        let list = this.props.dataSource.list;
        let selectRowValues = [];
        for (var i = 0; i < list.length; i++) {
            if (this.hasSelectRowByMaterialCode(list[i].id)) {
                validateArray.push("select_newBatchCode_" + i);
                selectRowValues.push(list[i]);
            }
        }


        form.validateFields(validateArray, (err, values) => {

            if(!err){
                if (validateArray.length > 0) {
                    let pm = this.reFormartSubmitDataISNull(values);
                    this.addBatchAdd(pm);
                }
            }

        });


    }
    handleOnSelect = (code, comp) => {
        const {displayName, eventKey} = comp.props;
        this.setState({
            newLocationCodeAllCode: {
                code: eventKey,
                name: displayName
            }
        });
        let form = this.TableFormConObj.getForm();

        let list = this.props.dataSource.list;

        for (var i = 0; i < list.length; i++) {
            if (this.hasSelectRowByMaterialCode(list[i].id)) {
                let obj = {};
                obj["select_newLocationCode_" + i] = eventKey;
                form.setFieldsValue(obj)
            }
        }


    }
    hasSelectRowByMaterialCode = (id) => {
        let selRows = this.state.selRows;
        for (var i = 0; i < selRows.length; i++) {
            if (selRows[i] === id) {
                return true;
            }
        }
        return false;
    }
    renderTableBar = () => {
        let getFieldDecorator = this.props.form.getFieldDecorator;
        switch (this.props.oneSelectVal.adjustTypeCode) {
            case "114":  //仓位移动
                return (
                    <div className="table-tool-warp">
                        <span className="table-tool-store">
                            <lable>新仓位:</lable>
                            <MyAutoComplete
                                warehouseCode={this.props.oneSelectVal.warehouseCode}
                                style={{width: 80}}
                                ref="tempAutoComplete"
                                fetchFn={this.props.actions.fetchLocationCode}
                                optionLabelProp="displayName"
                                keyName={"code"}
                                onSelect={this.handleOnSelect}
                                className="input"
                                getFieldDecorator={(dataSource) => {
                                    return (
                                        getFieldDecorator('tempAutoComplete', {
                                                initialValue: "",
                                                rules: [
                                                    {required: true, message: '仓位必填!'},
                                                    {
                                                        message: '请从下拉列表中选择一项',
                                                        validator: (rule, value, callback) => {
                                                            let result = false;
                                                            if (value && Array.isArray(dataSource)) {
                                                                dataSource.map(item => {
                                                                    if (item.code === value) {
                                                                        result = true;
                                                                    }
                                                                });
                                                            }
                                                            if (!result) callback(rule.message || "");
                                                            else callback();
                                                        }
                                                    }

                                                ]
                                            }
                                        )
                                    )
                                }}
                                dropdownClassName="new-sales-store-search-dropdown"

                            />
                        </span>
                        <span>
                            <Checkbox onChange={this.handMoveInventoryQtyAllOnChange}
                                      checked={this.state.moveInventoryQtyAll}>移动所有数量</Checkbox>
                        </span>
                    </div>
                );
            case "115":  //数量调整
                return (
                    <div className="table-tool-warp">
                      {/*  <span>
                            <Checkbox onChange={this.handMoveInventoryQtyAllOnChange}
                                      checked={this.state.moveInventoryQtyAll}>移动所有数量</Checkbox>
                        </span>*/}
                    </div>
                );
                break;
            case "116"://批次修改
                return (
                    <div className="table-tool-warp">
                        <span className="table-tool-store">
                            <lable>新批次号:</lable>
                            <Input style={{width: 80}} onChange={this.handleBatchCodeAllOnChange}
                                   value={this.state.newBatchCodeALL}/>
                        </span>
                    </div>
                );
            case "117": //状态调整
                return (
                    <div className="table-tool-warp">
                        <span className="table-tool-store">
                            <lable>新库存状态:</lable>
                               <Select style={{width: 120}} onChange={this.handleNewStatusAllOnChange}
                                       value={this.state.newStatusAll}>
                                   <Select.Option value="0">可用</Select.Option>
                                   <Select.Option value="4">冻结</Select.Option>
                               </Select>
                        </span>
                        <span>
                            <Checkbox onChange={this.handMoveInventoryQtyAllOnChange} checked={this.state.moveInventoryQtyAll}>移动所有数量</Checkbox>
                        </span>
                    </div>
                );


        }
    }
    handleNewStatusAllOnChange = (newStatusAll) => {
        this.setState({
            newStatusAll
        });

        let form = this.TableFormConObj.getForm();

        let list = this.props.dataSource.list;

        for (var i = 0; i < list.length; i++) {
            if (this.hasSelectRowByMaterialCode(list[i].id)) {
                let obj = {};
                obj["select_newStatus_" + i] = newStatusAll;
                form.setFieldsValue(obj)
            }
        }

    }
    handleBatchCodeAllOnChange = (e) => {
        let newBatchCodeALL = e.target.value;
        this.setState({
            newBatchCodeALL
        });

        let form = this.TableFormConObj.getForm();

        let list = this.props.dataSource.list;

        for (var i = 0; i < list.length; i++) {
            if (this.hasSelectRowByMaterialCode(list[i].id)) {
                let obj = {};
                obj["select_newBatchCode_" + i] = newBatchCodeALL;
                form.setFieldsValue(obj);
            }
        }
    }
    handleAddMaterialToAdjustmentBillsCallBack = (json) => {
        this.props.addMaterialToAdjustmentBillsCallBack && this.props.addMaterialToAdjustmentBillsCallBack(json);
        if (this.refs.tempAutoComplete && this.refs.tempAutoComplete.handleOnSearch) {
            this.refs.tempAutoComplete.handleOnSearch("");
        }
    }

    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(newProps) {
        if (this.props.dataSource.timestamp != newProps.dataSource.timestamp) {

            this.initState();
            this.TableFormCon = Form.create()(TableFormComp);
            this.props.form.resetFields();
            /*            this.props.actions.fetchStartLocationCodeEnum();*/
        }
    }

    render() {
        let getFieldDecorator = this.props.form.getFieldDecorator;
        let TableFormCon = this.TableFormCon;
        return (

            <div className="adjustment-table">
                <div className="table-tool-bar" style={{marginLeft: this.state.marginLeft}}>
                    {
                        this.renderTableBar()
                    }
                    <span className="batch" onClick={this.handleBatchAdd}>
                        <i className="c2mfont c2m-piliangjiaru"></i>
                            批量加入
                    </span>
                </div>
                <div className="table-content">
                    <TableFormCon ref={(TableFormConObj) => {
                        this.TableFormConObj = TableFormConObj
                    }}

                                  newBatchCodeALL={this.state.newBatchCodeALL}
                                  newStatusAll={this.state.newStatusAll}
                                  newLocationCodeAllCode={this.state.newLocationCodeAllCode}
                                  moveInventoryQtyAll={this.state.moveInventoryQtyAll}
                                  selRows={this.state.selRows}
                                  oneSelectVal={this.props.oneSelectVal}
                                  rowSelectionOnChange={this.handleRowSelectionOnChange}
                                  dataSource={this.props.dataSource}
                                  actions={this.props.actions}
                        /*             startLocationCodeEnum={this.props.startLocationCodeEnum}*/

                                  addMaterialToAdjustmentBillsCallBack={this.handleAddMaterialToAdjustmentBillsCallBack}
                    />
                </div>
            </div>

        );

    }
}

InventoryAdjustmentAddTableComp.defaultProps = {
    addMaterialToAdjustmentBillsCallBack: null
}

export default Form.create()(InventoryAdjustmentAddTableComp);