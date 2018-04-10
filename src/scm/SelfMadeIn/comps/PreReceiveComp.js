import React, { Component, PropTypes } from "react";
import { Form, Input, Spin, Button, Modal, Row, Col, message, Select } from '../../../base/components/AntdComp';
import ModalComp from '../../../base/mobxComps/ModalComp';
import TableEditComp from '../../../base/mobxComps/TableEditComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { formatNullStr } from '../../../base/consts/Utils';

let { observer } = mobxReact;

@observer
export default class PreReceiveComp extends ModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = props.store;
        this.columns = [
            {
                title: '仓位',
                dataIndex: 'locationCode',
                key: 'locationCode',
                width: 132,
                obj: {
                    selectStore: this.store.locationStore,
                    rules: [{ required: true, message: '仓位必填！' }],
                    ...this.store.locationStore.Props,
                }
            }, {
                title: '仓库',
                dataIndex: 'stockName',
                key: 'stockName',
                width: 105,
            }, {
                title: '批次号',
                dataIndex: 'batchCode',
                key: 'batchCode',
                width: 140,
            }, {
                title: '预收货数量',
                dataIndex: 'qty',
                key: 'qty',
                width: 140,
                obj: {
                    rules: [{ type: 'gtZero', label: '数量', decimal: 2, maxLen: 16 }]
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: 100,
            }
        ];
    }
    
    handleCancel = () => {
        if (!this.store.loading) {
            if (this.store.editingIndex != null) {
                message.error("请先处理未保存的编辑内容！");
                return
            }
            this.store.setVisible(false);
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let { loading, editingIndex, detail, dataSource, fetchSubmit, pStore} = this.store;
        if (!loading) {
            if (editingIndex != null) {
                message.error("请先处理未保存的编辑内容！");
                return 
            }
            let { orderCode, orderStatus} = pStore.detail;
            let { sourceOrderLineNo, materialCode, unitCode} = detail;
            let preDetailList = dataSource.slice().map(item => {
                item.qty = Number(item.qty);
                item.orderCode = orderCode;
                item.orderStatus = Number(orderStatus);
                item.sourceOrderLineNo = sourceOrderLineNo;
                item.materialCode = materialCode;
                item.unitCode = unitCode;
                return item
            });

            fetchSubmit({ preDetailList}).then(json => {
                if (json.status == 2000) {
                    pStore.fetchDetail({ orderCode });
                    message.success("预收货成功！");
                    this.handleCancel();
                }
            })
        }
    }
    title = () => {
        let addBtnText = "添加行";
        return (
            <div className="title">
                {
                    addBtnText ?
                        <a href='#' onClick={this.store.onAdd}>
                            <i className='c2mfont c2m-tianjia' />
                            {addBtnText}
                        </a>
                        : null
                }
            </div>
        );
    }
    getComp = () => {
        let { detail } = this.store;
        return (
            <div>
                <div className="head">
                    <div className="head-row">
                        <div>物料编码：{detail.materialCode}</div>
                        <div>单位：{detail.unitName}</div>
                        <div>计划数量：<span className="planQty">{detail.planQty.toFixed(2)}</span></div>
                    </div>
                    <div className="head-row">
                        <div>物料名称：<div style={{ margin: '-24px 0 0 60px' }}><TooltipComp attr={{ text: formatNullStr(detail.materialName), wid: 112 }} /></div></div>
                        <div>预收货数量：<span className="preReceiveQty">{detail.preReceiveQty.toFixed(2)}</span></div>
                    </div>
                </div>
                <TableEditComp
                    {...this.store.Props}
                    rowKey={record => record.line}
                    columns={this.columns}
                    title={this.title}
                />
            </div>
        )
    }
}