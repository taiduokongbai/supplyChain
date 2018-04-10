import { Table, Button, Select, Input, Popconfirm, message, TreeSelect } from '../../../base/components/AntdComp';
import React, { Component } from 'react';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { enumStore } from '../../../base/stores/EnumStore';

import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import TooltipComp from "../../../base/mobxComps/TooltipComp";

import { saleDeliveryNoticeStore, searchBarStore } from '../stores/SaleDeliveryNoticeStore';
import { addSaleDeliveryNoticeStore } from '../stores/AddSaleDeliveryNoticeStore';
import { editSaleDeliveryNoticeStore } from '../stores/EditSaleDeliveryNoticeStore';
import { saleDeliveryNoticeViewStore } from '../stores/SaleDeliveryNoticeViewStore';

@observer
export default class PurchaseComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '发货通知单号',
                dataIndex: 'orderCode',
                key: 'orderCode',
                width: 125,
                render: (text, record, index) => <a onClick={()=>this.onView(record)}>{text}</a>
            },{
                title: '单据状态',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                width: 74,
                render: (text, record, index) => enumStore.getEnum("noticeOrderStatus", text),
            },{
                title: '客户名称',
                dataIndex: 'customerName',
                key: 'customerName',
                width: 164,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 156 }} />
            },{
                title: '计划收货日期',
                dataIndex: 'planDate',
                key: 'planDate',
                // className: 'planDate',
                width: 108,
            },{
                title: '收货站点',
                dataIndex: 'receiveSiteName',
                key: 'receiveSiteName',
                width: 109,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 84 }} />
            }, {
                title: '收货人',
                dataIndex: 'receivePerson',
                key: 'receivePerson',
                width: 71,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 36 }} />
            }, {
                title: '收货人电话',
                dataIndex: 'receivePersonTel',
                key: 'receivePersonTel',
                width: 112,
            }, {
                title: '来源销售订单号',
                dataIndex: 'sourceOrderCode',
                key: 'sourceOrderCode',
                width: 120,
            }, {
                title: '来源通知单号',
                dataIndex: 'sourceJobOrderCode',
                key: 'sourceJobOrderCode',
                width: 108,
            }, {
                title: '下推状态',
                dataIndex: 'pushdownStatus',
                key: 'pushdownStatus',
                width: 74,
                render: (text, record, index) => enumStore.getEnum("isPushDownStatus", text),
            }, {
                title: '发货日期',
                dataIndex: 'shipDate',
                key: 'shipDate',
                width: 108,
            }, {
                title: '发货站点',
                dataIndex: 'shipSiteName',
                key: 'shipSiteName',
                width: 102,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 84 }} />
            }, {
                dataIndex: 'handle',
                title: '操作',
                width: 80,
                render: (txt, record, index) => {
                    let orderCode = record.orderCode;
                    function onEdit() {
                        store.dispatch(TabsAct.TabAdd({
                            title: "编辑发货通知单",
                            key: "editSaleDeliveryNotice"
                        }));
                        editSaleDeliveryNoticeStore.fetchDetail({ orderCode });
                    }
                    function onDelete() {
                        saleDeliveryNoticeStore.fetchDelete({ orderCode });;
                    };
                    let opts = [
                        {
                            title: '编辑',
                            fun: onEdit,
                            default: '--',
                            show: record.pushdownStatus == 0,
                        },
                        {
                            title: "删除",
                            titleText: ['确定删除该条订单吗？', '删除后，该条订单记录将不可恢复！'],
                            fun: onDelete,
                            default: '--',
                            show: record.pushdownStatus == 0,
                        },
                    ];
                    return <OperationsComp operations={opts} />;
                }
            }];
        this.searchComps = {
            left: {
                select: {
                    list: [
                        {
                            key: "orderCode",
                            label: "发货通知单号",
                            type: "string",
                        },
                        {
                            key: "customerName",
                            label: "客户名称",
                            type: "string",
                        },
                        {
                            key: "orderStatus",
                            label: "单据状态",
                            type: "enumSelect",
                            enumCode: "noticeOrderStatus",
                            style: { width: 200 },
                            defaultValue: 0
                        },
                        {
                            key: "planDate",
                            label: "计划收货日期",
                            type: "dateRange"
                        },
                        {
                            key: "shipDate",
                            label: "发货日期",
                            type: "dateRange"
                        },
                    ]
                },
                button: {
                    label: "查询",
                    fn: this.onSearch,
                    className: "",
                    style: {},
                }
            },
            right: [{
                type: "button",
                label: "新建",
                fn: this.onAdd,
                className: "",
                style: {},
            }]
        }
    }
    componentDidMount() {
        this.onSearch();
    }
    componentWillUnmount() {
        saleDeliveryNoticeStore.clear();
    }
    onSearch = () => {
        saleDeliveryNoticeStore.fetchTableList();
    }
    onAdd = () => {
        addSaleDeliveryNoticeStore.fetchCodeRule({ businessIndex: 52}).then(json => {
            if (json.status == 2000) {
                store.dispatch(TabsAct.TabAdd({
                    title: "新建发货通知单",
                    key: "addSaleDeliveryNotice"
                }));
                addSaleDeliveryNoticeStore.initData();
            }
        })
    }
    onView = (record) => {
        let orderCode = record.orderCode;
        store.dispatch(TabsAct.TabAdd({
            title: "发货通知单详情",
            key: "saleDeliveryNoticeView",
            tag: {_orderCode: orderCode}
        }));
        // saleDeliveryNoticeViewStore.fetchList({ orderCode });
    }
    render() {
        return (
            <div className="saleNotice-list">
                <SearchBarComp
                    comps={this.searchComps}
                    store={searchBarStore}
                />
                <Table
                    {...saleDeliveryNoticeStore.Props}
                    rowKey='orderCode'
                    columns={this.columns}
                    scroll={{ x: 1366 }}
                />
            </div>
        )
    }
}