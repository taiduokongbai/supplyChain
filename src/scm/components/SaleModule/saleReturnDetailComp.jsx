import React, {Component} from 'react';
import {Row, Col, Button, Select, Dropdown, Menu, Icon, Spin, Collapse} from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import TooltipComp from '../../../base/components/TooltipComp';
import {formatNullStr} from '../../../base/consts/Utils';

const Option = Select.Option;
const Panel = Collapse.Panel;

class SaleReturnDetailComp extends Component {
    constructor(props) {
        super(props);
        // this.pageSize = 11;
        this.state = {
            key: 0,
            value: '更多操作',
            panelState: '展开'
        }

        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNum',
                key: 'lineNum',
                fixed: 'left',
                width: 50
            },
            {
                title: '订单行号',
                dataIndex: 'saleOrderLineNum',
                key: 'saleOrderLineNum',
                fixed: 'left',
                width: 60
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                fixed: 'left',
                width: 108
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                fixed: 'left',
                width: 104,
                render: (text, index, record) => {
                    return <TooltipComp attr={{text: text, wid: 70, placement: 'left'}}/>
                }
            }, {
                title: '规格',
                dataIndex: 'specification',
                key: 'specification',
                width: 140,
                obj: {
                    style: {width: 200},
                },
                render: (txt, index, record) => <TooltipComp attr={{text: txt, wid: 70, placement: 'left'}}/>
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
                width: 140,
                obj: {
                    style: {width: 200},
                },
                render: (txt, index, record) => <TooltipComp attr={{text: txt, wid: 70, placement: 'left'}}/>
            }, {
                title: '退货数量',
                dataIndex: 'returnNum',
                key: 'returnNum',
                width: 80,
                render: (text, record, index) => {
                    return Number(text).toFixed(2)
                }
            }, {
                title: '退货单位',
                dataIndex: 'unitOfMeasurementName',
                key: 'unitOfMeasurementName',
                width: 140
            }, {
                title: '单位',
                dataIndex: 'unitOfMeasurement',
                key: 'unitOfMeasurement',
                hidden: true
            }, {
                title: '计价数量',
                dataIndex: 'valuationQty',
                key: 'valuationQty',
                width: 140
            }, {
                title: '计价单位',
                dataIndex: 'chargeUnitName',
                key: 'chargeUnitName',
                width: 140
            }, {
                title: '单价',
                dataIndex: 'unitPrice',
                key: 'unitPrice',
                width: 140,
                render: (text, record, index) => {
                    return '￥' + Number(text).toFixed(2)
                }
            }, {
                title: '赠品',
                dataIndex: 'isDonation',
                key: 'isDonation',
                width: 140,
                render: (txt, record, index) => {
                    return this.getE('isDonation', txt + '')
                }
            }, {
                title: '税率',
                dataIndex: 'taxRate',
                key: 'taxRate',
                width: 80,
                render: (text, record, index) => {
                    return Number(text).toFixed(2) + '%'
                }
            }, {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                width: 140,
                render: (text, record, index) => {
                    return '￥' + Number(text).toFixed(2)
                }

            }, {
                title: '税额',
                dataIndex: 'tax',
                key: 'tax',
                width: 140,
                render: (text, record, index) => {
                    return '￥' + Number(text).toFixed(2)
                }
            }, {
                title: '税价合计',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                width: 130,
                render: (text, record, index) => {
                    return '￥' + Number(text).toFixed(2)
                }
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width: 300,
                render: (text, record, index) => {
                    return <div className='saleReturn-remarks'>{text}</div>;
                }
            }];
    };

    componentDidMount() {
        this.props.initData && this.props.initData()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.detail.saleReturnCode !== nextProps.detail.saleReturnCode || this.props.detail.version !== nextProps.detail.version) {
            this.props.initData && this.props.initData()
        }
    };

    editSaleReturn = (saleReturnCode) => {
        this.props.GetSaleReturn(saleReturnCode, "edit");
        this.props.CheckLockingStatus(saleReturnCode);
    };
    handleChange = (value) => {
        switch (value) {
            case 'submit':
                this.props.SubmitSaleReturn(this.props.saleReturnDetailInfo.saleReturnCode);
                break;
            case 'recall':
                this.props.RecallSaleReturn(this.props.saleReturnDetailInfo.saleReturnCode);
                break;
            case 'close':
                this.props.CloseSaleReturn(this.props.saleReturnDetailInfo.saleReturnCode);
                break;
            case 'push':
                this.props.PushSaleReturn(this.props.saleReturnDetailInfo.saleReturnCode);
                break;

            default:
        }
    };
    getE = (key, val) => {
        if (val !== undefined && val !== null && val !== "") {
            return window.ENUM.getEnum(key, val)
        }
    };
    getStatus = (status, pushdownStatus) => {
        if (status == 0 || status == 4) {
            return <Select className="select-btn" value={this.state.value} style={{width: 80}}
                           onChange={this.handleChange}><Option value="submit">提交</Option></Select>;
        }
        if (status == 1) {
            return <Select className="select-btn" value={this.state.value} style={{width: 80}}
                           onChange={this.handleChange}><Option value="recall">撤回</Option></Select>;
        }
        // 审核状态可进行下推和关闭
        if (status == 2 && pushdownStatus != 1) {
            // return <Select className="select-btn" value={this.state.value} style={{ width: 80 }} onChange={this.handleChange}><Option value="close">关闭</Option><Option value="push">下推</Option></Select>;
            return <Select className="select-btn" value={this.state.value} style={{width: 80}}
                           onChange={this.handleChange}><Option value="push">下推</Option></Select>;

        }
        if (status == 6) {
            return <Select className="select-btn" value={this.state.value} style={{width: 80}}
                           onChange={this.handleChange}><Option value="submit">提交</Option></Select>;
        }
    }

    formatMoney = (money) => (money === '' || money === null || money === undefined) ? '0.00' : Number(money).toFixed(2);

    panelChange = (key) => {
        if (key.length == 0) {
            this.setState({
                panelState: '展开'
            })
        } else {
            this.setState({
                panelState: '收起'
            })
        }
    }

    statusHandler = (status) => {
        switch (status) {
            case '0': //保存（蓝色）
                return <a style={{color: '#4C80CF'}}>{this.getE("saleOrderStatus", status)}</a>
                break;
            case '1':
            case '4':
            case '6': //已提交和已撤回（橙色）
                return <a style={{color: '#F6A623'}}>{this.getE("saleOrderStatus", status)}</a>
                break;
            case '2': // 已批准（绿色）
                return <a style={{color: '#417505'}}>{this.getE("saleOrderStatus", status)}</a>
                break;
            case '3': // 关闭 已锁定 （红色）：D0011B
            case '5':
                return <a style={{color: '#D0011B'}}>{this.getE("saleOrderStatus", status)}</a>
                break;
            default:
                return '--'
                break;
        }
    }
    pushdownStatusHandler = (status) => {
        switch (status) {
            case '0':
                return <a style={{color: '#F6A623'}}>{this.getE("pushdownStatus", status)}</a>
                break;
            case '1':
                return <a style={{color: '#417505'}}>{this.getE("pushdownStatus", status)}</a>
                break;
        }
    }

    render() {

        const {saleReturnDetailInfo} = this.props;
        let columns = this.columns;
        let dataSource = this.dataSource;
        let {key, panelState} = this.state;
        return (
            <div>
                <Spin spinning={this.props.saleReturnLoading}>
                    <div className="saleReturn-head">
                        <div className="saleReturn-head-left">
                            <span
                                className="saleReturn-head-h1">订单编号：{formatNullStr(saleReturnDetailInfo.saleReturnCode)}
                                客户： {formatNullStr(saleReturnDetailInfo.customerCode)}
                                | {formatNullStr(saleReturnDetailInfo.customerName)}</span>
                            <span className="saleReturn-head-span">
                                单据状态：<strong
                                className="saleOrderStatus">{this.statusHandler(saleReturnDetailInfo.orderStatus)}</strong>
                            </span>
                            <span className="saleReturn-head-span">
                                下推入库标记：<strong
                            >{this.pushdownStatusHandler(saleReturnDetailInfo.pushdownStatus)}</strong>
                            </span>
                            <span className="saleReturn-head-span">
                                来源订单编号：<span>{formatNullStr(saleReturnDetailInfo.sourceCode)}</span>
                            </span>
                        </div>
                        <div className="saleReturn-head-right">
                            <span className="saleReturn-head-right-button">
                                <Button className="editable-add-btn saleReturnDetail-edit-btn"
                                        style={{visibility: saleReturnDetailInfo.orderStatus == "0" || saleReturnDetailInfo.orderStatus == "4" || saleReturnDetailInfo.orderStatus == "6" ? `visible` : `hidden`}}
                                        onClick={() => this.editSaleReturn(saleReturnDetailInfo.saleReturnCode)}>编辑</Button>
                                {this.getStatus(saleReturnDetailInfo.orderStatus, saleReturnDetailInfo.pushdownStatus)}
                            </span>
                        </div>
                    </div>
                    <div className="saleReturn-head-gray"></div>

                    <div className="saleReturn-body">
                        <Collapse bordered={false} onChange={this.panelChange}>
                            <Panel header={panelState} key="1">
                                <div className="saleReturn-content">
                                    <div className="saleReturn-baseinfo ant-col-12">
                                        <span className="saleReturn-baseinfo-title">基本信息</span>
                                        <div className="saleReturn-baseinfo-con">
                                            <ul>
                                                <li>
                                                    <span>客户名称：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.customerName)}</span>
                                                </li>
                                                <li>
                                                    <span>订单日期：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.orderDate)}</span>
                                                </li>
                                                <li>
                                                    <span>联系人：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.contactsPersonName)}</span>
                                                </li>
                                                <li>
                                                    <span>联系电话：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.contactsPhone)}</span>
                                                </li>
                                                <li>
                                                    <span>币种：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.currencyName)}</span></li>
                                                <li>
                                                    <span>取货站点：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.takeDelOfAddressName)}</span>
                                                </li>
                                                <li>
                                                    <span>详细地址：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.takeDelOfDetails)}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="saleReturn-stateinfo ant-col-12">
                                        <span className="saleReturn-stateinfo-title">地址信息</span>
                                        <div className="saleReturn-stateinfo-con">
                                            <ul>
                                                <li>
                                                    <span>预计退货日期：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.planReturnDate)}</span>
                                                </li>
                                                <li>
                                                    <span>销售组织：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.saleOrgName)}</span>
                                                </li>
                                                <li>
                                                    <span>销售员：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.salesmanName)}</span>
                                                </li>
                                                <li>
                                                    <span>收货站点：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.receiveAddressName)}</span>
                                                </li>
                                                <li>
                                                    <span>收货仓库：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.receivWarehouseName)}</span>
                                                </li>
                                                <li>
                                                    <span>详细地址：</span>
                                                    <span>{formatNullStr(saleReturnDetailInfo.receiveAddressDetails)}</span>
                                                </li>
                                                <li>
                                                    <span>备注：</span>
                                                    <p className="saleReturn-baseinfo-con-li saleReturn-baseinfo-rc">{formatNullStr(saleReturnDetailInfo.remark)}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>

                        <div className="saleReturn-detailedinfo">
                            <Row>
                                <Col span={12}><span className="saleReturn-detailedinfo-title">明细信息</span></Col>
                                <Col span={12} className="detailinfo-right">
                                    <span>合计</span>
                                    <span>金额：<span>¥{this.formatMoney(saleReturnDetailInfo.amount)}</span></span>
                                    <span>纳税：<span>¥{this.formatMoney(saleReturnDetailInfo.tax)}</span></span>
                                    <span>税价合计：<span>¥{this.formatMoney(saleReturnDetailInfo.totalAmount)}</span></span>
                                </Col>
                            </Row>

                            <div className="saleReturn-detailedinfo-con">
                                <MTable
                                    cols={columns}
                                    dataSource={saleReturnDetailInfo.saleReturnDetails}
                                    rowKey={"id"}
                                    scroll={{x: 2530}}
                                />
                            </div>
                        </div>
                    </div>
                </Spin>
            </div>
        )
    }
}

export default SaleReturnDetailComp;