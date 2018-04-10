import React, { Component } from 'react';
import { Button, Popconfirm, message, Select, Table } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import SalePriceAddTableDialogCont from '../../dialogconts/SaleModule/SalePriceAddTableDialogCont';
import SalePriceEditTableDialogCont from '../../dialogconts/SaleModule/SalePriceEditTableDialogCont';
import TooltipComp from "../../../base/components/TooltipComp";
import OperationsComp from '../../../base/components/OperationsComp'
const columns = [
    {
        title: '行号',
        dataIndex: 'lineNumber',
        key: 'lineNumber',
    },
    {
        title: '物料编码',
        dataIndex: 'materialCode',
        key: 'materialCode',
    },
    {
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
    }, {
        title: '规格',
        dataIndex: 'materialSpec',
        key: 'materialSpec',
    }, {
        title: '型号',
        dataIndex: 'model',
        key: 'model',
    },{
        title: '数量',
        dataIndex: 'materialQty',
        key: 'materialQty',
        render:(text,record,index)=>{
            return Number(text).toFixed(2)
        }
    }, {
        title: '单位',
        dataIndex: 'materialUnit',
        key: 'materialUnit',
        hidden:true
    },{
        title: '销售单位',
        dataIndex: 'sellUnitName',
        key: 'sellUnitName',
        hidden:true
    },  {
        title: '单位',
        dataIndex: 'unitName',
        key: 'unitName',
    }, {
        title: '税率(%)',
        dataIndex: 'taxRate',
        key: 'taxRate',
        render:(text,record,index)=>{
            return Number(text).toFixed(2)
        }
    }, {
        title: '批量价格',
        dataIndex: 'batchPrice',
        key: 'batchPrice',
        render:(text,record,index)=>{
            return Number(text).toFixed(2)
        }

    }, {
        title: '批量价格含税',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        render:(text,record,index)=>{
            return Number(text).toFixed(2)
        }
    }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 100, placement: 'left' }} />
    }, {
        dataIndex: 'handle',
        title: '操作',

    }
];

class SalePriceTableComp extends Component {
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
        
        columns[columns.length - 1].render = (text, record, index) => {
            let opts = [
                {
                    title: '编辑',
                    show: true,
                    fun: () => {
                        this.editPriceList(record, index)
                    },
                },
                {
                    title: "删除",
                    titleText: ['确定要删除该条明细吗', '删除后，该条明细将不可恢复！'],
                    show: true,
                    fun: () => this.delPriceList(index),
                },
            ];
            return <OperationsComp operations={opts} />;
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
    SourceCodeDilog = () => {
        this.props.SourceCodeDilog(true);
    }
    addNewRow = () => {
        this.props.SaleOrderAddTableVisiable(true, 'add');
        this.forceUpdate();
    }
    editPriceList = (record, index) => {
        this.props.SaleOrderAddTableVisiable(true, 'edit');
        this.setState({ currVal: record, index: index })

    }
    delPriceList = (index) => {
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
    onEditOk = (data) => {
        this.state.dataSource[this.state.index] = data;
        this.props.SourceEditDilog(false);
    }
    render() {
        let { list, currVal } = this.state;
        let dataSource = list || [];
        return (
            <div className="saleprice-table">
                <div style={{ paddingLeft: 20, paddingTop: 20, paddingBottom: 10 }}>
                    <span className='saledetail'>明细项</span>

                    <span className='twobtn2' onClick={()=>this.props.ImportViewVisiable(true)}><i className="c2mfont c2m-daoru_nor" style={{ paddingRight: '7px', fontSize: '10px' }}></i>导入</span>
                    <span className='twobtn1' onClick={this.addNewRow}><a><i className="c2mfont c2m-tianjia" style={{ paddingRight: 5 }}></i>添加行</a></span>
                </div>

                <div className="salepriceTable-body">
                    <MTable
                        {...this.props}
                        cols={columns}
                        dataSource={dataSource}
                        handleSubmit={this.handleSubmit}
                        rowKey={"key"}
                        addBtn="添加行"
                        onChange={this.handleTableChange}
                    />
                </div>
                <SalePriceAddTableDialogCont
                    {...this.props}
                    setTableElement={this.setTableElement}
                    list={list}
                />
                <SalePriceEditTableDialogCont
                    {...this.props}
                    setEditTableElement={this.setEditTableElement}
                    list={list}
                    currVal={currVal}
                />
            </div>
        );
    }

}

export default SalePriceTableComp;    