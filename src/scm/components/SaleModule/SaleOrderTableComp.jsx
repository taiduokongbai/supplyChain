import React, { Component } from "react";
import { Table, Input, Icon, Button, Popconfirm } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import TooltipComp from "../../../base/components/TooltipComp";
class SaleOrderTableComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditBtnShow: false
        }
        this.columns = [
            {
                title: '订单id',
                dataIndex: "saleId",
                key: "saleId",
                hidden: true
            }, {
                title: '销售订单号',
                dataIndex: "saleOrderCode",
                key: "saleOrderCode",
                width: 150,
                fixed: 'left',
                render: (text, record) => (<a onClick={() => this.saleOrderDetail(record.saleOrderCode)}>{text}</a>)
            }, {
                title: '单据状态',
                dataIndex: "saleStatus",
                key: "saleStatus",
                width: 68,
                fixed: 'left',
                render: (txt, record, index) => {
                    return this.getE("saleStatus", txt + '')
                },
            }, {
                title: '客户名称',
                dataIndex: "customerName",
                key: "customerName",
                width: 96,
                fixed: 'left',
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '单据类型',
                dataIndex: "businessType",
                key: "businessType",
                className: 'padding-left20',
                render: (txt, record, index) => {
                    return this.getE("businessType", txt + '')
                },
            }, {
                title: '预计交货日期',
                dataIndex: "planDelivery",
                key: "planDelivery",
            }, {
                title: '销售组织',
                dataIndex: "saleOrg",
                key: "saleOrg",
            }, {
                title: '销售人员',
                dataIndex: "saleEmp",
                key: "saleEmp",
            }, {
                title: '来源订单号',
                dataIndex: "sourceCode",
                key: "sourceCode",
            }, {
                title: '下推状态',
                dataIndex: "pushdownStatus",
                key: "pushdownStatus",
                render: (txt, record, index) => {
                    return this.getE("pushdownStatus", txt + '')
                },
            }, {
                title: '更新人',
                dataIndex: "updateByName",
                key: "updateByName",
            }, {
                title: '更新时间',
                dataIndex: "updateDate",
                key: "updateDate",
            }, {
                title: '操作',
                dataIndex: 'operate',
                className: 'operate-center',
                key: 'operate',
                width: 80,
                fixed:'right',
            }
        ];
        this.columns[this.columns.length - 1].render = (txt, record, index) => 
            <div>
                {(record.saleStatus == "0" || record.saleStatus == "4" || record.saleStatus == "6") ? <span className="purchase-order-implement c2mfont c2m-bianji" title='编辑' onClick={() => this.onEditOrder(record.saleOrderCode)}></span> : <span className="purchase-double-line">--</span>}
                {(record.saleStatus == "0" || record.saleStatus == "4" || record.saleStatus == "6") ? <Popconfirm title="确认删除该数据吗？" onConfirm={() => this.onDeleteOrder(record.saleOrderCode)} okText="确定" cancelText="取消">
                    <span className="purchase-order-implement-delete c2mfont c2m-shanchu" title='删除'></span>
                </Popconfirm> : <span className="purchase-double-line-delete">--</span>}
            </div>
       
    }
    saleOrderDetail = (saleOrderCode) => {
        this.props.SetSaleOrderDetail(saleOrderCode)
        store.dispatch(TabsAct.TabAdd({ title: "销售订单详情", key: "saleOrderDetail" }));
    };
    onEditOrder = (saleOrderCode) => {
        this.props.SetSaleOrderEdit(saleOrderCode);
        this.props.CheckLockingStatus(saleOrderCode);
    };
    onDeleteOrder = (saleOrderCode) => {
        this.props.DeleteSaleOrder(saleOrderCode)
    };
    getE = (key, val) => {
        if (val !== undefined && val !== 'null' && val !== "") {
            return window.ENUM.getEnum(key, val)
        }
    };
    componentDidMount() {
        this.props.tablePaging(1);
    }

    render() {
        const { tabLoading, tablePaging, dataSourceList, ...props } = this.props;
        return (
            <div className="sale-order-table-wrap">
                <div className="sale-order-body">
                    <MTable
                        {...props}
                        loading={tabLoading}
                        cols={this.columns}
                        rowKey={"saleId"}
                        dataSource={dataSourceList}
                        pageOnChange={tablePaging}
                    />
                </div>
            </div>
        );
    }
}
export default SaleOrderTableComp;