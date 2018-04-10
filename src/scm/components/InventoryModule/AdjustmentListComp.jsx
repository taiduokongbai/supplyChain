import React, {Component} from 'react'
import {
    Form,
    Input,
    Col,
    Row,
    InputNumber,
    Button,
    Spin,
    Select,
    Checkbox,
    Pagination,
    Popconfirm,
    message
} from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import PurchaseListAct from '../../actions/InventoryModule/PurchaseListAct'
import Sidebar from '../../../base/components/SidebarWrapComp';
import TooltipComp from '../../../base/components/TooltipComp'

let Option = Select.Option;
let InputGroup = Input.Group;
let CheckboxGroup = Checkbox.Group;


let columns = [{
    title: '库存调整单号',
    dataIndex: 'adjustCode',
    key: 'adjustCode',
    width: 216,
}, {
    title: '所属仓库',
    dataIndex: 'warehouseName',
    key: 'warehouseName',
}, {
    title: '调整类型',
    dataIndex: 'adjustTypeName',
    key: 'adjustTypeName',
}, {
    title: '调整原因',
    dataIndex: 'adjustReason',
    key: 'adjustReason',
    render: (text, record, index) => <TooltipComp attr={{text: text, wid: 132}}/>
}, {
    title: '创建人',
    dataIndex: 'createByName',
    key: 'createByName',
}, {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 130,
    className: 'purchaselist-oeration'
},

];
let selectConditionData = [
    {
        keyCode: "adjustCode",
        value: "调整单号"
    },
    {
        keyCode: "warehouseName",
        value: "所属仓库"
    },
    {
        keyCode: "adjustTypeCode",
        value: "调整类型"
    },

];

class AdjustmentListComp extends Component {
    constructor(props, context) {
        super(props, context);
        columns[0].render = (txt, record, index) =>
            <a onClick={() => this.props.receiptDetails({
                adjustCode: record.adjustCode,
                adjustTypeCode: record.adjustTypeCode,
                id: record.id
            })} className="purchase-color-href">
                {record.adjustCode}
            </a>
        this.state = {
            keyCode: selectConditionData[0].keyCode,
            record: {},
            statusVal: "仓位移动",
        }
    }

    handleSelectChange = (value) => {
        this.props.form.resetFields();
        this.setState({
            keyCode: value,
        });
    }

    componentDidMount() {
        this.props.PurchaseList({page: 1, pageSize: 10});
        this.props.BusCodeList({billType: 4});
    }

    searchBar = () => {//查询按钮
        let searchVal = this.props.form.getFieldsValue();
        this.props.PurchaseList({page: 1, pageSize: this.props.newState.paging.pageSize, ...searchVal})
        this.props.takeBtnLoading()
    }
    tablePaging = (current) => {
        this.props.PurchaseList(typeof current == 'number' ? Object.assign(this.props.newState.search, {page: current}) : Object.assign(this.props.newState.search, current));
    }
    newCreate = () => {
        let {GetCodeRule, newCreate} = this.props;
        GetCodeRule().then(json => {
            if (json.status === 2000) {
                newCreate()
            }
        })
    }
    typeSelect = (val) => {
        this.setState({typeVal: val});
    }
    getInput = () => {
        let {getFieldDecorator} = this.props.form;
        switch (this.state.keyCode) {
            case "adjustCode":
                return <Input className="select-get-input" placeholder='请输入关键字搜索'
                              onPressEnter={() => this.searchBar()}/>;
            case "warehouseName":
                return <Input className="select-get-input" placeholder='请输入关键字搜索'
                              onPressEnter={() => this.searchBar()}/>;
            case "bpName":
                return <Input className="select-get-input" placeholder='请输入关键字搜索'
                              onPressEnter={() => this.searchBar()}/>;
            case "adjustTypeCode":
                return <span className="option_status">
                         {
                             getFieldDecorator("adjustTypeCode", {
                                 initialValue: this.props.newState.busCodeData[0].busCode ? this.props.newState.busCodeData[0].busCode : ''
                             })(
                                 <Select style={{width: 186, height: 30}} onChange={this.typeSelect}>
                                     {
                                         this.props.newState.busCodeData.map((option, index) => {
                                             return (<Option key={option.busCode + ""}
                                                             value={option.busCode + ""}>{option.busName}</Option>);
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

    render() {
        let {newState, tableLoading, tablePaging, ...props} = this.props;
        let selectConditionOptions = selectConditionData.map(conditionWay => <Option
            key={conditionWay.keyCode}>{conditionWay.value}</Option>)
        let {getFieldDecorator} = this.props.form;
        return (
            <div className="purchase-list-content">
                <div className="select-input-content">
                    <Select defaultValue={selectConditionData[0].value} onChange={this.handleSelectChange}
                            className="select-input">
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
                            <Button type="primary" onClick={this.searchBar} className="searchBar"
                                    loading={newState.btnLoading}><span
                                className="search-icon c2mfont c2m-search1"></span><span>查询</span></Button>
                        </Form.Item>
                    </Form>
                    <Button type="primary" className="newSet" onClick={this.newCreate}><span
                        className="newset-icon c2mfont c2m-jia"></span><span
                        className="newset-create">新建</span></Button>
                </div>
                <MTable
                    cols={columns}
                    rowKey={"id"}
                    dataSource={newState.dataSource}
                    loading={newState.tableLoading}
                    paging={newState.paging}
                    pageOnChange={this.tablePaging}
                    {...props}
                />
            </div>

        )
    }
}

export default Form.create()(AdjustmentListComp)



