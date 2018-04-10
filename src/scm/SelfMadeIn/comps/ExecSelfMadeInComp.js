import React, { Component, PropTypes } from "react";
import { Table, Dropdown, Menu, Spin, Button, message, Row, Col, Icon, Tabs, Modal} from '../../../base/components/AntdComp';
import { formatNullStr } from '../../../base/consts/Utils';
import TooltipComp from "../../../base/mobxComps/TooltipComp";
import OperationsComp from '../../../base/mobxComps/OperationsComp';

let { observable } = mobx;
let { observer } = mobxReact;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { selfMadeInStore } from '../stores/SelfMadeInStore';
import { execSelfMadeInStore } from '../stores/ExecSelfMadeInStore';
import { enumStore } from '../../../base/stores/EnumStore';
import PreReceiveComp from './PreReceiveComp';



@observer
class ExecSelfMadeInComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.title = '自制件入库单详情';
        this.store = execSelfMadeInStore;
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNo',
                key: 'lineNo',
                // fixed: 'left',
                width: 50,
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
            }, {
                dataIndex: 'handle',
                title: '操作',
                width: 54,
                render: (txt, record, index) => {
                    let { orderStatus, preReceiveQty, planQty } = record;
                    let opts = [
                        {
                            title: "预收货",
                            fun: ()=>this.onPreReceive(record,index),
                            default: '--',
                            show: ['1', '2', '4'].includes(orderStatus + '') && Number(preReceiveQty) < Number(planQty) ,
                        },
                    ];
                    return <OperationsComp operations={opts} />;
                }
            }
        ];
        this.columns_pr = [
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
                render: (text, record, index) => enumStore.getEnum("receiveStatus2", text),
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
                title: '仓库',
                dataIndex: 'stockName',
                key: 'stockName',
                // className: 'materialSpec',
                width: 129,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 108 }} />
            }, {
                title: '仓位',
                dataIndex: 'locationCode',
                key: 'locationCode',
                width: 126,
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 106 }} />
            }, {
                title: '批次号',
                dataIndex: 'batchCode',
                key: 'batchCode',
                width: 108,
            }, {
                title: '数量',
                dataIndex: 'qty',
                key: 'qty',
                width: 102,
                render: (text, record, index) => Number(text).toFixed(2),
            }, {
                title: '库存单位',
                dataIndex: 'unitName',
                key: 'unitName',
                width: 66,
            }, {
                title: '创建人',
                dataIndex: 'createByName',
                key: 'createByName',
                width: 66,
            }, {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
                width: 146,
            }, {
                dataIndex: 'handle',
                title: '操作',
                width: 54,
                render: (txt, record, index) => {
                    let opts = [
                        {
                            title: "删除",
                            titleText: ['确认要删除该明细项吗？'],
                            fun: ()=>this.onDelete(record),
                            default: '--',
                            show: record.orderStatus == 0,
                        },
                    ];
                    return <OperationsComp operations={opts} />;
                }
            }
        ];
    }

    @observable show = true;
    setShow = () => this.show = !this.show;
    onPreReceive = (record, index) =>{
        this.store.preRecStore.setVisible(true);
        this.store.preRecStore.setDetail(record);
    };
    onDelete = (record) => {
        let { lineNo } = record;
        let { orderCode } = this.store.detail;
        this.store.fetchDelete({ orderCode, lineNo: Number(lineNo) }).then(json => {
            if (json.status == 2000) {
                this.store.fetchDetail({ orderCode });
                message.success("预收货信息删除成功！");
            }
        });

    };
    onReceive = (orderCode) => {
        let hasReceived = true;
        this.store.receiveStore.dataSource.slice().forEach(item => {
            if (item.orderStatus == '0') {
                hasReceived = false;
            }
        });
        if (hasReceived) {
            Modal.warning({
                title: '没有预收货记录待收货！',
                okText: '知道了！',
            });
            return 
        }
        this.store.fetchReceive({ orderCode }).then(json => {
            if (json.status == 2000) {
                this.store.fetchDetail({ orderCode });
                selfMadeInStore.fetchTableList();
                message.success('收货成功！');
            }
        });
    }
    onClose = () => {
        let { orderCode } = this.store.detail;
        this.store.fetchClose({ orderCode }).then(json => {
            if (json.status == 2000) {
                message.success('关闭成功！');
                store.dispatch(TabsAct.TabRemove('execSelfMadeIn', 'selfMadeInList'));
                selfMadeInStore.fetchTableList();
            }
        });
    }
    onMore = (item) => {
        if (item.key == 'close') {
            let isQtyEq = true;
            this.store.detailStore.dataSource.slice().forEach(item => {
                if (item.accumReceiveQty != item.preReceiveQty) {
                    isQtyEq = false;
                }
            });
            isQtyEq ?
                confirm({
                    title: '是否确认关闭当前入库单！',
                    content: '关闭后当前入库单的所有未收货货物将不能继续收货操作。',
                    onOk: this.onClose,
                    okText: '确认',
                    cancelText: '取消'
                })
                :
                confirm({
                    title: '有预收货货物待收货确认，是仍要关闭！',
                    content: '关闭后预收货记录将不再继续收货操作，当前入库单所有未收货货物将不能继续收货操作。',
                    onOk: this.onClose,
                    okText: '确认',
                    cancelText: '取消'
                });

        }
    }
    render() {
        const { detail, loading } = this.store;
        let menu = (
            <Menu onClick={this.onMore}>
                {
                    ['1','2','3','4'].includes(detail.orderStatus+'') ?
                        <Menu.Item key="close">关闭</Menu.Item> : null
                }
            </Menu>
        );
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
                                <span style={{ color: enumStore.getEnum("orderStatus", detail.orderStatus, "color") }}>{formatNullStr(enumStore.getEnum("orderStatus",detail.orderStatus))}</span>
                                <span style={{ marginLeft: 20 }}>收货站点：</span>
                                <span>{formatNullStr(detail.receiveSiteName)}</span>
                                <span style={{ marginLeft: 22 }}>收货仓库：</span>
                                <span>{formatNullStr(detail.stockName)}</span>
                            </div>
                        </div>
                        <div>
                            {['1', '2', '3', '4'].includes(detail.orderStatus + '') ?
                                <Button type="primary" onClick={() => this.onReceive(detail.orderCode)}
                                    style={{
                                        backgroundColor: '#4C80CF',
                                        borderColor: '#4C80CF',
                                    }}>
                                    <i className="c2mfont c2m-shouhuo" style={{ paddingRight: 7, fontSize: '12px' }}></i>
                                    收货
                                </Button>
                                : null
                            }
                            <Dropdown overlay={menu}><Button type="ghost">更多操作<Icon type="down" /></Button></Dropdown>
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
                    <div className="selfMadeInExec-wrap">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="明细信息" key="1">
                                <Table
                                    {...this.store.detailStore.Props}
                                    rowKey='lineNo'
                                    columns={this.columns}
                                />    
                            </TabPane>
                            <TabPane tab="预收货信息" key="2">
                                <Table
                                    {...this.store.receiveStore.Props}
                                    rowKey='lineNo'
                                    columns={this.columns_pr}
                                />
                            </TabPane>
                        </Tabs>
                        <PreReceiveComp store={this.store.preRecStore}/>
                    </div>
                </Spin>
            </div>
        )
    }

}


export default ExecSelfMadeInComp;