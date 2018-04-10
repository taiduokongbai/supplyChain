import React, { Component, PropTypes } from "react";
import moment from "moment";
import { Table, Spin, Button, message, Row, Col } from '../../../base/components/AntdComp';
import TooltipComp from '../../../base/components/TooltipComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import { formatNullStr } from '../../../base/consts/Utils';
import ExpenseDetailViewComp from './ExpenseDetailViewComp'
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
//mobx store
import { receiptConfirmViewStore } from '../stores/ReceiptConfirmViewStore';
import { editReceiptConfirmStore } from '../stores/EditReceiptConfirmStore';
import { enumStore } from '../../../base/stores/EnumStore';
import { measureStore } from '../../data/DropDownStore';

let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
export default class ReceiptConfirmViewComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNo',
                key: 'lineNo',
                className: 'align-center-first',
                // width: 48,
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                // width: 104,
            },
            {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                render: (txt, record, index) => {
                    return <TooltipComp attr={{text:txt, wid: 93, placement: 'top'}}/>
                }
                // width: 98,
            },
            {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                render: (txt, record, index) => {
                    return <TooltipComp attr={{text:txt, wid: 84, placement: 'top'}}/>
                }
            },
            {
                title: '型号',
                dataIndex: 'model',
                key: 'model',
                render: (txt, record, index) => {
                    return <TooltipComp attr={{text:txt, wid: 84, placement: 'top'}}/>
                }
            },
            {
                title: '计划收货数量',
                dataIndex: 'planReceiveNumber',
                key: 'planReceiveNumber',
                render: (text, record, index) => (text||text=='0')&&Number(text).toFixed(2)
            },
            {
                title: '已收货数量',
                dataIndex: 'receiveNumber',
                key: 'receiveNumber',
                render: (text, record, index) => (text||text=='0')&&Number(text).toFixed(2)
            }, 
            {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                render: (text, record, index) => measureStore.getLabelName(text),
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 84,
                className: 'align-center',
                render: (txt, record, index) => {
                    function onExpenseDetail() {
                        receiptConfirmViewStore.setVisible(true);
                        receiptConfirmViewStore.setExpenseDetail(record);
                    }
                    let opts = [
                        {
                            title: '费用明细',
                            default:'--',
                            fun: onExpenseDetail,
                            show: record.signFlag==1,
                        }
                    ];
                    return <OperationsComp operations={opts} />;
                }
            }
        ];
    }
    handleSubmit = () => {
        store.dispatch(TabsAct.TabAdd({
            title: "执行收货确认单",
            key: "editReceiptConfirm"
        }));
        editReceiptConfirmStore.fetchReceiptConfirmDetail({ receiveAffirmCode:receiptConfirmViewStore.detail.receiveAffirmCode });
    }
    render() {
        let { detail, loading } = receiptConfirmViewStore;
        return (
            <div className='receiptConfirmView-cont'>
                <Spin spinning={loading}>
                    <div className='receiptConfirmView-title'>
                        <Row>
                            <Col span={22} >
                                <h4>收货确认单：{detail.receiveAffirmCode}</h4>
                                <p>
                                    <span>收货状态：<em style={{color:detail.receiveStatus===0?'#D0011B':(detail.receiveStatus===1?'#F6A623':'#417505'),fontStyle:'normal'}}>{detail.receiveStatus!==undefined&&window.ENUM.getEnum("receiveStatus", (detail.receiveStatus) + '')}</em></span>
                                    <span style={{padding:'0 20px'}}>供应商：{detail.supplierName}</span>
                                </p>
                            </Col>
                            <Col span={2}>
                                {detail.receiveStatus != '2' ?
                                    <Button type='primary' onClick={this.handleSubmit} className="saveBtn"><i className="c2mfont c2m-zhihang "></i>执行</Button> : null}
                            </Col>
                        </Row>
                    </div>
                    <div className='receiptConfirmView-col'>
                        <Row className='receiptConfirmView-stitle'>
                            <Col span={24}><strong>基本信息</strong></Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <ul className="base-info">
                                    <li><span>来源通知单号：</span>{formatNullStr(detail.sourceOrderCode)}</li>
                                    <li><span>采购类型：</span>{detail.sourceOrderType?window.ENUM.getEnum("purchaseType", (detail.sourceOrderType) + ''):'--'}</li>
                                    <li><span>收货人：</span>{formatNullStr(detail.reveiverName)}</li>
                                    <li><span>更新人：</span>{formatNullStr(detail.updateByName)}</li>
                                </ul>
                            </Col>
                            <Col span={8}>
                                <ul className="base-info">
                                    <li><span>采购部门：</span>{formatNullStr(detail.deptName)}</li>
                                    <li><span>采购人：</span>{formatNullStr(detail.purchaserName)}</li>
                                    <li><span>收货地址：</span>{formatNullStr(detail.receiveAddressName)}</li>
                                    <li><span>更新时间：</span>{detail.updateDate || formatNullStr(detail.updateDate)}</li>
                                </ul>
                            </Col>
                            <Col span={8}>
                                <ul className="base-info">
                                    <li><span>供应商名称：</span>{formatNullStr(detail.supplierName)}</li>
                                    <li><span>计划收货日期：</span>{detail.planReceiveDate  || formatNullStr(detail.planReceiveDate)}</li>
                                    <li><span>实际收货日期：</span>{detail.actualReceiveDate|| formatNullStr(detail.actualReceiveDate)}</li>
                                </ul>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className='receiptConfirmView-remark' style={{marginTop:5}}>
                                <p>
                                    <span style={{ float: 'left', width: 95 }}>备注：</span><span style={{width:'90%',textAlign:'left',color:'#666'}}>{formatNullStr(detail.remark)}</span>
                                </p>
                            </Col>
                        </Row>
                    </div>
                    <div className='receiptConfirmViewDetail-table'>
                        <h5>明细信息</h5>    
                        <Table
                            dataSource={detail.detailList}
                            columns={this.columns}
                            rowKey={"id"}
                            pagination={{
                                total: detail.detailList ? detail.detailList.length : 0,
                                showTotal: (total) => `总共 ${total} 条记录`,
                                pageSizeOptions: ['10', '15', '20', '50'],
                                showSizeChanger: true,
                            }}
                        />
                    </div>    
                </Spin>
                <ExpenseDetailViewComp/>
            </div>
        )
    }
}