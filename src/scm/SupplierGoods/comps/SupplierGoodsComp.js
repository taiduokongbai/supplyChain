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

import { supGoodsListStore, searchBarStore } from '../stores/SupGoodsStore';
import AddSupGoodsComp from './AddSupGoodsComp';
import EditSupGoodsComp from './EditSupGoodsComp';
import SupGoodsViewComp from './SupGoodsViewComp';
import { addSupGoodsStore } from '../stores/AddSupGoodsStore';
import { editSupGoodsStore } from '../stores/EditSupGoodsStore';
import { supGoodsViewStore } from '../stores/SupGoodsViewStore';

@observer
export default class PurchaseComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '供应商编码',
                dataIndex: 'supplierCode',
                key: 'supplierCode',
                width: 155,
            },
            {
                title: '供应商名称',
                dataIndex: 'supplierFull',
                key: 'supplierFull',
                width: 110,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 82 }} />
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width: 154,
                render: (text, record, index) => <a onClick={()=>this.onDetail(record)}>{text}</a>
            },{
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 110,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 82 }} />
            },{
                title: '数量',
                dataIndex: 'materialQty',
                key: 'materialQty',
                width: 70,
            }, {
                title: '单位',
                dataIndex: 'materialUnitName',
                key: 'materialUnitName',
                width: 62,
            }, {
                title: '商品编码',
                dataIndex: 'goodsCode',
                key: 'goodsCode',
                width: 169,
            }, {
                title: '商品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                width: 105,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 82 }} />
            }, {
                title: '商品数量',
                dataIndex: 'goodsQty',
                key: 'goodsQty',
                width: 79,
            }, {
                title: '商品单位',
                dataIndex: 'goodsUnitName',
                key: 'goodsUnitName',
                width: 80,
            }, {
                title: '转换因子',
                dataIndex: 'convertFactor',
                key: 'convertFactor',
                width: 86,
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 52,
                render: (text, record, index) => enumStore.getEnum('dataStatus', text),
            }, {
                dataIndex: 'handle',
                title: '操作',
                className: 'table-operations',
                width: 112,
                render: (txt, record, index) => {
                    let id = record.id;
                    function onEdit() {
                        editSupGoodsStore.setVisible(true);
                        editSupGoodsStore.fetchDetail({id});
                    }
                    function onDelete() {
                        supGoodsListStore.fetchDelete({ id });
                    };
                    function onStatus() {
                        let msg = record.status == '1' ? '禁用成功!' : '启用成功!';
                        if (record.status == 1) {
                            supGoodsListStore.onBatchDisable(id).then(json => {
                                if (json.status == 2000) {
                                    message.success(msg);
                                }
                            });
                        } else {
                            supGoodsListStore.onBatchEnable(id).then(json => {
                                if (json.status == 2000) {
                                    message.success(msg);
                                }
                            });
                        }
                    };
                    let opts = [
                        {
                            title: '编辑',
                            fun: onEdit,
                            default: '--',
                            show: true,
                        },
                        {
                            title: "删除",
                            titleText: ['确定删除该数据吗？'],
                            fun: onDelete,
                            default: '--',
                            show: record.status == 0,
                        },
                        {
                            title: record.status == 1 ? "禁用":"启用",
                            fun: onStatus,
                            default: '--',
                            show: true,
                        },
                    ];
                    return <OperationsComp operations={opts} />;
                }
            }];
        this.searchComps = {
            left: {
                select: {
                    style: {},
                    list: [
                        {
                            key: "supplierCode",
                            label: "供应商编码",
                            type: "string",
                        },
                        {
                            key: "supplierFull",
                            label: "供应商名称",
                            type: "string",
                        },
                        {
                            key: "materialCode",
                            label: "物料编码",
                            type: "string",
                        },
                        {
                            key: "materialName",
                            label: "物料名称",
                            type: "string",
                        },
                        {
                            key: "goodsCode",
                            label: "商品编码",
                            type: "string",
                        },
                        {
                            key: "goodsName",
                            label: "商品名称",
                            type: "string",
                        },
                        {
                            key: "status",
                            label: "单据状态",
                            type: "enumSelect",
                            enumCode: "supplierStatus",
                            style: { width: 200 },
                            defaultValue: 'null',
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
    onSearch = () => {
        supGoodsListStore.fetchTableList();
    }
    onDetail = (record) => {
        let id = record.id;
        supGoodsViewStore.setVisible(true);
        supGoodsViewStore.fetchDetail({ id });
    }
    onAdd = () => {
        addSupGoodsStore.resetDetail();
        addSupGoodsStore.setVisible(true);
        addSupGoodsStore.initData();
    }

    onBatchEnable = () => {
        supGoodsListStore.onBatchEnable().then(json => {
            if (json.status == 2000) {
                message.success('批量启用成功!');
            }
        });
    }
    onBatchDisable = () => {
        supGoodsListStore.onBatchDisable().then(json => {
            if (json.status == 2000) {
                message.success('批量禁用成功!');
            }
        });
    }
    render() {
        let selecteds = supGoodsListStore.selectedRowKeys.slice();
        return (
            <div className="supGoods">
                {
                    selecteds.length <= 0 ?
                        <SearchBarComp
                            comps={this.searchComps}
                            store={searchBarStore}
                        />
                        :
                        <div style={{lineHeight: "72px"}}>
                            <Button type="primary"
                                onClick={this.onBatchEnable}
                                style={{ marginRight: 20 }}
                                loading={supGoodsListStore.loading}
                            >批量启用</Button>
                            <Button type="primary"
                                onClick={this.onBatchDisable}
                                loading={supGoodsListStore.loading}
                            >批量禁用</Button>
                        </div>
                }
                <Table
                    {...supGoodsListStore.Props}
                    rowKey={record=>record.id}
                    columns={this.columns}
                />
                <AddSupGoodsComp />
                <EditSupGoodsComp />
                <SupGoodsViewComp />
            </div>
        )
    }
}