import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, Button, Input, Form } from '../../../base/components/AntdComp';
import TabsAct from '../../actions/TabsAct';
import { store } from '../../data/StoreConfig';
import {prefixScm} from '../../../base/consts/UrlsConfig'
import {getCookie} from '../../../base/services/ReqApi'
const Option = Select.Option;
class SaleOrderSearchComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 'saleOrderCode',
            isInput: true,
            inputValue:'',
            value: '',
            url:prefixScm+"/sale/exportExcel?tokenid="+getCookie("tokenId")
        };
    }
    query = () => {
        let queryKey = this.state.key;
        this.props.onSearch({ [queryKey]: this.state.value })
        this.setState({
            url:prefixScm+"/sale/exportExcel?tokenid="+getCookie("tokenId")+"&"+this.state.key+"="+this.state.value
        })
    };
    handleInputChange = (event) => {
        this.setState({ value: event.target.value })
    };
    add = () => {
        this.props.GetCodeRule().then(json => {
            if (json.status === 2000) {
                store.dispatch(TabsAct.TabAdd({ title: "新建销售订单", key: "saleOrderAdd" }));
            }
        })
    };
    onChange = (value) => {
        this.setState({isInput: value !== 'orderStatus'});
        if(value == 'orderStatus'){
            this.setState({value: '0'})
            this.setState({key: value})
        }else {
            this.setState({value: ''})
            this.setState({key: value})
        }

    };
    handleStatusChange = (value) => {
        this.setState({value: value})
    };
    render() {
        return (
            <div className="sale-input-cont">
                <div className="input-select">
                    <Select style={{ width: 180 }} onChange={this.onChange} defaultValue="saleOrderCode" >
                        <Option value="saleOrderCode">销售订单号</Option>
                        <Option value="customerName">客户名称</Option>
                        <Option value="sourceCode">来源订单号</Option>
                        <Option value="orderStatus">单据状态</Option>
                    </Select>
                    {this.state.isInput ?
                        <Input   onPressEnter={this.query} placeholder="请输入关键字查询" style={{width: 180,marginLeft:20}} value={this.state.value}  onChange={this.handleInputChange}/>:
                        <Select   style={{width: 100,marginLeft:20}} onChange={this.handleStatusChange} defaultValue="0">
                            <Option value="0">已保存</Option>
                            <Option value="1">已提交</Option>
                            <Option value="2">已审批</Option>
                            <Option value="6">已撤回</Option>
                            <Option value="4">已驳回</Option>
                        </Select>}
                    <Button className="default-btn query-sale" onClick={this.query}><i className="c2mfont c2m-search1" style={{ paddingRight: 7, fontSize: 10 }}></i><span>查询</span></Button>
                    <a href={this.state.url}><Button className="default-btn query-sale"><i className="c2mfont c2m-daochu" style={{ paddingRight: 7, fontSize: 10 }}></i>导出</Button></a>
                    <Button className="default-btn new-sale" onClick={this.add}><i className="c2mfont c2m-jia" style={{ paddingRight: 7, fontSize: 10 }}></i><span>新建</span></Button>
                </div>

            </div>
        )
    }
}

export default SaleOrderSearchComp;