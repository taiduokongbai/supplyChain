import React, { Component } from "react";
import { Table, Button, Popconfirm, message, Radio, Select, Form } from '../../../base/components/AntdComp';
import { TableEditComp } from '../../../base/mobxComps/TableEditComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import { enumStore } from '../../../base/stores/EnumStore';
import { formatNullStr } from '../../../base/consts/Utils';
import TooltipComp from "../../../base/mobxComps/TooltipComp";
let { observer } = mobxReact;
import { addSaleDeliveryNoticeStore, addSaleDeliveryNoticeDetailStore } from '../stores/AddSaleDeliveryNoticeStore';
const FormItem = Form.Item;

class MyTableEditComp extends TableEditComp{
    constructor(props, context) {
        super(props, context);
        this.columns[this.columns.length - 1].render = this.optColRender;
    }

    //操作列使用的Render
    optColRender = (txt, record, index) => {
        let { editingRecord, editingIndex, recordKey, disableds,
            handleSave, onCancel, onEdit, onDelete, orderType
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
                show: editingIndex == null && orderType == 0,
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
export default class AddSaleDeliveryNoticeDetailComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = addSaleDeliveryNoticeDetailStore;
        this.store.onSave = this.onSave;
        this.purFormStore = addSaleDeliveryNoticeStore;
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNo',
                key: 'lineNo',
                // fixed: 'left',
                width: 47,
                render: (text, record, index) => formatNullStr(text),
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                // fixed: 'left',
                width: 188,
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                // fixed: 'left',
                width: 117,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 84 }} />
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
                width: 84,
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                width: 84,
            }, {
                title: '未清数量',
                dataIndex: 'openQty',
                key: 'openQty',
                width: 84,
                render: (text, record, index) => Number(text).toFixed(2),
            }, {
                title: '发货数量',
                dataIndex: 'endShipQty',
                key: 'endShipQty',
                width: 84,
                obj: {
                    rules: [
                        { type: 'gtEqZero', label: '发货数量' }
                    ],
                    render: (text, record, index) => Number(text).toFixed(2),
                },
            }, {
                title: '单位',
                dataIndex: 'unitName',
                key: 'unitName',
                width: 59,
            }, {
                title: '来源销售订单行号',
                dataIndex: 'sourceOrderLineNo',
                key: 'sourceOrderLineNo',
                width: 132,
            }, {
                title: '来源通知单行号',
                dataIndex: 'sourceJobOrderLineNo',
                key: 'sourceJobOrderLineNo',
                width: 108,
            }, {
                title: '已发货数量',
                dataIndex: 'accumShipQty',
                key: 'accumShipQty',
                width: 64,
                render: (text, record, index) => text == undefined ? text : Number(text).toFixed(2),
            }, {
                title: '操作',
                dataIndex: 'operation',
                // fixed: 'right',
                width: 100,
            }
        ];


    }
    title = () => {
        return (
            <div className="tab-title">
                <div className="left-text">
                    <span><strong>明细信息</strong></span>
                </div>
            </div>
        );
    }

    render() {
        let { Props, orderType } = this.store;
        return (
            <div className='saleNotice-table'>
                <MyTableEditCont
                    {...Props}
                    rowKey={record => record.id}
                    columns={this.columns}
                    title={this.title}
                    orderType={orderType}
                    //scroll={{ x: 1250 }}
                />
            </div>
        );
    }
}
