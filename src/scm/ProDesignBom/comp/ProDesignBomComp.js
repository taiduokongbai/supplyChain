import { Table, message } from 'antd';
import React, { Component } from 'react';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import { formatNullStr } from "../../../base/consts/Utils";
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';

import { searchBarStore, productTableStore } from '../store/ProDesignBomStore';
import { proDesignBomDetailsInfoStore, deignTypeDetailsStore, importTypeDetailsStore, detailsEditTable} from '../store/ProDesignBomDetailsStore'
import { importTableStore, deignTypeStore, importTypeStore } from '../store/ImportProDesignBomStore';
import { editProDesignBomTableStore } from "../store/AddProDesignBomStore";

let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
export default class ProDesignBomComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '产品编码',
                dataIndex: 'productCode',
                fixed: 'left',
                width: 160,
                render: (text, record, index) => <a href="#" onClick={() => this.openDetails(record.id)}>{text}</a>
            }, {
                title: '产品名称',
                dataIndex: 'productName',
                fixed: 'left',
                width: 120,
                render: (text,record,index) => <TooltipComp attr={{text:text, wid: 112}}/>
            }, {
                title: '规格',
                dataIndex: 'productSpec',
                render: (text, record, index) => <TooltipComp attr={{text: text, wid: 88}}/>,
                className: 'roll-first',
            }, {
                title: '型号',
                dataIndex: 'productModel',
                render: (text,record,index) => <TooltipComp attr={{text:text, wid: 88}}/>
            }, {
                title: '材料',
                dataIndex: 'productTexture',
                render: (text,record,index) => <TooltipComp attr={{text:text, wid: 88}}/>
            }, {
                title: '产品分类',
                dataIndex: 'productCategoryName',
                render: (text,record,index) => <TooltipComp attr={{text:text, wid: 88}}/>
            }, {
                title: '代号',
                dataIndex: 'gbCode',
                render: (text,record,index) => <TooltipComp attr={{text:text, wid: 88}}/>
            }, {
                title: '来源单号',
                dataIndex: 'sourceCode',
            }, {
                title: '状态',
                dataIndex: 'status',
                render: (text, record, index) => window.ENUM.getEnum("wareHouseType", text.toString()),
            }, {
                title: '更新人',
                dataIndex: 'updateByName',
            }, {
                title: '更新时间',
                dataIndex: 'updateDate',
            }, {
                title: '操作',
                dataIndex: 'operate',
                fixed: 'right',
                width: 57,
                render: (txt, record, index) => {
                    let opts = [
                        {
                            title: "删除",
                            titleText: ['确定要删除该数据吗？删除后，该条数据记录将不可恢复！'],
                            fun: () =>productTableStore.fetchProductDesignBomDelete(record.id),
                            show:  record.status == 0,
                            default: formatNullStr('')
                        },
                    ];
                    return <OperationsComp operations={opts}/>;
                }
            },
        ];
        this.searchComps = {
            left: {
                select: {
                    style: {},
                    list: [
                        {
                            key: "productName",
                            label: "产品名称",
                            type: "string",
                            defaultValue: ''
                        },
                        {
                            key: "productCategoryName",
                            label: "产品分类",
                            type: "string",
                        },
                        {
                            key: "sourceCode",
                            label: "来源单号",
                            type: "string"
                        },
                        {
                            key: "status",
                            label: "单据状态",
                            type: "enumSelect",
                            enumCode: "pBomStatus",
                            style: { width: 200 },
                            defaultValue: -1
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
                label: "导入",
                fn: this.onImport,
                className: "",
                style: {},
            }]
        };
    };

    componentDidMount(){
        productTableStore.fetchTableList();
    };

    onSearch = () => {
        productTableStore.fetchTableList();
    };

    openDetails = (id) => {
        store.dispatch(TabsAct.TabAdd({
            title: "产品设计BOM详情",
            key: "importProDesignBomDetails"
        }));
        deignTypeDetailsStore.fetchSelectList({ subCode: ["C022"]});
        importTypeDetailsStore.fetchSelectList({orderStatus: 1});
        proDesignBomDetailsInfoStore.getProDesignBomDetailsInfo({id:id})
            .then(json => {
                if(json.status === 2000) {
                    detailsEditTable.fetchTableList({
                        page:1 ,
                        pageSize: 50,
                        designTypeCode: '',//values[0].data.designTypeCode,
                        importTypeCode: '', //json.data.productCategoryCode,
                        productId:id});
                }
            })
    };

    onImport = () => {
        store.dispatch(TabsAct.TabAdd({
            title: "导入产品设计BOM",
            key: "importProDesignBom"
        }));
    };

    render() {
        return (
            <div className="pro-design-bom-list">
                <SearchBarComp
                    comps={this.searchComps}
                    store={searchBarStore}
                />
                <Table
                    {...productTableStore.Props}
                    rowKey='productCode'
                    scroll={{ x: 1680 }}
                    columns={this.columns}
                />
            </div>
        )
    }
}