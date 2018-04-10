import { Button, Select, Row, Col, Form, Popconfirm, Spin, message } from 'antd';
import React, { Component } from 'react';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import ImportPopComp from './ImportPopComp';
import {TableEditComp} from '../../../base/mobxComps/TableEditComp';
import FormComp from '../../../base/mobxComps/FormComp';
import { deignTypeStore,  popStore, importTableStore,importTypeStore } from '../store/ImportProDesignBomStore';
import { addProDesignBomStore,designTypeStore,editProDesignBomTableStore,importAddTypeStore ,productCategoryStore} from "../store/AddProDesignBomStore";
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import {prefixPub} from '../../../base/consts/UrlsConfig'
let { observable, action, computed, runInAction, toJS } = mobx,
    { observer } = mobxReact;

let Option = Select.Option,
    FormItem = Form.Item,
    formItemLayout = {
        labelCol: {span: 1},
        wrapperCol: {span: 23}
    };

@observer
class ImportProDesignBom extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: '导入类型',
                dataIndex: 'importTypeName',
                obj: {
                    selectStore: importTypeStore
                }
            }, {
                title: '导入文件',
                dataIndex: 'importFilename',
            }, {
                title: '导入结果',
                dataIndex: 'importResult',
                obj: {
                    render: (text) => {
                        return <div>成功导入 <span style={{"color": "#F6A623", "fontSize": "16px", "fontWeight": "bold"}}>{text}</span> 行数据</div>;
                    }
                }
            }, {
                title: '执行状态',
                dataIndex: 'importStatus',
                obj: {
                    render:(text,record) => {
                        return text ?
                            <span style={{"color": "#417505"}}>导入成功</span>
                            :
                            <span style={{"color": "#F04134"}}>
                                导入失败{record.fileURL?<a  href={prefixPub+"/common/downloadFile?fileUrl="+ record.fileURL +"&fileName="+record.importFilename}
                                        className="c2mfont c2m-xiazaicuowubaogao" style={{"color": "#F04134", "paddingLeft":"8px"}}></a>:''}
                            </span>
                    }
                }
            }, {
                title: '导入时间',
                dataIndex: 'importTime',
            }, {
                title: '操作人',
                dataIndex: 'importEmplName',
            }, {
                title: '操作',
                dataIndex: 'operate',
               //  render: (txt, record, index) => {
               //      let opts = [
               //          {
               //              title: "导入",
               //              // titleText: ['确定要删除该数据吗？'],
               //              fun: () => this.validateFds((err, data) => {
               //                  if (!err) {
               //                      this.setVisible(true)
               //                  }
               //              }),
               //              show:  record.status == 0,
               //          },{
               //              title: "删除",
               //              titleText: ['确定要删除该数据吗？'],
               //              fun: () => console.log(123),
               //              show:  record.status == 0,
               //          },
               //      ];
               //      return <OperationsComp operations={opts}/>;
               // }
           }
       ];
    };
    componentDidMount(){
        importTableStore.setSpin(true);
        Promise.all([
            deignTypeStore.fetchSelectList({ subCode: ["C022"]}),
            importTypeStore.fetchSelectList({status: 1}),
        ]).then(values => {
            importTableStore.setSpin(false);
        }, reason => {
            importTableStore.setSpin(false);
        });
        importTableStore.setVisible('disPopconfirm',false);
        importTableStore.setVisible('condition',true);
        importTableStore.setVisible('disablledBtn',true);
        importTableStore.clear();
        importTableStore.clearImportExcel();
        importTableStore.setEditRecord();
        importTableStore.setIds();
    }

    nextNewBom = () =>{
       designTypeStore.fetchDesignType({ "subCode": ["C022"]});//设计类型
       editProDesignBomTableStore.fetchTableList(importTableStore.Ids);
       productCategoryStore.fetchCombBoxList({orderStatus:1});//导入类型--产品分类
       addProDesignBomStore.getBomDetail({id:importTableStore.Ids.productId})//新建产品BOM时候获取产品信息
       importAddTypeStore.fetchSelectList({orderStatus:1});//导入类型一级
       store.dispatch(TabsAct.TabRemove("importProDesignBom", "addProDesignBom"));
       store.dispatch(TabsAct.TabAdd({
            title: "新建产品设计BOM",
            key: "addProDesignBom",
            tag: {Ids:importTableStore.Ids}
        }));
   };

    cancel = () => {
        importTableStore.setVisible('disPopconfirm',false);
    };

    handleVisibleChange = (visible) => {
        if (importTableStore.condition) {
            this.nextNewBom();
        } else {
            importTableStore.setVisible('disPopconfirm',visible);
        }
    };

    render() {
        return (
            <div>
                <Spin spinning={importTableStore.spinLoading}>
                    <div className="one-step">
                        <Row className="top">
                            <Col span={23}>
                                <Form>
                                    <FormItem label="设计类型：" {...formItemLayout}>
                                        {this.getFD('designTypeCode',{
                                                initialValue: deignTypeStore.designLabel
                                            }
                                        )(
                                            <Select style={{"width":"200px"}}>
                                                {deignTypeStore.options}
                                            </Select>
                                        )
                                        }
                                    </FormItem>
                                </Form>
                            </Col>
                            <Col span={1}>
                                <Popconfirm  title="导入数据还不完备，您确定还要继续吗?"
                                             onConfirm={this.nextNewBom}
                                             onCancel={this.cancel}
                                             okText="确定"
                                             cancelText="取消"
                                             onVisibleChange={this.handleVisibleChange }
                                             visible={importTableStore.disPopconfirm}>
                                    <Button type="primary" disabled={importTableStore.disablledBtn} style={{width:70,height:28,background:"#4c80cf"}} >下一步 ></Button>
                                </Popconfirm>
                            </Col>
                        </Row>
                        <SelfTableEditComp className="table"
                                           {...importTableStore.Props}
                                           columns={this.columns}
                                           rowKey="id"
                                           pagination={false}/>
                        <span className="add" href='#' onClick={importTableStore.onAdd}>
                        <i className='c2mfont c2m-tianjia' />
                        添加行
                        </span>
                        {<ImportPopComp />}
                    </div>
                </Spin>
            </div>
        )
    }
}

@observer
class SelfTableEdit extends TableEditComp {
    constructor(props) {
        super(props);
        this.columns = props.columns;
        this.columns.forEach((item) => {
            if (props.disableds.includes(item.dataIndex)) {
                item.render = this.textColRender(item.dataIndex, item.obj);
            } else if (props.inputCell.includes(item.dataIndex)) {
                item.render = this.inputColRender(item.dataIndex, item.obj);
            } else if (props.inputNumberCell.includes(item.dataIndex)) {
                item.render = this.inputNumberColRender(item.dataIndex, item.obj);
            } else if (props.selectCell.includes(item.dataIndex)) {
                item.render = this.selectColRender(item.dataIndex, item.obj);
            } else if (props.autoCompleteCell.includes(item.dataIndex)) {
                item.render = this.autoCompleteColRender(item.dataIndex, item.obj);
            } else if (props.radioCell.includes(item.dataIndex)) {
                item.render = this.radioColRender(item.dataIndex, item.obj);
            } else if (props.datePickerCell.includes(item.dataIndex)) {
                item.render = this.datePickerColRender(item.dataIndex, item.obj);
            } else {
                item.render = this.textColRender(item.dataIndex, item.obj);
            }

        });
        this.columns[this.columns.length - 1].render = this.optColRender;
    };

    //下拉列表类型的列使用的Render
    selectColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, selectStore, enumCode, onChange, ...selectProps } = obj;
        let { editingRecord, recordKey,initRecord } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        if (show) {
            let changeEvent = (value) => {
                if (onChange) {
                    this.setFdv(onChange(value));
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex, {
                            initialValue: String(editingRecord[dataIndex]) || String(initRecord.importTypeCode),
                            rules: rules || [],
                            onChange: changeEvent,
                        })(
                            <Select
                                onSelect={(value,option) => {
                                    importTableStore.setEditingRecord({importTypeCode:option.props.children});
                                }}
                                style={{ width: 100 }}
                                {...selectProps}
                            >
                                {
                                    enumCode ?
                                        enumStore.getOptions(enumCode)
                                        : (selectStore && selectStore.options)
                                }
                            </Select>
                        )}
                    </FormItem>
                </div>
            )
        } else {
            text = enumCode ? enumStore.getEnum(enumCode, text) : selectStore.getLabelName(text);
            return <div style={textStyle}>{text}</div>
        }
    };

    //操作列使用的Render
    optColRender = (txt, record, index) => {
        let { editingRecord, editingIndex, recordKey, disableds,
            handleSave, onCancel, onEdit, onDelete
        } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        let opts = [
            record.id != editingRecord.id ?
                {
                    title: '--',
                    // fun: () => popStore.setVisible(true,record),
                    show: true
                }:
                {
                    title: '导入',
                    fun: () => this.importPop(record),
                    show: true,
                },
            {
                title: "删除",
                titleText: ['确认要删除该明细项吗？'],
                fun: () => onDelete(index),
                show: true,
            },
        ];
        return <OperationsComp operations={opts} />;
    };

    importPop = (record) => {
        // if(deignTypeStore.designLabel == ''){
        //     message.warn('设计类型不能为空');
        // } else
            if(this.props.editingRecord.importTypeName == ''){
            message.warn('导入类型不能为空');
        } else {
            let list = importTableStore.dataSource.slice();
            if(list.some((item,index) => {
                    if(index != (list.length-1)){
                        return item.importTypeCode == this.props.editingRecord.importTypeName;
                    }
                })){
                message.warn('导入类型不能相同');
            } else {
                popStore.setVisible(true,record);
            }
        }

    }
}

let options = {
        onValuesChange(props, values) {
            props.setEditingRecord(values)
        }
    },
    importOptions = {
        onValuesChange(props, values) {
            if('designTypeCode' in values){
                deignTypeStore.setDefaultLabel(values.designTypeCode);
            }
        }
    },
    SelfTableEditComp =  Form.create(options)(SelfTableEdit),
    ImportProDesignBomComp =  Form.create(importOptions)(ImportProDesignBom);
export default ImportProDesignBomComp;