import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message } from '../../../base/components/AntdComp';
import { planDeskListStore, searchBarStore } from "../store/PlanDeskListStore";
import { editInfoStore,editDetailStore } from "../store/EditPlanDispatchStore";
import { _add_PlanDispatch_Store, _pdEditTableStore } from "../store/AddPlanDispatchStore";
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import SaleOrderAct from '../../actions/SaleModule/SaleOrderAct'
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
export default class PlanDeskListComp extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '计划单编号',
            dataIndex: 'planOrderCode',
            key: 'planOrderCode',
            width: 160,
            render: (text, record, index) => <a onClick={() => this.detailPlanDesk(record.planOrderCode)}>{record.planOrderCode}</a>
        }, {
            title: '计划状态',
            dataIndex: 'planOrderStatus',
            key: 'planOrderStatus',
            render: (text, record, index) => this.renderTableRowStatus(text, record, index)
        }, {
            title: '销售订单编号',
            dataIndex: 'sellOrderCodeDisplay',
            key: 'sellOrderCodeDisplay',
            render: (text, record, index) => <a onClick={() => this.saleOrder(record.sellOrderCode)}>{record.sellOrderCodeDisplay}</a>
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        }, {
            title: '客户名称',
            dataIndex: 'customerName',
            key: 'customerName',
        }, {
            title: '产品名称',
            dataIndex: 'materialName',
            key: 'materialName',
            render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 88 }} />
        }, {
            title: '计划数量',
            dataIndex: 'planQty',
            key: 'planQty',
        }, {
            title: '单位',
            dataIndex: 'materialUnitName',
            key: 'materialUnitName',
        }, {
            title: '创建人员',
            dataIndex: 'createByName',
            key: 'createByName',
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
        }, {
            title: '操作',
            dataIndex: '',
            key: '',
            width: 88,
            className: 'operations-columns',
            render: (txt, record, index) => {
                function onEdit(pm) {
                    store.dispatch(TabsAct.TabAdd({
                        title: "计划单详情",
                        key: "editPlanDeskComp"
                    }));
                    editDetailStore.fetchDeskDetails({planOrderCode:pm},true)
                     editInfoStore.fetchTableList({planOrderCode:pm})
                }
                let opts = [
                    {
                        title: '编辑',
                        fun: ()=>onEdit(record.planOrderCode),
                        show: record.planOrderStatus == 1 || record.planOrderStatus == 2,
                        default: '--'
                    },
                    {
                        title: "删除",
                        titleText: ['确定要删除该数据吗？'],
                        fun: () => this.onDelete(record.planOrderCode),
                        show: record.planOrderStatus == 1,
                        default: '--'
                    },
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
                            key: "contractCode",
                            label: "合同编号",
                            type: "string"
                        },
                        {
                            key: "planOrderCode",
                            label: "计划单编号",
                            type: "string"
                        },
                        {
                            key: "customerName",
                            label: "客户名称",
                            type: "string"
                        },
                        {
                            key: "planOrderStatus",
                            label: "计划状态",
                            type: "enumSelect",
                            enumCode: "planDeskStatus",
                            style: { width: 200 },
                            defaultValue: ""
                        },
                        {
                            key: "sellOrderCode",
                            label: "销售订单编号",
                            type: "string"
                        },
                        {
                            key: "createByName",
                            label: "创建人员",
                            type: "string"
                        },
                        {
                            key: "createByTime",
                            label: "创建时间",
                            type: "dateRange",
                            format: "YYYY-MM-DD",
                            showTime: true,
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
        _add_PlanDispatch_Store.getCodeRule({businessIndex: 55})
    }
    onSearch = () => {
        planDeskListStore.fetchTableList()
    };
    componentDidMount() {
        planDeskListStore.fetchTableList({ page: 1, pageSize: 15 })
    }
    renderTableRowStatus = (text, record, index) => {
        // "planOrderStatus": "int,计划单状态;1：已保存 2：部分提交 3：已提交"
        switch (record.planOrderStatus) {
            case 1:
                return "已保存";
            case 2:
                return "部分提交";
            case 3:
                return "已提交";
        }
    }
    detailPlanDesk = (pm) => {
        store.dispatch(TabsAct.TabAdd({
            title: "计划单详情",
            key: "editPlanDeskComp"
        }));
         editDetailStore.fetchDeskDetails({planOrderCode:pm},true)
         editInfoStore.fetchTableList({planOrderCode:pm})
    }
    onDelete=(pm)=>{
         planDeskListStore.fetchTableDelet({planOrderCode: pm}).then(json => {
            if (json.status === 2000) {
                message.success('删除成功!');
                planDeskListStore.fetchTableList();
            }
        });
    }
    saleOrder=(pm)=>{
        store.dispatch(SaleOrderAct.SetSaleOrderDetail({saleOrderCode:pm}))
        store.dispatch(TabsAct.TabAdd({
             title: "销售订单详情", 
             key: "saleOrderDetail"
        }));
    }
    render() {
        return (
            <div>
                <SearchBarComp
                    comps={this.searchComps}
                    store={searchBarStore}
                />
                <Table
                    {...planDeskListStore.Props}
                    rowKey='id'
                    columns={this.columns}
                    className='plan-desk-list-table'
                />
            </div>
        )
    }
}