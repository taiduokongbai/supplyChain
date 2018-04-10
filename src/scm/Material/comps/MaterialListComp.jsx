import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect } from '../../../base/components/AntdComp';
import OptionComp from './OptionComp';
import TooltipComp from "../../../base/components/TooltipComp";
//redux的store 和 tab标签页action
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
let Option = Select.Option;
//物料列表和搜索store
import { materialListStore, searchBarStore, materialTypeStore } from '../stores/MaterialListStore'
import { materialEditStore, measurestoreSize, measurestoreBase, measurestoreVolume, measurestoreWeight } from '../stores/MaterialEditStore';

import { materialAddStore } from '../stores/MaterialAddStore';
import { materialDetailStore, materialDetailFJStore, materialDetailDWListStore } from '../stores/MaterialDetailStore';
import ImportStorageAct from "../../actions/InventoryModule/ImportStorageAct";
import MaterialAct from '../../actions/MaterialModule/MaterialAct';
import ImportMaterialDialogComp from './ImportMaterialDialogComp';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

let selectData = [
    {
        keyCode: "materialCode",
        value: "物料编码"
    }, {
        keyCode: "simpleCode",
        value: "简码"
    }, {
        keyCode: "materialName",
        value: "物料名称"
    }, {
        keyCode: "status",
        value: "状态"
    }, {
        keyCode: "materialSpec",
        value: "规格"
    }, {
        keyCode: "categoryCode",
        value: "物料分类"
    }

];
@observer
class MaterialListComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            keyCode: selectData[0].keyCode,
            value: undefined,
        }
        this.columns = [
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width: 150,
                render: (text, record) => (<a onClick={() => this.materialrDetail(record.materialCode)}>{text}</a>)
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 150,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 166, placement: 'left' }} />
            }, {
                title: '简码',
                dataIndex: 'simpleCode',
                key: 'simpleCode',
                width: 150,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '物料分类',
                dataIndex: 'categoryName',
                key: 'categoryName',
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                width: 150,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '型号',
                dataIndex: 'model',
                key: 'model',
                width: 150,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record, index) => window.ENUM.getEnum("status", text.toString()),
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
                    let materialCode = record.materialCode;
                    let _this = this
                    function onEdit() {
                        materialTypeStore.fetchSelectList();
                        store.dispatch(TabsAct.TabAdd({
                            title: "编辑物料",
                            key: "editMaterial"
                        }));
                        materialEditStore.fetchMaterialDetail({ materialCode }).then(() => {
                            measurestoreBase.initData();
                            measurestoreVolume.initData();
                            measurestoreSize.initData();
                            measurestoreWeight.initData();
                        });
                    }
                    function onDetele() {
                        materialListStore.fetchMatrialDetele({ materialCode }).then(json => {
                            if (json.status === 2000) {
                                message.success('删除成功!');
                            }
                        })
                    }
                    let opts = [
                        {
                            title: '编辑',
                            fun: onEdit,
                            show: true,
                        },
                        {
                            title: "删除",
                            titleText: ["确定删除该条数据吗？", "删除后，该条数据记录将不可恢复！"],
                            fun: onDetele,
                            show: record.status == 0,
                        }];
                    return <OptionComp operations={opts} />;
                }

            }
        ];
        this.status_options = [
            {
                key: "0",
                value: "已保存"
            }, {
                key: "1",
                value: "已启用"
            }, {
                key: "2",
                value: "已禁用"
            },{
                key: "-1",
                value: "全部"
            }
        ];
    }
    componentDidMount() {
        materialTypeStore.fetchSelectList();
        materialListStore.fetchTableList({ page: 1, pageSize: 15 });
        // this.onSearch();
    }
    onSearch = () => {
        materialListStore.fetchTableList();
    }
    handleSelectChange = (value) => {
        this.props.form.resetFields();
        this.setState({
            keyCode: value,
        });
    }
    onChange = (value) => {
        this.setState({ value });
    }
    getSelectType = () => {
        let { getFieldDecorator } = this.props.form;
        switch (this.state.keyCode) {
            case "materialCode":
                return <Input placeholder='请输入关键字搜索' onPressEnter={() => this.searchMaterial()} className="select-get-input" />;
                break;
            case "materialName":
                return <Input placeholder='请输入关键字搜索' onPressEnter={() => this.searchMaterial()} className="select-get-input" />;
                break;
            case "simpleCode":
                return <Input placeholder='请输入关键字搜索' className="select-get-input" />;
                break;
            case "status":
                return <span className="option_status">
                    {
                        getFieldDecorator("status", {
                            initialValue: "0",
                        })(
                            <Select style={{ width: 200, height: 30 }}>
                                {
                                    this.status_options.map((option, index) => {
                                        return <Option key={option.key + ""} value={option.key + ""} >{option.value}</Option>
                                    })
                                }
                            </Select>
                            )
                    }
                </span>;
                break;
            case "materialSpec":
                return <Input placeholder='请输入关键字搜索' onPressEnter={() => this.searchMaterial()} className="select-get-input" />;
                break;
            case "categoryCode":
                return <Input placeholder='请输入关键字搜索' onPressEnter={() => this.searchMaterial()} className="select-get-input" />;
                // return <span className="option_status">
                //     {
                //         getFieldDecorator("categoryCode", {
                //             initialValue: "",
                //         })(
                //             <TreeSelect
                //                 {...materialTypeStore.Props}
                //                 width={300}
                //                 onChange={this.onChange}
                //             >
                //             </TreeSelect>
                //             )
                //     }
                // </span>;
                break;
            default:
                return false;
        }
    }
    searchMaterial = () => {
        let searchVal = this.props.form.getFieldsValue();
        if (searchVal.categoryCode) {
            searchVal.categoryName = searchVal.categoryCode;
        }
        materialListStore.fetchTableList(searchVal);
    }
    materialrDetail = (materialCode) => {
        materialDetailStore.fetchMaterialDetail({ materialCode }).then(() => {
            materialDetailDWListStore.fetchSelectList({ materialCode });
        });
        materialDetailFJStore.fetchTableList({ materialCode })
        store.dispatch(TabsAct.TabAdd({
            title: "物料详情",
            key: "detailMaterial"
        }));
    }
    onAdd = () => {
        materialListStore.isAuto().then(json=>{
            if(json.data.businessStatus ===1){
                materialTypeStore.fetchSelectList();
                materialDetailFJStore.fileList = []
                store.dispatch(TabsAct.TabAdd({
                    title: "新建物料",
                    key: "addMaterial"
                }));
            }else{
                // message.error('物料编码未启用')
            }
        })
        materialAddStore.fetchMaterialDefaultMeasure({ standard: 0 });
    }
    onImport = () => {
        store.dispatch(MaterialAct.ImportViewVisiable(true));
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
                            <Button type="primary" onClick={() => this.searchMaterial()} className="searchBar" ><span className="search-icon c2mfont c2m-search1"></span><span>查询</span></Button>
                        </Form.Item>
                    </Form>
                    <Button type="primary" onClick={() => this.onAdd()} className="addBtn"><span className="newset-icon c2mfont c2m-jia"></span><span className="newset-create">新建</span></Button>
                    {/*<Button type="primary" onClick={() => this.onImport()} className="newSet"><span className="newset-icon c2mfont c2m-daoru_nor"></span><span className="newset-create">导入</span></Button>*/}
                </div>
                <Table
                    {...materialListStore.Props}
                    rowKey='materialCode'
                    columns={this.columns}
                />
                <ImportMaterialDialogComp callBack={(json) => { this.onSearch(); }} />
            </div>
        )
    }
}
export default Form.create()(MaterialListComp);