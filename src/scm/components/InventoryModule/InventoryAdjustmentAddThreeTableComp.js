/**
 * Created by MW on 2017/4/20.
 * 新建采购退货出库单
 */
import React, {Component} from 'react';
import MyAutoComplete from "./MyAutoComplete";
import {
    Form,
    Input,
    Checkbox,
    Icon,
    InputNumber,
    Button,
    AutoComplete,
    Select,
    Popconfirm,
    message
} from 'antd'

const FormItem = Form.Item;

const Option = AutoComplete.Option;
import MTable from '../../../base/components/TableComp';


class TableFormComp extends Component {
    constructor(props) {
        super(props)
    }

    /*    addBatchAdd =(pm)=>{
            this.props.actions.addMaterialToAdjustmentBills(pm).then((json)=>{
                this.props.addMaterialToAdjustmentBillsCallBack && this.props.addMaterialToAdjustmentBillsCallBack(json);
            });
        }*/
    handleStartLocationCodeOnSearch = (val) => {
        this.props.actions.fetchStartLocationCodeEnum(val);
    }


    handleRowDle = (pm) => {
        this.props.actions.adjustRemove(pm).then((json) => {
            if (json.status === 2000) {
                message.success("删除成功");
            }
            this.props.actions.fetchTempDataSource(this.props.oneSelectVal);
        });
    }
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
                    }, {
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
                                    initSearchCode={record.newLocationCode + ""}
                                    getFieldDecorator={(dataSource) => {
                                        return (
                                            getFieldDecorator('newLocationCode_' + index, {
                                                    initialValue: record.newLocationCode + "",
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
                                                initialValue: record.newInventoryQty,
                                            }
                                        )(
                                            <InputNumber style={{width: 60}} min={0} max={record.oldInventoryQty} step={0.01}/>
                                        )
                                    }
                                </FormItem>
                            );
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        key: '',
                        width: 64,
                        render: (text, record, index) => {
                            return (
                                <Popconfirm title="确认删除该数据吗？"
                                            onConfirm={() => this.handleRowDle({list: [{id: record.id}]})} okText="确定"
                                            cancelText="取消">
                                    <a title="删除"><i className="c2mfont c2m-shanchu2"></i></a>
                                </Popconfirm>
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
                                                initialValue: record.newInventoryQty,
                                            }
                                        )(
                                            <InputNumber style={{width: 60}}  min={0} step={0.01}/>
                                        )
                                    }
                                </FormItem>
                            );

                        }
                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        key: '',
                        width: 64,
                        render: (text, record, index) => {
                            return (
                                <Popconfirm title="确认删除该数据吗？"
                                            onConfirm={() => this.handleRowDle({list: [{id: record.id}]})} okText="确定"
                                            cancelText="取消">
                                    <a title="删除"><i className="c2mfont c2m-shanchu2"></i></a>
                                </Popconfirm>
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
                            return (
                                <FormItem>
                                    {
                                        getFieldDecorator(`newBatchCode_${index}`, {
                                                initialValue: record.newBatchCode,
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
                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        key: '',
                        width: 64,
                        render: (text, record, index) => {
                            return (
                                <Popconfirm title="确认删除该数据吗？"
                                            onConfirm={() => this.handleRowDle({list: [{id: record.id}]})} okText="确定"
                                            cancelText="取消">
                                    <a title="删除"><i className="c2mfont c2m-shanchu2"></i></a>
                                </Popconfirm>
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
                                                    },
                                                ],
                                                initialValue: record.newStatus + "",
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
                                                initialValue: record.newInventoryQty,
                                            }
                                        )(
                                            <InputNumber style={{width: 60}} min={0} max={record.oldInventoryQty} step={0.01}/>
                                        )
                                    }
                                </FormItem>
                            );
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        key: '',
                        width: 64,
                        render: (text, record, index) => {
                            return (
                                <Popconfirm title="确认删除该数据吗？"
                                            onConfirm={() => this.handleRowDle({list: [{id: record.id}]})} okText="确定"
                                            cancelText="取消">
                                    <a title="删除"><i className="c2mfont c2m-shanchu2"></i></a>
                                </Popconfirm>
                            )
                        }

                    }
                ];
        }
    }


    render() {
        return (
            <MTable
                rowKey={"id"}
                selRows={this.props.selRows}
                rowSelection={
                    {
                        onChange: this.props.rowSelectionOnChange
                    }
                }
                cols={this.getColumns()}
                dataSource={this.props.dataSource.list}
                pagination={false}/>
        )
    }
}

TableFormComp.defaultProps = {
    delCallBack: () => {

    }
}


class InventoryAdjustmentAddTableComp extends Component {
    TableFormCon = Form.create()(TableFormComp);

    state = {
        newLocationCodeAllCode: {},
        marginLeft: -1000,
        selRows: []
    }

    constructor(props) {
        super(props)
    }


    initState = () => {
        this.setState({
            newLocationCodeAllCode: {},
            selRows: []
        });
    }

    componentWillReceiveProps(newProps) {
        if (this.props.dataSource.timestamp != newProps.dataSource.timestamp) {
            this.initState();
            this.TableFormCon = Form.create()(TableFormComp);


            this.props.form.resetFields();
            this.props.actions.fetchStartLocationCodeEnum();
        }
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


    handleBatchDel = (e) => {
        let pm = [];
        let a = this;
        for (var i = 0; i < this.state.selRows.length; i++) {
            pm.push({id: this.state.selRows[i]})
        }
        this.props.actions.adjustRemove({list: pm}).then((json) => {
            if (json.status === 2000) {
                message.success("删除成功");
            }
            this.props.actions.fetchTempDataSource(this.props.oneSelectVal);
            this.props.delCallBack && this.props.delCallBack(json);
        });
    }


    render() {
        let getFieldDecorator = this.props.form.getFieldDecorator;
        let TableFormCon = this.TableFormCon;
        return (

            <div className="adjustment-table">
                <div className="table-tool-bar" style={{marginLeft: this.state.marginLeft}}>
                    <Popconfirm title="确认删除该数据吗？" onConfirm={this.handleBatchDel} okText="确定" cancelText="取消">
                       <span className="delete">
                        <i className="c2mfont c2m-shanchu2"></i>
                         批量删除
                         </span>
                    </Popconfirm>
                </div>
                <div className="table-content">
                    <TableFormCon ref={(TableFormConObj) => {
                        this.TableFormConObj = TableFormConObj
                    }}
                                  newLocationCodeAllCode={this.state.newLocationCodeAllCode}
                                  selRows={this.state.selRows}
                                  oneSelectVal={this.props.oneSelectVal}
                                  rowSelectionOnChange={this.handleRowSelectionOnChange}
                                  dataSource={this.props.dataSource}
                                  actions={this.props.actions}
                                  startLocationCodeEnum={this.props.startLocationCodeEnum}
                                  addMaterialToAdjustmentBillsCallBack={this.props.addMaterialToAdjustmentBillsCallBack}

                    />
                </div>
            </div>

        );

    }
}

InventoryAdjustmentAddTableComp.defaultProps = {
    addMaterialToAdjustmentBillsCallBack: null,
    delCallBack: () => {

    }
}

export default Form.create({withRef: true})(InventoryAdjustmentAddTableComp);