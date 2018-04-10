import React, {Component} from "react";
import {Table, InputNumber, Popconfirm, Form,message}from '../../../base/components/AntdComp';
import {OtherOutboundOrderAddTableStore} from "../stores/AddEditableTableStore";
import { materialPopStore, searchMaterialStore, materialChooseTableStore} from "../../OtherOutEditTable/stores/SelectAddTableStore";
import SelectAddTableComp from "../../OtherOutEditTable/comps/SelectAddTableComp";

import OperationsComp from '../../../base/mobxComps/OperationsComp';
let { observer } = mobxReact;

const FormItem = Form.Item;

@observer
export class OtherOutboundOrderAddEditableTableComp extends Component {

    tableStore = OtherOutboundOrderAddTableStore;

    constructor(props) {
        super(props);

        this.columns = [
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (txt, record, index) => window.ENUM.getEnum("outDetailStatus", record.status),
            }, {
                title: '物料编码',
                width: 200,
                dataIndex: 'materialCode',
                key: 'materialCode'
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName'
            },
            {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec'
            },
            {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel'
            },
            {
                title: '计划数量',
                dataIndex: 'planAmount',
                key: 'planAmount',
                width: 120,
                render: (text, record, index) => this.renderColumns(text, record, index),
            },
            {
                title: '库存单位',
                dataIndex: 'materialUnitName',
                key: 'materialUnitName'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right',
                width: 92,
                render: (text, record, index) => this.optColRender(text, record, index)
            }
        ];




    }

    optColRender = (txt, record, index) => {
        let opts = [];
        let boolean = this.tableStore.currentEditableKey == record[this.tableStore.rowKeyCoide];
        if(this.tableStore.currentEditableKey){

            if(boolean){
                opts = [
                    {
                        title: '确定',
                        show:true,
                        fun: (e) => this.handlerSave(e,record)
                    },
                    {
                        title: '取消',
                        show:true,
                        fun: (e) => this.handlerCancel(e,record)
                    }
                ]
            }

        }else {
            opts = [
                {
                    title: '编辑',
                    show: true,
                    fun: (e) => this.handlerEdit(e,record),
                },
                {
                    title: "删除",
                    titleText: ['确认要删除该明细项吗？'],
                    show: true,
                    fun: (e) => this.handlerDel(e,record),
                }
            ]

        }

        return <OperationsComp operations={opts} />;
    }

    renderColumns(text, record, index) {
        const {getFieldDecorator} = this.props.form;

        let boolean = this.tableStore.currentEditableKey == record[this.tableStore.rowKeyCoide];
        return boolean ? (
            <FormItem
            >
                {
                    getFieldDecorator(`planAmount`, {
                        initialValue: record.planAmount,
                        rules: [
                            {
                                required: true,
                                message: '必填!'
                            },
                            {
                                validator: (rule, value, callback)=>{
                                    if (!(value > 0)) {
                                        callback("输入值必须大于 0。")
                                    } else if(!(/^\d+(\.\d{1,2})?$/.test(value))){
                                        callback("保留小数点后两位")
                                    }else {
                                        callback()
                                    }
                                }
                            }
                        ],
                    })(
                        <InputNumber min={0}  precision={2}  />
                    )}
            </FormItem>
        ) : record.planAmount;
    }

    handlerDel=(e,record)=>{
        e.preventDefault();
        this.tableStore.del(record[this.tableStore.rowKeyCoide])
    }

    handlerCancel=(e,record)=>{
        e.preventDefault();
        this.tableStore.cancel(record[this.tableStore.rowKeyCoide])
    }

    handlerEdit=(e,record)=>{
        e.preventDefault();
        this.tableStore.edit(record[this.tableStore.rowKeyCoide]);
    }

    handlerSave =(e,record)=>{
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            const newRecord = JSON.parse(JSON.stringify(record));
            if (!err) {
                this.tableStore.save(record[this.tableStore.rowKeyCoide],{
                    ...newRecord,
                    ...values
                });
                // console.log('Received 111values of form: ', values);
            }
        });

    }


    handlerAddRow = (newRow)=>{
        if(!(this.tableStore.currentEditableKey) || this.tableStore.currentEditableKey  === null){
            materialPopStore.setVisible(true);
            materialChooseTableStore.fetchTableList();
        }else {
            message.warning('已有行处于编辑状态!');
        }
    }


    getSelectDialog = ()=>{
        return  <SelectAddTableComp/>;
    }
    render() {
        return (
            <div className="formInTable">
                <div className="other-out-information-table">
                    <div className="formInTable-right">
                        <h3 className="information-title">
                            明细信息
                        </h3>
                    </div>
                    <div className="formInTable-right">
                        <div>
                                    <span className="contactBtn formInTable-right-btn" type="primary" onClick={this.handlerAddRow}>
                                        <i className="c2mfont c2m-tianjia"></i>添加行
                                    </span>
                        </div>
                    </div>
                </div>
                <Table {...this.tableStore.Props} columns={this.columns} />
                {
                    this.getSelectDialog()
                }
            </div>
        );
    }
}

export default Form.create({withRef:true})(OtherOutboundOrderAddEditableTableComp);