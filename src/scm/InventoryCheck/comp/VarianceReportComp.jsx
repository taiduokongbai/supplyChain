/**
 * 盘点差异报告 comp'
 */
import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message } from '../../../base/components/AntdComp';
import { _varianceReportStore, _searchBarStore, _varianceReportDetailsStore } from "../store/VarianceReportStore";
import SearchBarComp from "../../../base/mobxComps/SearchBarComp";
import { store } from '../../data/StoreConfig';
import TabsAct from "../../actions/TabsAct";
import TooltipComp from '../../../base/mobxComps/TooltipComp';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
export default class VarianceReportComp extends Component {
    constructor(props) {
        super();
        this.store = _varianceReportStore;
        this.columns = [
            {
                title: '报告编号',
                dataIndex: 'stocktakeReportCode',
                key: 'stocktakeReportCode',
                width: 161,
                render: (text, record, index) => {
                    return (<span onClick={() => this.varianceReportDetails(record)} style={{ cursor: 'pointer' , color : '#4C80CF' }}>{record.stocktakeReportCode}</span>)
                }
            }, {
                title: '单据状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record, index) => window.ENUM.getEnum("reportStatus", text.toString())
            }, {
                title: '关联作业单号',
                dataIndex: 'stocktakeTaskCode',
                key: 'stocktakeTaskCode',
            }, {
                title: '关联方案编号',
                dataIndex: 'solutionCode',
                key: 'solutionCode',
            }, {
                title: '关联方案名称',
                dataIndex: 'solutionName',
                key: 'solutionName',
                render: (text,render,index) => <TooltipComp attr={{text:text, wid: 84}}/>
            }, {
                title: '所属仓库',
                dataIndex: 'warehouseName',
                key: 'warehouseName',
                render: (text,render,index) => <TooltipComp attr={{text:text, wid: 120}}/>
            }, {
                title: '更新人',
                dataIndex: 'updateByName',
                key: 'updateByName',
                render: (text,render,index) => <TooltipComp attr={{text:text, wid: 58}}/>
            }, {
                title: '更新时间',
                dataIndex: 'updateDate',
                key: 'updateDate',
                width: 140,
            }
        ];
        this.searchComps = {
            left: {
                select: {
                    style: {},
                    list: [
                        {
                            key: "stocktakeReportCode",
                            label: "报告编号",
                            type: "string"
                        }, {
                            key: "status",
                            label: "单据状态",
                            type: "enumSelect",
                            enumCode: "reportStatus",
                            defaultValue: '1'
                        }, {
                            key: "stocktakeTaskCode",
                            label: "关联作业单号",
                            type: "string"
                        }, {
                            key: "solutionCode",
                            label: "关联方案编号",
                            type: "string"
                        }, {
                            key: "solutionName",
                            label: "关联方案名称",
                            type: "string"
                        }, {
                            key: "warehouseName",
                            label: "所属仓库",
                            type: "string"
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
            right: []
        };
    }
    componentDidMount() {
        this.onSearch();
    }
    varianceReportDetails = (record) => {
        store.dispatch(TabsAct.TabAdd({
            title: "盘点差异报告详情",
            key: "varianceReportDetails"
        }));
        // 获取详情 和 表格数据
        let pm = {id: record.id, stocktakeReportCode: record.stocktakeReportCode}
        _varianceReportDetailsStore.getReportDetails(pm);
       // let materialTablePm = {stocktakeReportId: record.id, stocktakeReportCode: record.stocktakeReportCode}
        runInAction(()=>{
            _varianceReportDetailsStore._materialDetailStore.searchKey = 'all'
        })
        _varianceReportDetailsStore._materialDetailStore.fetchTableList(pm);
    }
    onSearch = () => {
        this.store.fetchTableList()
    }
    render() {
        return (
            <div>
                <SearchBarComp
                    comps={this.searchComps}
                    store={_searchBarStore}
                />
                <Table
                    {..._varianceReportStore.Props}
                    rowKey='stocktakeReportCode'
                    columns={this.columns}
                />
            </div>
        )
    }

}