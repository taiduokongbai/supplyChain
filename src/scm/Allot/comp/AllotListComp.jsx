import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message } from '../../../base/components/AntdComp';

import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';

import SearchBarComp from '../../../base/mobxComps/SearchBarComp'
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
let { observable, action, computed, runInAction, toJS } = mobx;
import { searchBarStore, allotListStore } from '../store/AllotListStore';
import { allotTypeStore, employeeStore, outSiteStore, inSiteStore, addAllotStore, addOutInfoStore, advancePopStore,advancePopTableStore} from '../store/AddAllotStore';
import { allotDetailsStore, allotDetailsTableStore } from '../store/AllotDetailsStore';
let { observer } = mobxReact;

@observer
export default class AllotListComp extends Component {
    constructor (props) {
        super(props);
        this.columns = [
            {
                title: '单据号',
                dataIndex: 'allotOrderCode',
                key: 'allotOrderCode',
                width: 214,
                render: (text, record, index) => {
                        return(
                            <a onClick={() => this.onOpenDetails(record.allotOrderCode)}>{record.allotOrderCode}</a>
                        )
                }
            }, {
                title: '单据类型',
                dataIndex: 'allotOrderTypeName',
                key: 'allotOrderTypeName',
            }, {
                title: '调出仓库',
                dataIndex: 'allotOutSiteName',
                key: 'allotOutSiteName',
            }, {
                title: '调入仓库',
                dataIndex: 'allotInSiteName',
                key: 'allotInSiteName',
            }, {
                title: '调拨申请人',
                dataIndex: 'allotProposerName',
                key: 'allotProposerName',
            }, {
                title: '调拨日期',
                dataIndex: 'allotDate',
                key: 'allotDate',
                width: 130
            }
        ];
        this.searchComps = {
            left: {
                select: {
                    style: {},
                    list: [
                        {
                            key: "allotOrderCode",
                            label: "单据号",
                            type: "string",
                            defaultValue: ''
                        },
                        {
                            key: "allotOrderTypeCode",
                            label: "单据类型",
                            type: "select",
                            store: allotTypeStore,
                            style: { width: 200 }
                        },
                        {
                            key: "allotOutSiteName",
                            label: "调出仓库",
                            type: "string",
                        },
                        {
                            key: "allotInSiteName",
                            label: "调入仓库",
                            type: "string"
                        },
                        {
                            key: "allotProposerName",
                            label: "调拨申请人",
                            type: "string"
                        },
                        {
                            key: "allotTime",
                            label: "调拨时间",
                            type: "dateRange"
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
        };
    }

    onAdd = () => {
        // Promise.all(
        addAllotStore.clear();
        addOutInfoStore.clear();
        addOutInfoStore.clearSubmitValue();
        advancePopStore.clear();
        advancePopTableStore.clear();
        addOutInfoStore.setEditRecord();
        addAllotStore.delAllAllotInfo();
        // addAllotStore.setLoading(true),
        addAllotStore.getCurrentUser();
        outSiteStore.fetchSelectList();
        inSiteStore.fetchSelectList();
        allotTypeStore.fetchSelectList({billType:3});
        employeeStore.fetchSelectList();
        // ).then(values => {
        //     addAllotStore.setLoading(false);
        // }, reason => {
        //     addAllotStore.setLoading(false);
        // });
        store.dispatch(TabsAct.TabAdd({title: "新建直接调拨单", key: "inventoryAddAllot"}));

    };

    onOpenDetails = (allotOrderCode) => {
        store.dispatch(TabsAct.TabAdd({
            title: "直接调拨单详情",
            key: "inventoryAllotDetails"
        }));
        allotDetailsStore.setLoading(allotOrderCode);
    };

    componentDidMount() {
        allotListStore.fetchTableList({ page: 1,pageSize: 15});
        allotTypeStore.fetchSelectList({billType:3});
    }

    onSearch = () => {
        allotListStore.fetchTableList();
    };

    render() {
        return (
            <div className="ware-house-list">
                <SearchBarComp
                    comps={this.searchComps}
                    store={searchBarStore}
                />
                <Table
                    {...allotListStore.Props}
                    rowKey='allotOrderCode'
                    columns={this.columns}
                />
            </div>
        )
    }
}