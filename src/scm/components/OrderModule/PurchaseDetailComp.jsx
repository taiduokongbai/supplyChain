import React, { Component } from "react";
import { Form, Input, Spin, Button, message, Row, Col, Icon,Select, DatePicker,Checkbox } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import OperationsComp from '../../../base/components/OperationsComp'
import TooltipComp from '../../../base/components/TooltipComp';

import AddPurDetailLineCont from '../../dialogconts/OrderModule/AddPurDetailLineCont';
import EditPurDetailLineCont from '../../dialogconts/OrderModule/EditPurDetailLineCont';
import PurExpenseDetailViewComp from './PurExpenseDetailViewComp'


class PurchaseDetailComp extends Component {
    constructor(props, context) {
        super(props, context);
        const value = props.value || [];
        this.state = {
            list: value,
            data: {
                materialCode: "",
                materialName: "",
                materialSpec: "",
                materialModel: "",
                materialQuality: "",
                standardCode: "",
                netAmount: "",
                taxAmount: "",
                totalAmount: "",
                expenseAmount: "",
                orderQty: "",
                purchaseUnit: "",
                priceQty: "",
                priceUnit: "",
                price: "",
                taxRate: "",
                remark: "",
            },
            index: null,
            current: 1,
            pageSize: 10,
            netAmount: 0,
            taxAmount: 0,
            totalAmount: 0,
            expenseAmount: 0,
            disableds: [],
            columns: [],
            colsChanged: false,
            expenseDetail:{}
        }
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNum',
                key: 'lineNum',
                width: 56,
                fixed: 'left',
                className: 'lineNum-center'
            },{
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                width: 140,
                fixed: 'left',
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 98,
                fixed: 'left',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                className: 'purchaseOrder-table-padding',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '材料',
                dataIndex: 'materialQuality',
                key: 'materialQuality',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '代号',
                dataIndex: 'standardCode',
                key: 'standardCode',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            },{
                title: '订单数量',
                dataIndex: 'orderQty',
                key: 'orderQty',
                render: (txt, record, index) => (txt||txt=='0')&&Number(txt).toFixed(2)
            }, {
                title: '单位',
                dataIndex: 'purchaseUnit',
                key: 'purchaseUnit',
                width: 140,
                render: (text, record, index) => this.getUnitName(text),
            }, {
                title: '计价数量',
                dataIndex: 'priceQty',
                key: 'priceQty',
                render: (txt, record, index) => (txt||txt=='0')&&Number(txt).toFixed(2)
            }, {
                title: '计价单位',
                dataIndex: 'priceUnit',
                key: 'priceUnit',
                render: (text, record, index) => this.getUnitName(text),
                hidden: true
            }, {
                title: '计价单位',
                dataIndex: 'priceUnitDetl',
                key: 'priceUnitDetl',
            }, {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                render: (txt, record, index) => (txt||txt=='0')&&'￥'+Number(txt).toFixed(2)
            }, {
                title: '税率',
                dataIndex: 'taxRate',
                key: 'taxRate',
                render: (txt, record, index) => (txt||txt=='0')&&Number(txt).toFixed(2)+'%'
            }, {
                title: '金额',
                dataIndex: 'netAmount',
                key: 'netAmount',
                render: (txt, record, index) => (txt||txt=='0')&&'￥'+Number(txt).toFixed(2)
            }, {
                title: '税额',
                dataIndex: 'taxAmount',
                key: 'taxAmount',
                render: (txt, record, index) => (txt||txt=='0')&&'￥'+Number(txt).toFixed(2)
            }, {
                title: '附加费',
                dataIndex: 'expenseAmount',
                key: 'expenseAmount',
                render: (txt, record, index) => ((txt||txt=='0')&&'￥'+Number(txt).toFixed(2))||'--'
            },{
                title: '价税合计',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                hidden: true
            }, {
                title: 'SPU编码',
                dataIndex: 'spuCode',
                key: 'spuCode',
                hidden: true
            }, {
                title: 'SPU名称',
                dataIndex: 'spuName',
                key: 'spuName',
                hidden: true
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width: 200,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 134, placement: 'top' }} />
            }, {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right',
                width: 80,
                className:'operation-center'
            }
        ];
        this.columns2 = [
            {
                title: '行号',
                dataIndex: 'lineNum',
                key: 'lineNum',
                width: 56,
                fixed: 'left',
                className: 'lineNum-center'
            },{
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                width: 140,
                fixed: 'left',
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 98,
                fixed: 'left',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                className: 'purchaseOrder-table-padding',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '材料',
                dataIndex: 'materialQuality',
                key: 'materialQuality',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '代号',
                dataIndex: 'standardCode',
                key: 'standardCode',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            },{
                title: '订单数量',
                dataIndex: 'orderQty',
                key: 'orderQty',
                render: (txt, record, index) => (txt||txt=='0')&&Number(txt).toFixed(2)
            }, {
                title: '单位',
                dataIndex: 'purchaseUnit',
                key: 'purchaseUnit',
                width: 140,
                render: (text, record, index) => this.getUnitName(text),
            }, {
                title: '计价数量',
                dataIndex: 'priceQty',
                key: 'priceQty',
                render: (txt, record, index) => (txt||txt=='0')&&Number(txt).toFixed(2)
            }, {
                title: '计价单位',
                dataIndex: 'priceUnit',
                key: 'priceUnit',
                render: (text, record, index) => this.getUnitName(text),
                hidden: true
            }, {
                title: '计价单位',
                dataIndex: 'priceUnitDetl',
                key: 'priceUnitDetl',
            },{
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                render: (txt, record, index) => (txt||txt=='0')&&'￥'+Number(txt).toFixed(2)
            }, {
                title: '税率',
                dataIndex: 'taxRate',
                key: 'taxRate',
                render: (txt, record, index) => (txt||txt=='0')&&Number(txt).toFixed(2)+'%'
            }, {
                title: '金额',
                dataIndex: 'netAmount',
                key: 'netAmount',
                render: (txt, record, index) => (txt||txt=='0')&&'￥'+Number(txt).toFixed(2)
            }, {
                title: '税额',
                dataIndex: 'taxAmount',
                key: 'taxAmount',
                render: (txt, record, index) => (txt||txt=='0')&&'￥'+Number(txt).toFixed(2)
            }, {
                title: '附加费',
                dataIndex: 'expenseAmount',
                key: 'expenseAmount',
                // render: (txt, record, index) => (txt||txt=='0')&&'￥'+Number(txt).toFixed(2)
            },{
                title: '价税合计',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                hidden: true
            }, {
                title: 'SPU编码',
                dataIndex: 'spuCode',
                key: 'spuCode',
            }, {
                title: 'SPU名称',
                dataIndex: 'spuName',
                key: 'spuName',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            },{
                title: 'SPU规格',
                dataIndex: 'spuSpec',
                key: 'spuSpec',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: 'SPU型号',
                dataIndex: 'spuModel',
                key: 'spuModel',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: 'SPU材料',
                dataIndex: 'spuQuality',
                key: 'spuQuality',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: 'SPU代号',
                dataIndex: 'supStandardCode',
                key: 'supStandardCode',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 86, placement: 'top' }} />
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width: 200,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 134, placement: 'top' }} />
            }
        ];
        this.columns2[1].render = (txt, record, index) => {
            let { sourceOrderType } = this.props;
            // let materialCode = sourceOrderType=='3'&&this.props.purchaseDetail.list.length>0&&this.props.purchaseDetail.list[index].materialCode;
            if (record.matchedFlag=='0') {
                return <a href="#" onClick={() => this.PurchaseDetailEditShow(record, index)} >{txt?txt:'补录'}</a>
            } else if (record.matchedFlag == '1') {
                return <a href="#" onClick={() => this.PurchaseDetailEditShow(record, index)} >{txt}</a>
            }
            // else if (txt && materialCode == '' && sourceOrderType == '3') {
                // return <a href="#" onClick={() => this.PurchaseDetailEditShow(record, index)}>{record.materialCode}</a>
            // }
            // else {
            //     return txt
            // }
        }
        this.columns[this.columns.length - 1].render = (text, record, index) => {
            let opts = [
                {
                    title: '编辑',
                    show: this.props.sourceOrderType=='1'||this.props.sourceOrderType=='2'||(this.props.sourceOrderType=='3'&&record.materialCode==''),
                    fun: () => {
                        let { showDetailLine, type } = this.props;
                        showDetailLine && showDetailLine(type, 'edit', true);
                        this.getDetail(record, index);
                    },
                },
                {
                    title: "删除",
                    titleText: ['确定要删除该物料明细吗', '删除后，该条物料明细将不可恢复！'],
                    show: this.props.sourceOrderType=='1'||this.props.sourceOrderType=='2',
                    fun: () => this.handleDelete(index),
                },
            ];
            return <OperationsComp operations={opts} />;
        }
        this.columns2[16].render = (txt, record, index) => {
            if (txt !== '') {
                return <a href="#" onClick={() => this.expenseDetailShow(record)}>{'￥'+Number(txt).toFixed(2)}</a>
            } else {
                return '--'
            }
        }
        
    }
    expenseDetailShow = (record) => {
        this.props.ExpenseDetailVisible(true);
        this.setState({ expenseDetail: record });
    }
    PurchaseDetailEditShow = (record, index) => {
        let { showDetailLine, type } = this.props;
        showDetailLine && showDetailLine(type, 'edit', true);
        this.getDetail(record, index);
    }
    getUnitName(value) {
        let { measureList } = this.props;
        let keyName = 'meaCode', labelName = 'meaName';
        if (measureList && keyName && labelName) {
            if (Array.isArray(measureList) && measureList.length > 0) {
                measureList.forEach(item => {
                    if (item[keyName] === value) {
                        value = item[labelName];
                    }
                })
            }
        }
        return value;
    };
    title = () => {
        let { sourceOrderType, addBtn, showDetailLine, type } = this.props;
        let { netAmount, taxAmount, totalAmount } = this.state;
        let addBtnText = sourceOrderType != '3' ? "添加行" : "";
        let curSymbol = '￥';
        return (
            <div className="tab-title">
                <div className="left-text">
                    <span><strong>明细信息</strong></span>
                </div>
                <div>
                    <span className="total">
                        <span className="laber">合计</span>
                        <span className="laber">金额：</span>
                        <span className="number">{curSymbol+netAmount}</span>
                        <span className="laber">税额：</span>
                        <span className="number">{curSymbol+taxAmount}</span>
                        <span className="laber">价税合计：</span>
                        <span className="number">{curSymbol+totalAmount}</span>
                    </span>
                {
                    addBtnText ?
                            <Button onClick={() => showDetailLine(type, 'add', true)} disabled={this.props.supplierCode?false:true}>
                                <i className='c2mfont c2m-tianjia' style={{paddingLeft:'0'}}/>
                            {addBtnText}
                        </Button>
                    :null
                }
                </div>
            </div>
        );
    }
    componentWillMount() {
        let { getMaterialList, getMeasureList, getExpenseList } = this.props;
        // getMaterialList && getMaterialList("");
        getMeasureList && getMeasureList();
        getExpenseList && getExpenseList();
    }
    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            let tax = 0,
                netAmount = 0,
                taxAmount = 0,
                totalAmount = 0,
                expenseAmount = 0,
                list = nextProps.value,
                freightAmount = nextProps.freightAmount;
                // freightAmount = (freightAmount || freightAmount == '0') ? Number(freightAmount) : 0;
                freightAmount = !!Number(freightAmount)?Number(freightAmount) : 0;
            list.forEach(item => {
                expenseAmount = expenseAmount + Number(item.expenseAmount);
                netAmount = netAmount + Number(item.netAmount);
                taxAmount = taxAmount + Number(item.taxAmount);
                // totalAmount = netAmount + taxAmount;
            });
            this.setState({
                list,
                netAmount: (netAmount+expenseAmount+freightAmount).toFixed(2),
                taxAmount: taxAmount.toFixed(2),
                totalAmount: (netAmount+expenseAmount+freightAmount+taxAmount).toFixed(2),
            });
            this.setDisableds(nextProps);
            this.setState({
                columns: this.props.sourceOrderType == '3' ? this.columns2 : this.columns,
                colsChanged: !this.state.colsChanged
            })
        }
    }
    //新增保存
    handleAdd = (data) => {
        const { onChange } = this.props;
        let { list } = this.state;
        let id = -1;
        if (list[0] && list[0].id < 0) {
            id = list[0].id - 1;
        };
        data.id = id;
        // data.lineNum = "";
        data = this.changeDetail(data);
        let newData = [...list];
        newData.splice(0, 0, data);
        onChange && onChange(newData);
    }
    //编辑保存
    handleEdit = (data) => {
        const { onChange } = this.props;
        let { list, index } = this.state;
        let newData = [...list];
        data = this.changeDetail(data);
        if (index != null) {
            newData[index] = data;
            this.setState({index:null})
        }
        onChange && onChange(newData);
    }
    //获取行数据
    getDetail = (data, index) => {
        let { current, pageSize } = this.state;
        if (current && current != 1) {
            index = (current - 1) * pageSize + index;
        };
        this.setState({data,index})
    }
    //转化行数据
    changeDetail = (data) => {
        //计价数量
        // data.priceQty = data.orderQty;
        //计价单位
        // data.priceUnit = data.purchaseUnit;
        //税额
        // data.taxAmount = (data.priceQty * data.price * data.taxRate / 100).toFixed(2);
        // //价税合计
        // data.totalAmount = (data.priceQty * data.price).toFixed(2);
        // //金额
        // data.netAmount = (data.totalAmount - data.taxAmount).toFixed(2);
        
        return data;
    }
    //点击删除
    handleDelete = (index) => {
        const { onChange } = this.props;
        let { current, pageSize, list } = this.state;
        let realIndex = index;
        if (current && current != 1) {
            realIndex = (current - 1) * pageSize + index;
            if (index == 0 && list.length - 1 == realIndex) {
                this.setState({ current: current - 1 });
            }
        };
        let newData = [...list];
        newData.splice(realIndex, 1);
        onChange && onChange(newData);
    }
    //表格换页
    handleTableChange = (pagination, filters, sorter) => {
        let { current, pageSize } = pagination;
        this.setState({ current, pageSize });
    }
    setDisableds = (props) => {
        let {  taxFlag, sourceOrderType } = props;
        //来源电商-禁编对象
        const list0 = ['purchaseUnit', 'priceUnit', 'priceQty', 'price','taxRate'];
        //来源自建-禁编对象
        const list1 = ['materialCode'];
        //设置需要禁用的列,点编辑时有效
        let disableds = [];
        if (sourceOrderType == '3') {//来源电商
            disableds = [...list0];
        } else {
            disableds = [...list1];
        }
        
        this.setState({ disableds });
    }
    render() {
        let { list, data, disableds } = this.state;
        let dataSource = list || [];
        let { paging, onChange, form, loading, ...props } = this.props;
        return (
            <div className='purchaseDetail-table'>
                <MTable
                    {...props}
                    cols={this.state.columns}
                    dataSource={dataSource}
                    rowKey={'id'}
                    title={this.title}
                    onChange={this.handleTableChange}
                    scroll={{ x: 2640 }}
                    colsChanged={this.state.colsChanged}
                />
                <AddPurDetailLineCont
                    {...props} handleSubmit={this.handleAdd} onChange={onChange}/>
                <EditPurDetailLineCont
                    {...props} handleSubmit={this.handleEdit} disableds={disableds} detail={data} onChange={onChange} />
                {this.props.edit.expenseDetailVisible ? <PurExpenseDetailViewComp expenseDetail={this.state.expenseDetail} visible={this.props.edit.expenseDetailVisible} title='费用明细' className='purOrder-expense-cont purOrder-expenseView-cont' width={800} ExpenseDetailVisible={this.props.ExpenseDetailVisible}/> : null}
            </div>
        );
    }
}
export default PurchaseDetailComp;




PurchaseDetailComp.defaultProps = {
    curSymbol:'',
}