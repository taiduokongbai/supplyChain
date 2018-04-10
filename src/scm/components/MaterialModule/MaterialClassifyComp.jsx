import React, { Component } from 'react'
import { Form, Input, Col, Row, InputNumber, Button, Spin, Select, Checkbox, Pagination, Popconfirm, message, Popover, Modal } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import { formatNullStr, shouldComponentUpdate } from "../../../base/consts/Utils";
import EditMaterialClassifyCont from '../../dialogconts/MaterialModule/EditMaterialClassifyCont';
import AddMaterialClassifyCont from '../../dialogconts/MaterialModule/AddMaterialClassifyCont'
let Option = Select.Option;
let InputGroup = Input.Group;
let CheckboxGroup = Checkbox.Group;

const columns = [
    {
        title: '物料分类名称',
        dataIndex: 'categoryName',
        key: 'categoryName',
        render: (text, record, index) => {
            return record.orderStatus == 2 ? <span style={{ color: '#d73435' }}>{record.categoryName}</span> : record.categoryName
        }
    }, {
        title: '物料分类编码',
        dataIndex: 'categoryCode',
        key: 'categoryCode',
        width: 190,
        fixed: 'right',
    }, {
        title: '分类层级',
        dataIndex: 'categoryLevel',
        key: 'categoryLevel',
        width: 149,
        fixed: 'right',
    }, {
        title: '允许物料使用',
        dataIndex: 'isUse',
        key: 'isUse',
        width: 176,
        fixed: 'right',
        render: (text, record, index) => record.isUse ? '是' : '否'
    }, {
        title: '状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width: 122,
        fixed: 'right',
        render: (text, record, index) => {
            if (record.orderStatus == 1) {
                return <span>已启用</span>
            } else if (record.orderStatus == 2) {
                return <span>已禁用</span>
            } else {
                return <span>已保存</span>
            }
        }
    }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 104,
        fixed: 'right',
        className: 'table-thead-center'
    },
]

let selectConditionData = [
    {
        keyCode: "categoryCode",
        value: "物料分类编码"
    },
    {
        keyCode: "categoryName",
        value: "物料分类名称"
    },
    {
        keyCode: "categoryLevel",
        value: "分类层级"
    },
    {
        keyCode: "orderStatus",
        value: "状态"
    },

];

class MaterialClassifyComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            keyCode: selectConditionData[0].keyCode,
            tableSrcoll: 1500,
            visible: false,
            details: {},
            statusSearch: 0,
            deleteIndex: null
        }
        columns[columns.length - 1].render = (text, record, index) => {
            return <div>
                <span className='c2mfont c2m-bianji iconstyle' onClick={() => this.editModalShow(record)} title='编辑'></span>
                {
                    record.orderStatus == 1 ? <span className='c2mfont c2m-jinyong iconstyle' title='禁用' onClick={() => this.updateOrderStatus(record, '禁用', 2)}></span> :
                        <Popconfirm
                            placement="topRight"
                            title="是否启用当前节点的所有子节点？"
                            okText="确定"
                            cancelText="取消"
                            visible={record.categoryCode == this.props.state.checkChildrenIndex}
                            onConfirm={() => this.onStartAll(record)}
                            onCancel={() => this.onStartSelf(record)}
                        >
                            <span className='c2mfont c2m-qiyong iconstyle' title='启用' onClick={() => this.checkChildren(record, '启用')}></span>
                        </Popconfirm>
                }
                {
                    record.orderStatus == 0 ? <Popconfirm
                        placement="topRight"
                        title="确认删除该数据么？"
                        okText="确定"
                        cancelText="取消"
                        //visible={record.categoryCode == this.state.deleteIndex}
                        onCancel={() => this.cancelDelete()}
                        onConfirm={() => this.onDelete(index, record.categoryCode)}
                    >
                        <span className='c2mfont c2m-shanchu iconstyle' title='删除'
                        ></span>
                    </Popconfirm> : <span className='no-icon'>--</span>
                }
            </div>
        }

        this.classify_options = [
            {
                key: 1,
                value: '一级'
            }, {
                key: 2,
                value: '二级'
            }, {
                key: 3,
                value: '三级'
            }, {
                key: 4,
                value: '四级'
            }, {
                key: 5,
                value: '五级'
            }, {
                key: -1,   // 要处理
                value: '全部'
            }
        ]

        columns[1].render = (text, record, index) => <span style={{ color: '#4C80CF', cursor: 'pointer' }} onClick={() => this.detailsModal(record)}>{record.categoryCode}</span>

        this.status_options = [
            {
                key: 3,
                value: '已保存'
            }, {
                key: 1,
                value: '已启用'
            }, {
                key: 2,
                value: '已禁用'
            }, {
                key: 4,
                value: '全部' // 要处理
            }
        ]
    }

    deleteConfirm = (index) => {
        this.setState({ deleteIndex: index });
        this.forceUpdate();
    }

    cancelDelete = () => {
        this.setState({ deleteIndex: null })
    }

    searchHandler = () => {
        let searchVal = this.props.form.getFieldsValue();
        this.props.expandedRowKeys([]);
        let { state } = this.props;
        searchVal.orderStatus ? (searchVal.orderStatus = searchVal.orderStatus == '3' ? 0 : (searchVal.orderStatus == '4' ? '' : searchVal.orderStatus * 1)) : null //状态处理
        searchVal.categoryLevel ? (searchVal.categoryLevel = searchVal.categoryLevel == '-1' ? '' : (searchVal.categoryLevel * 1)) : null  // 分类级别处理
        this.state.keyCode == 'orderStatus' ? delete searchVal.isHideDisable : (state.forbiddenStatus ? searchVal.isHideDisable = 1 : searchVal.isHideDisable = 0);
        if (this.props.getList && !state.detailsModalLoading) {
            this.props.getList(searchVal);
        }
    }

    editModalShow = (record) => {
        this.props.modalVisible(true);
        this.props.getMaterialDetail({ categoryCode: record.categoryCode })
    }

    addHandler = () => {
        this.props.addModalVisible(true);
    }

    updateOrderStatus = (val, str, status) => { // 禁用/启用
        this.props.updateOrderStatus({ categoryCode: val.categoryCode, orderStatus: status }, str)
    }

    checkChildren = (val, str) => { // 启用
        this.props.checkChildren({ categoryCode: val.categoryCode }, str)
    }

    onStartAll = (record) => {
        this.props.updateOrderStatus({ categoryCode: record.categoryCode, orderStatus: 1, isEnabledChild: 1 }, '启用')
        this.props.checkChildrenIndex(null)
    }

    onStartSelf = (record) => {
        this.props.updateOrderStatus({ categoryCode: record.categoryCode, orderStatus: 1, isEnabledChild: 0 }, '启用')
        this.props.checkChildrenIndex(null)
    }

    componentWillUnmount = () => {
        this.props.checkChildrenIndex(null);
        this.setState({ deleteIndex: null })
    }

    onDelete = (index, code) => {
        this.props.delete({ categoryCode: code }).then(json => {
            json.status === 2000 ? this.setState({ deleteIndex: null }) : null;
        })
    }

    handleSelectChange = (value) => {
        this.props.form.resetFields();
        value == 'orderStatus' ? this.setState({ statusSearch: 1 }) : this.setState({ statusSearch: 0 })
        this.setState({
            keyCode: value,
        });
    }

    forbiddenCheckbox = (e) => {
        this.props.forbiddenCheckbox(e.target.checked ? 1 : 0);
        let searchVal = this.props.form.getFieldsValue();
        delete searchVal.orderStatus;
        this.props.expandedRowKeys([]);
        searchVal.categoryLevel ? (searchVal.categoryLevel = searchVal.categoryLevel == '-1' ? '' : (searchVal.categoryLevel * 1)) : null  // 分类级别处理
        e.target.checked ? searchVal.isHideDisable = 1 : searchVal.isHideDisable = 0
        if (this.props.getList) {
            this.props.getList(searchVal);
        }
    }

    detailsModal = (record) => {
        this.setState({
            visible: true
        })
        const instantsidberwarpwrap = document.getElementsByClassName("details-modal-wrap");
        if (instantsidberwarpwrap.length > 0) {
            instantsidberwarpwrap[0].parentNode.firstChild.style.backgroundColor = 'rgba(255,255,255,0)';
        }
        this.props.getDetails({ categoryCode: record.categoryCode }).then(json => {
            this.setState({
                details: json.data,
            })
        })
    }

    modalTitle = () => {
        return <div className='details-modal-title'>
            <span className='details-categorycode'>{"物料编码：" + this.state.details.categoryCode}</span>
            <span className='details-orderStatus'>状态：
                {
                    this.statusHandler(this.state.details.orderStatus)
                }
            </span>
        </div>
    }

    statusHandler = (status) => {
        switch (status) {
            case 0:
                return <span style={{ color: "#4C80CF" }}>已保存</span>
                break;
            case 1:
                return <span style={{ color: "#417505" }}>已启用</span>
                break;
            case 2:
                return <span style={{ color: "#D0011B" }}>已禁用</span>
                break;
            default:
                break;
        }
    }

    modalClose = () => {
        this.setState({
            visible: false
        })
    }

    componentDidMount() {
        this.props.getList({ isHideDisable: 1 });
        this.props.forbiddenCheckbox(1);
        this.props.expandedRowKeys();   //表格收起层级初始化
    }

    deleteNullChildren = (data) => data.map((item, index) => {
        if (item.children && item.children.length < 1) {
            delete item.children;
        }
        if (item.children) this.deleteNullChildren(item.children);
    })

    getInput = () => {
        let { getFieldDecorator } = this.props.form;
        switch (this.state.keyCode) {
            case "categoryCode":
                return <Input placeholder='请输入关键字搜索' onPressEnter={() => this.searchHandler()} className="select-get-input" />;
            case "categoryName":
                return <Input placeholder='请输入关键字搜索' onPressEnter={() => this.searchHandler()} className="select-get-input" />;
            case "categoryLevel":
                return <span className="option_status">
                    {
                        getFieldDecorator("categoryLevel", {
                            initialValue: "1",
                        })(
                            <Select style={{ width: 200, height: 30 }}>
                                {
                                    this.classify_options.map((option, index) => {
                                        return <Option key={option.key + ""} value={option.key + ""} >{option.value}</Option>
                                    })
                                }
                            </Select>
                            )
                    }
                </span>
            case "orderStatus":
                return <span className="option_status">
                    {
                        getFieldDecorator("orderStatus", {
                            initialValue: "3",
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
                </span>
            default:
                return false;
        }
    }

    onExpand = (expanded, record) => {
        if (expanded) {
            this.props.addExpandedRow([record.categoryCode])
        } else {
            this.props.deleteExpandedRow(record.categoryCode)
        }
    }

    render() {
        let { state, ...props } = this.props;
        let selectConditionOptions = selectConditionData.map(conditionWay => <Option key={conditionWay.keyCode}>{conditionWay.value}</Option>)
        let { getFieldDecorator } = this.props.form;
        let { details } = this.state;
        this.deleteNullChildren(state.dataSource);
        return (
            <div>
                <div className="select-input-content">
                    <Select defaultValue={selectConditionData[0].value} onChange={this.handleSelectChange} className="select-input" >
                        {selectConditionOptions}
                    </Select>
                    <Form className="selectForm">
                        <Form.Item>
                            {
                                getFieldDecorator(this.state.keyCode, {
                                    initialValue: "",
                                })(
                                    this.getInput()
                                    )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={() => this.searchHandler()} className="searchBar" ><span className="search-icon c2mfont c2m-search1"></span><span>查询</span></Button>
                        </Form.Item>
                    </Form>
                    <Button type="primary" className="newSet" onClick={() => this.addHandler()}><span className="newset-icon c2mfont c2m-jia"></span><span className="newset-create">新建</span></Button>
                </div>
                <div className='forbidden-checkbox' style={{ display: this.state.statusSearch ? 'none' : 'block' }}>
                    <Checkbox onChange={(e) => this.forbiddenCheckbox(e)} checked={state.forbiddenStatus ? true : false}>隐藏禁用分类</Checkbox>
                </div>
                <MTable
                    cols={columns}
                    dataSource={state.dataSource}
                    rowKey={'categoryCode'}
                    scroll={{ x: 1583 }}
                    pagination={false}
                    loading={state.tableLoading}
                    expandedRowKeys={state.expandedRowKeys}
                    onExpand={this.onExpand}
                    className='material-classify-table'
                />
                {this.state.visible ?
                    <Modal
                        title={this.modalTitle()}
                        //visible={this.state.visible}
                        visible={true}
                        onCancel={() => this.modalClose()}
                        className="details-modal"
                        wrapClassName='details-modal-wrap'
                        footer={null}
                        maskClosable={false}
                    >
                        <Spin spinning={state.detailsModalLoading}>
                            <div>
                                <div className="details-body-info">
                                    <div className="details-body-info-left">
                                        <p><span>分类名称：</span>{formatNullStr(details.categoryName)}</p>
                                        <p><span>上级分类：</span>{formatNullStr(details.parentName)}</p>
                                        <p><span>是否允许使用：</span>{details.isUse == 1 ? '是' : '否'}</p>
                                    </div>
                                    <div className="details-body-info-right">
                                        <p><span>分类编码：</span>{formatNullStr(details.categoryCode)}</p>
                                        <p><span>分类层级：</span>{formatNullStr(details.categoryLevel)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='details-remarks'>
                                <p>备注：</p>
                                <p>{formatNullStr(details.remarks)}</p>
                            </div>
                        </Spin>
                    </Modal> : null}
                <EditMaterialClassifyCont />
                <AddMaterialClassifyCont />
            </div>
        );

    }
}

export default Form.create()(MaterialClassifyComp)