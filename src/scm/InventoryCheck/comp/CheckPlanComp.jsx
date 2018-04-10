/**
 *  盘点方案列表
 */
import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Checkbox } from '../../../base/components/AntdComp';
import SearchBarComp from "../../../base/mobxComps/SearchBarComp";
import StorageOperationsComp from '../../StorageBin/comp/StorageOperationsComp';
import { checkplan_store, searchBarStore, _addCheckPlanStore, _editCheckPlanStore, _checkplan_details } from "../store/CheckPlanStore";
import AddCheckPlanComp from "./AddCheckPlanComp";
import EditCheckPlanComp from "./EditCheckPlanComp";
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import TabsAct from "../../actions/TabsAct";
import { store } from '../../data/StoreConfig';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
export default class CheckPlanComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = checkplan_store;
        this.columns = [
            {
                title: '方案编号',
                dataIndex: 'solutionCode',
                key: 'solutionCode',
                width: 161,
                render: (text, record, index) => {
                    return (
                        <span onClick={() => this.checkPlanDetails(record)} style={{ cursor: 'pointer', color: '#4C80CF' }}>{record.solutionCode}</span>
                    )
                }
            }, {
                title: '方案名称',
                dataIndex: 'solutionName',
                key: 'solutionName',
            }, {
                title: '单据状态',
                dataIndex: 'status',
                key: 'status',
                render: (txt, record, index) => window.ENUM.getEnum("checkPlanStatus", txt.toString()), // 只有保存0和下推3两个状态
            }, {
                title: '是否盲盘',
                dataIndex: 'isBlindStocktake',
                key: 'isBlindStocktake',
                width: 100,
                render: (text, record, index) => record.isBlindStocktake ? '是' : '否'
            }, {
                title: '所属仓库',
                dataIndex: 'warehouseName',
                key: 'warehouseName',
                render: (text, render, index) => <TooltipComp attr={{ text: text, wid: 120 }} />
            }, {
                title: '更新人',
                dataIndex: 'updateByName',
                key: 'updateByName',
                render: (text, render, index) => <TooltipComp attr={{ text: text, wid: 58 }} />
            }, {
                title: '更新时间',
                dataIndex: 'updateDate',
                key: 'updateDate',
            }, {
                title: '操作',
                dataIndex: '',
                key: '',
                width: 84,
                className: 'table-operation-center',
                render: (txt, record, index) => {  // 保存状态  才有操作按钮
                    let opts = [
                        {
                            title: '编辑',
                            fun: () => this.onEdit(record),
                            show: record.status == 1,
                        },
                        {
                            title: "删除",
                            titleText: ['确定要删除该数据吗？'],
                            fun: () => this.onDelete(record),
                            show: record.status == 1,
                        },
                    ];
                    return <StorageOperationsComp operations={opts} />;
                }
            }
        ];
        this.searchComps = {
            left: {
                select: {
                    style: {},
                    list: [
                        {
                            key: "solutionCode",
                            label: "方案编号",
                            type: "string",
                            defaultValue: ''
                        },
                        {
                            key: "solutionName",
                            label: "方案名称",
                            type: "string"
                        },
                        {
                            key: "status",
                            label: "单据状态",
                            type: "enumSelect",
                            enumCode: "checkPlanStatus",
                            style: { width: 200 },
                            defaultValue: "1"
                        },
                        {
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
            right: [{
                type: "button",
                label: "新建",
                fn: this.onAdd,
                className: "",
                style: {},
            }]
        };
    }

    componentDidMount() {
        this.store.fetchTableList()
    }

    checkPlanDetails = (record) => {
        store.dispatch(TabsAct.TabAdd({
            title: "盘点方案详情",
            key: "CheckPlanDetailsComp"
        }));
        let pm = { id: record.id, solutionCode: record.solutionCode };
        _checkplan_details.getDetails(pm);
    }
    onSearch = () => {
        this.store.fetchTableList()
    }
    onAdd = () => {
        _addCheckPlanStore._warehouseStore.fetchTreeSelectList();      // 所属仓库
        _addCheckPlanStore._materialclassifyStore.fetchTreeSelectList({isNode: 0});  // 物料分类
        _addCheckPlanStore._materialStore.fetchSelectList(); // 物料
        _addCheckPlanStore.setVisible(true);
    }
    onEdit = (record) => {
        let pm = { id: record.id, solutionCode: record.solutionCode }
        _editCheckPlanStore.setVisible(true);
        _editCheckPlanStore._warehouseStore.fetchTreeSelectList({isNode: 0});
        _editCheckPlanStore._materialclassifyStore.fetchTreeSelectList();
        _editCheckPlanStore.getDetailsInfo(pm);
    }
    onDelete = (record) => {
        let pm = { id: record.id }
        this.store.delete(pm).then(json => {
            if (json.status === 2000) {
                message.success('删除成功！')
            }
        })
    }
    checkPlanModal = () => {
        return (
            <div>
                <AddCheckPlanComp
                    store={_addCheckPlanStore}
                    visible={_addCheckPlanStore.visible}
                />
                <EditCheckPlanComp
                    store={_editCheckPlanStore}
                    visible={_editCheckPlanStore.visible}
                />
            </div>
        )
    }

    render() {
        return (
            <div className='check-plan'>
                <SearchBarComp
                    comps={this.searchComps}
                    store={searchBarStore}
                />
                <Table
                    {...checkplan_store.Props}
                    rowKey='solutionCode'
                    columns={this.columns}
                />
                {
                    this.checkPlanModal()
                }
            </div>
        )
    }

}