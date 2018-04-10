import React, { Component, PropTypes } from "react";
import { Form, Input, Spin, Button, Modal, Row, Col, message} from '../../../base/components/AntdComp';
import ModalComp from '../../../base/components/ModalComp';
import EditableTableComp from '../../../base/components/EditableTableComp';
import SelectComp from '../../../base/components/SelectComp';
import TooltipComp from '../../../base/components/TooltipComp';

class TableComp extends EditableTableComp {
    constructor(props, context) {
        super(props, context);
        this.recordKey = 'id';
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                hidden: true
            },{
                title: '费用项',
                dataIndex: 'expenseCode',
                key: 'expenseCode',
                width: 160,
                obj: {
                    list: props.expenseTypeList,
                    keyName: 'priceCode',
                    labelName: 'priceName',
                    rules: [{ required: true, message: '费用项 必填！'}],
                },
            }, {
                title: '费用描述',
                dataIndex: 'expenseDetl',
                key: 'expenseDetl',
                obj: {
                    style: { width: 300 },
                    render: {
                        wid: 280
                    },
                    rules: [{ max: 200, message:'费用描述不能超过200字符！'}],
                },
                width: 330
            }, {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                obj:{
                    rules:[
                        {type:'gtEqZero',label:'金额',decimal:2}
                    ],
                    prefix: '￥',
                    render: (txt) => {
                        txt = Number(txt).toFixed(2);
                        return `￥${txt}`
                    }
                },
            },{
                title: '操作',
                dataIndex: 'operation',
                width: 92,
                className: 'operation-center'
            }
        ];

        this.columns[this.columns.length - 1].render = this.optColRender;
        this.columns.forEach((item) => {
            //input
            if (/^expenseDetl|amount$/i.test(item.dataIndex)) {
                item.render = this.inputColRender(item.dataIndex, item.obj);
            }
            //select
            if (/^expenseCode$/i.test(item.dataIndex)) {
                item.render = this.selectColRender(item.dataIndex, item.obj);
            }
        })
    }
    //点击添加
    addNewRow = () => {
        if (this.state.isEdit == null) {
            let newRow = Object.assign({}, this.getNewRow());
            this.data.splice(0, 0, newRow);
            this.editHandler(newRow);
        } else {
            message.warn("已有行处于编辑状态！")
        }
        this.forceUpdate();
    }
    //获取新行初始值
    getNewRow = () => {
        let id = -1;
        if (this.data[0] && this.data[0].id < 0) {
            id = this.data[0].id - 1;
        };
        return {
            "id": id,
            "expenseCode": "",
            "expenseDetl": "",
            "amount": "0.00",
        }
    }
    //点击保存
    saveHandler = (index) => {
        this.validateFds(["amount","expenseCode"],(err, data) => {
            if (!err) {
                let { current, pageSize } = this.state;
                if (current && current != 1) {
                    index = (current - 1) * pageSize + index;
                };
                this.handleSave(index);
                if (this.isEdit) {
                    Object.assign(this.data[index], this.record);
                    let expenseCodeList = this.data.map(item => item.expenseCode);
                    if ([...new Set(expenseCodeList)].length !== expenseCodeList.length) {
                        message.warn('不允许出现多行有相同的费用项，请检查！')
                    } else {
                        let expenseAmount = 0;
                        this.data.forEach(item => {
                            expenseAmount = expenseAmount + Number(item.amount);
                        })
                        this.props.onCountExpense(expenseAmount);
                        this.setState({ isEdit: null });
                    }
                    
                }
            }
        })
    }
    //点击取消
    cancelEdit = (index) => {
        let { current, pageSize } = this.state;
        let realIndex = index;
        if (current && current != 1) {
            realIndex = (current - 1) * pageSize + index;
        };
        if (this.isEdit) {
            let newData = JSON.parse(JSON.stringify(this.data));
            Object.assign(newData[realIndex], this.record);
            let expenseCodeList = newData.map(item => item.expenseCode);
            if ([...new Set(expenseCodeList)].length !== expenseCodeList.length) {
                if (index == 0 && this.data.length - 1 == realIndex) {
                    this.setState({ current: current - 1 });
                }
                this.data.splice(realIndex, 1);
            } 
        }
        this.setState({ isEdit: null});
    }
     //点击删除
     deleteRow = (index) => {
        let { current, pageSize } = this.state;
        let realIndex = index;
        if (current && current != 1) {
            realIndex = (current - 1) * pageSize + index;
            if (index == 0 && this.data.length - 1 == realIndex) {
                this.setState({ current: current - 1 });
            }
        };
        this.handleDel(realIndex);
        this.data.splice(realIndex, 1);
        let expenseAmount = 0;
        this.data.forEach(item => {
            expenseAmount = expenseAmount + Number(item.amount);
        })
        this.props.onCountExpense(expenseAmount); 
        this.forceUpdate();
    }
    componentWillMount() {
        // this.props.getExpenseList().then(list => {
        //     this.expenseCode = list;
        // })
        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource != this.data) {
            this.data = nextProps.dataSource;
        }
    }
}

let MTable = Form.create()(TableComp);

export default class PurExpenseDetailComp extends ModalComp {
    constructor(props, context) {
        super(props, context);
        const expenses = [].concat(JSON.parse(JSON.stringify(props.detail.expenses)));
        // console.log("expenses",expenses);
        this.state = {
            list: expenses,
            expenseAmount: props.expenseAmount||0,
        }
    }
    handleCancel = () => {
        this.props.ExpenseVisible(this.props.type, this.props.dtype, false);
        
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.list.length < 1) {
            message.warn('必须要有行记录！');
            return
        }
        let flag = false;
        Array.isArray(this.state.list) && this.state.list.map(item => {
            if(!item.expenseCode){
                flag = true;
            }
        })
        if(flag){
            message.warn('行记录数据不能为空！')
            return;
        }
        let expenseCodeList = this.state.list.map(item => item.expenseCode);
        if ([...new Set(expenseCodeList)].length !== expenseCodeList.length) {
            message.warn('不允许出现多行有相同的费用项，请检查！')
            return;
        }
        
        this.props.onCallBack(this.state.expenseAmount);
        this.props.detail.expenses = this.state.list;
        this.props.ExpenseVisible(this.props.type, this.props.dtype, false);
    }
    getComp = () => {
        let { materialDetail,detail } = this.props;
        let { list } = this.state;
        let dataSource = list || [];
        return (
            <div>
                <div className='purExpenseDetail-baseInfo'>
                <Row className='purExpenseDetail-title' >
                    <Col span={12}>
                        <div className='purExpenseDetail-ctitle'><span>物料编码：</span><TooltipComp attr={{ text: materialDetail.materialCode, wid: 210, placement: 'top' }} /></div>
                        <div className='purExpenseDetail-ctitle'><span>规格：</span><TooltipComp attr={{ text: materialDetail.materialSpec, wid: 210, placement: 'top' }} /></div>
                    </Col>
                    <Col span={12}>
                        <div className='purExpenseDetail-ctitle'><span>物料名称：</span><TooltipComp attr={{ text: materialDetail.materialName, wid: 210, placement: 'top' }} /></div>  
                        <div className='purExpenseDetail-ctitle'><span>型号：</span><TooltipComp attr={{ text: materialDetail.materialModel, wid: 210, placement: 'top' }} /></div>
                    </Col>
                </Row>
                </div>         
                <div className='purExpenseDetail-table'>
                <MTable
                        {...this.props}
                        dataSource={dataSource}
                        rowKey={"id"}
                        addBtn="添加行"
                        style={{ marginTop: 10 }}
                        pagination={false}
                        footer={() => <div>合计：<span>￥{Number(this.state.expenseAmount).toFixed(2)}</span></div>}
                        onCountExpense={(data) => this.setState({expenseAmount:data})}
                />
                </div>    
            </div>
        )
    }
    
}