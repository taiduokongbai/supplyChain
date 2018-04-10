import React, { Component } from 'react';
import { Row, Col, Button, Spin, Table} from '../../../base/components/AntdComp';
import { formatNullStr } from "../../../base/consts/Utils";
import TooltipComp from '../../../base/mobxComps/TooltipComp';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

import { allotDetailsTableStore, allotDetailsStore } from '../store/AllotDetailsStore';

@observer
class AllotDetailsComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayInfo: 'block',
            infoRemark: '收起',
            displayRemark: 'none',
            RemarkContent: '显示',
        }
        this.columns = [
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
                dataIndex: 'allotOutStockName',
                key: 'allotOutStockName',
            }, {
                title: '调出仓位',
                dataIndex: 'allotOutLocationCode',
                key: 'allotOutLocationCode',
            }, {
                title: '原批号',
                dataIndex: 'allotOutBatchCode',
                key: 'allotOutBatchCode',
            }, {
                title: '调入仓库',
                dataIndex: 'allotInStockName',
                key: 'allotInStockName',
            }, {
                title: '调入仓位',
                dataIndex: 'allotInLocationCode',
                key: 'allotInLocationCode',
            }, {
                title: '现批号',
                dataIndex: 'allotInBatchCode',
                key: 'allotInBatchCode',
            }, {
                title: '调拨数量',
                dataIndex: 'allotInQty',
                key: 'allotInQty',
            }, {
                title: '库存单位',
                dataIndex: 'unitName',
                key: 'unitName',
                width: 82,
            },
        ]
    }

    toggle = (e) => {
        if (e.target.id) {
            this.state.displayRemark == 'none' ? this.setState({ displayRemark: 'block', RemarkContent: '收起' }) : this.setState({ displayRemark: 'none', RemarkContent: '显示' });
        } else {
            this.state.displayInfo == 'none' ? this.setState({ displayInfo: 'block', infoRemark: '收起' }) : this.setState({ displayInfo: 'none', infoRemark: '显示', displayRemark: 'none', RemarkContent: '显示' });
        }

    };
    render() {
        let { info, outRecord, inRecord, loading } = allotDetailsStore;
        // let info = this.props.takeOrderDetailsPm || '';
        return (
            <div className="direct-transfer-details">
                <Spin spinning={loading}>
                    <div className="top">
                        <Row>
                            <Col span={22}>
                                <div className="header">
                                    直接调拨单号：{formatNullStr(info.allotOrderCode)}
                                </div>
                                <div className="content">
                                    <span className="per-content">
                                        单据类型：{formatNullStr(info.allotOrderTypeName)}
                                    </span>
                                    <span className="per-content">
                                        调出仓库：{formatNullStr(info.allotOutSiteName)}
                                    </span>
                                    <span>
                                        调入仓库：{formatNullStr(info.allotInSiteName)}
                                    </span>
                                </div>
                            </Col>
                            <Col span={2}>
                                <Button className="return" onClick={allotDetailsStore.callback}><icon className="c2mfont c2m-fanhui" style={{'paddingRight':'5px'}}></icon>返回</Button>
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
                                            <span>
                                                {formatNullStr(info.allotOrderTypeName)}
                                            </span>
                                        </div>
                                        <div className="per-col">
                                            <span className="first-per-name">调拨申请人：</span>
                                            <span>
                                                {formatNullStr(info.allotProposerName)}
                                            </span>
                                        </div>
                                        <div className="per-col">
                                            <span className="first-per-name">调拨时间：</span>
                                            <span>
                                                {formatNullStr(info.allotDate?info.allotDate.match(/\d{4}\-\d{2}\-\d{2}/)[0]:'')}
                                            </span>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="per-col">
                                            <span className="first-per-name">调出仓库：</span>
                                            <span>
                                                {formatNullStr(info.allotOutSiteName)}
                                            </span>
                                        </div>
                                        <div className="per-col">
                                            <span className="first-per-name">调入仓库：</span>
                                            <span>
                                                {formatNullStr(info.allotInSiteName)}
                                            </span>
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
                        <Table
                            {...allotDetailsTableStore.Props}
                            columns={this.columns}
                            rowKey={'id'}
                        />
                    </div>
                    <div className="remark">
                        <h3 className="public-title">调出记录</h3>
                        <div className="content">
                            {outRecord.map((record) => {
                                return(
                                    <div key={record.numNo} className="per-remark">
                                        <span className="time">{record.recordTime}</span>
                                        <span>{record.description}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="remark">
                        <h3 className="public-title">调入记录</h3>
                        <div className="content">
                            {inRecord.map((record) => {
                                return(
                                    <div key={record.numNo} className="per-remark">
                                        <span className="time">{record.recordTime}</span>
                                        <span>{record.description}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Spin>
            </div>
        )
    }
}

export default AllotDetailsComp