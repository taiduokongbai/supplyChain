import React, { Component } from "react";
import { Row, Col, Spin, Table, Input, Button, Pagination, Dropdown, Menu, message, Icon } from '../../../base/components/AntdComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { formatNullStr } from '../../../base/consts/Utils';
import { purReturnViewStore } from '../stores/PurchaseReturnViewStore';
import { purReturnEditStore } from '../stores/EditPurchaseReturnStore'; 
import { purReturnListStore } from '../stores/PurchaseReturnStore';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
let { observer } = mobxReact;
let status = {
    submit: "提交",
    pushDown: "下推"
};
//orderStatus   0：已保存 1：已提交 2：已审核 
//pushdownFlag   0：否 1：是
let moreList = {
    "0": ["submit"],
    "1": [],//["withdraw"],
    "2": ["pushDown"],
};
@observer
class PurchaseReturnViewComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNum',
                key: 'lineNum',
                width: 48,
                fixed: 'left'
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                fixed: 'left',
                width: 140,
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                fixed: 'left',
                width: 98,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                className: 'purchaseOrder-table-padding',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            },  {
                title: '材料',
                dataIndex: 'materialQuality',
                key: 'materialQuality',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '代号',
                dataIndex: 'standardCode',
                key: 'standardCode',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '退货数量',
                dataIndex: 'returnQty',
                key: 'returnQty',
                render: (text, record, index) => (text || text == '0') && Number(text).toFixed(2),
            }, {
                title: '单位',
                dataIndex: 'purchaseUnitName',
                key: 'purchaseUnitName',
            }, {
                title: '计价数量',
                dataIndex: 'priceQty',
                key: 'priceQty',
                render: (text, record, index) => (text || text == '0') && Number(text).toFixed(2),
            },
            {
                title: '计价单位',
                dataIndex: 'priceUnitDetl',
                key: 'priceUnitDetl',
            }, {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                render: (text, record, index) => (text || text == '0') && '￥'+Number(text).toFixed(2),
            }, {
                title: '税率',
                dataIndex: 'taxRate',
                key: 'taxRate',
                render: (text, record, index) => (text || text == '0') && Number(text).toFixed(2)+'%',
            }, {
                title: '金额',
                dataIndex: 'netAmount',
                key: 'netAmount',
                render: (text, record, index) => (text || text == '0') &&'￥'+Number(text).toFixed(2)
            }, {
                title: '税额',
                dataIndex: 'taxAmount',
                key: 'taxAmount',
                render: (text, record, index) => (text||text=='0')&&'￥'+Number(text).toFixed(2)
            },{
                title: '源订单行号',
                dataIndex: 'sourceLineNum',
                key: 'sourceLineNum',
            }, {
                title: '退货状态',
                dataIndex: 'returnStatus',
                key: 'returnStatus',
                render: (text, record, index) => window.ENUM.getEnum("purchaseReturnStatus", text+''),
            }, {
                title: '实退数量',
                dataIndex: 'returnedQty',
                key: 'returnedQty',
                render: (text, record, index) => (text||text===0)&&Number(text).toFixed(2)
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width: 150,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 134, placement: 'top' }} />
            }
        ];
        this.state = {
            show: true,
            showMore: false,
        };
    }
    editPurchaseReturn = (orderCode) => {
        store.dispatch(TabsAct.TabAdd({
            title: "编辑采购退货单",
            key: "editPurchaseReturn"
        }));
        purReturnEditStore.fetchPurReturnDetail({orderCode})
    };
    onClick = (obj) => {
        let { fetchPurReturnStatus, detail } = purReturnViewStore;
        fetchPurReturnStatus(obj.key, { orderCode:detail.orderCode }).then(json => {
            if (json.status == 2100 || json.status == 2200 || json.status == 2300 || json.status == 2400) {
                message.success(json.message[0].msg);
                store.dispatch(TabsAct.TabAdd({
                    title: "采购退货单",
                    key: "purchaseReturn"
                }));
                purReturnListStore.fetchTableList();
            } else {
                message.error(json.message[0].msg);
            }
        });
    };
    
    title = () => {
        let { netAmount, taxAmount, totalAmount } = purReturnViewStore.detail;
        return (
            <div className="tab-title">
                <div className="left-text">
                    <span><strong>明细信息</strong></span>
                </div>
                <div>
                    <span className="total">
                        <span className="laber">合计</span>
                        <span className="laber">金额：</span>
                        <span className="number">{'￥'+ Number(netAmount).toFixed(2)}</span>
                        <span className="laber">税额：</span>
                        <span className="number">{'￥'+ Number(taxAmount).toFixed(2)}</span>
                        <span className="laber">价税合计：</span>
                        <span className="number">{'￥'+ Number(totalAmount).toFixed(2)}</span>
                    </span>
                </div>
            </div>
        );
    };
    render() {
        let { detail, loading } = purReturnViewStore;
        let { orderStatus, pushdownFlag, returnStatus } = detail;
        let menu = (
            <Menu onClick={this.onClick}>
                {
                    (detail.orderStatus != undefined) && moreList[detail.orderStatus].map(item => {
                        if (detail.orderStatus == 2 && detail.pushdownFlag == 1) {
                            // if (item == 'close') {
                            //     return <Menu.Item key="close">关闭</Menu.Item>
                            // }
                        } else {
                            return <Menu.Item key={item}> {status[item]}</Menu.Item>
                        }
                    })
                }

            </Menu>
        );
        let { show, showMore } = this.state;        
        return (
            <div className="PurchaseRetView-wrap">
                <Spin spinning={loading}>
                    <Row className="PurchaseRetView-title">
                        <Col span={16}>
                            <p className="order">
                                <b>
                                    订单编号：<span style={{ marginRight: 31 }}>{ formatNullStr(detail.orderCode)}</span>
                                    供应商：<span>{formatNullStr(detail.supplierName)}</span>
                                </b>
                            </p>
                            <p className="status">
                                单据状态：<span style={{ color: orderStatus=='0'?'#4c80cf':(orderStatus=='2'?'#417505':'#f6a623'), paddingRight: '20px' }}>{window.ENUM.getEnum("purchaseOrderStatus", (detail.orderStatus || 0) + '')}</span>
                                <span>
                                    源订单号：<span style={{ paddingRight:'20px' }}>{formatNullStr(detail.purchaseOrderCode)}</span>
                                    下推状态：<span style={{ color: pushdownFlag=='0'?'#f6a623':'#417505',paddingRight:'20px' }}>{detail.pushdownFlag ? '已下推' : '未下推'}</span>
                                    退货状态：<span style={{ color: returnStatus=='3'?'#417505':'#f6a623'}}>{window.ENUM.getEnum("purchaseReturnStatus", (detail.returnStatus  || 1) + '')}</span>
                                </span>
                            </p>
                        </Col>
                        <Col span={8} style={{textAlign:'right'}}>
                            {detail.orderStatus == 0?
                                <Button type="primary" onClick={() => this.editPurchaseReturn(detail.orderCode)} className='PurchaseRetView-edit-btn'><i className='c2mfont c2m-bianji1'></i>编辑</Button>
                                :null
                            }
                            <Dropdown overlay={menu}>
                                <Button type="ghost" className="morebtn">更多操作 <Icon type="down" /></Button>
                            </Dropdown>
                        </Col>
                        <a className="show-more-info" href="#" onClick={() => {
                            this.setState({ show: !show })
                        }}>{show ? '收起' : '展开'}</a>
                    </Row>
                    <Row className="PurchaseRetView-info" style={{ display: this.state.show ? `block` : `none` }}>
                        <Col span={8}>
                            <ul className="base-info">
                                <li className="header">
                                    <strong>基本信息</strong>
                                </li>
                                <li>
                                    <span>供应商：</span>{formatNullStr(detail.supplierName)}
                                </li>
                                <li>
                                    <span>业务类型：</span>{detail.orderType?formatNullStr(window.ENUM.getEnum("returnOrderType", (detail.orderType) + '')):'--'}
                                </li>
                                <li>
                                    <span>源订单号：</span>{formatNullStr(detail.purchaseOrderCode) }
                                </li>
                                <li>
                                    <span>下单日期：</span>{formatNullStr(detail.orderDate)}
                                </li>
                                <li>
                                    <span>业务部门：</span>{formatNullStr(detail.deptName)}
                                </li>
                                <li>
                                    <span>业务员：</span>{formatNullStr(detail.empName)}
                                </li>
                            </ul>
                        </Col>
                        <Col span={8}>
                            <ul className="receive-info">
                                <li className="header">
                                    <strong>物流信息</strong>
                                </li>
                                <li>
                                    <span>预计退货日：</span>{formatNullStr(detail.planReturnDate)}
                                </li>
                                <li>
                                    <span>发货站点：</span>{formatNullStr(detail.siteName)}
                                </li>
                                <li>
                                    <span>发货仓库：</span>{formatNullStr(detail.warehouseName)}
                                </li>
                                <li>
                                    <span>收货地址：</span>{formatNullStr(detail.receivingAddressDetl)}
                                </li>
                                <li>
                                    <span>收货人：</span>{formatNullStr(detail.receiverName)}
                                </li>
                                <li>
                                    <span>联系电话：</span>{formatNullStr(detail.receiverTel)}
                                </li>
                            </ul>
                        </Col>
                        <Col span={8}>
                            <ul className="other-info">
                                <li className="header">
                                    <strong>财务信息</strong>
                                </li>
                                <li>
                                    <span>付款条件：</span>{formatNullStr(detail.paymentTermName)}
                                </li>
                                <li>
                                    <span>结算方式：</span>{formatNullStr(detail.paymentMethodName)}
                                </li>
                                <li>
                                    <span>发票类型：</span>{formatNullStr(detail.invoiceTypeName)}
                                </li>
                                <li>
                                    <span>币种：</span>{formatNullStr(detail.currencyName)}
                                </li>
                                <li>
                                    <span>默认税率：</span>{detail.taxRate?`${detail.taxRate}%`:'--'}{detail.taxFlag?' (单价含税)':' (单价不含税)'}
                                </li>
                                <li>
                                    <span>运费：</span>{detail.freightAmount?`￥${detail.freightAmount}`:'--'}
                                </li>
                            </ul>  
                        </Col>
                        <a className="show-more-info" href="#" onClick={() => this.setState({ showMore: !showMore })}>
                            {this.state.showMore ? '收起更多隐藏信息' : '展开更多隐藏信息'}
                        </a>
                    </Row>
                    <Row className="PurchaseRetView-remark" style={{ display: this.state.showMore ? `block` : `none` }}>
                        <Col className="bayer-info" span={8}>
                            <div className="header">退货原因：</div>
                            <div dangerouslySetInnerHTML={{ __html: formatNullStr(detail.returnReason) }}></div>
                        </Col>    
                        <Col className="shop-info" span={16}>
                            <div className="header">备注：</div>
                            <div dangerouslySetInnerHTML={{ __html: formatNullStr(detail.remark) }}></div>
                        </Col>
                    </Row>
                    <div className='PurchaseRetView-table'>
                        <Table
                            dataSource={detail.list}
                            columns={this.columns}
                            rowKey={"id"}
                            scroll={{ x: 2600 }}
                            title={this.title}
                            pagination={{
                                total: detail.list ? detail.list.length : 0,
                                showTotal: (total) => `总共 ${total} 条记录`,
                                pageSizeOptions: ['10', '15', '20', '50'],
                                showSizeChanger: true,
                            }}
                        />
                    </div>
                </Spin>
            </div>
        )
    }
}
export default PurchaseReturnViewComp;