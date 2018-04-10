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

import { selfMadeInStore } from '../stores/SelfMadeInStore';
import { addSelfMadeInStore, editSelfMadeInStore } from '../stores/AddSelfMadeInStore';
import { selfMadeInViewStore } from '../stores/SelfMadeInViewStore';
import { execSelfMadeInStore } from '../stores/ExecSelfMadeInStore';

@observer
export default class PurchaseComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = selfMadeInStore;
        this.columns = [
            {
                title: '单据号',
                dataIndex: 'orderCode',
                key: 'orderCode',
                width: 184,
                render: (text, record, index) => <a onClick={()=>this.onView(record)}>{text}</a>,
            },{
                title: '状态',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                width: 125,
                render: (text, record, index) => enumStore.getEnum("orderStatus", text),
            }, {
                title: '源单类型',
                dataIndex: 'sourceOrderType',
                key: 'sourceOrderType',
                width: 143,
                render: (text, record, index) => enumStore.getEnum("sourceOrderType2", text),
            }, {
                title: '源单据号',
                dataIndex: 'sourceOrderCode',
                key: 'sourceOrderCode',
                width: 184,
            }, {
                title: '收货仓库',
                dataIndex: 'stockName',
                key: 'stockName',
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 192 }} />,
                width: 240,
            },{
                title: '创建人',
                dataIndex: 'createByName',
                key: 'createByName',
                width: 90,
            }, {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
                width: 146,
            }, {
                dataIndex: 'handle',
                title: '操作',
                width: 106,
                className: 'saleNotice-list-operation',
                render: (txt, record, index) => {
                    let orderCode = record.orderCode;
                    function onEdit() {
                        store.dispatch(TabsAct.TabAdd({
                            title: "编辑自制件入库单",
                            key: "editSelfMadeIn"
                        }));
                        editSelfMadeInStore.fetchDetail({ orderCode });
                    }
                    function onExec() {
                        store.dispatch(TabsAct.TabAdd({
                            title: "执行自制件入库单",
                            key: "execSelfMadeIn"
                        }));
                        execSelfMadeInStore.fetchDetail({ orderCode });
                    }
                    function onDelete() {
                        selfMadeInStore.fetchDelete({ orderCode });;
                    };
                    let opts = [
                        {
                            title: '编辑',
                            fun: onEdit,
                            default: '--',
                            show: record.orderStatus == 1,
                        },
                        {
                            title: '执行',
                            fun: onExec,
                            default: '--',
                            show: ['1','2','3','4'].includes(String(record.orderStatus)),
                        },
                        {
                            title: "删除",
                            titleText: ['确定删除该数据吗？'],
                            fun: onDelete,
                            default: '--',
                            show: record.orderStatus == 1,
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
                            label: "单据号",
                            type: "string",
                        },{
                            key: "sourceOrderType",
                            label: "源单类型",
                            type: "enumSelect",
                            enumCode: "sourceOrderType2",
                            style: { width: 200 },
                            defaultValue: 0
                        },{
                            key: "sourceOrderCode",
                            label: "源单据号",
                            type: "string"
                        },{
                            key: "stockName",
                            label: "收货仓库",
                            type: "string"
                        },{
                            key: "orderStatus",
                            label: "单据状态",
                            type: "enumSelect",
                            enumCode: "orderStatus",
                            style: { width: 200 },
                            defaultValue: 'null'
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
        this.store.clear();
    }
    onSearch = () => {
        this.store.fetchTableList();
    }
    onAdd = () => {
        addSelfMadeInStore.fetchCodeRule({ businessIndex: 54}).then(json => {
            if (json.status == 2000) {
                store.dispatch(TabsAct.TabAdd({
                    title: "新建自制件入库单",
                    key: "addSelfMadeIn"
                }));
            }
        })
    }
    onView = (record) => {
        let orderCode = record.orderCode;
        store.dispatch(TabsAct.TabAdd({
            title: "自制件入库单详情",
            key: "selfMadeInView"
        }));
        selfMadeInViewStore.fetchList({ orderCode });
        selfMadeInViewStore.fetchReceiveLogList(orderCode);
    }
    render() {
        return (
            <div className="saleNotice-list">
                <SearchBarComp
                    comps={this.searchComps}
                    store={this.store.searchBarStore}
                />
                <Table
                    {...this.store.Props}
                    rowKey='orderCode'
                    columns={this.columns}
                />
            </div>
        )
    }
}