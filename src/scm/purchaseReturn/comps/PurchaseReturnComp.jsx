import { Table, Button, Select, Input, Popconfirm, message, TreeSelect} from '../../../base/components/AntdComp';
import React, { Component } from 'react';

import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';

//采购退货列表、搜索、编辑 的 mobx store
import { purReturnListStore, searchBarStore } from '../stores/PurchaseReturnStore';
import { purReturnAddStore } from '../stores/AddPurchaseReturnStore';
import { purReturnEditStore } from '../stores/EditPurchaseReturnStore';
import { purReturnViewStore } from '../stores/PurchaseReturnViewStore'
//redux的store 和 tab标签页action
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { enumStore } from '../../../base/stores/EnumStore';
import moment from "moment";
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
export default class PurchaseReturnComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '采购退货单',
                dataIndex: 'orderCode',
                key: 'orderCode',
                width: 172,
                fixed: 'left'
            },
            {
                title: '单据状态',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                width: 86,
                render: (text, record, index) => enumStore.getEnum("purRetOrderStatus", text),
                fixed: 'left'
            },
            {
                title: '业务类型',
                dataIndex: 'orderType',
                key: 'orderType',
                width: 86,
                className:'purchaseOrder-table-padding',
                render: (text, record, index) => enumStore.getEnum("returnOrderType", text+''),
            },
            {
                title: '下单日期',
                dataIndex: 'orderDate',
                key: 'orderDate',
            },
            {
                title: '供应商',
                dataIndex: 'supplierName',
                key: 'supplierName',
                width: 154,
                render: (txt, record, index) => <TooltipComp attr={{text: txt,wid: 90,}}/>
            }, 
            {
                title: '预计退货日',
                dataIndex: 'planReturnDate',
                key: 'planReturnDate',
            },
            {
                title: '发货站点',
                dataIndex: 'siteName',
                key: 'siteName',
            }, 
            {
                title: '源订单号',
                dataIndex: 'purchaseOrderCode',
                key: 'purchaseOrderCode',
            },
            {
                title: '下推状态',
                dataIndex: 'pushdownFlag',
                key: 'pushdownFlag',
                render: (text, record, index) => enumStore.getEnum("isPushDownStatus", text),
            },
            {
                title: '更新人',
                dataIndex: 'updateByName',
                key: 'updateByName',
            },
            {
                title: '更新时间',
                dataIndex: 'updateDate',
                key: 'updateDate',
                width: 126,
            }, {
                dataIndex: 'handle',
                title: '操作',
                width: 80,
                fixed: 'right',
                className:'handle-center',
                render: (txt, record, index) => {
                    let orderCode = record.orderCode;
                    function onEdit() {
                        store.dispatch(TabsAct.TabAdd({
                            title: "编辑采购退货单",
                            key: "editPurchaseReturn"
                        }));
                        purReturnEditStore.fetchPurReturnDetail({ orderCode });
                    }
                    function onDelete() {
                        purReturnListStore.fetchPurReturnDelete({ orderCode }).then(json => {
                            if (json.status === 2000) {
                                message.success('删除成功!');
                            }
                        });
                    };
                    let opts = [
                        {
                            title: '编辑',
                            fun: onEdit,
                            show: record.orderStatus == '0',
                            default:'--'
                        },
                        {
                            title: "删除",
                            titleText: ['确定删除该条订单吗？', '删除后，该条订单记录将不可恢复！'],
                            fun: onDelete,
                            show: record.orderStatus == '0',
                            default:'--'
                        },
                    ];
                    return <OperationsComp operations={opts} />;
                }
            }];
        this.columns[0].render = (txt, record, index) =>
            <a href="#" onClick={() => this.purReturnViewShow(record.orderCode)}>{record.orderCode}</a>
        this.searchComps = {
            left: {
                select: {
                    style: {},
                    list: [
                        {
                            key: "orderCode",
                            label: "退货单号",
                            type: "string",
                        },
                        {
                            key: "orderStatus",
                            label: "单据状态",
                            type: "enumSelect",
                            enumCode: "purRetOrderStatus",
                            style: { width: 200 },
                            defaultValue: 'null'
                        },
                        {
                            key: "orderDate",
                            label: "退货日期",
                            defaultValue: [moment().subtract(1,"months").format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
                            type: "dateRange"
                        },
                        {
                            key: "siteName",
                            label: "发货站点",
                            type: "string"
                        },
                        {
                            key: "supplierNickName",
                            label: "供应商",
                            type: "string"
                        },
                        {
                            key: "sourceOrderCode",
                            label: "源订单号",
                            type: "string"
                        }
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
    purReturnViewShow = (orderCode) => {
        store.dispatch(TabsAct.TabAdd({
            title: "采购退货单详情",
            key: "purchaseReturnView"
        }));
        purReturnViewStore.fetchPurReturnView({orderCode})
    }
    onSearch = () => {
        purReturnListStore.fetchTableList();
    }
    onAdd = () => {
        purReturnListStore.fetchPurReturnCodeRule({ businessIndex: 15 }).then(json => {
            if (json.status === 2000) {
                store.dispatch(TabsAct.TabAdd({
                    title: "新建采购退货单",
                    key: "addPurchaseReturn"
                }));
                purReturnAddStore.initData();
            } 
        })
        
    }
    render() {
        return (
            <div className='purReturnOder-List'>
                <SearchBarComp
                    comps={this.searchComps}
                    store={searchBarStore}
                />
                <Table
                    {...purReturnListStore.Props}
                    rowKey='orderCode'
                    columns={this.columns}
                />
            </div>
        )
    }
}