import React, { Component } from "react";
import { Row, Col, Spin, Table, Input, Button, Pagination, Dropdown, Menu, message, Icon } from '../../../base/components/AntdComp';
import TooltipComp from '../../../base/components/TooltipComp';
import TableComp from '../../../base/components/TableComp';
import { formatNullStr } from '../../../base/consts/Utils';
import PurExpenseDetailViewComp from './PurExpenseDetailViewComp'

let status = {
    submit: "提交",
    withdraw: "撤回",
    // close: "关闭",
    pushDown: "下推"
};
//orderStatus   0：已保存 1：已提交 2：已审核 3：已关闭 4：已驳回 5:已锁定 6：已撤回 7：已拒绝
//pushdownMark   0：否 1：是
let moreList = {
    "0": ["submit"],
    "1": ["withdraw"],
    "2": ["pushDown"],
    "3": [],
    "4": ["submit"],
    "5": [],
    "6": ["submit"],
    "7": [],
};
class PurchaseViewComp extends Component {
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
                className: 'PurchaseView-spec',
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
                title: '订单数量',
                dataIndex: 'orderQty',
                key: 'orderQty',
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
            }, {
                title: '附加费',
                dataIndex: 'expenseAmount',
                key: 'expenseAmount',
                render: (text, record, index) => ((text||text=='0')&&'￥'+Number(text).toFixed(2))||'--'
            }, {
                title: 'SPU编码',
                dataIndex: 'spuCode',
                key: 'spuCode',
                hidden: true
            }, {
                title: 'SPU名称',
                dataIndex: 'spuName',
                key: 'spuName',
                hidden: true
            }, {
                title: '累计通知数量',
                dataIndex: 'receivingQty',
                key: 'receivingQty',
                render: (text, record, index) => (text||text===0)&&Number(text).toFixed(2)
            }, {
                title: '累计收货数量',
                dataIndex: 'receivedQty',
                key: 'receivedQty',
                render: (text, record, index) => (text||text===0)&&Number(text).toFixed(2)
            }, {
                title: '收货状态',
                dataIndex: 'receiveStatus',
                key: 'receiveStatus',
                render: (text, record, index) => window.ENUM.getEnum("purchaseReceiveStatus", text+''),
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
        this.columns2 = [
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
                className: 'PurchaseView-spec',
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
                title: '订单数量',
                dataIndex: 'orderQty',
                key: 'orderQty',
            }, {
                title: '单位',
                dataIndex: 'purchaseUnitName',
                key: 'purchaseUnitName',
            }, {
                title: '计价数量',
                dataIndex: 'priceQty',
                key: 'priceQty',
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
            }, {
                title: '附加费',
                dataIndex: 'expenseAmount',
                key: 'expenseAmount',
                render: (text, record, index) => ((text||text=='0')&&'￥'+Number(text).toFixed(2))||'--'
            }, {
                title: 'SPU编码',
                dataIndex: 'spuCode',
                key: 'spuCode',
            }, {
                title: 'SPU名称',
                dataIndex: 'spuName',
                key: 'spuName',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: 'SPU规格',
                dataIndex: 'spuSpec',
                key: 'spuSpec',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: 'SPU型号',
                dataIndex: 'spuModel',
                key: 'spuModel',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: 'SPU材料',
                dataIndex: 'spuQuality',
                key: 'spuQuality',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: 'SPU代号',
                dataIndex: 'supStandardCode',
                key: 'supStandardCode',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '累计通知数量',
                dataIndex: 'receivingQty',
                key: 'receivingQty',
                render: (text, record, index) => (text || text === 0) && Number(text).toFixed(2),
                hidden: true
            }, {
                title: '累计收货数量',
                dataIndex: 'receivedQty',
                key: 'receivedQty',
                render: (text, record, index) => (text || text === 0) && Number(text).toFixed(2),
                hidden: true
            }, {
                title: '收货状态',
                dataIndex: 'receiveStatus',
                key: 'receiveStatus',
                render: (text, record, index) => window.ENUM.getEnum("purchaseReceiveStatus", text + ''),
                hidden: true
            }, {
                title: '实退数量',
                dataIndex: 'returnedQty',
                key: 'returnedQty',
                render: (text, record, index) => (text || text === 0) && Number(text).toFixed(2),
                hidden: true
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width: 150,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 134, placement: 'top' }} />
            }
        ];
        this.state = {
            // money: 0,
            // taxMoney: 0,
            // taxMoneyTotal: 0,
            show: true,
            showMore: false,
            expenseDetail: {},
            columns: [],
            colsChanged: false,
        };

        this.columns[15].render = (txt, record, index) => {
            if (txt !== '') {
                return <a href="#" onClick={() => this.expenseDetailShow(record)}>{'￥'+Number(txt).toFixed(2)}</a>
            } else {
                return '--'
            }
        }
        this.columns2[15].render = (txt, record, index) => {
            if (txt !== '') {
                return <a href="#" onClick={() => this.expenseDetailShow(record)}>{'￥'+Number(txt).toFixed(2)}</a>
            } else {
                return '--'
            }
        }
    }
    expenseDetailShow = (record) => {
        this.props.ExpenseDetailVisible(true);
        this.setState({ expenseDetail: record });
    }
    editPurchase = (orderCode) => {
        let { CanPurchaseEdit, EditModul, PurchaseDetail } = this.props;
        // CanPurchaseEdit(orderCode).then(json => {
            // if (json.status === 2000) {
                EditModul();
                PurchaseDetail(orderCode);
            // } else {
                // message.info('该单据已锁住，不能编辑!');
            // }
        // })
    };
    onClick = (obj) => {
        let { PurchaseStatus, PurchaseViewData, tabRemove, PurchaseList } = this.props;
        let flag = false;
        PurchaseViewData.sourceOrderType == '3' && Array.isArray(PurchaseViewData.list) && PurchaseViewData.list.map(item => {
            if (!item.materialCode) {
                flag = true;
            }
        })
        if (flag) {
            message.warn('明细项物料信息不能为空');
            return;
        }
        if (PurchaseViewData.sourceOrderType == '3' && PurchaseViewData.siteName == '') {
            message.warn('收货站点不能为空');
            return;
        }
        if (PurchaseViewData.sourceOrderType == '3' && PurchaseViewData.purchaseType === null) {
            message.warn('采购类型不能为空');
            return;
        }
        if (Number(PurchaseViewData.totalAmount) <= 0) {
            message.warn('订单金额不能为0！')
            return;
        }
        PurchaseStatus(obj.key, PurchaseViewData.orderCode).then(json => {
            if (json.status == 2100 || json.status == 2200 || json.status == 2300 || json.status == 2400) {
                message.success(json.message[0].msg);
                tabRemove();
                PurchaseList({ page: 1, pageSize: 15 });
                
            } else {
                message.error(json.message[0].msg);
            }
        });
    };
    componentDidMount() {
        let searchUrl = window.location.search.split('&');
        let orderCode = searchUrl.length>1?searchUrl[1].split('=')[1]:'';
        if (!this.props.tag.orderCode&&orderCode) {
            this.props.PurchaseViewTable(orderCode);
        } else {
            let orderCode = this.props.tag.orderCode;
            this.props.PurchaseViewTable(this.props.tag.orderCode);
        }
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.tag.orderCode != this.props.tag.orderCode) {
            let orderCode = nextProps.tag.orderCode;
            this.props.PurchaseViewTable(nextProps.tag.orderCode);
        }
        this.setState({
            columns: this.props.PurchaseViewData.sourceOrderType == '3' ? this.columns2 : this.columns,
            colsChanged: !this.state.colsChanged
        })
    }
    
    title = () => {
        let { netAmount, taxAmount, totalAmount } = this.props.PurchaseViewData || {};
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
        let { PurchaseViewData, purchaseViewLoading } = this.props;
        let { orderStatus, pushdownMark, receiveStatus } = PurchaseViewData;
        let menu = (
            <Menu onClick={this.onClick}>
                {
                    (PurchaseViewData.orderStatus != undefined) && moreList[PurchaseViewData.orderStatus].map(item => {
                        if (PurchaseViewData.orderStatus == 2 && (PurchaseViewData.sourceOrderType == 3||PurchaseViewData.pushdownMark==1)) {
                            // if (item == 'close') {
                            //     return <Menu.Item key="close">关闭</Menu.Item>
                            // }
                            return;
                        } else {
                            return <Menu.Item key={item}> {status[item]}</Menu.Item>
                        }
                    })
                }

            </Menu>
        );
        let { show, showMore } = this.state;        
        return (
            <div className="PurchaseView-wrap">
                <Spin spinning={purchaseViewLoading}>
                    <Row className="PurchaseView-title">
                        <Col span={16}>
                            <p className="order">
                                <b>
                                    订单编号：<span style={{ marginRight: 31 }}>{ formatNullStr(PurchaseViewData.orderCode)}</span>
                                    供应商：<span>{formatNullStr(PurchaseViewData.supplierName)}</span>
                                    {/*<span>{formatNullStr(PurchaseViewData.supplierName)}</span>*/}
                                </b>
                            </p>
                            <p className="status">
                                单据状态：<span style={{ color: orderStatus=='0'?'#4c80cf':(orderStatus=='2'?'#417505':((orderStatus=='1'||orderStatus=='4'||orderStatus=='6')?'#f6a623':'#d0011b')), paddingRight: '20px' }}>{window.ENUM.getEnum("purchaseOrderStatus", (PurchaseViewData.orderStatus || 0) + '')}</span>
                                { PurchaseViewData.sourceOrderType == '3' ?
                                    <span>
                                        来源单据：<span style={{ paddingRight:'20px' }}>{window.ENUM.getEnum("purchaseSourceOrderType", (PurchaseViewData.sourceOrderType  || 1) + '') + ' | ' + PurchaseViewData.sourceOrderCode}</span>
                                    </span>
                                    :
                                    <span>
                                        {/*<span>{window.ENUM.getEnum("purchaseSourceOrderType", (PurchaseViewData.sourceOrderType || 0) + '')}</span>*/}
                                        来源单据：<span style={{ paddingRight:'20px' }}>{window.ENUM.getEnum("purchaseSourceOrderType", (PurchaseViewData.sourceOrderType  || 1) + '')}</span>
                                        下推状态：<span style={{ color: pushdownMark=='0'?'#f6a623':'#417505',paddingRight:'20px' }}>{PurchaseViewData.pushdownMark ? '已下推' : '未下推'}</span>
                                        收货状态：<span style={{ color: receiveStatus=='3'?'#417505':'#f6a623'}}>{window.ENUM.getEnum("purchaseReceiveStatus", (PurchaseViewData.receiveStatus  || 1) + '')}</span>
                                    </span>
                                }
                            </p>
                        </Col>
                        <Col span={8} style={{textAlign:'right'}}>
                            {PurchaseViewData.orderStatus == 0 || PurchaseViewData.orderStatus == 4 ?
                                <Button type="primary" onClick={() => this.editPurchase(PurchaseViewData.orderCode)} className='PurchaseView-edit-btn'><i className='c2mfont c2m-bianji1'></i>编辑</Button>
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
                    <Row className="PurchaseView-info" style={{ display: this.state.show ? `block` : `none` }}>
                        <Col span={8}>
                            <ul className="base-info">
                                <li className="header">
                                    <strong>基本信息</strong>
                                </li>
                                <li>
                                    <span>业务类型：</span>{PurchaseViewData.orderType?formatNullStr(window.ENUM.getEnum("purchaseOrderType", (PurchaseViewData.orderType) + '')):'--'}
                                </li>
                                <li>
                                    <span>采购类型：</span>{(PurchaseViewData.purchaseType||PurchaseViewData.purchaseType=='0')?formatNullStr(window.ENUM.getEnum("purchaseType", (PurchaseViewData.purchaseType) + '')):'--'}
                                </li>
                                <li>
                                    <span>供应商：</span>{formatNullStr(PurchaseViewData.supplierName)}
                                </li>
                                <li>
                                    <span>发货地址：</span>{formatNullStr(PurchaseViewData.deliveryAddressDetl)}
                                </li>
                                <li>
                                    <span>采购部门：</span>{formatNullStr(PurchaseViewData.deptName)}
                                </li>
                                <li>
                                    <span>业务员：</span>{formatNullStr(PurchaseViewData.empName)}
                                </li>
                            </ul>
                        </Col>
                        <Col span={8}>
                            <ul className="receive-info">
                                <li className="header">
                                    <strong>物流信息</strong>
                                </li>
                                <li>
                                    <span>订单日期：</span>{formatNullStr(PurchaseViewData.orderDate)}
                                </li>
                                <li>
                                    <span>预计到货日：</span>{formatNullStr(PurchaseViewData.planReceiveDate)}
                                </li>
                                <li>
                                    <span>收货站点：</span>{formatNullStr(PurchaseViewData.siteName)}
                                </li>
                                <li>
                                    <span>收货地址：</span>{formatNullStr(PurchaseViewData.receiveAddressDetl)}
                                </li>
                                <li>
                                    <span>收货人：</span>{formatNullStr(PurchaseViewData.receiverName)}
                                </li>
                                <li>
                                    <span>联系电话：</span>{formatNullStr(PurchaseViewData.receiverTel)}
                                </li>
                            </ul>
                        </Col>
                        <Col span={8}>
                            <ul className="other-info">
                                <li className="header">
                                    <strong>财务信息</strong>
                                </li>
                                <li>
                                    <span>付款条件：</span>{formatNullStr(PurchaseViewData.paymentTermName)}
                                </li>
                                <li>
                                    <span>结算方式：</span>{formatNullStr(PurchaseViewData.paymentMethodName)}
                                </li>
                                <li>
                                    <span>发票类型：</span>{formatNullStr(PurchaseViewData.invoiceTypeName)}
                                </li>
                                <li>
                                    <span>币种：</span>{formatNullStr(PurchaseViewData.currencyName)}
                                </li>
                                <li>
                                    <span>默认税率：</span>{PurchaseViewData.taxRate?`${PurchaseViewData.taxRate}%`:''}{PurchaseViewData.taxFlag?' (单价含税)':' (单价不含税)'}
                                </li>
                                <li>
                                    <span>运费：</span>{PurchaseViewData.freightAmount?`￥${PurchaseViewData.freightAmount}`:'--'}
                                </li>
                            </ul>  
                        </Col>
                        <a className="show-more-info" href="#" onClick={() => this.setState({ showMore: !showMore })}>
                            {this.state.showMore ? '收起更多隐藏信息' : '展开更多隐藏信息'}
                        </a>
                    </Row>
                    {
                        PurchaseViewData.sourceOrderType == '3' ?
                            <Row className="PurchaseView-remark" style={{ display: this.state.showMore ? `block` : `none` }}>
                                <Col span={8} className="bayer-info">
                                    <div className="header">备注</div>
                                    <div className="content" dangerouslySetInnerHTML={{ __html: formatNullStr(PurchaseViewData.remark) }}></div>
                                </Col>
                                <Col span={8} className="shop-info">
                                    <div className="header">给供应商留言</div>
                                    <div className="content" dangerouslySetInnerHTML={{ __html: formatNullStr(PurchaseViewData.message) }}></div>
                                </Col>
                                <Col span={8} className="shop-info">
                                    <div className="header">电商备注</div>
                                    <div className="content" dangerouslySetInnerHTML={{__html: formatNullStr(PurchaseViewData.ecRemark)}}></div>
                                </Col>
                            </Row>
                        :

                            <Row className="PurchaseView-remark" style={{ display: this.state.showMore ? `block` : `none` }}>
                                <Col className="bayer-info">
                                    <div className="header">备注：</div>
                                    <div dangerouslySetInnerHTML={{ __html: formatNullStr(PurchaseViewData.remark) }}></div>
                                </Col>
                            </Row>
                    }
                    <div className='PurchaseView-table'>
                        <TableComp
                            dataSource={PurchaseViewData.list}
                            cols={this.state.columns}
                            rowKey={"id"}
                            scroll={{ x: 2600 }}
                            colsChanged={this.state.colsChanged}
                            // pagination={{
                            //     total: PurchaseViewData.list ? PurchaseViewData.list.length : 0,
                            //     showTotal: (total) => `总共 ${total} 条记录`,
                            //     pageSizeOptions: ['10', '15', '20', '50'],
                            //     showSizeChanger: true,
                            // }}
                            title={this.title}
                        />
                    </div>
                </Spin>
                {this.props.view.expenseDetailVisible ? <PurExpenseDetailViewComp expenseDetail={this.state.expenseDetail} visible={this.props.view.expenseDetailVisible} title='费用明细' className='purOrder-expense-cont purOrder-expenseView-cont' width={800} ExpenseDetailVisible={this.props.ExpenseDetailVisible}/> : null}
            </div>
        )
    }
}
export default PurchaseViewComp;