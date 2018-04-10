import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Spin } from '../../../base/components/AntdComp';

import SearchBarComp from './SearchBarComp'
import StorageOperationsComp from './StorageOperationsComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import AddStorageBinComp from './AddStorageBinComp'
import EditStorageBinComp from './EditStorageBinComp'
import StorageBinListTreeComp from './StorageBinListTreeComp'
import { searchBarStore, storageBinListStore, addStorageBinStore, editStorageBinStore, wareHouseStore } from '../store/StorageBinListStore';
import { storageBinListTreeStore } from '../store/StorageBinListTreeStore';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
import  ImportStorageAct from "../../actions/InventoryModule/ImportStorageAct";
import { store } from '../../data/StoreConfig';
import ImportSotrageBinDialogComp from "./ImportSotrageBinDialogComp";
@observer
export default class StorageBinListComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            headerVisible: false,
            stockIds: [],
        }
        this.columns = [{
            title: '编码',
            dataIndex: 'locationCode',
            key: 'locationCode',
            width: 160
        }, {
            title: '名称',
            dataIndex: 'locationName',
            key: 'locationName',
            render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 94 }} />
        }, {
            title: '所属仓库',
            dataIndex: 'stockName',
            key: 'stockName',
            render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 94 }} />
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 158,
            render: (text, record, index) => this.renderTableRowStatus(text, record, index)
        }, {
            title: '更新人',
            dataIndex: 'updateByName',
            key: 'updateByName',
            render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 60 }} />
        }, {
            title: '更新时间',
            dataIndex: 'updateDate',
            key: 'updateDate',
            width: 134
        }, {
            title: '操作',
            dataIndex: '',
            key: '',
            width: 100,
            className:'operations-columns',
            render: (txt, record, index) => {
                function onEdit() {
                    // store.dispatch(TabsAct.TabAdd({
                    //     title: "编辑采购订单22",
                    //     key: "editPurchase2"
                    // }));
                    // purEditStore.fetchPurchaseDetail({ orderCode });
                    editStorageBinStore.setVisible(true);
                    editStorageBinStore.stockLocationInfo({ id: record.id });
                }

                let opts = [
                    {
                        title: '编辑',
                        fun: onEdit,
                        show: true,
                    },
                    {
                        title: "删除",
                        titleText: ['确定要删除该数据吗？'],
                        fun: () => this.onDelete(record.id),
                        show: record.status == 0,
                    },
                    {
                        title: record.status == 1?"禁用":"启用",
                        titleText: record.status == 1?['确定要禁用该数据吗？']:['确定要启用该数据吗？'],
                        fun:record.status == 1?() => this.onDisable([record.id]):() => this.onEnable([record.id]),
                        show: record.status == 1?record.status == 1:(record.status == 0 || record.status == 2),
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
                            key: "status",
                            label: "状态",
                            type: "enumSelect",
                            enumCode: "storageType",
                            style: { width: 200 },
                            defaultValue: ""
                        },
                        {
                            key: "locationCode",
                            label: "编码",
                            type: "string"
                        },
                        {
                            key: "locationName",
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
                label: "导入",
                fn: this.handleImport,
                className: "",
                style: {},
            },{
                type: "button",
                label: "新建",
                fn: this.onAdd,
                className: "",
                style: {},
            }]
        };
    }
    onDelete = (pm) => {
        storageBinListStore.fetchTableDelet({ "ids": [pm] }).then(json => {
            if (json.status === 2000) {
                message.success('删除成功!');
                storageBinListStore.fetchTableList();
            }
        });
    }
    onEnable = (pm) => {
        storageBinListStore.fetchTableEnable({ "ids": pm }).then(json => {
            if (json.status === 2000) {
                message.success('启用成功!');
                this.setState({ selectedRowKeys: [] })
                this.setState({ headerVisible: false })
                storageBinListStore.fetchTableList();
            }
        });
    }
    onDisable = (pm) => {
        storageBinListStore.fetchTableDisabled({ "ids": pm }).then(json => {
            if (json.status === 2000) {
                message.success('禁用成功!');
                this.setState({ selectedRowKeys: [] })
                this.setState({ headerVisible: false })
                storageBinListStore.fetchTableList();
            }
        });
    }
    componentWillUnmount = () => {
        storageBinListTreeStore.stockIds = [];
    }
    componentDidMount() {
        storageBinListStore.fetchTableList({page: 1,pageSize: 15})
        wareHouseStore.fetchSelectList();
    }
    onSearch = () => {
        storageBinListStore.fetchTableList();
    };

    onAdd = () => {
        addStorageBinStore.setVisible(true);
        // store.dispatch(TabsAct.TabAdd({
        //     title: "新建采购订单22",
        //     key: "addPurchase2"
        // }));
        // purAddStore.initAutoCompleteData();
    };

    renderTableRowStatus = (text, record, index) => {
        // "status": "int,仓位状态;0：保存 1：启用 2：禁用"
        switch (record.status) {
            case 0:
                return "已保存";
            case 1:
                return "已启用";
            case 2:
                return "已禁用";
        }
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        if (selectedRows.length > 0) {
            this.setState({ headerVisible: true })
            this.setState({ selectedRowKeys })
        } else {
            this.setState({ headerVisible: false })
            this.setState({ selectedRowKeys: [] })
        }
    }

    getPopup = () => {
        return (
            <div>
                <AddStorageBinComp />
                <EditStorageBinComp />
            </div>
        )
    }
     handleImport = ()=>{
        store.dispatch(ImportStorageAct.ImportViewVisiable(true));
    }
    render() {
        let rowSelection = {
            onChange: this.onSelectChange,
            selectedRowKeys: this.state.selectedRowKeys
        }
        return (
            <div className="storage-bin-list">
                <div className={this.state.headerVisible ? 'storage-header' : 'storage-header header-hidden'}>
                    <div className="storage-header-button">
                        <Button type="primary" onClick={() => this.onEnable(this.state.selectedRowKeys)} className="enable-all-button" ><span className="icon-enable c2mfont c2m-qiyong"></span><span className="icon-all-enable">批量启用</span></Button>
                        <Button type="primary" onClick={() => this.onDisable(this.state.selectedRowKeys)}><span className="icon-disable c2mfont c2m-jinyong2"></span><span className="icon-all-enable">批量禁用</span></Button>
                    </div>
                    <div className="storage-header-button-right">
                        <Button type="primary" style={{marginRight:"10px"}} onClick={()=>this.handleImport()}><span className="newset-icon c2mfont c2m-daoru_nor"></span>导入</Button>
                        <Button type="primary" onClick={()=>this.onAdd()}><span className="newset-icon c2mfont c2m-jia"></span>新建</Button>
                    </div>
                </div>
                <div className={this.state.headerVisible ? 'storage-header-search header-hidden-search' : 'storage-header-search'}>
                    <div className="opration-style-search">操作类型：</div>
                    <SearchBarComp
                        comps={this.searchComps}
                        store={searchBarStore}
                    />
                </div>
                <div style={{ display: "flex" }}>
                    <Spin spinning={storageBinListTreeStore.loading}>
                        <div className="storage-tree-list">
                            <StorageBinListTreeComp />
                        </div>
                    </Spin>
                    <Table
                        {...storageBinListStore.Props}
                        rowKey='id'
                        columns={this.columns}
                        rowSelection={rowSelection}
                        style={{ flex: "right", width: "100%" }}
                        className='storage-list-table'
                    />
                </div>
                {this.getPopup()}
                 <ImportSotrageBinDialogComp callBack={(json)=>{ this.onSearch();}}/>
            </div>
        )
    }
}