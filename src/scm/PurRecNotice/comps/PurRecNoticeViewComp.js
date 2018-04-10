import React, { Component, PropTypes } from "react";
import { AutoComplete, Form, Table, Dropdown, Menu, Input, Spin, Button, message, Row, Col, Icon, Select, DatePicker, TreeSelect } from '../../../base/components/AntdComp';
import { formatNullStr } from '../../../base/consts/Utils';
import TooltipComp from "../../../base/mobxComps/TooltipComp";

let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const Option = Select.Option;

import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { purRecNoticeStore } from '../stores/PurRecNoticeStore';
import { editPurRecNoticeStore } from '../stores/EditPurRecNoticeStore';
import { purRecNoticeViewStore } from '../stores/PurRecNoticeViewStore';
import { enumStore } from '../../../base/stores/EnumStore';

let pushColor = {
    "0": "#F6A623",
    "1": "#417505"
};

@observer
class PurRecNoticeViewComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.title = '收货通知单详情';
        this.store = purRecNoticeViewStore;
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNo',
                key: 'lineNo',
                // fixed: 'left',
                width: 47,
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                // fixed: 'left',
                width: 188,
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                // fixed: 'left',
                width: 117,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 84 }} />
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                width: 84,
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
                width: 84,
            }, {
                title: '未清数量',
                dataIndex: 'openQty',
                key: 'openQty',
                width: 84,
                render: (text, record, index) => Number(text).toFixed(2),
            }, {
                title: '收货数量',
                dataIndex: 'receiveQty',
                key: 'receiveQty',
                width: 84,
                render: (text, record, index) => Number(text).toFixed(2),
            }, {
                title: '已收货数量',
                dataIndex: 'accumReceiveQty',
                key: 'accumReceiveQty',
                width: 84,
                render: (text, record, index) => Number(text).toFixed(2),
            }, {
                title: '单位',
                dataIndex: 'unitName',
                key: 'unitName',
                width: 59,
            }, {
                title: '来源采购订单行号',
                dataIndex: 'sourceOrderLineNo',
                key: 'sourceOrderLineNo',
                width: 132,
            }, {
                title: '来源通知单行号',
                dataIndex: 'sourceJobOrderLineNo',
                key: 'sourceJobOrderLineNo',
                width: 108,
            }
        ];
    }

    @observable show = true;
    @observable showMore = false;
    setShow = () => this.show = !this.show;
    setShowMore = () => this.showMore = !this.showMore;
    onEdit = (orderCode) => {
        store.dispatch(TabsAct.TabAdd({
            title: "编辑收货通知单",
            key: "editPurRecNotice"
        }));
        editPurRecNoticeStore.fetchDetail({ orderCode });
    }
    onMore = (item) => {
        let _detail = this.store.detail,
            canPush = _detail.receiveAddressDetl && _detail.receivePerson,
            hasAddrOrPerson = _detail.receiveAddressDetl || _detail.receivePerson;
        let nextOrder = _detail.purchaseType == 0 ? "采购入库" : "收货确认";
        if (item.key == 'pushDown') {
            if (canPush) {
                this.store.fetchPushDown({ orderCode: _detail.orderCode }).then(json => {
                    if (json.status == 2000) {
                        message.success(`下推成功，${nextOrder}单号为：${json.data.orderCode}`);
                        store.dispatch(TabsAct.TabRemove('purRecNoticeView', 'purRecNoticeList'));
                        purRecNoticeStore.fetchTableList();
                    }
                });
            } else {
                let msg = hasAddrOrPerson ? (_detail.receiveAddressDetl ? '收货人' : "收货地址") : "收货人和收货地址";
                message.info(`${msg}不能为空！`)
            }
        }
    }
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
        let formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 13 },
        };
        let formItemLayout2 = {
            labelCol: { span: 2 },
            wrapperCol: { span: 20 },
        };
        const { detail, loading } = this.store;
        let menu = (
            <Menu onClick={this.onMore}>
                {
                    detail.pushdownStatus == 0 ?
                        <Menu.Item key="pushDown">下推</Menu.Item> : null
                }
            </Menu>
        );
        return (
            <div className='purRecNoticeView-wrap'>
                <Spin spinning={loading}>
                    <div className='purRecNoticeView-head'>
                        <div className="title">
                            <div className="mtitle">
                                <span>收货通知单号：</span>
                                <span>{formatNullStr(detail.orderCode)}</span>
                                <span className="sqlit"></span>
                                <span>供应商：</span>
                                <span>{formatNullStr(detail.supplierName)}</span>
                            </div>
                            <div className="stitle">
                                <span>单据状态：</span>
                                <span style={{ color: '#4C80CF' }}>{formatNullStr(enumStore.getEnum("noticeOrderStatus", detail.orderStatus))}</span>
                                <span style={{ marginLeft: 20 }}>下推状态：</span>
                                <span style={{ color: pushColor[detail.pushdownStatus + ''] }}>{formatNullStr(enumStore.getEnum("isPushDownStatus", detail.pushdownStatus))}</span>
                                <span style={{ marginLeft: 20 }}>预计到货日期：</span>
                                <span>{formatNullStr(detail.planDate)}</span>
                                <span style={{ marginLeft: 20 }}>单据类型：</span>
                                <span>{formatNullStr(enumStore.getEnum('noticeOrderType', detail.orderType))}</span>
                            </div>
                        </div>
                        <div>
                            {detail.pushdownStatus == 0 ?
                                <Button type="primary" onClick={() => this.onEdit(detail.orderCode)}
                                    style={{
                                        backgroundColor: '#4C80CF',
                                        borderColor: '#4C80CF',
                                    }}>
                                    <i className="c2mfont c2m-bianji1" style={{ paddingRight: 7, fontSize: '12px' }}></i>
                                    编辑
                                </Button>
                                : null
                            }
                            <Dropdown overlay={menu}><Button type="ghost">更多操作<Icon type="down" /></Button></Dropdown>
                        </div>
                        <a className="show-more-info" href="#" onClick={this.setShow}>{this.show ? '收起' : '展开'}</a>
                    </div>
                    <div className="purRecNoticeView-base-info" style={{ display: this.show ? `block` : `none` }}>
                        <Row>
                            <Col span={8}>
                                <ul className="colone">
                                    <li><span>来源订单号：</span>{formatNullStr(detail.sourceOrderCode)}</li>
                                    <li><span>来源通知单：</span>{formatNullStr(detail.sourceJobOrderCode)}</li>
                                    <li><span>采购类型：</span>{formatNullStr(enumStore.getEnum('purchaseType', detail.purchaseType))}</li>

                                </ul>
                            </Col>
                            <Col span={8}>
                                <ul className="coltwo">
                                    <li><span>收货站点：</span>{formatNullStr(detail.receiveSiteName)}</li>
                                    <li><span>收货仓库：</span>{formatNullStr(detail.stockName)}</li>
                                    <li><span>收货地址：</span>{formatNullStr(detail.receiveAddressDetl)}</li>
                                </ul>
                            </Col>
                            <Col span={8}>
                                <ul className="colthree">
                                    <li><span>收货人：</span>{formatNullStr(detail.receivePerson)}</li>
                                    <li><span>联系电话：</span>{formatNullStr(detail.receivePersonTel)}</li>
                                </ul>
                            </Col>
                            <a className="show-more-info" href="#" onClick={this.setShowMore}>{this.showMore ? '收起更多隐藏信息' : '展开更多隐藏信息'}</a>
                        </Row>
                    </div>
                    <div className="purRecNoticeView-other-info" style={{ display: this.showMore ? `block` : `none` }}>
                        <ul className="other-info">
                            <li><span>备注：</span>{formatNullStr(detail.remarks)}</li>
                        </ul>
                    </div>
                    <div className="purRecNoticeView-detail-info">
                        <Table
                            {...this.store.Props}
                            rowKey='lineNo'
                            columns={this.columns}
                            title={this.tableTitle}
                        />
                    </div>
                </Spin>
            </div>
        )
    }

}


export default PurRecNoticeViewComp;