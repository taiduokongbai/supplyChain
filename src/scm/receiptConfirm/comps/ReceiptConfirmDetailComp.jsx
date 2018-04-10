import React, { Component } from "react";
import { Table, Button, Popconfirm, message, Radio, Select, Form } from '../../../base/components/AntdComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { TableEditComp } from '../../../base/mobxComps/TableEditComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import { enumStore } from '../../../base/stores/EnumStore';
let { observer } = mobxReact;
import { receiptConfirmDetailStore  } from '../stores/EditReceiptConfirmStore';
import { measureStore } from '../../data/DropDownStore';
import { ExpenseDetailComp } from './ExpenseDetailComp';
class MyTableEditComp extends TableEditComp{
    constructor(props, context) {
        super(props, context);
        this.columns[this.columns.length - 1].render = this.optColRender;
    }
    
    //操作列使用的Render
    optColRender = (txt, record, index) => {
        let { editingRecord, editingIndex, recordKey, disableds,
            handleSave, onCancel, onEdit, onDelete, handleSave2
        } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        let opts = [
            {
                title: '费用明细',//费用明细
                fun: () => this.validateFds((err, data) => {
                    if (!err) {
                        handleSave2();
                    }
                }),
                show:show&&record['signFlag']=='1'
            },
            {
                title: '确定',//确定
                fun: () => this.validateFds((err, data) => {
                    if (!err) {
                        handleSave();
                    }
                }),
                show:show&&record['signFlag']=='0'
            },
            {
                title: '取消',
                fun: () => onCancel(),
                show,
            },
            record['receiveStatus'] == '2' ?
            {
                title: '--',
                fun: () => { },
                show: editingIndex == null,
            }:
            {
                title: '编辑',
                fun: () => onEdit(record, index),
                show: editingIndex == null && record['receiveStatus'] != '2',
            },
            {
                title: '--',
                fun: () => { },
                show: editingIndex == null,
            },
        ];
        return <OperationsComp operations={opts} />;
    }
}
const options = {
    onValuesChange(props, values) {
        props.setEditingRecord(values)
    }
}
let MyTableEditCont = Form.create(options)(MyTableEditComp);

@observer
export default class ReceiptConfirmDetailComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNo',
                key: 'lineNo',
                className:'align-center-first'
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
            },
            {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                obj: {
                    render: {
                        wid: 93
                    }
                } 
            },
            {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                obj: {
                    render: {
                        wid: 84
                    }
                } 
            },
            {
                title: '型号',
                dataIndex: 'model',
                key: 'model',
                obj: {
                    render: {
                        wid: 94
                    }
                } 
            },
            {
                title: '计划收货数量',
                dataIndex: 'planReceiveNumber',
                key: 'planReceiveNumber',
                render: (text, record, index) => text!==''&&text!==undefined&&Number(text).toFixed(2)
            },
            {
                title: '已收货数量',
                dataIndex: 'receiveNumber',
                key: 'receiveNumber',
                render: (text, record, index) => text!==''&&text!==undefined&&Number(text).toFixed(2)
            }, 
            {
                title: '本次收货数量',
                dataIndex: 'number',
                key: 'number',
                obj: {
                    rules: [
                        { type: 'gtZero', label: '本次收货数量', decimal: 2},
                        {
                            validator: (rule, value, callback) => {
                                let { planReceiveNumber, receiveNumber } = receiptConfirmDetailStore.editingRecord;
                                if (Number(value) > Number(planReceiveNumber) - Number(receiveNumber)) {
                                    callback('本次收货数量 应小于等于计划收货数量-已收货数量')
                                } else {
                                    callback()
                                }
                            }
                        }
                    ],
                    render: (txt) => Number(txt).toFixed(2)
                }
            },
            {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                obj: {
                    selectStore: measureStore
                }
                // render: (text, record, index) => measureStore.getLabelName(text),
            },
            {
                title: '金额合计',
                dataIndex: 'accAmount',
                key: 'accAmount',
                render: (text, record, index) => text!==''&&text!==undefined&&Number(text).toFixed(2)||'0.00'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 104,
                className: 'align-center'
            }
        ];
            
    }

    render() {
        return (
            <div className='receiptConfirmDetail-table'>
                <MyTableEditCont
                    {...receiptConfirmDetailStore.Props}
                    rowKey={record => record.lineNo}
                    columns={this.columns}
                />
                <ExpenseDetailComp/>
            </div>
        );
    }
}
