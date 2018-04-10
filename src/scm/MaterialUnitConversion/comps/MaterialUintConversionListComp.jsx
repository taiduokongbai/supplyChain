import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect } from '../../../base/components/AntdComp';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import OptionComp from './OptionComp';
import { enumStore } from '../../../base/stores/EnumStore';
import TooltipComp from "../../../base/components/TooltipComp";
//redux的store 和 tab标签页action
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
//物料单位换算列表和搜索store
import { materialUintConversionListStore, addMaterialUintConversionStore, editMaterialUintConversionStore } from '../stores/MaterialUintConversionListStore'
import AddMaterialUintConversionComp from './AddMaterialUintConversionComp';
import EditMaterialUintConversionComp from './EditMaterialUintConversionComp';
// import {addMaterialUintConversionStore} from '../stores/AddMaterialUintConversionStore';
let Option = Select.Option;
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
let selectData = [
    {
        keyCode: "materialCode",
        value: "物料编码"
    }, {
        keyCode: "materialName",
        value: "物料名称"
    }
];
@observer
class MaterialUintConversionListComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            keyCode: selectData[0].keyCode,
            value: undefined,
        }
        this.store = materialUintConversionListStore;
        this.editMaterialUintConversionStore = editMaterialUintConversionStore;
        this.addMaterialUintConversionStore = addMaterialUintConversionStore;
        this.columns = [
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width: 169,
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 166,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 166, placement: 'left' }} />
            }, {
                title: '业务数量',
                dataIndex: 'businessNumber',
                key: 'businessNumber',
            }, {
                title: '业务单位',
                dataIndex: 'businessUnitName',
                key: 'businessUnitName',
            }, {
                title: '基本数量',
                dataIndex: 'measureNumber',
                key: 'measureNumber',
            }, {
                title: '基本单位',
                dataIndex: 'measureUnitName',
                key: 'measureUnitName',
            }, {
                title: '更新人',
                dataIndex: 'updateByName',
                key: 'updateByName',
            }, {
                title: '更新时间',
                dataIndex: 'updateDate',
                key: 'updateDate',
            }, {
                dataIndex: 'handle',
                title: '操作',
                className: 'operate-center',
                width: 80,
                fixed:'right',
                render: (txt, record, index) => {

                    let opts = [
                        {
                            title: '编辑',
                            show: true,
                            fun: () => this.onEdit(record, index),
                        },
                        {
                            title: "删除",
                            titleText: ["确定删除该条数据吗？", "删除后，该条数据记录将不可恢复！"],
                            fun: () => this.onDetele(record),
                            show: true,
                        }];
                    return <OptionComp operations={opts} />;
                }

            }
        ];
    }
    componentDidMount() {
        this.store.fetchTableList({ page: 1, pageSize: 15 });
    }
    onSearch = () => {
        this.store.fetchTableList();
    }
    searchMaterialUintConversion = () => {
        let searchVal = this.props.form.getFieldsValue();
        this.store.fetchTableList(searchVal);
    }
    handleSelectChange = (value) => {
        this.props.form.resetFields();
        this.setState({
            keyCode: value,
        });
    }
    getSelectType = () => {
        let { getFieldDecorator } = this.props.form;
        switch (this.state.keyCode) {
            case "materialCode":
                return <Input placeholder='请输入关键字搜索' onPressEnter={() => this.searchMaterialUintConversion()} className="select-get-input" />;
                break;
            case "materialName":
                return <Input placeholder='请输入关键字搜索' onPressEnter={() => this.searchMaterialUintConversion()} className="select-get-input" />;
                break;
        }
    }
    onAdd = () => {
        this.addMaterialUintConversionStore.setVisible(true);
    }
    onEdit = (record, index) => {
        this.editMaterialUintConversionStore.setVisible(true);
        this.editMaterialUintConversionStore.setMaterialUintConversionDetail(record);
        this.store.setEditingIndex(index);
    }
    onDetele = (record) => {
        let id = record.id;
        this.store.fetchMatrialUintConversionDetele({ id }).then(json => {
            if (json.status === 2000) {
                message.success('删除成功!');
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        let selectOptions = selectData.map(Item => <Option key={Item.keyCode}>{Item.value}</Option>)
        return (
            <div className="material-glg">
                <div className="select-input-content">
                    <Select defaultValue={selectData[0].value} onChange={this.handleSelectChange} className="select-input" >
                        {selectOptions}
                    </Select>
                    <Form className="selectForm">
                        <Form.Item>
                            {
                                getFieldDecorator(this.state.keyCode, {
                                    initialValue: "",
                                })(
                                    this.getSelectType()
                                    )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={() => this.searchMaterialUintConversion()} className="searchBar" ><span className="search-icon c2mfont c2m-search1"></span><span>查询</span></Button>
                        </Form.Item>
                    </Form>
                    <Button type="primary" onClick={() => this.onAdd()} className="newSet"><span className="newset-icon c2mfont c2m-jia"></span><span className="newset-create">新建</span></Button>
                </div>
                <Table
                    {...this.store.Props}
                    rowKey='id'
                    columns={this.columns}
                />
                <AddMaterialUintConversionComp />
                <EditMaterialUintConversionComp />
            </div>
        )
    }
}
export default Form.create()(MaterialUintConversionListComp);