import React, { Component, PropTypes } from "react";
import { Input, Button, Modal, Row, Col, message} from '../../../base/components/AntdComp';
import ModalComp from '../../../base/components/ModalComp';
import TableComp from '../../../base/components/TableComp';
import TooltipComp from '../../../base/components/TooltipComp';
export default class PurExpenseDetailViewComp extends ModalComp {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '费用项',
                dataIndex: 'expenseName',
                key: 'expenseName',
                width: 180,
            }, {
                title: '费用描述',
                dataIndex: 'expenseDetl',
                key: 'expenseDetl',
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 300, placement: 'top' }} />,
            }, {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                width: 140,
                render: (txt) => {
                    txt = Number(txt).toFixed(2);
                    return `￥${txt}`
                }
            }
        ];
    }
    handleCancel = () => {
        this.props.ExpenseDetailVisible(false);
    }
    getFooter = () => ([
        
    ])
    
    getComp = () => {
        let { expenseDetail } = this.props;
        return (
            <div>
                <div className='purExpenseDetail-baseInfo'>
                    <Row className='purExpenseDetail-title' style={{borderBottom:0}}>
                        <Col span={12}>
                            <div className='purExpenseDetail-ctitle'><span>物料编码：</span><TooltipComp attr={{ text: expenseDetail.materialCode, wid: 210, placement: 'top' }} /></div>
                            <div className='purExpenseDetail-ctitle'><span>规格：</span><TooltipComp attr={{ text: expenseDetail.materialSpec, wid: 210, placement: 'top' }} /></div>
                        </Col>
                        <Col span={12}>
                            <div className='purExpenseDetail-ctitle'><span>物料名称：</span><TooltipComp attr={{ text: expenseDetail.materialName, wid: 210, placement: 'top' }} /></div>  
                            <div className='purExpenseDetail-ctitle'><span>型号：</span><TooltipComp attr={{ text: expenseDetail.materialModel, wid: 210, placement: 'top' }} /></div>
                        </Col>
                    </Row>
                </div>         
                <div className='purExpenseDetail-table purExpenseDetailView-table'>
                    <TableComp
                        dataSource={expenseDetail.expenses}
                        rowKey={"id"}
                        cols={this.columns}
                        style={{ marginTop: 10 }}
                        pagination={false}
                        footer={() => <div>合计：<span>￥{Number(expenseDetail.expenseAmount).toFixed(2)}</span></div>}
                    />
                </div>    
            </div>
        )
    }
    
}