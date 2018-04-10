import React, { Component, PropTypes } from "react";
import { Form, Input, Spin, Button, Modal, Row, Col, message, Select, Table } from 'antd';
import ModalComp from '../../../base/mobxComps/ModalComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';

let { observer } = mobxReact;
import { receiptConfirmViewStore  } from '../stores/ReceiptConfirmViewStore';
import { measureStore } from '../../data/DropDownStore';

@observer
export default class ExpenseDetailViewComp extends ModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = receiptConfirmViewStore;
        this.columns = [{
            title: '费用项',
            dataIndex: 'costName',
            render: (txt, record, index) => {
                return <TooltipComp attr={{text:txt, wid: 100, placement: 'top'}}/>
            }
        }, {
            title: '费用描述',
            dataIndex: 'costRemark',
            render: (txt, record, index) => {
                return <TooltipComp attr={{text:txt, wid: 300, placement: 'top'}}/>
            }
        }, {
            title: '累计金额',
            dataIndex: 'amount',
            render: (txt, record, index) => {
                txt = (txt || txt == '0') && Number(txt).toFixed(2);
                return `￥${txt}`
            },
            width: 120
        }];
    }
    handleCancel = () => {
        this.store.setVisible(false);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.handleCancel();
    }
    getFooter = () => ([
        <Button key="submit" type="primary" size="large"
            loading={this.store.loading}
            onClick={this.handleSubmit}
        >
            {this.props.okText || "确定"}
        </Button>
    ])
    getComp = () => {
        let { expenseDetail } = this.store;
        return (
            <div>
                <div className='expenseDetail-baseInfo'>
                    <Row>
                        <Col span={12}>
                            <p><lable>物料编码：</lable><span title={expenseDetail.materialCode}>{expenseDetail.materialCode}</span></p>
                            <p><lable>物料名称：</lable><span title={expenseDetail.materialName}>{expenseDetail.materialName}</span></p>
                        </Col>
                        <Col span={12}>
                            <p><lable>规格：</lable><span title={expenseDetail.materialSpec}>{expenseDetail.materialSpec}</span></p>
                            <p><lable>型号：</lable><span title={expenseDetail.model}>{expenseDetail.model}</span></p>
                        </Col>
                    </Row>
                </div>         
                <div className='expenseDetail-table'>
                    <Table
                        dataSource={expenseDetail.costList}
                        columns={this.columns}
                        rowKey={"id"}
                        pagination={false}
                    />
                </div>    
            </div>
        )
    }
}