//采购订单
import React, { Component } from "react";
import moment from "moment";
import { Button, Popconfirm, message, Select } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import TooltipComp from '../../../base/components/TooltipComp';
import { shouldComponentUpdate } from '../../../base/consts/Utils';
import SearchComp from '../../../base/components/SearchComp';
import SearchBarComp from '../../../base/components/SearchBarComp';
import TXT from '../../languages';
import OperationsComp from '../../../base/components/OperationsComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';

const T = TXT.Purchase;
const Option = Select.Option;
const columns = [
    {
        title: '订单编号',
        dataIndex: 'orderCode',
        key: 'orderCode',
        width: 160,
        fixed: 'left'
    },
    {
        title: '单据状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width: 68,
        render: (text, record, index) => window.ENUM.getEnum("purchaseOrderStatus", text + ''),
        fixed: 'left'
    },
    {
        title: '业务类型',
        dataIndex: 'orderType',
        key: 'orderType',
        className: 'purchaseOrder-table-padding',
        render: (text, record, index) => window.ENUM.getEnum("purchaseOrderType2", text+''),
    },
    {
        title: '采购类型',
        dataIndex: 'purchaseType',
        key: 'purchaseType',
        render: (text, record, index) => window.ENUM.getEnum("purchaseType2", text+''),
    },
    {
        title: '订单日期',
        dataIndex: 'orderDate',
        key: 'orderDate',
    },
    {
        title: '供应商',
        dataIndex: 'supplierName',
        key: 'supplierName',
        render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
    },
    {
        title: '收货站点',
        dataIndex: 'siteName',
        key: 'siteName',
    }, 
    {
        title: '来源单据',
        dataIndex: 'sourceOrderType',
        key: 'sourceOrderType',
        render: (text, record, index) => window.ENUM.getEnum("purchaseSourceOrderType", text+''),
    }, 
    {
        title: '来源单号',
        dataIndex: 'sourceOrderCode',
        key: 'sourceOrderCode',
    }, 
    {
        title: '下推状态',
        dataIndex: 'pushdownMark',
        key: 'pushdownMark',
        render: (text, record, index) => window.ENUM.getEnum("isPushDownStatus", text+''),
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
        className: 'operation-center',
        fixed: 'right'
    }];


class PurchaseComp extends Component {
    constructor(props, context) {
        super(props, context);


        columns[0].render = (txt, record, index) =>
            <a href="#" onClick={() => this.PurchaseViewShow(record.orderCode)}>{record.orderCode}</a>

        columns[columns.length - 1].render = (txt, record, index) => {
            let opts = [
                {
                    title: '编辑',
                    fun: () => this.editPurchase(record.orderCode),
                    show: record.orderStatus == 0 || record.orderStatus == 4,
                    default:'--'
                },
                {
                    title: "删除",
                    titleText: ['确定删除该条订单吗？', '删除后，该条订单记录将不可恢复！'],
                    fun: () => this.delPurchase(record.orderCode, record.sourceOrderType),
                    show: (record.orderStatus == 0 && record.sourceOrderType != 3) || (record.orderStatus == 4 && record.sourceOrderType != 3),
                    default:'--'
                },
            ];
            return <OperationsComp operations={opts} />;
        };

        this.searchData = {
            left: [
                {
                    key: "orderCode",
                    val: "订单编号",
                    type: "string"
                },
                {
                    key: "orderStatus",
                    val: "单据状态",
                    type: "select",
                    data: {
                        list: window.ENUM.getEnum("purchaseOrderStatus"),
                        keyName: "catCode",
                        labelName: "catName",
                        style: { width: 200 },
                    },
                    initialValue: "",
                },
                {
                    key: "orderDate",
                    val: "订单日期",
                    type: "date",
                    initialValue: [moment().subtract(1,"months").format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
                },
                {
                    key: "supplierNickName",
                    val: "供应商",
                    type: "string"
                },
                {
                    key: "siteName",
                    val: "收货站点",
                    type: "string"
                },
                {
                    key: "sourceOrderCode",
                    val: "来源单号",
                    type: "string"
                }
            ],
            center: [
                {
                    title: "查询",
                    Func: null,
                    style: {},
                    type: "button"
                }
            ],
            right: [
                {
                    title: "新建",
                    Func: this.AddPurchase,
                    style: {}
                },
                {
                    title: "导出",
                    Func: null,
                    url: '',
                    style: {}
                }
            ]
        }
    }


    PurchaseViewShow = (orderCode) => {
        // this.props.PurchaseViewClick();
        store.dispatch(TabsAct.TabAdd({
            title: "采购订单详情",
            key: "purchaseViewCont",
            tag: {orderCode:orderCode}
        }));
        this.props.PurchaseCode(orderCode);
        // this.props.PurchaseViewTable(orderCode);
    };
    AddPurchase = () => {
        let { AddModul, GetSelectData, DeleteData, tabs, GetCodeRule} = this.props;
        GetCodeRule().then(json=>{
            if(json.status===2000){
                AddModul();
                tabs = tabs.map(item=>item.key);
                if(!tabs.includes('addPurchase')){
                    GetSelectData();
                    DeleteData('supplierCode', 'add');
                }
            }
        })
    }

    editPurchase = (orderCode) => {
        let { CanPurchaseEdit, EditModul, PurchaseDetail } = this.props;
        // CanPurchaseEdit(orderCode, 'purchaseList').then(json => {
            // if (json.status === 2000) {
                EditModul();
                PurchaseDetail(orderCode);
            // } else {
                // message.info('该单据已锁住，不能编辑!');
            // }
        // })
    }

    delPurchase = (orderCode, sourceOrderType) => {
        this.props.PurchaseDelete(orderCode);
    }



    render() {
        let { url, onSearch, SearchVal, searchType, tabLoading, tablePaging, AddModul, onSelect, ...props } = this.props;
        this.searchData.right.map(item => {
            if (item.title == "导出") {
                item.url = url;
            }
            return item;
        });
        return (
            <div>
                <SearchBarComp
                    {...props}
                    onSearch={onSearch}
                    searchData={this.searchData}
                />
                <div className="supplier-body purOrder-body">
                    <MTable
                        {...props}
                        loading={tabLoading}
                        cols={columns}
                        rowKey={"orderCode"}
                        pageOnChange={tablePaging}
                    />
                </div>
            </div>

        )
    }

    componentDidMount() {
        this.props.tablePaging(1);
    }
}

export default PurchaseComp;
