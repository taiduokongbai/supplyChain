import React, { Component, PropTypes } from "react";
import { Form, Input, Spin, Button, Modal, Row, Col, message, Select } from 'antd';
import ModalComp from '../../../base/mobxComps/ModalComp';
import { TableEditComp } from '../../../base/mobxComps/TableEditComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import OperationsComp  from '../../../base/mobxComps/OperationsComp';

let { observer } = mobxReact;
import { receiptConfirmDetailStore, expenseDetailStore  } from '../stores/EditReceiptConfirmStore';
import { measureStore } from '../../data/DropDownStore';
let sum = 0;

class MyTableEditComp extends TableEditComp{
    constructor(props, context) {
        super(props, context);
        this.columns[this.columns.length - 1].render = this.optColRender;
    }
    
    //操作列使用的Render
    optColRender = (txt, record, index) => {
        let { editingRecord, editingIndex, recordKey, disableds,
            handleSave, onCancel, onEdit, onDelete, 
        } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        let opts = [
            {
                title: '确定',
                fun: () => this.validateFds((err, data) => {
                    if (!err) {
                        handleSave();
                    }
                }),
                show,
            },
            {
                title: '取消',
                fun: () => onCancel(),
                show,
            },
            {
                title: '编辑',
                fun: () => onEdit(record, index),
                show: editingIndex == null,
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
class ExpenseDetailComp extends ModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = expenseDetailStore;
        this.columns = [{
            title: '费用项',
            dataIndex: 'costName',
            key: 'costName',
            obj: {
                render: {
                    wid: 86
                }
            }    
        }, {
            title: '费用描述',
            dataIndex: 'costRemark',
            key: 'costRemark',
            obj: {
                render: {
                    wid: 200
                },
                rules: [{ max: 200, message:'费用描述不能超过200字符！'}],
            }  
        }, {
            title: '金额',
            dataIndex: 'money',
            key: 'money',
            obj: {
                rules: [
                    { type: 'gtEqZero', label: '金额', decimal:2},
                ],
                prefix: '￥',
                render: (txt) => {
                    txt = Number(txt).toFixed(2);
                    return `￥${txt}`
                }
            },
        }, {
            title: '操作',
            dataIndex: 'operation',
            width: 84,
            className: 'align-center'
        }];
    }
    handleCancel = () => {
        if (!this.store.loading) {
            this.store.setVisible(false);
            this.store.editingIndex = null;
            this.store.editingRecord = {};
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (expenseDetailStore.editingIndex != null) {
            message.warn('请确认费用项信息！');
            return
        }
        if (expenseDetailStore.dataSource.slice().length > 0) {
            sum = 0;
            expenseDetailStore.dataSource.slice().forEach((item) => {
                sum += Number(item.money);
            });
            if (!sum > 0) {
                message.warn('费用项金额不能为空！')
                return;
            }
        };
        receiptConfirmDetailStore.setDataSourceList(expenseDetailStore.dataSource, sum);
        this.handleCancel();
    }
    getComp = () => {
        let detail = receiptConfirmDetailStore.dataSource[expenseDetailStore.preId];
        return (
            <div>
                <div className='expenseDetail-baseInfo'>
                    <Row>
                        <Col span={12}>
                            <p><lable>物料编码：</lable><span title={detail.materialCode}>{detail.materialCode}</span></p>
                            <p><lable>物料名称：</lable><span title={detail.materialName}>{detail.materialName}</span></p>
                        </Col>
                        <Col span={12}>
                            <p><lable>规格：</lable><span title={detail.materialSpec}>{detail.materialSpec}</span></p>                                
                            <p><lable>型号：</lable><span title={detail.model}>{detail.model}</span></p>
                        </Col>
                    </Row>
                </div>         
                <div className='expenseDetail-table'>
                    <MyTableEditCont
                        {...expenseDetailStore.Props}
                        pagination={false}
                        rowKey={record=>record.id}
                        columns={this.columns}
                    />
                </div>    
            </div>
        )
    }
    
}
export { ExpenseDetailComp }