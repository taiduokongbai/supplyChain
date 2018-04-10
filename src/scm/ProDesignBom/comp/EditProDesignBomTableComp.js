import React, { Component } from "react";
import { Table, Button, Popconfirm, message, Radio, Select, Form } from '../../../base/components/AntdComp';
import { TableEditComp } from '../../../base/mobxComps/TableEditComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import { enumStore } from '../../../base/stores/EnumStore';
import { formatNullStr } from '../../../base/consts/Utils';
import TooltipComp from "../../../base/mobxComps/TooltipComp";
import {editProDesignBomTableStore} from "../store/AddProDesignBomStore";
let { observer } = mobxReact;
const FormItem = Form.Item;

class MyTableEditComp extends TableEditComp{
    constructor(props, context) {
        super(props, context);
        this.columns[this.columns.length-1].render = this.optColRender;
    }
    
    //操作列使用的Render
    optColRender = (txt, record, index) => {
        let { editingRecord, editingIndex, recordKey, disableds,
            handleSave, onCancel, onEdit, onDelete, displayBtn
        } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        let opts = [
            {
                title: '确定',
                fun: () => this.validateFds((err, data) => {
                    if (!err) {
                        handleSave();
                    }
                }),
                show:displayBtn && show,
            },
            {
                title: '取消',
                fun: () => onCancel(),
                show:displayBtn && show,
            },
            {
                title: '编辑',
                fun: () => onEdit(record, index),
                show: editingIndex == null && displayBtn,
            },
        ];
        return <OperationsComp operations={opts} />;
    }
}

const options = {
    onValuesChange(props, values) {
        props.setEditingRecord(values)
    }
};
let MyTableEditCont = Form.create(options)(MyTableEditComp);


@observer
export default class EditProDesignBomTableComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = editProDesignBomTableStore;
        this.columns = [
             {
                title: '导入类型',
                dataIndex: 'importTypeName',
                key: 'importTypeName', 
                width:100,
                fixed:'left',
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width:145,
                fixed:'left',
                obj:{
                    render: (text, record, index) =>{
                        /*if(record.syncFlag=="2"){
                            return (
                                <div style={{color:"#F04134"}}>
                                    <i title={record.errorCause||""} className="c2mfont c2m-wuliaobianmachongtu" style={{fontSize:'14px',marginRight:'4px'}}></i>
                                    {text}
                                </div>
                            )
                            
                        }*/
                        // else if(record.syncFlag=="4"){
                        //     return (
                        //         <div>
                        //              <i title={record.errorCause||""} className="c2mfont c2m-wuliaobianmachongtu" style={{fontSize:'14px',marginRight:'4px',color:"#F04134"}}></i>
                        //             {text}
                        //         </div>
                        //     )
                        // }
                        //else{
                            return text
                        //}
                    },
                    rules:[
                        {required: true,message: '物料编码必填'},
                        {max: 20,message: '物料编码不能超过20字符'},
                        {type:'numLetterList',label:'物料编码'}
                    ]
                },
                
            },{
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName', 
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 140, placement: 'top' }} />,
                fixed:'left',
            },{
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec', 
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 80, placement: 'top' }} />,
            },{
                title: '型号',
                dataIndex: 'materialModel',
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 88, placement: 'top' }} />,
                key: 'materialModel', 
            },{
                title: '材料',
                dataIndex: 'materialTexture',
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 88, placement: 'top' }} />,
                key: 'materialTexture', 
            },{
                title: '物料分类',
                dataIndex: 'materialCategoryName',
                key: 'materialCategoryName', 
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 88, placement: 'top' }} />,
            },{
                title: '代号',
                dataIndex: 'gbCode',
                key: 'gbCode', 
            },{
                title: '品牌',
                dataIndex: 'materialBrand',
                key: 'materialBrand', 
            }, {
                title: '单位用量',
                dataIndex: 'stdQty',
                key: 'stdQty', 
            },{
                title: '计量单位',
                dataIndex: 'stdUnitName',
                key: 'stdUnitName', 
            },{
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks', 
            },{
                title: '',
                dataIndex: '',
                key: '', 
            }
        ];

    }

    render() {
        let props = this.store.Props;
        return (
            <div className='saleNotice-table'>
                <MyTableEditCont
                    {...props}
                    rowKey={record => record.id}
                    columns={this.columns}
                    // pagination={false}
                   // title={this.title}
                    scroll={{ x: 2000 }}
                />
            </div>
        );
    }
}
