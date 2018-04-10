import React, { Component, PropTypes } from "react";
import { AutoComplete, Form, Table, Dropdown, Menu, Input, Spin, Button, message, Row, Col, Icon, Select, DatePicker, TreeSelect } from '../../../base/components/AntdComp';
import { formatNullStr } from '../../../base/consts/Utils';
import TooltipComp from "../../../base/mobxComps/TooltipComp";

let { observable } = mobx;
let { observer } = mobxReact;
const Option = Select.Option;

import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { selfMadeInStore } from '../stores/SelfMadeInStore';
import { editSelfMadeInStore } from '../stores/AddSelfMadeInStore';
import { selfMadeInViewStore } from '../stores/SelfMadeInViewStore';
import { enumStore } from '../../../base/stores/EnumStore';


let pushColor = {
    "0": "#F6A623",
    "1": "#417505"
};
@observer
class SelfMadeInViewComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.title = '自制件入库单详情';
        this.store = selfMadeInViewStore;
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNo',
                key: 'lineNo',
                // fixed: 'left',
                width: 39,
            }, {
                title: '状态',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                // fixed: 'left',
                width: 76,
                render: (text, record, index) => enumStore.getEnum("orderStatus", text),
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                // fixed: 'left',
                width: 160,
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                // fixed: 'left',
                width: 142,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 132 }} />
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                // className: 'materialSpec',
                width: 129,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 108 }} />
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
                width: 126,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 106 }} />
            }, {
                title: '计划数量',
                dataIndex: 'planQty',
                key: 'planQty',
                width: 108,
                render: (text, record, index) => Number(text).toFixed(2),
            }, {
                title: '预收货数量',
                dataIndex: 'preReceiveQty',
                key: 'preReceiveQty',
                width: 85,
                render: (text, record, index) => Number(text).toFixed(2),
            }, {
                title: '已收货数量',
                dataIndex: 'accumReceiveQty',
                key: 'accumReceiveQty',
                width: 88,
                render: (text, record, index) => Number(text).toFixed(2),
            }, {
                title: '未清数量',
                dataIndex: 'openQty',
                key: 'openQty',
                width: 109,
                render: (text, record, index) => Number(text).toFixed(2),
            }, {
                title: '库存单位',
                dataIndex: 'unitName',
                key: 'unitName',
                width: 66,
            },
        ];
    }

    @observable show = true;
    setShow = () => this.show = !this.show;
    
    tableTitle = () => {
        return (
            <div className="tab-title">
                <div className="left-text">
                    <span><strong>明细信息</strong></span>
                </div>
            </div>
        );
    }
    render() {
        const { detail, loading } = this.store;
        return (
            <div className='selfMadeInView-wrap'>
                <Spin spinning={loading}>
                    <div className='selfMadeInView-head'>
                        <div className="title">
                            <div className="mtitle">
                                <span>自制件入库单号：</span>
                                <span>{formatNullStr(detail.orderCode)}</span>
                            </div>
                            <div className="stitle">
                                <span>状态：</span>
                                <span style={{ color: enumStore.getEnum("orderStatus", detail.orderStatus, "color")  }}>{formatNullStr(enumStore.getEnum("orderStatus",detail.orderStatus))}</span>
                                <span style={{ marginLeft: 20 }}>收货站点：</span>
                                <span>{formatNullStr(detail.receiveSiteName)}</span>
                                <span style={{ marginLeft: 22 }}>收货仓库：</span>
                                <span>{formatNullStr(detail.stockName)}</span>
                            </div>
                        </div>
                        <a className="show-more-info" href="#" onClick={this.setShow}>{this.show ? '收起' : '展开'}</a>
                    </div>
                    <div className="selfMadeInView-base-info" style={{ display: this.show ? `block` : `none` }}>
                        <Row>
                            <Col span={12}>
                                <ul>
                                    <li><span>源单类型：</span>{formatNullStr(enumStore.getEnum("sourceOrderType2", detail.sourceOrderType))}</li>
                                    <li><span>源单据号：</span>{formatNullStr(detail.sourceOrderCode)}</li>
                                    <li><span>收货仓库：</span>{formatNullStr(detail.stockName)}</li>
                                </ul> 
                            </Col>
                            <Col span={12}>
                                <ul>
                                    <li><span>创建人：</span>{formatNullStr(detail.createByName)}</li>
                                    <li><span>创建时间：</span>{formatNullStr(detail.createDate)}</li>
                                    <li><span>备注：</span><div style={{ margin: '-24px 0 0 60px' }}>{<TooltipComp attr={{ text: formatNullStr(detail.remarks), wid: '60%' }} />}</div></li>
                                </ul> 
                            </Col>
                        </Row>
                    </div>
                    <div className="selfMadeInView-detail-info">
                        <Table
                            {...this.store.Props}
                            rowKey='lineNo'
                            columns={this.columns}
                            title={this.tableTitle}
                            // scroll={{ x: 1160 }}
                        />
                    </div>
                    <div className="selfMadeInView-log">
                        <div className="title">收货记录</div>
                        {
                            detail.orderStatus == 5 ?
                                <div className="row">
                                    <span className="date">{detail.receiveDate}</span>
                                    <span>收货完成。</span>
                                </div> : null
                        }{
                            this.store.receiveLogList.slice().map(item => {
                                return (
                                    <div className="row">
                                        <span className="date">{item.createDate}</span>
                                        <span>{item.createByName}收货了批次为{item.batchCode ? item.batchCode : '空'}的{formatNullStr(item.materialName)}[{item.materialCode}]{item.operatNum}{item.unitName}，</span>
                                        <span>收货仓位为{item.stockName}的{item.freightSpaceCode}。</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Spin>
            </div>
        )
    }

}


export default SelfMadeInViewComp;