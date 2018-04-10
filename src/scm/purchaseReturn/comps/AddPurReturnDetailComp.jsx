import React, { Component } from "react";
import { Table, Button, Popconfirm, message, Radio, Select, Form } from '../../../base/components/AntdComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp'
import AddPurReturnAddMatComp from './AddPurReturnAddMatComp';
import AddPurReturnEditMatComp from './AddPurReturnEditMatComp';
import { enumStore } from '../../../base/stores/EnumStore';
let { observer } = mobxReact;
import { purReturnAddStore, addPurReturnDetailStore, addMaterialStore, editMaterialStore } from '../stores/AddPurchaseReturnStore';
import { measureStore } from '../../data/DropDownStore';

@observer
export default class AddPurReturnDetailComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = addPurReturnDetailStore;
        this.purReturnFormStore = purReturnAddStore;
        this.addMaterialStore = addMaterialStore;
        this.editMaterialStore = editMaterialStore;
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNum',
                key: 'lineNum',
                width: 48,
                fixed: 'left',
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                width: 140,
                fixed: 'left',
            },
            {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 98,
                fixed: 'left',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 92 }} />
            },
            {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                className: 'purchaseOrder-table-padding',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86 }} />
            },
            {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86 }} />
            },
            {
                title: '材料',
                dataIndex: 'materialQuality',
                key: 'materialQuality',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86 }} />
            },
            {
                title: '代号',
                dataIndex: 'standardCode',
                key: 'standardCode',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86 }} />
            },
            {
                title: '退货数量',
                dataIndex: 'returnQty',
                key: 'returnQty',
                render: (txt, record, index) => (txt||txt=='0')&&Number(txt).toFixed(2)
            },
            {
                title: '单位',
                dataIndex: 'purchaseUnit',
                key: 'purchaseUnit',
                width: 140,
                render: (text, record, index) => measureStore.getLabelName(text),
                className:'col-hidden'
            },
            {
                title: '单位',
                dataIndex: 'purchaseUnitName',
                key: 'purchaseUnitName',
                width: 140,
            },
            {
                title: '计价数量',
                dataIndex: 'priceQty',
                key: 'priceQty',
                render: (txt, record, index) => (txt||txt=='0')&&Number(txt).toFixed(2)
            },
            {
                title: '计价单位',
                dataIndex: 'priceUnit',
                key: 'priceUnit',
                render: (text, record, index) => measureStore.getLabelName(text),
                className: 'col-hidden'
            },
            {
                title: '计价单位',
                dataIndex: 'priceUnitDetl',
                key: 'priceUnitDetl',
                width: 140,
            },
            {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                render: (txt, record, index) => (txt||txt=='0')&&'￥'+Number(txt).toFixed(2)
            },
            {
                title: '税率',
                dataIndex: 'taxRate',
                key: 'taxRate',
                render: (txt, record, index) => (txt||txt=='0')&&Number(txt).toFixed(2)+'%'
            },
            {
                title: '金额',
                dataIndex: 'netAmount',
                key: 'netAmount',
                render: (txt, record, index) => (txt||txt=='0')&&'￥'+Number(txt).toFixed(2)
            },
            {
                title: '税额',
                dataIndex: 'taxAmount',
                key: 'taxAmount',
                render: (txt, record, index) => (txt||txt=='0')&&'￥'+Number(txt).toFixed(2)
            },
            {
                title: '源订单行号',
                dataIndex: 'sourceLineNum',
                key: 'sourceLineNum',
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width: 200,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 134 }} />
            }, {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right',
                width: 100,
                className: 'operation-center'
            }
        ];

        this.columns[this.columns.length - 1].render = (text, record, index) => {
            let opts = [
                {
                    title: '编辑',
                    show: true,
                    fun: ()=>this.onEdit(record,index),
                },
                {
                    title: "删除",
                    titleText: ['确定要删除该条记录吗', '删除后，该条记录将不可恢复！'],
                    show: true,
                    fun: () => this.store.onMaterialDelete(index),
                },
            ];
            return <OperationsComp operations={opts} />;
        }
    }
    title = () => {
        let { supplierCode,orderType,purchaseOrderCode } = this.purReturnFormStore.detail;
        let addBtnText = "添加行";
        let curSymbol = '￥';
        let netAmount = 0,
            taxAmount = 0,
            totalAmount = 0,
            freightAmount = !!Number(this.purReturnFormStore.detail.freightAmount)?Number(this.purReturnFormStore.detail.freightAmount) : 0;
        this.store.dataSource.slice().forEach(item => {
            netAmount = netAmount + Number(item.netAmount);
            taxAmount = taxAmount + Number(item.taxAmount);
        });
        netAmount = netAmount + Number(freightAmount);
        totalAmount = netAmount + taxAmount;
        return (
            <div className="tab-title">
                <div className="left-text">
                    <span><strong>明细信息</strong></span>
                </div>
                <div>
                    <span className="total">
                        <span className="laber">合计</span>
                        <span className="laber">金额：</span>
                        <span className="number">{(curSymbol || '') + netAmount.toFixed(2)}</span>
                        <span className="laber">税额：</span>
                        <span className="number">{(curSymbol || '') + taxAmount.toFixed(2)}</span>
                        <span className="laber">价税合计：</span>
                        <span className="number">{(curSymbol || '') + totalAmount.toFixed(2)}</span>
                    </span>
                    {
                        addBtnText ?
                            <Button href='#' onClick={this.onAdd} disabled={supplierCode&&(orderType=='2'||(orderType=='1'&&purchaseOrderCode))?false:true}>
                                <i className='c2mfont c2m-tianjia' />
                                {addBtnText}
                            </Button>
                            : null
                    }
                </div>
            </div>
        );
    }
    onAdd = () => {
        this.addMaterialStore.setVisible(true);
        this.addMaterialStore.resetDetail();
    }
    onEdit = (record,index) => {
        this.editMaterialStore.setVisible(true);
        this.editMaterialStore.setMaterialDetail(record);
        this.store.setEditingIndex(index);
        this.editMaterialStore.materialAllUnitStore.fetchSelectList({ materialCode: record.materialCode });
        if (this.purReturnFormStore.detail.purchaseOrderCode) {
            this.editMaterialStore.setDisableds(['materialCode', 'purchaseUnit', 'priceUnit', 'taxRate', 'price']);
        } else {
            this.editMaterialStore.setDisableds(['materialCode']);
        };
        this.editMaterialStore.setPriceUnit(this.editMaterialStore.detail.priceUnitDetl)
    }
    getMaterialCont = () => (
        <div>
            <AddPurReturnAddMatComp />
            <AddPurReturnEditMatComp />
        </div>
    )
    render() {
        let detail = this.purReturnFormStore.detail;
        return (
            <div className='purchaseDetail-table'>
                <Table
                    {...this.store.Props}
                    rowKey={record=>record.id}
                    columns={this.columns}
                    title={this.title}
                    scroll={{ x: 1860 }}
                />
                {
                    this.getMaterialCont()
                }
            </div>
        );
    }
}
