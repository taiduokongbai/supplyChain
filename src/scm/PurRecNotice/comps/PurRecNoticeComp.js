import { Table, Button, Select, Input, Popconfirm, message, TreeSelect } from '../../../base/components/AntdComp';
import React, { Component } from 'react';
let { observer } = mobxReact;

import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { enumStore } from '../../../base/stores/EnumStore';

import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import TooltipComp from "../../../base/mobxComps/TooltipComp";

import { purRecNoticeStore, searchBarStore } from '../stores/PurRecNoticeStore';
import { addPurRecNoticeStore } from '../stores/AddPurRecNoticeStore';
import { editPurRecNoticeStore } from '../stores/EditPurRecNoticeStore';
import { purRecNoticeViewStore } from '../stores/PurRecNoticeViewStore';

@observer
export default class PurRecNoticeComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '收货通知单号',
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
                title: '供应商',
                dataIndex: 'supplierName',
                key: 'supplierName',
                width: 165,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 156 }} />
            },{
                title: '预计到货日期',
                dataIndex: 'planDate',
                key: 'planDate',
                // className: 'planDate',
                width: 125,
            },{
                title: '收货站点',
                dataIndex: 'receiveSiteName',
                key: 'receiveSiteName',
                width: 102,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 84 }} />
            }, {
                title: '收货仓库',
                dataIndex: 'stockName',
                key: 'stockName',
                width: 102,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 84 }} />
            }, {
                title: '收货地址',
                dataIndex: 'receiveAddressDetl',
                key: 'receiveAddressDetl',
                width: 102,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 84 }} />
            }, {
                title: '来源订单号',
                dataIndex: 'sourceOrderCode',
                key: 'sourceOrderCode',
                width: 120,
            }, {
                title: '来源通知单号',
                dataIndex: 'sourceJobOrderCode',
                key: 'sourceJobOrderCode',
                width: 120,
            }, {
                title: '下推状态',
                dataIndex: 'pushdownStatus',
                key: 'pushdownStatus',
                width: 74,
                render: (text, record, index) => enumStore.getEnum("isPushDownStatus", text),
            }, {
                dataIndex: 'handle',
                title: '操作',
                width: 80,
                className: 'table-operation',
                render: (txt, record, index) => {
                    let orderCode = record.orderCode;
                    function onEdit() {
                        store.dispatch(TabsAct.TabAdd({
                            title: "编辑收货通知单",
                            key: "editPurRecNotice"
                        }));
                        editPurRecNoticeStore.fetchDetail({ orderCode });
                    }
                    function onDelete() {
                        purRecNoticeStore.fetchDelete({ orderCode });;
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
                            label: "收货通知单号",
                            type: "string",
                        },
                        {
                            key: "sourceOrderCode",
                            label: "来源订单号",
                            type: "string",
                        },
                        {
                            key: "sourceJobOrderCode",
                            label: "来源通知单号",
                            type: "string",
                        },
                        {
                            key: "supplierName",
                            label: "供应商名称",
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
                            label: "预计到货日期",
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
        purRecNoticeStore.clear();
    }
    onSearch = () => {
        purRecNoticeStore.fetchTableList();
    }
    onAdd = () => {
        addPurRecNoticeStore.fetchCodeRule({ businessIndex: 53}).then(json => {
            if (json.status == 2000) {
                store.dispatch(TabsAct.TabAdd({
                    title: "新建收货通知单",
                    key: "addPurRecNotice"
                }));
                addPurRecNoticeStore.initData();
            }
        })
    }
    onView = (record) => {
        let orderCode = record.orderCode;
        store.dispatch(TabsAct.TabAdd({
            title: "收货通知单详情",
            key: "purRecNoticeView"
        }));
        purRecNoticeViewStore.fetchList({ orderCode });
    }
    render() {
        return (
            <div className="saleNotice-list">
                <SearchBarComp
                    comps={this.searchComps}
                    store={searchBarStore}
                />
                <Table
                    {...purRecNoticeStore.Props}
                    rowKey='orderCode'
                    columns={this.columns}
                    // scroll={{ x: 1250 }}
                />
            </div>
        )
    }
}