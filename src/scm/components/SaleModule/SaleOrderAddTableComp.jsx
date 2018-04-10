import React, { Component } from 'react';
import { Button, Popconfirm, message, Input, Icon, Table, Select, Radio, DatePicker, Form } from '../../../base/components/AntdComp';
import TooltipComp from "../../../base/components/TooltipComp";
import SaleOrderAddTableDialogCont from "../../dialogconts/SaleModule/SaleOrderAddTableDialogCont";
import SaleOrderEditTableDialogCont from '../../dialogconts/SaleModule/SaleOrderEditTableDialogCont'
import MTable from "../../../base/components/TableComp"
const Option = Select.Option;

class SaleOrderAddTableComp extends Component {
    constructor(props, context) {
        super(props, context);
        const value = props.value || [];
        this.state = {
            list: value,
            currVal: '',
            index: '',
            current: 1,
            pageSize: 10
        }
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                hidden: true
            }, {
                title: '行号',
                dataIndex: 'lineNum',
                key: 'lineNum',
                width:80,
                fixed: 'left',
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                width: 150,
                fixed: 'left',
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 150,
                fixed: 'left',
            }, {
                title: '规格',
                dataIndex: 'specification',
                key: 'specification',
                className: 'saleOrder-table-padding',
                width: 150,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
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
            },  {
                title: '计价单位',
                dataIndex: 'chargeUnitName',
                key: 'chargeUnitName',
                width: 100,
            },{
                title: '计价单位',
                dataIndex: 'chargeUnitCode',
                key: 'chargeUnitCode',
                hidden:true
            },{
                title: '单价',
                dataIndex: 'unitPrice',
                key: 'unitPrice',
                width: 150,
                render: (text, record, index) => {
                    return '￥'+Number(text).toFixed(2)
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
                    return Number(text).toFixed(2)+'%'
                }
            }, {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                width: 150,
                render: (text, record, index) => {
                    return '￥'+Number(text).toFixed(2)
                }
            }, {
                title: '税额',
                dataIndex: 'tax',
                key: 'tax',
                width: 150,
                render: (text, record, index) => {
                    return '￥'+Number(text).toFixed(2)
                }
            }, {
                title: '价税合计',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                width: 150,
                render: (text, record, index) => {
                    return '￥'+Number(text).toFixed(2)
                }
            }, {
                title: 'SPU',
                dataIndex: 'spuCode',
                key: 'spuCode',
                width: 150,
            }, {
                title: 'SPU名称',
                dataIndex: 'spuName',
                key: 'spuName',
                width: 150,
            },{
                title: 'SPU数量',
                dataIndex: 'spuNum',
                key: 'spuNum',
                width: 150,
            }, {
                title: '品牌',
                dataIndex: 'brand',
                key: 'brand',
                width: 150,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 100, placement: 'left' }} />
            },{
                title: '配置BOM',
                dataIndex: 'bom',
                key: 'bom',
                width: 150,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 100, placement: 'left' }} />
            },{
                title: '图纸',
                dataIndex: 'drawingUrl',
                key: 'drawingUrl',
                width: 150,
                render: (txt, index, record) =>{
                    return <div><a href={txt}>{txt}</a></div>
                }
            },{
                title: '附件',
                dataIndex: 'accessoryUrl',
                key: 'accessoryUrl',
                width: 150,
                render: (txt, index, record) =>{
                    return <div><a href={txt}>{txt}</a></div>
                }
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 100, placement: 'left' }} />
            }, {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right',
                width: 80,
            }
        ];

        this.columns[this.columns.length - 1].render = this.optColRender;
    }
    optColRender = (txt, record, index) => {
        return (
            <div>
                {this.props.businessType == 3 ? <span className="purchase-double-line">--</span> : <span className="purchase-order-implement c2mfont c2m-bianji" title='编辑' onClick={() => this.editDialogShow(index, record)}></span>}
                {(this.props.businessType == 3 || this.props.businessType == 2) ? <span className="purchase-double-line-delete">--</span> : <Popconfirm title="确认删除该数据吗？" onConfirm={() => this.delOrder(index, record)} okText="确定" cancelText="取消">
                    <span className="purchase-order-implement-delete c2mfont c2m-shanchu" title='删除'></span>
                </Popconfirm>}

            </div>
        );
    }
    editDialogShow = (index, record) => {
        if (this.props.businessType == 3) {
            message.error('来源电商标品不能编辑');
            return false;
        }
        if(this.props.planDelivery){
            this.props.SaleOrderAddTableVisiable(true, 'edit');
            this.setState({ currVal: record, index: index })
        }else{
            message.error('请先选择预计交货日期！');
            return false;
        }
    }
    addNewRow = () => {
        if (this.props.businessType == 2 || this.props.businessType == 3) {
            message.error('来源电商不能新增');
            return false;
        }
        if(this.props.planDelivery){
            this.props.SaleOrderAddTableVisiable(true, 'add');
            this.forceUpdate();
        }else{
            message.error('请先选择预计交货日期！');
            return false;
        }
    }
    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps && nextProps.value !== this.state.list) {
            const list = nextProps.value;
            this.setState({ list });
        }
    }
    handleSubmit = (data, index) => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(data);
        }
    }
    setTableElement = (data) => {
        let { list } = this.state;
        list.splice(0, 0, data);
        this.handleSubmit(list);
    }
    setEditTableElement = (data, index = this.state.index) => {
        let { list, current, pageSize } = this.state;
        let newData = [...list];
        if (current && current != 1) {
            index = (current - 1) * pageSize + index;
        };
        newData[index] = data;
        this.handleSubmit(newData, index)
    }
    delOrder = (index) => {
        let { list, current, pageSize } = this.state;
        let realIndex = index;
        if (current && current != 1) {
            realIndex = (current - 1) * pageSize + index;
            if (index == 0 && list.length - 1 == realIndex) {
                this.setState({ current: current - 1 });
            }
        };
        list.splice(realIndex, 1);
        this.handleSubmit(list, realIndex)
    }
    //表格变化事件
    handleTableChange = (pagination, filters, sorter) => {
        let { current, pageSize } = pagination;
        this.setState({ current, pageSize });
    }
    render() {
        let { list, currVal } = this.state;
        let dataSource = list || [];
        let { paging, onChange, saleDetails, ...props } = this.props;
        return (
            <div className="saleOrder-add-table-wrap">
                {(this.props.businessType ==2 ||this.props.businessType ==3 )? null:<div onClick={this.addNewRow} className="saleOrder-add-btn"><a><i className="c2mfont c2m-tianjia" style={{ paddingRight: 5 }}></i>添加物料</a></div>}
                <MTable className="add-table"
                    {...this.props}
                    cols={this.columns}
                    dataSource={dataSource}
                    handleSubmit={this.handleSubmit}
                    rowKey={"key"}
                    addBtn="添加行"
                    scroll={{ x: 3650 }}
                    onChange={this.handleTableChange}
                />
                <SaleOrderAddTableDialogCont
                    {...this.props}
                    setTable={this.props.setTable}
                    setTableElement={this.setTableElement}
                    list={list}
                    className="saleOrder"
                />
                <SaleOrderEditTableDialogCont
                    {...this.props}
                    setTable={this.props.setTable}
                    list={list}
                    setEditTableElement={this.setEditTableElement}
                    currVal={currVal}
                />
            </div>
        );
    }
}
export default SaleOrderAddTableComp;