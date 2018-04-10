import React, { Component, PropTypes } from "react";
import { Form, Select, Input, Row, Col, TreeSelect, AutoComplete, Button, message, Popconfirm } from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/components/FormModalComp';
import EditableTableComp from '../../../base/components/EditableTableComp';
import TooltipComp from "../../../base/components/TooltipComp";
import { AutoSelectCell } from '../../../base/components/EditableCell';
const FormItem = Form.Item;
class TableComp extends EditableTableComp {
    constructor(props, context) {
        super(props, context);
        this.recordKey = 'rowKey';
        let { record } = this.props
        this.state = {
            disableds: ['stockName'],
            preReceiveNum: record.planAmount - record.beforehandDeliveryAmount,
            current: 1,
            pageSize: 10,
        }
        this.columns = [
            {
                title: 'rowKey',
                dataIndex: 'rowKey',
                key: 'rowKey',
                hidden: true
            }, {
                title: '行号',
                dataIndex: 'line',
                key: 'line',
                hidden: true
            }, {
                title: '仓位',
                dataIndex: 'freightSpaceCode',
                key: 'freightSpaceCode',
                width: 157,
                obj: {
                    keyName: 'code',
                    labelName: 'code',
                    listKey: 'code',
                    getList: props.actions.searchPosition,
                    dropdownMatchSelectWidth: false,
                    dropdownClassName: 'select-auto-complete',
                    placeholder: '请输入关键字',
                    dropdownStyle: { width: 290 },
                    style: { width: 100 },
                    rules: [
                        { required: true, message: '仓位必填' },
                    ],
                    format: (item) => (
                    <div className='auto-complete-option'>
                        <span>{item.code}</span> 
                        <span>{item.name ? '[' + item.name + ']' : ''}</span> 
                        <span>{item.stockName}</span>
                    </div>)
                },
            }, {
                title: '仓库',
                dataIndex: 'stockName',
                key: 'stockName',
            }, {
                title: '仓库编码',
                dataIndex: 'warehouseCode',
                key: 'warehouseCode',
                hidden: true,
            }, {
                title: '批次号',
                dataIndex: 'batchNum',
                key: 'batchNum',
                obj: {
                    style: { width: 100 },
                    rules: [
                        { max: 20, message: '批次号为0-20个字符' }
                    ],
                },
            }, {
                title: '预收货数量',
                dataIndex: 'materialAmount',
                key: 'materialAmount',
                obj: {
                    style: { width: 100 },
                    rules: [
                        { type: 'gtZero', label: '预收货数量', decimal: 2, max: this.state.preReceiveNum.toFixed(2) }
                    ],
                },
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: 80,
                className: 'table-operation'
            }
        ];

        this.columns[this.columns.length - 1].render = this.optColRender;
        this.columns.forEach((item) => {
            //input ---
            if (/^batchNum|stockName$/i.test(item.dataIndex)) {
                item.render = this.inputColRender(item.dataIndex, item.obj);
            }
            //autoselect
            if (/^freightSpaceCode$/i.test(item.dataIndex)) {
                item.render = this.autoSelectColRender(item.dataIndex, item.obj);
            }
            //inputNumberColRender
            if (/^materialAmount$/i.test(item.dataIndex)) {
                item.render = this.inputNumberColRender(item.dataIndex, item.obj);
            }
        })
    }
    autoSelectColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { keyName, labelName, getList, rules } = obj;
        let list = obj.list || this[dataIndex];
        if (this.state.isEdit == record[this.recordKey]) {
            if (this.state.disableds.includes(dataIndex)) {
                return this.record[dataIndex];
            } else {
                let { current, pageSize } = this.state;
                if (current && current != 1) {
                    index = (current - 1) * pageSize + index;
                };
                obj.selectedList = list;
                obj.onSelect = (value) => {
                    this.handleChange(dataIndex, index, value);
                };
                obj.onSearch = (value) => {
                    if (value) {
                        return getList(value).then(list => {
                            this[dataIndex] = list;
                            this.forceUpdate();
                        })
                    } else {
                        this[dataIndex] = [];
                        this.forceUpdate()
                    }
                };
                return (
                    <div>
                        <FormItem>
                            {this.getFD(dataIndex, {
                                initialValue: text,
                                rules: [
                                    {
                                        type: "autoselect",
                                        message: "请从下拉列表中选择一项！",
                                        list: list,
                                        keyName: keyName,
                                    },
                                    ...(rules || [])
                                ]
                            })(
                                <AutoSelectCell
                                    colName={dataIndex}
                                    record={this.record}
                                    obj={obj}
                                />
                                )}
                        </FormItem>
                    </div>
                )
            };
        } else {
            return text;
        }
    }
    getNewRow = () => {
        let rowKey = "-1";
        if (this.data[0] && this.data[0].rowKey < 0) {
            rowKey = this.data[0].rowKey - 1;
        };
        return {
            "rowKey": String(rowKey),
            "line": "",
            "warehouseCode": "",
            "stockName": "",
            "freightSpaceCode": "",
            "batchNum": "",
            "materialAmount": "",
        }
    }
    setDisableds = (purchaseType, tax = this.props.tax) => {

    }
    handleEdit = (record) => {
        record.isEdit = 1; // 当前行为编辑状态
        if (record.warehouseCode) {
            this.freightSpaceCode = [record];
        } else {
            this.freightSpaceCode = [];
        }
    }
    handleSave = () => {
        this.record.isEdit = 0;  // 当前行为非编辑状态
    }

    handleChange = (key, index, value) => {
        if (key === 'freightSpaceCode') {  
            this.record.freightSpaceCode = value.code;    // 仓位编码
            this.record.stockName = value.stockName;    // 站点名称
            this.record.warehouseCode = value.stockId || this.record.warehouseCode ;    // 站点编码
            //--- 为了二次编辑时，下拉框中能有当前行数据显示
            this.record.code = value.code;
            this.record.name = value.name;
            // this.record.siteName = value.siteName;
        }
        if (key === 'batchNum') {
            this.record.batchNum = value;
        }

        if (key === 'materialAmount') {
            this.record.materialAmount = value;
        }
        this.forceUpdate();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource != this.data) {
            this.data = nextProps.dataSource;
        }
    }


}

let MTable = Form.create()(TableComp);

class SalesReturnStoreDialogComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        const value = props.value || [];
        this.state = {
            list: value,
        }
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps && nextProps.value !== this.state.list) {
            const list = nextProps.value;
            this.setState({ list });
        }
    }
    submitHandler = (data, index) => {
        const onChange = this.props.onChange;
        onChange ? onChange(data, index) : null;
    }

    getComp = () => {
        let { list } = this.state;
        let dataSource = list || [];
        let { record, title, loading, ...props } = this.props;
        return (
            <div className='pre-receipt-dialog'>
                <div className="pre-receipt-dialog-title">
                    <Row className='pre-receipt-dialog-info-top'>
                        <Col span={8}><span>物料编码：{record.materialCode || ''}</span></Col>
                        <Col span={8}><span>库存单位：{record.materialUnitName || ''}</span></Col>
                        <Col span={8}>计划数量：<span className="receipt-number">{record.planAmount || 0}</span></Col>
                    </Row>
                    <Row className='pre-receipt-dialog-info-bottom'>
                        <Col span={12}><span className='material-name'>物料名称：<TooltipComp attr={{ text: record.materialName, wid: 172}} className="table-tooltip">{record.materialName || ''}</TooltipComp></span></Col>
                        <Col span={12}>预收货数量：<span className="distribute-number">{record.beforehandDeliveryAmount || 0}</span></Col>
                    </Row>
                </div>
                <MTable
                    {...props}
                    dataSource={dataSource}
                    handleSubmit={this.submitHandler}
                    rowKey={"key"}
                    addBtn="添加行"
                    style={{ marginTop: 20 }}
                    pagination={false}
                    record={record}
                />
            </div>
        )
    }
}

export default SalesReturnStoreDialogComp
