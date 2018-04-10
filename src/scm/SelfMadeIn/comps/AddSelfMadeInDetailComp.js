import React, { Component } from "react";
import { Table, Button, Popconfirm, message, Radio, Select, Form } from '../../../base/components/AntdComp';
import { TableEditComp } from '../../../base/mobxComps/TableEditComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import { enumStore } from '../../../base/stores/EnumStore';
import { formatNullStr } from '../../../base/consts/Utils';
import TooltipComp from "../../../base/mobxComps/TooltipComp";
import AddLineComp from "./AddLineComp";
let { observer } = mobxReact;

@observer
export default class AddSaleDeliveryNoticeDetailComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = props.store;
        this.columns = [{
                title: '状态',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                width: 76,
                render: (text, record, index) => enumStore.getEnum("orderStatus", text),
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                width: 188,
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 182,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 132 }} />
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                width: 160,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 108 }} />
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
                width: 142,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 106 }} />
             }, {
                title: '计划数量',
                dataIndex: 'planQty',
                key: 'planQty',
                width: 112,
                render: (text, record, index) => Number(text).toFixed(2),
            }, {
                title: '库存单位',
                dataIndex: 'unitName',
                key: 'unitName',
                width: 82,
            }, {
                dataIndex: 'handle',
                title: '操作',
                width: 92,
                render: (txt, record, index) => {
                    let show = this.store.pStore.detail.sourceOrderType == 1;
                    let opts = [
                        {
                            title: "删除",
                            titleText: ['确定删除该条数据吗？', '删除后，该条数据将不可恢复！'],
                            fun: ()=>this.onDelete(index),
                            default: '--',
                            show,
                        },
                    ];
                    return <OperationsComp operations={opts} />;
                }
            }
        ];
    }
    title = () => {
        let { sourceOrderType, sourceOrderCode } = this.store.pStore.detail;
        let addBtnText = (sourceOrderType == '1' && sourceOrderCode)? "添加行" : "";
        return (
            <div className="tab-title">
                <div className="left-text">
                    <span><strong>明细信息</strong></span>
                </div>
                <div>
                    {
                        addBtnText ?
                            <a href='#' onClick={this.onAdd}>
                                <i className='c2mfont c2m-tianjia' />
                                {addBtnText}
                            </a>
                            : null
                    }
                </div>
            </div>
        );
    }
    onAdd = () => {
        this.store.addLineStore.setVisible(true);
    }
    onDelete = (index) => {
        this.store.onMaterialDelete(index);
    };
    render() {
        return (
            <div className='selfMadeIn-table'>
                <Table
                    {...this.store.Props}
                    rowKey={record => record.id}
                    columns={this.columns}
                    title={this.title}
                />
                <AddLineComp store={this.store.addLineStore}/>
            </div>
        );
    }
}
