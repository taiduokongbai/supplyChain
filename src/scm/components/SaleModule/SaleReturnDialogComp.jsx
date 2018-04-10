import React, { Component } from 'react';
import { Form, Input, Spin, Select, Button, Modal, Col, Row, message } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';

let Search = Input.Search;
let FormItem = Form.Item;

let columns = [{
    title: '行号',
    dataIndex: 'id',
    key: 'id',
    hidden: true,
}, {
    title: '销售订单编码',
    dataIndex: 'saleOrderCode',
    key: 'saleOrderCode',
}, {
    title: '订单行号',
    dataIndex: 'lineNum',
    key: 'lineNum',
}, {
    title: '物料编码',
    dataIndex: 'materialCode',
    key: 'materialCode',
}, {
    title: '可退货数量',
    dataIndex: 'canRetNum',
    key: 'canRetNum',
}, {
    title: '客户名称',
    dataIndex: 'customerName',
    key: 'customerName',
}, {
    title: '物料名称',
    dataIndex: 'materialName',
    key: 'materialName',
}];

class SaleReturnDialogComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.searchPm = { saleOrderCode: '', materialCode: '', customerName: '',  page: 1, pageSize: 20 };
        this.inputValue = { materialCode: '', customerName: '' };
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            list: props.list || [],
            searchKey: 'materialCode',
            searchValue: ''
        };

    }
    handleSubmit = (e) => {

        let { selectedRows } = this.state;
        let { handleSubmit, handleCancel } = this.props;
        selectedRows.map(item => {
            item.lineNum = '';
        })
        handleSubmit(selectedRows);
        handleCancel(this.props.type)
    }
    handleCancel = (e) => {
        if (!this.props.saleReturnDetailLoading) {
            this.props.handleCancel && this.props.handleCancel(this.props.type);
        }
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    }
    componentWillMount() {
        this.props.SaleOrderDetailList(this.props[this.props.type].saleOrderDetail.saleDetails, this.props.type);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.list != this.state.list) {
            this.setState({ list: nextProps.list });
        }
    }

    onChange = (val) => {
        this.setState({ searchKey: val, searchValue: '' });
    }

    // 翻页
    tablePaging = (page) => {
        const { saleReturnDetailLoading, OriginalOrderList, saleOrderCode } = this.props;
        if (!saleReturnDetailLoading) {
            if (typeof page === "number") {
                this.searchPm.page = page;
            } else {
                this.searchPm = {...this.searchPm, ...page};
            }
            this.searchPm.saleOrderCode = saleOrderCode;
            OriginalOrderList(this.searchPm);
        }
    };


    onSearch = (val) => {
        let searchKey = this.state.searchKey, type = this.props.type;
        this.searchPm = Object.assign({}, this.inputValue, val);
        if(!this.props.saleReturnDetailLoading) {
            this.searchPm = {...this.searchPm, page: 1};
            this.tablePaging();
        }

    }
    query = () => {
        let searchKey = this.state.searchKey;
        this.onSearch({[searchKey]:this.state.searchValue})
    }

     onSearchChange = (e) => {
        this.setState({ searchValue: e.target.value });
    }

    dialog = () => {
        let { tablePaging, type, saleReturnDetailLoading, originalOrderSource, ...props } = this.props;
        let saleOrder = [];
   
        let list = this.state.list.map(item => item.saleOrderLineNum);
    

        if(Array.isArray(originalOrderSource)) {
            originalOrderSource.forEach((item, index) => {
                let i = 1;
                
                if (!list.includes(item.lineNum)) {
                    let obj = {};
                    for(let key in item){
                        if(key != 'list') {
                            obj[key] = item[key];
                        }
                    }
                    let saleLineNum = obj['lineNum'];
                    obj['id'] =  obj['detailId'];
                    obj['saleOrderLineNum'] = saleLineNum;
                    obj['returnNum'] = Number(obj['canRetNum'].replace(/,/,''));
                    obj['canRetNum'] = Number(obj['canRetNum'].replace(/,/,''));
                    obj['taxRate'] = Number(obj['taxRate']).toFixed(2);
                    obj['unitPrice'] = Number(obj['unitPrice']).toFixed(2);
                    obj['amount'] = Number(obj['returnNum'] * obj['unitPrice']).toFixed(2);
                    obj['tax'] = Number(obj['returnNum'] * (obj['taxRate']/100) * obj['unitPrice']).toFixed(2);
                    obj['totalAmount'] = (Number(obj['amount']) + Number(obj['tax'])).toFixed(2);
                    saleOrder.push(obj);
                }
                
            })
        }
     
        let rowSelection = {
            onChange: this.onSelectChange,
            type: "checkbox"
        };
        let { selectedRowKeys } = this.state;
        return (
            <div className="manage-box">
                <div className="managehead" style={{ marginBottom: 20 }}> 
                  
                    <Select style={{ width: 200, marginRight: 20 }} placeholder="物料编码" onChange={this.onChange}>
                        <Select.Option value="materialCode">物料编码</Select.Option>
                        <Select.Option value="customerName">客户名称</Select.Option>
                    </Select>

                    <Input
                        placeholder="请输入关键字搜索"
                        style={{ width: 200 }}
                        onChange={this.onSearchChange}
                        value={this.state.searchValue}
                        onPressEnter={this.query}
                    />
                    <Button type="primary" onClick={this.query} style={{ marginLeft: 20 }}>查询</Button>
                </div>
                <div className="manage-body">
                    <MTable
                        dataSource={saleOrder}
                        cols={columns}
                        loading={saleReturnDetailLoading}
                        rowKey={'lineNum'}
                        selRows={selectedRowKeys}
                        rowSelection={rowSelection}
                    />
                </div> 
            </div>
        )

    }

    render() {
        const { title, type } = this.props;
        return (
            <div>
                <Modal title={title} visible={this.props[type].saleReturn_visiable }
                    width={"1200px"}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="submit" type="primary" size="large"
                            onClick={this.handleSubmit}>
                            确定
                    </Button>
                    ]}
                >
                    {this.dialog()}
                </Modal>
            </div>

        );

    }
}
export default SaleReturnDialogComp;
