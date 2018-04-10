
import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message } from '../../../base/components/AntdComp';
import { inventoryWorkSheetStore, searchBarStore } from "../store/InventoryWorkSheetStore";
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { impWorkSheetStore,detailSheetStore,addTableLineStore,detailWorkSheetTableStore} from "../store/ImpWorkSheetStore";
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
export default class InventoryWorkSheetComp extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '作业单号',
            dataIndex: 'stocktakeTaskCode',
            key: 'stocktakeTaskCode',
            width: 160,
            render: (text, record, index) => <a onClick={() => this.detailWorkShet({ id: record.id, stocktakeTaskCode: record.stocktakeTaskCode })}>{record.stocktakeTaskCode}</a>
        }, {
            title: '单据状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record, index) => this.renderTableRowStatus(text, record, index)
        }, {
            title: '关联方案编号',
            dataIndex: 'solutionCode',
            key: 'solutionCode',
        }, {
            title: '关联方案名称',
            dataIndex: 'solutionName',
            key: 'solutionName',
            render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 84 }} />
        }, {
            title: '所属仓库',
            dataIndex: 'warehouseName',
            key: 'warehouseName',
            render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 132 }} />
        }, {
            title: '更新人',
            dataIndex: 'updateByName',
            key: 'updateByName',
            render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 58 }} />
        }, {
            title: '更新时间',
            dataIndex: 'updateDate',
            key: 'updateDate',
            width: 134
        }, {
            title: '操作',
            dataIndex: '',
            key: '',
            width: 84,
            className: 'operations-columns',
            render: (txt, record, index) => {
                let opts = [
                    {
                        title: '执行',
                        fun: () => this.implement({ id: record.id, stocktakeTaskCode: record.stocktakeTaskCode }),
                        show: record.status == 1 || record.status == 2,
                        default:'--'
                    }
                ];
                return <OperationsComp operations={opts} />;
            }
        }
        ];
        this.searchComps = {
            left: {
                select: {
                    style: {},
                    list: [
                        {
                            key: "stocktakeTaskCode",
                            label: "作业单号",
                            type: "string"
                        },
                        {
                            key: "status",
                            label: "单据状态",
                            type: "enumSelect",
                            enumCode: "workDocStatus",
                            style: { width: 200 },
                            defaultValue: "1"
                        },
                        {
                            key: "solutionCode",
                            label: "关联方案编号",
                            type: "string"
                        },
                        {
                            key: "solutionName",
                            label: "关联方案名称",
                            type: "string"
                        },
                        {
                            key: "warehouseName",
                            label: "所属仓库",
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
            }
        };
    }
    implement = (pm) => {
        store.dispatch(TabsAct.TabAdd({
            title: "执行盘点作业单",
            key: "impWorkSheetComp"
        }));
        impWorkSheetStore.fetchImpDetails(pm)
        addTableLineStore.getTableList({id: pm.id, stocktakeTaskCode: pm.stocktakeTaskCode,page: 1, pageSize: 15 })
    }
    renderTableRowStatus = (text, record, index) => {
        // status作业单据状态:1已保存,2盘点中,3已完成,4已更新,5已关闭
        switch (record.status) {
            case 1:
                return "已保存";
            case 2:
                return "盘点中";
            case 3:
                return "已完成";
            case 4:
                return "已更新";
            case 5:
                return "已关闭";
        }
    }
    componentDidMount() {
        inventoryWorkSheetStore.fetchTableList({ page: 1, pageSize: 15 })
        window.addEventListener('currentOpen',this.isCurrentOpen(true))
    }
     isCurrentOpen=(pm)=>{
        runInAction(()=>{
            inventoryWorkSheetStore.isCurrentOpen=pm
        })

    }
    componentWillUnmount(){
         window.removeEventListener('change',this.isCurrentOpen(false))
    }
    detailWorkShet = (pm) => {
        store.dispatch(TabsAct.TabAdd({
            title: "盘点作业单详情",
            key: "detailWorkSheetComp"
        }));
        detailSheetStore.fetchImpDetails(pm)
        detailWorkSheetTableStore.fetchTableList({ id:pm.id,stocktakeTaskCode:pm.stocktakeTaskCode,page: 1, pageSize: 15 })
    }
    onSearch = () => {
        inventoryWorkSheetStore.fetchTableList()
    };
    render() {
        return (
            <div className="inventory-work-sheet">
                <SearchBarComp
                    comps={this.searchComps}
                    store={searchBarStore}
                />
                <Table
                    {...inventoryWorkSheetStore.Props}
                    rowKey='id'
                    columns={this.columns}
                    className='storage-list-table'
                />
            </div>
        )
    }
}