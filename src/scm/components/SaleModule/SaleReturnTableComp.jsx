import React, { Component } from 'react';
import { Table, Input, Icon, Button, Popconfirm } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';

class SaleReturnTableComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '销售退货id',
                className: 'saleReturnId',
                key: 'saleReturnId',
                width: 120,
                hidden: true,
            },
            {
                title: '销售退货单号',
                dataIndex: 'saleReturnCode',
                key: 'saleReturnCode',
                width: 150,
                fixed: 'left',
                render: (text, record) => (<a onClick={() => this.getSaleReturnDetail(record.saleReturnCode)}>{text}</a>)
            }, {
                title: '单据状态',
                dataIndex: 'status',
                key: 'status',
                width: 60,
                fixed: 'left',
                render: (txt, record, index) => {
                    return this.getE("ProOrderStatus", txt + '')
                },
            }, {
                title: '客户名称',
                dataIndex: 'customerName',
                key: 'customerName',
                width: 118,
                fixed: 'left',
            }, {
                title: '单据类型',
                dataIndex: 'businessType',
                key: 'businessType',
                className: 'padding-left20',
                render: (txt, record, index) => {
                    return this.getE("saleReturnBusinessType", txt + '')
                },

            }, {
                title: '预计退货日期',
                dataIndex: 'planReturnDate',
                key: 'planReturnDate',
            }, {
                title: '销售组织',
                dataIndex: 'saleOrg',
                key: 'saleOrg',
            }, {
                title: '销售人员',
                dataIndex: 'saleEmp',
                key: 'saleEmp',
            },  {
                title: '来源订单号',
                dataIndex: 'sourceCode',
                key: 'sourceCode',
            },{
                title: '下推状态',
                dataIndex: 'pushdownStatus',
                key: 'pushdownStatus',
                render: (txt, record, index) => {
                    return this.getE("isPushDownStatus", txt + '')
                },
            }, {
                title: '更新人',
                dataIndex: 'updateByName',
                key: 'updateByName',
            }, {
                title: '更新时间',
                dataIndex: 'updateDate',
                key: 'updateDate',
            }, {
                title: '操作',
                dataIndex: 'operate',
                className: 'operate-center',
                key: 'operate',
                width: 80,
                fixed:'right',
            }];

        this.columns[this.columns.length - 1].render = (txt, record, index) =>
            <div>
                {(record.status == "0" || record.status == "4" || record.status == "6") ? <span className="c2mfont c2m-bianji return-order-implement" title='编辑' onClick={() => this.onEditSaleReturnDetail(record.saleReturnCode)}></span> : <span className="return-double-line">--</span>}
                {(record.status == "0" || record.status == "4" || record.status == "6") ? <Popconfirm title="确认删除该数据吗？" onConfirm={() => this.onDelete(record.saleReturnCode)} okText="确定" cancelText="取消">
                    <span className="return-order-implement-delete c2mfont c2m-shanchu" title='删除'></span>
                </Popconfirm> : <span className="return-double-line-delete">--</span>}
            </div>
    }
    getSaleReturnDetail = (saleReturnCode) => {
        this.props.GetSaleReturn(saleReturnCode, "detail");
        store.dispatch(TabsAct.TabAdd({ title: "销售退货单详情", key: "saleReturnDetail" }));

    };

    onEditSaleReturnDetail = (saleReturnCode) => {
        this.props.GetSaleReturn(saleReturnCode, "edit");
        this.props.CheckLockingStatus(saleReturnCode);
    };
    onDelete = (saleReturnCode) => {
        this.props.DeleteSaleReturn(saleReturnCode);
    }

    getE = (key, val) => {
        if (val !== undefined && val !== 'null' && val !== "") {
            return window.ENUM.getEnum(key, val)
        }
    }
    componentDidMount() {
        this.props.tablePaging(1);
    }
    render() {
        const { tabLoading, tablePaging, dataSource, ...props } = this.props;
        return (
            <div className="table-wrap">
                <div className="table-body">
                    <MTable
                        {...props}
                        dataSource={dataSource}
                        loading={tabLoading}
                        cols={this.columns}
                        rowKey={"saleReturnId"}
                        pageOnChange={tablePaging}

                    />
                </div>
            </div>
        );
    }
}
export default SaleReturnTableComp;