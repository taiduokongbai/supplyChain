import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message } from '../../../base/components/AntdComp';

import SearchBarComp from '../../../base/mobxComps/SearchBarComp'
import StorageOperationsComp from '../../StorageBin/comp/StorageOperationsComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';

import { searchBarStore, wareHouseListStore } from '../store/WareHouseListStore';
import { addwarehousestore } from "../store/AddWareHouseStore";
import { editwarehousestore } from "../store/EditWareHouseStore";
import AddWareHouseCont from "./AddWareHouseCont";
import EditWareHouseCont from "./EditWareHouseCont";
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
export default class WareHouseListComp extends Component {
    constructor (props) {
        super(props);
        this.addwarehousestore = addwarehousestore;
        this.editwarehousestore = editwarehousestore;
        this.columns = [
            {
                title: '编码',
                dataIndex: 'stockCode',
                key: 'stockCode',
                width: 150,
            }, {
                title: '名称',
                dataIndex: 'stockName',
                key: 'stockName',
                render: (text,render,index) => <TooltipComp attr={{text:text, wid: 70}}/>
            }, {
                title: '所属站点',
                dataIndex: 'siteName',
                key: 'siteName',
            }, {
                title: '负责人',
                dataIndex: 'headName',
                key: 'headName',
                width: 100,
                render: (text,render,index) => <TooltipComp attr={{text:text, wid: 70}}/>
            }, {
                title: '地址',
                dataIndex: 'address',
                key: 'address',
                render: (text,render,index) => <TooltipComp attr={{text:text, wid: 140}}/>
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (txt, record, index) => window.ENUM.getEnum("wareHouseType", txt.toString()),
                width: 74,
            }, {
                title: '更新人',
                dataIndex: 'updateByName',
                key: 'updateByName',
                width: 94
            }, {
                title: '更新时间',
                dataIndex: 'updateDate',
                key: 'updateDate',
                width: 140
            }, {
                title: '操作',
                dataIndex: '',
                key: '',
                width: 100,
                render: (txt, record, index) => {
                    let id = record.id;

                    function onEdit() {
                        editwarehousestore.changeVisible(true);
                        editwarehousestore.getStockInfo({id: id});
                    }

                    let opts = [
                        {
                            title: '编辑',
                            fun: onEdit,
                            show: record.status != 3,
                        },
                        {
                            title: "删除",
                            titleText: ['确定要删除该数据吗？'],
                            fun: () => wareHouseListStore.fetchWareHouseDelete(record.id),
                            show:  record.status == 0,
                        },
                        {
                            title: record.status != 1 ? "启用" : (record.status == 1 ? "禁用" : ''),
                            titleText: record.status != 1 ?
                                ['确定要启用该数据吗？'] : (record.status == 1 ? ['确定要禁用该数据吗？'] : ''),
                            fun: () => record.status != 1 ?
                                wareHouseListStore.fetchWareHouseStart(record.id) :
                                (record.status == 1 ? wareHouseListStore.fetchWareHouseForbidden(record.id) : ''),
                            show: record.status != 1 || record.status == 1,
                        },
                        // {
                        //     title: "禁用",
                        //     titleText: ['确定要禁用该数据吗？'] ,
                        //     fun: ,
                        //     show: record.status == 1,
                        // },
                    ];
                    return <StorageOperationsComp operations={opts}/>;
                }
            }
        ];
        this.searchComps = {
            left: {
                select: {
                    style: {},
                    list: [
                        {
                            key: "status",
                            label: "状态",
                            type: "enumSelect",
                            enumCode: "wareHouseType",
                            style: {width: 200},
                            defaultValue: ''
                        },
                        {
                            key: "stockCode",
                            label: "编码",
                            type: "string"
                        },
                        {
                            key: "stockName",
                            label: "名称",
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
        };
    }

    componentDidMount() {
       wareHouseListStore.fetchTableList({ page: 1,pageSize: 15});
    }

    onSearch = () => {
        wareHouseListStore.fetchTableList();
    };

    onAdd = () => {
        this.addwarehousestore.changeVisible(true);
        this.addwarehousestore.sitestore.fetchSelectList();   // 获取所属站点列表
        this.addwarehousestore.memberstore.fetchSelectList(); // 获取负责人列表  ??? 
        this.addwarehousestore.addrliststore.fetchSelectList(); // 获取地址列表
    };

    modalComp = () => {
        return(
            <div>
                <AddWareHouseCont 
                    store={this.addwarehousestore}
                    visible={this.addwarehousestore.visible}
                />
                <EditWareHouseCont 
                    store={this.editwarehousestore}
                    visible={this.editwarehousestore.visible}
                />
            </div>
        )
    }

    render() {
        return (
            <div className="ware-house-list">
                <SearchBarComp
                    comps={this.searchComps}
                    store={searchBarStore}
                />
                <Table
                    {...wareHouseListStore.Props}
                    rowKey='id'
                    columns={this.columns}
                />
                {
                    this.modalComp()
                }
            </div>
        )
    }
}