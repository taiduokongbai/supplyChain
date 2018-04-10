import { Table, Button, Select, Input, Popconfirm, message, TreeSelect} from '../../../base/components/AntdComp';
import React, { Component } from 'react';

import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';

//采购退货列表、搜索、编辑 的 mobx store
import { receiptConfirmListStore, searchBarStore } from '../stores/ReceiptConfirmStore';
import { editReceiptConfirmStore } from '../stores/EditReceiptConfirmStore';
import { receiptConfirmViewStore} from '../stores/ReceiptConfirmViewStore';

//redux的store 和 tab标签页action
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { enumStore } from '../../../base/stores/EnumStore';

let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
export default class ReceiptConfirmComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '单据编号',
                dataIndex: 'receiveAffirmCode',
                key: 'receiveAffirmCode',
                width: 160,
            },
            {
                title: '收货状态',
                dataIndex: 'receiveStatus',
                key: 'receiveStatus',
                render: (text, record, index) => enumStore.getEnum("receiveStatus", text),
            },
            {
                title: '来源通知单号',
                dataIndex: 'sourceOrderCode',
                key: 'sourceOrderCode',
            },
            {
                title: '供应商名称',
                dataIndex: 'supplierName',
                key: 'supplierName',
            },
            {
                title: '采购部门',
                dataIndex: 'deptName',
                key: 'deptName',
            },
            {
                title: '采购人',
                dataIndex: 'purchaserName',
                key: 'purchaserName',
                // render:(text)=>{
                //     return <TooltipComp attr={{text:text, wid: 80, placement: 'top'}} />
                // },
            },
            {
                title: '收货人',
                dataIndex: 'reveiverName',
                key: 'reveiverName',
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
            },
            {
                dataIndex: 'handle',
                title: '操作',
                width: 80,
                className:'align-center',
                render: (txt, record, index) => {
                    let receiveAffirmCode = record.receiveAffirmCode;
                    function onEdit() {
                        store.dispatch(TabsAct.TabAdd({
                            title: "执行收货确认单",
                            key: "editReceiptConfirm"
                        }));
                        editReceiptConfirmStore.fetchReceiptConfirmDetail({ receiveAffirmCode });
                    }
                    let opts = [
                        {
                            title: '执行',
                            default: '--',
                            fun: onEdit,
                            show: record.receiveStatus == 0 || record.receiveStatus == 1,
                        }
                    ];
                    return <OperationsComp operations={opts} />;
                }
            }];
        this.columns[0].render = (txt, record, index) =>
            <a href="#" onClick={() => this.ReceiptConfirmViewShow(record.receiveAffirmCode)}>{record.receiveAffirmCode}</a>
        this.searchComps = {
            left: {
                select: {
                    style: {},
                    list: [
                        {
                            key: "receiveAffirmCode",
                            label: "单据编号",
                            type: "string",
                        },
                        {
                            key: "receiveStatus",
                            label: "收货状态",
                            type: "enumSelect",
                            enumCode: "receiveStatus",
                            style: { width: 200 },
                            defaultValue: 'null'
                        },
                        {
                            key: "sourceOrderCode",
                            label: "来源通知单号",
                            type: "string",
                        },
                        {
                            key: "supplierName",
                            label: "供应商名称",
                            type: "string",
                        },
                        {
                            key: "deptName",
                            label: "采购部门",
                            type: "string",
                        },
                        {
                            key: "purchaserName",
                            label: "采购人",
                            type: "string"
                        },
                        {
                            key: "reveiverName",
                            label: "收货人",
                            type: "string"
                        },
                        {
                            key: "updateByName",
                            label: "更新人",
                            type: "string",
                        },
                        {
                            key: "updateDateStr",
                            label: "更新时间",
                            type: "dateRange",
                            // format: "YYYY-MM-DD HH:mm:ss",
                            // showTime: true,
                            style: { width: 250 }
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
        }
    }
    componentDidMount() {
        this.onSearch();
    }
    onSearch = () => {
        receiptConfirmListStore.fetchTableList();
    }
    ReceiptConfirmViewShow = (receiveAffirmCode) => {
        store.dispatch(TabsAct.TabAdd({
            title: "收货确认单详情",
            key: "receiptConfirmView"
        }));
        receiptConfirmViewStore.fetchReceiptConfirmDetail({ receiveAffirmCode });
    }
    render() {
        return (
            <div className='receiptConfirmList-table'>
                <SearchBarComp
                    comps={this.searchComps}
                    store={searchBarStore}
                />
                <Table
                    {...receiptConfirmListStore.Props}
                    rowKey='receiveAffirmCode'
                    columns={this.columns}
                />
            </div>
        )
    }
}