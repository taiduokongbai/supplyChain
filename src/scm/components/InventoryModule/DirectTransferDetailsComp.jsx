/**
 * Created by MW on 2017/8/30.
 * 直接调拨单详情
 */
import React, { Component } from 'react'
import { Row, Col, Button, Spin } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp'
import TooltipComp from '../../../base/components/TooltipComp'
import { formatNullStr } from "../../../base/consts/Utils";
import DirectTransferDetailsAct from '../../actions/InventoryModule/DirectTransferDetailsAct';
import { store } from "../../data/StoreConfig";
let columns = [
    {
        title: '行号',
        dataIndex: 'lineNo',
        key: 'lineNo',
        width: 50
    }, {
        title: '物料编码',
        dataIndex: 'materialCode',
        key: 'materialCode',
        width: 178
    }, {
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
        render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 84 }} />
    }, {
        title: '规格',
        dataIndex: 'materialSpec',
        key: 'materialSpec',
    }, {
        title: '型号',
        dataIndex: 'materialModel',
        key: 'materialModel',
    }, {
        title: '调出仓库',
        dataIndex: 'allotOutLocationCode',
        key: 'allotOutLocationCode',
    }, {
        title: '调出仓位',
        dataIndex: 'allotOutLocationName',
        key: 'allotOutLocationName',
    }, {
        title: '原批号',
        dataIndex: 'allotOutBatchCode',
        key: 'allotOutBatchCode',
    }, {
        title: '调入仓库',
        dataIndex: 'allotInLocationCode',
        key: 'allotInLocationCode',
    }, {
        title: '调入仓位',
        dataIndex: 'allotInLocationName',
        key: 'allotInLocationName',
    }, {
        title: '现批号',
        dataIndex: 'allotInBatchCode',
        key: 'allotInBatchCode',
    }, {
        title: '调拨数量',
        dataIndex: 'allotInQty',
        key: 'allotInQty',
    }, {
        title: '基本单位',
        dataIndex: 'unitName',
        key: 'unitName',
        width: 82,
    },
]
class DirectTransferDetailsComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayInfo: 'block',
            infoRemark: '收起',
            displayRemark: 'none',
            RemarkContent: '显示',
        }

    }

    toggle = (e) => {
        if (e.target.id) {
            this.state.displayRemark == 'none' ? this.setState({ displayRemark: 'block', RemarkContent: '收起' }) : this.setState({ displayRemark: 'none', RemarkContent: '显示' });
        } else {
            this.state.displayInfo == 'none' ? this.setState({ displayInfo: 'block', infoRemark: '收起' }) : this.setState({ displayInfo: 'none', infoRemark: '显示', displayRemark: 'none', RemarkContent: '显示' });
        }

    };
    tablePaging = (current) => {
        store.dispatch(DirectTransferDetailsAct.takeOrderDetailsMaterialPm(typeof current == 'number' ? Object.assign(this.props.search, { page: current }) : Object.assign(this.props.search, current)));
    }
    render() {
        let {tablePaging, tableLoading, ...props} = this.props;
        let info = this.props.takeOrderDetailsPm || '';
        console.log(this.props);
        return (
            <div className="direct-transfer-details">
                <Spin spinning={this.props.searchLoading}>
                    <div className="top">
                        <Row>
                            <Col span={22}>
                                <div className="header">直接调拨单号：{formatNullStr(info.allotOrderCode)}</div>
                                <div className="content">
                                    <span className="per-content">单据类型：{formatNullStr(info.allotOrderTypeName)}</span>
                                    <span className="per-content">调出仓库：{formatNullStr(info.allotOutSiteName)}</span>
                                    <span>调入仓库：{formatNullStr(info.allotInSiteName)}</span>
                                </div>
                            </Col>
                            <Col span={2}>
                                <Button className="return"><icon className="c2mfont c2m-jia"></icon>返回</Button>
                            </Col>
                        </Row>
                        <div className="lay-top" onClick={(e) => this.toggle(e)}>{this.state.infoRemark}</div>
                    </div>
                    <div className="info" style={{ 'display': this.state.displayInfo }}>
                        <Row className="row-first">
                            <Col className="col-left" span={13}>
                                <Row>
                                    <Col>
                                        <h3 className="public-title">基本信息</h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <div className="per-col">
                                            <span className="first-per-name">单据类型：</span>
                                            <span>{formatNullStr(info.allotOrderTypeName)}</span>
                                        </div>
                                        <div className="per-col">
                                            <span className="first-per-name">调拨申请人：</span>
                                            <span>{formatNullStr(info.allotProposerName)}</span>
                                        </div>
                                        <div className="per-col">
                                            <span className="first-per-name">调拨时间：</span>
                                            <span>{formatNullStr(info.allotDate)}</span>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="per-col">
                                            <span className="first-per-name">调出仓库：</span>
                                            <span>{formatNullStr(info.allotOutSiteName)}</span>
                                        </div>
                                        <div className="per-col">
                                            <span className="first-per-name">调入仓库：</span>
                                            <span>{formatNullStr(info.allotInSiteName)}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="col-right" span={11}>
                                <Row>
                                    <Col className="public-title">
                                        <h3 className="public-title">其他信息</h3>
                                    </Col>
                                </Row>
                                <div className="per-col">
                                    <span className="second-per-name">创建人：</span>
                                    <span>
                                        {formatNullStr(info.createByName)}
                                    </span>
                                </div>
                                <div className="per-col">
                                    <span className="second-per-name">创建时间：</span>
                                    <span>
                                        {formatNullStr(info.createDate)}
                                    </span>
                                </div>
                                <div className="lay-aside" id="remark" onClick={(e) => this.toggle(e)}>
                                    {this.state.RemarkContent}更多隐藏信息
                            </div>
                            </Col>
                        </Row>
                        <Row className="row-second" style={{ 'display': this.state.displayRemark }}>
                            <Col>
                                <div className="info-remark">
                                    <span className="first-name"> 备注：</span>
                                    <span className="remark-content">
                                        {formatNullStr(info.remarks)}
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="table">
                        <h3 className="public-title">调拨信息</h3>
                        <MTable
                            cols={columns}
                            rowKey={'id'}
                            dataSource={this.props.dataSource}
                            loading={tableLoading}
                            paging={this.props.paging}
                            pageOnChange={this.tablePaging}
                            {...props}
                        />
                    </div>
                    {/*<div className="remark">*/}
                    {/*<h3 className="public-title">调入记录</h3>*/}
                    {/*<div className="content">*/}
                    {/*{this.props.remarkList.map((perRemark) => {*/}
                    {/*return(*/}
                    {/*<div key={perRemark.id} className="per-remark">*/}
                    {/*<span className="time">{perRemark.updateDate}</span>*/}
                    {/*<span>{perRemark.createByName}从{perRemark.warehouseName}的{perRemark.freightSpaceName}仓位，分配了批次为{perRemark.batchCode ? perRemark.batchCode : '空'}的{perRemark.materialName}{perRemark.materialCode?'[' + perRemark.materialCode + ']':''}{perRemark.materialAmount}{perRemark.materialUnitName}。</span>*/}
                    {/*</div>*/}
                    {/*)*/}
                    {/*})}*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="remark">*/}
                    {/*<h3 className="public-title">调入记录</h3>*/}
                    {/*<div className="content">*/}
                    {/*{this.props.remarkList.map((perRemark) => {*/}
                    {/*return(*/}
                    {/*<div key={perRemark.id} className="per-remark">*/}
                    {/*<span className="time">{perRemark.updateDate}</span>*/}
                    {/*<span>{perRemark.createByName}从{perRemark.warehouseName}的{perRemark.freightSpaceName}仓位，分配了批次为{perRemark.batchCode ? perRemark.batchCode : '空'}的{perRemark.materialName}{perRemark.materialCode?'[' + perRemark.materialCode + ']':''}{perRemark.materialAmount}{perRemark.materialUnitName}。</span>*/}
                    {/*</div>*/}
                    {/*)*/}
                    {/*})}*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    <div className="remark">
                        <h3 className="public-title">调入记录</h3>
                        <div className="content">
                            <div className="per-remark">
                                <span className="time">2018-09-16</span>
                                <span>王五从中转库的A102仓位，调出批次为L1701的米其林轮胎[MR9085594]20个。</span>
                            </div>
                        </div>
                    </div>
                    <div className="remark">
                        <h3 className="public-title">调入记录</h3>
                        <div className="content">
                            <div className="per-remark">
                                <span className="time">2018-09-16</span>
                                <span>王五从中转库的A102仓位，调出批次为L1701的米其林轮胎[MR9085594]20个。</span>
                            </div>
                        </div>
                    </div>
                </Spin>
            </div>
        )
    }
}

export default DirectTransferDetailsComp
