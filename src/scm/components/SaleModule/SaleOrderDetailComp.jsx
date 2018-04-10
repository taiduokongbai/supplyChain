import React, {Component} from "react";
import {
    Row,
    Col,
    Button,
    Select,
    Dropdown,
    Menu,
    Icon,
    message,
    Spin,
    Input,
    Table
} from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import TooltipComp from "../../../base/components/TooltipComp";
import {formatNullStr} from '../../../base/consts/Utils';
import TabsAct from '../../actions/TabsAct';
import { store } from '../../data/StoreConfig';
const Option = Select.Option;

class SaleOrderDetailComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '更多选择',
            show: true,
            tip: '展开',
            tipMore: '展开更多隐藏信息',
            showMore: true
        }
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNum',
                key: 'lineNum',
                width: 62,
                fixed: 'left',
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width: 164,
                fixed: 'left',
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 200,
                fixed: 'left',
                render: (txt, index, record) => <TooltipComp attr={{text: txt, wid: 70, placement: 'left'}}/>
            }, {
                title: '规格',
                dataIndex: 'specification',
                key: 'specification',
                className: 'padding-left20',
                width: 150,
                render: (txt, index, record) => <TooltipComp attr={{text: txt, wid: 70, placement: 'left'}}/>
            }, {
                title: '型号',
                dataIndex: 'model',
                key: 'model',
                width: 150,
            }, {
                title: '材料',
                dataIndex: 'materialTexture',
                key: 'materialTexture',
                width: 150,
            }, {
                title: '代号',
                dataIndex: 'materialCodeName',
                key: 'materialCodeName',
                width: 150,
            }, {
                title: '销售数量',
                dataIndex: 'materialNum',
                key: 'materialNum',
                width: 100,
                render: (text, record, index) => {
                    return Number(text).toFixed(2)
                }
            }, {
                title: '销售单位',
                dataIndex: 'unitOfMeasurementName',
                key: 'unitOfMeasurementName',
                width: 100,
            }, {
                title: '销售单位',
                dataIndex: 'unitOfMeasurement',
                key: 'unitOfMeasurement',
                hidden: true
            }, {
                title: '计价数量',
                dataIndex: 'valuationQty',
                key: 'valuationQty',
                width: 100,
                render: (text, record, index) => {
                    return Number(text).toFixed(2)
                }
            }, {
                title: '计价单位',
                dataIndex: 'chargeUnitName',
                key: 'chargeUnitName',
                width: 100,
            }, {
                title: '计价单位',
                dataIndex: 'chargeUnitCode',
                key: 'chargeUnitCode',
                hidden: true
            }, {
                title: '单价',
                dataIndex: 'unitPrice',
                key: 'unitPrice',
                width: 150,
                render: (text, record, index) => {
                    return '￥' + Number(text).toFixed(2)
                }
            }, {
                title: '赠品',
                dataIndex: 'isDonation',
                key: 'isDonation',
                width: 100,
                render: (txt, record, index) => {
                    return window.ENUM.getEnum("isDonation", txt + '')
                },
            }, {
                title: '预计交货日期',
                dataIndex: 'planDelivery',
                key: 'planDelivery',
                width: 150,
            }, {
                title: '税率',
                dataIndex: 'taxRate',
                key: 'taxRate',
                width: 150,
                render: (text, record, index) => {
                    return Number(text).toFixed(2) + '%'
                }
            }, {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                width: 150,
                render: (text, record, index) => {
                    return '￥' + Number(text).toFixed(2)
                }
            }, {
                title: '税额',
                dataIndex: 'tax',
                key: 'tax',
                width: 150,
                render: (text, record, index) => {
                    return '￥' + Number(text).toFixed(2)
                }
            }, {
                title: '附加费',
                dataIndex: 'totalExpense',
                key: 'totalExpense',
                width: 150,
                render: (text, record, index) => {
                    return '￥'+Number(text).toFixed(2)
                }
            },{
                title: '税价合计',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                width: 150,
                render: (text, record, index) => {
                    return '￥' + Number(text).toFixed(2)
                }
            }, {
                title: 'SPU',
                dataIndex: 'spuCode',
                key: 'spuCode',
                render: (txt, index, record) => <TooltipComp attr={{text: txt, wid: 100, placement: 'left'}}/>
            }, {
                title: 'SPU名称',
                dataIndex: 'spuName',
                key: 'spuName',
                render: (txt, index, record) => <TooltipComp attr={{text: txt, wid: 100, placement: 'left'}}/>
            }, {
                title: 'SPU数量',
                dataIndex: 'spuNum',
                key: 'spuNum',
                render: (txt, index, record) => <TooltipComp attr={{text: txt, wid: 100, placement: 'left'}}/>
            }, {
                title: '来源单号',
                dataIndex: 'sourceCode',
                key: 'sourceCode',
                width: 150,
            }, {
                title: '来源行号',
                dataIndex: 'sourceLineNum',
                key: 'sourceLineNum',
                width: 150,
            }, {
                title: '品牌',
                dataIndex: 'brand',
                key: 'brand',
                render: (txt, index, record) => <TooltipComp attr={{text: txt, wid: 100, placement: 'left'}}/>
            }, {
                title: '配置BOM',
                dataIndex: 'bom',
                key: 'bom',
                render: (txt, index, record) => <TooltipComp attr={{text: txt, wid: 100, placement: 'left'}}/>
            }, {
                title: '图纸',
                dataIndex: 'drawingUrl',
                key: 'drawingUrl',
                render: (txt, index, record) => {
                    return <div><a href={txt}>{txt}</a></div>
                }
            }, {
                title: '附件',
                dataIndex: 'accessoryUrl',
                key: 'accessoryUrl',
                width: 100,
                render: (txt, index, record) => {
                    return <div><a href={txt}>{txt}</a></div>
                }
            }, {
                title: '是否导入',
                dataIndex: 'isImport',
                key: 'isImport',
                width: 100,
                render: (txt, record, index) => {
                    if(txt!==0){
                        return window.ENUM.getEnum("isImport", txt + '')
                    }else{
                        return <a  href="#" onClick={()=>this.openTab()}>{window.ENUM.getEnum("isImport", txt + '')}</a>
                    }

                },
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width: 150,
                render: (txt, index, record) => <TooltipComp attr={{text: txt, wid: 90, placement: 'left'}}/>
            }];
    }

    getE = (key, val) => {
        if (val !== undefined && val !== null && val !== "") {
            return window.ENUM.getEnum(key, val)
        }
    };
    openTab=()=>{
        store.dispatch(TabsAct.TabInsert("importProDesignBom"));
    }
    SubmitSaleOrder = () => {
        let {saleOrderDetail} = this.props;
        if (saleOrderDetail.shipAddressName === "") {
            message.warn('发货站点不能为空');
            return;
        }
        if (saleOrderDetail.contractCode === "") {
            message.warn('合同编号不能为空');
            return;
        }
        if (saleOrderDetail.collectionTermsName === "") {
            message.warn('收款条件不能为空');
            return;
        }
        this.props.SubmitSaleOrder({saleOrderCode:this.props.saleOrderDetail.saleOrderCode},this.props.saleOrderDetail.businessType)
    }
    handleChange = (value) => {
        switch (value) {
            case 'submit':
                this.SubmitSaleOrder()
                break;
            case 'recall':
                this.props.RecallSaleOrder(this.props.saleOrderDetail.saleOrderCode)
                break;
            /* case 'closed':
                 this.props.CloseSaleOrder(this.props.saleOrderDetail.saleOrderCode)
                 break;*/
            case 'push':
                this.props.PushSaleOrder(this.props.saleOrderDetail.saleOrderCode)
                break;
            default:
        }
    };
    onEditOrder = (saleOrderCode) => {
        this.props.SetSaleOrderEdit(saleOrderCode);
        this.props.CheckLockingStatus(saleOrderCode);
    };
    onClick = (obj) => {
        let {saleOrderDetail} = this.props;
        this.handleChange(obj.key, saleOrderDetail.saleOrderCode);
    }
    toggle = () => {
        this.setState({
            tip: this.state.show ? '收起' : '展开',
            show: this.state.show ? false : true
        })
    };
    toggleMore = () => {
        this.setState({
            tipMore: this.state.showMore ? '收起更多隐藏信息' : '展开更多隐藏信息',
            showMore: this.state.showMore ? false : true
        })
    }
    statusHandler = (status) => {
        switch (status) {
            case '0': //保存（蓝色）
                return <a style={{color: '#4C80CF'}}>{this.getE("saleStatus", status)}</a>
                break;
            case '1':
            case '4':
            case '6': //已提交和已撤回（橙色）
                return <a style={{color: '#F6A623'}}>{this.getE("saleStatus", status)}</a>
                break;
            case '2': // 已批准（绿色）
                return <a style={{color: '#417505'}}>{this.getE("saleStatus", status)}</a>
                break;
            case '3': // 关闭 已锁定 （红色）：D0011B
            case '5':
                return <a style={{color: '#D0011B'}}>{this.getE("saleStatus", status)}</a>
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

    componentDidMount() {
        if(this.props.orderDetail==''){
            let searchUrl = window.location.search.split('&');
            let orderCode = searchUrl.length > 1 ? searchUrl[1].split('=')[1] : '';
            if (orderCode) {
                this.props.SaleOrderDetail(orderCode, "detail")
            }
        }

    }

    render() {
        let {saleOrderDetail} = this.props;
        let columns = this.columns;
        let moreList = {
            "0": ["submit"],
            "1": ["recall"],
            "2": ["push"],
            "3": [],
            "4": ["submit"],
            "5": [],
            "6": ["submit"],
        };
        let menu = (
            <Menu onClick={this.onClick}>
                {
                    (saleOrderDetail.saleStatus != undefined) && moreList[saleOrderDetail.saleStatus].map(item => {
                        if (saleOrderDetail.saleStatus == '0' || saleOrderDetail.saleStatus == '4' || saleOrderDetail.saleStatus == '6') {
                            return <Menu.Item key="submit">提交</Menu.Item>
                        } else if (saleOrderDetail.saleStatus == '1') {
                            return <Menu.Item key="recall">撤回</Menu.Item>
                        } else if (saleOrderDetail.saleStatus == '2') {
                            if (item == 'push') {
                                if (saleOrderDetail.businessType != '3'&& saleOrderDetail.pushdownStatus != '1') {
                                    return <Menu.Item key="push">下推</Menu.Item>
                                }
                            }
                        } else {
                            return <Menu.Item key={item}> {status[item]}</Menu.Item>
                        }
                    })
                }

            </Menu>
        );
        return (
            <div>
                <div className="saleOrder-head">
                    <div className="saleOrder-head-border">
                        <div className="saleOrder-head-left">
                            <strong
                                className="saleOrderm-head-h1 saleOrder-head-strong">订单编号：{formatNullStr(saleOrderDetail.saleOrderCode)}
                                | <strong>客户：</strong>{(saleOrderDetail.customerCode)}
                                | {formatNullStr(saleOrderDetail.customerName)}
                            </strong>
                            <span className="saleOrder-head-h">
                                单据状态：<strong
                                className="saleOrder-head-strong-blue">{this.statusHandler(saleOrderDetail.saleStatus)}</strong>
                                下推状态：<strong
                                className="saleOrder-head-strong-red">{this.pushdownStatusHandler(saleOrderDetail.pushdownStatus)}</strong>
                                来源单据：<strong
                                className="saleOrder-head-strong">{formatNullStr(saleOrderDetail.sourceCode)}</strong> | {formatNullStr(this.getE('businessType', saleOrderDetail.businessType))}
                            </span>

                        </div>
                        <div className="saleOrder-head-right">
                            <div className="saleOrder-head-right-button">
                                <Button className="editable-add-btn bomDetail-efit-btn"
                                        onClick={() => this.onEditOrder(saleOrderDetail.saleOrderCode)}
                                        style={{visibility: saleOrderDetail.saleStatus == "0" || saleOrderDetail.saleStatus == "4" || saleOrderDetail.saleStatus == "6" ? `visible` : `hidden`}}><i
                                    className="c2mfont c2m-bianji1"
                                    style={{paddingRight: 7, fontSize: 10}}></i><span>编辑</span></Button>
                                <Dropdown overlay={menu}><Button type="ghost" className="select-btn">更多操作<Icon
                                    type="down"/></Button></Dropdown>
                            </div>
                        </div>
                        <a className="show-or-hide" href="#" onClick={this.toggle}>{this.state.tip}</a>
                    </div>
                </div>
                <div className="saleOrder-body">
                    <div className="saleOrder-body-border" style={{display: this.state.show ? `none` : `block`}}>
                        <div className="saleOrder-body-top">
                            <Row type="flex" justify="end">
                                <Col className="saleOrder-body-top-borderR" span={8}>
                                    <div className="saleOrder-baseInfo">
                                        <span className="saleOrder-form-baseInfo"><strong>基本信息</strong></span>
                                    </div>
                                    <ul>
                                        <li className="saleOrder-li">
                                            <span className="saleOrder-baseinfo-20">客户名称：</span><span
                                            className="saleOrder-baseinfo-r">{formatNullStr(saleOrderDetail.customerName)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span className="saleOrder-baseinfo-20">订单日期：</span><span
                                            className="saleOrder-baseinfo-r">{formatNullStr(saleOrderDetail.orderDate)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span className="saleOrder-baseinfo-20">收货人：</span><span
                                            className="saleOrder-baseinfo-r">{formatNullStr(saleOrderDetail.contactsPerson)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span className="saleOrder-baseinfo-20">联系电话：</span><span
                                            className="saleOrder-baseinfo-r">{formatNullStr(saleOrderDetail.contactsPhone)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span className="saleOrder-baseinfo-20">收货站点：</span><span
                                            className="saleOrder-baseinfo-r">{formatNullStr(saleOrderDetail.receiveAddressName)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span className="saleOrder-baseinfo-20">详细地址：</span><span
                                            className="saleOrder-baseinfo-r">{formatNullStr(saleOrderDetail.receiveAddressDetails)}</span>
                                        </li>
                                    </ul>
                                </Col>
                                <Col className="saleOrder-body-top-borderR" span={8}>
                                    <div className="saleOrder-baseInfo saleOrder-tit">
                                        <span className="saleOrder-form-baseInfo"><strong>发货信息</strong></span>
                                    </div>
                                    <ul className="saleOrder-ul">
                                        <li className="saleOrder-li">
                                            <span className="saleOrder-baseinfo-20">预计交货日期：</span><span
                                            className="saleOrder-baseinfo-r">{formatNullStr(saleOrderDetail.planDelivery)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span className="saleOrder-baseinfo-20">销售组织：</span><span
                                            className="saleOrder-baseinfo-r">{formatNullStr(saleOrderDetail.saleOrgName)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span className="saleOrder-baseinfo-20">销售员：</span><span
                                            className="saleOrder-baseinfo-r">{formatNullStr(saleOrderDetail.salesmanName)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span
                                                className="saleOrder-baseinfo-20">币种：</span><span>{saleOrderDetail.currencyName ? saleOrderDetail.currencyName : 'RMB'}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span className="saleOrder-baseinfo-20">发货站点：</span><span
                                            className="saleOrder-baseinfo-r">{formatNullStr(saleOrderDetail.shipAddressName)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span className="saleOrder-baseinfo-20">合同编号：</span><span
                                            className="saleOrder-baseinfo-r">{formatNullStr(saleOrderDetail.contractCode)}</span>
                                        </li>

                                    </ul>
                                </Col>
                                <Col span={8}>
                                    <div className="saleOrder-baseInfo saleOrder-tit">
                                        <span className="saleOrder-form-baseInfo"><strong>财务信息</strong></span>
                                    </div>
                                    <ul className="saleOrder-ul">
                                        <li className="saleOrder-li">
                                            <span
                                                className="saleOrder-baseinfo-20">收款条件：</span><span>{formatNullStr(saleOrderDetail.collectionTermsName)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span
                                                className="saleOrder-baseinfo-20">发票类型：</span><span>{formatNullStr(saleOrderDetail.invoiceTypeName)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span
                                                className="saleOrder-baseinfo-20">发票抬头：</span><span>{formatNullStr(saleOrderDetail.invoiceTitle)}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span
                                                className="saleOrder-baseinfo-20">详细地址：</span><span>{formatNullStr(saleOrderDetail.invoiceAddressDetails)}</span>
                                        </li>

                                        <li className="saleOrder-li">
                                            <span
                                                className="saleOrder-baseinfo-20">是否含税：</span><span>{this.getE('saleOrderIsTax', saleOrderDetail.isTax)} {saleOrderDetail.isTax == 0 ? "默认17%" : ``}</span>
                                        </li>
                                        <li className="saleOrder-li">
                                            <span
                                                className="saleOrder-baseinfo-20">运输费用：</span><span>{saleOrderDetail.transportCosts}</span>
                                        </li>
                                    </ul>
                                    <a className="show-and-hide" href="#"
                                       onClick={this.toggleMore}>{this.state.tipMore}</a>
                                </Col>
                            </Row>
                        </div>
                        <div className="saleOrder-body-down" style={{display: this.state.showMore ? `none` : `block`}}>
                            <Row type="flex" justify="end">
                                <Col className="saleOrder-body-top-borderR" span={8}>
                                    <div className="saleOrder-baseInfo">
                                        <span className="saleOrder-form-baseInfo"><strong>备注</strong></span>
                                    </div>
                                    <div className="saleOrder-body-down-con">
                                        备注：{formatNullStr(saleOrderDetail.remark)}
                                    </div>
                                </Col>
                                <Col className="saleOrder-body-top-borderR" span={8}>
                                    <div className="saleOrder-baseInfo saleOrder-tit">
                                        <span className="saleOrder-form-baseInfo"><strong>买家留言</strong></span>
                                    </div>
                                    <div className="saleOrder-body-down-con">
                                        {formatNullStr(saleOrderDetail.outECommerceRemark)}
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="saleOrder-baseInfo saleOrder-tit">
                                        <span className="saleOrder-form-baseInfo"><strong>电商备注</strong></span>
                                    </div>
                                    <div className="saleOrder-body-down-con"
                                         dangerouslySetInnerHTML={{__html: formatNullStr(saleOrderDetail.inECommerceRemark)}}>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div>
                        <div className="saleOrder-mxInfo">
                            <span className="saleOrder-form-baseInfo"><strong>明细信息</strong></span>
                            <span className="saleOrder-mxInfo-r">
                                <span className="saleOrder-mxInfo-l">合计</span>
                                <span className="saleOrder-mxInfo-l">金额：</span><strong
                                className="saleOrder-mxInfo-orange">￥{Number(saleOrderDetail.amount).toFixed(2)}</strong>
                                <span className="saleOrder-mxInfo-l">税额：</span><strong
                                className="saleOrder-mxInfo-orange">￥{Number(saleOrderDetail.tax).toFixed(2)}</strong>
                                <span className="saleOrder-mxInfo-l">价税合计：</span><strong
                                className="saleOrder-mxInfo-orange">￥{Number(saleOrderDetail.totalAmount).toFixed(2)}</strong>
                            </span>
                        </div>
                        <div className="saleOrder-table-con">
                            <MTable
                                cols={columns}
                                dataSource={saleOrderDetail.saleDetails}
                                rowKey={"lineNum"}
                                scroll={{x: 3800}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SaleOrderDetailComp;