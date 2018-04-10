import React, { Component } from 'react';
import { Select, Button, Input, Form } from '../../../base/components/AntdComp';
import SaleReturnAct from '../../actions/SaleModule/SaleReturnAct';
import TabsAct from '../../actions/TabsAct';
import { store } from '../../data/StoreConfig';
const Option = Select.Option;
class LinkInputComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInput: true,
            inputValue:'',
            SearchVal: props.SearchVal,
            key: 'saleReturnCode',
            value: '',
            condition: {}
        };
    }

    onChange = (value) => {
        this.setState({isInput: value !== 'status'});
        if(value == 'status'){
            this.setState({value: '0'})
            this.setState({key: value})
        }else {
            this.setState({value: ''})
            this.setState({key: value})
        }

    };
    query = () => {
        let queryKey = this.state.key;
        this.props.onSearch({[queryKey]:this.state.value})
    };
    add = () => {
        this.props.GetCodeRule().then(json => {
            if (json.status === 2000) {
                store.dispatch(TabsAct.TabAdd({title:"新建销售退货单",key:"saleReturnAdd"}));
            }
        })
    };
    handleInputChange = (event) => {
        this.setState({value: event.target.value})
    };
    handleStatusChange = (value) => {
        this.setState({value: value})
    };
    render() {
        return (
            <div className="link-input-cont">
                <div className="input-select">

                    <Select style={{ width: 180 }}  defaultValue="saleReturnCode" onChange={this.onChange}>
                        <Option value="saleReturnCode">销售退货单号</Option>
                        <Option value="customerName">客户名称</Option>
                        <Option value="sourceCode">来源订单号</Option>
                        <Option value="status">单据状态</Option>
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
                    <Button className="default-btn query-saleReturn" onClick={this.query}><i className="c2mfont c2m-search1" style={{paddingRight:7,fontSize:10}}></i>查询</Button>
                    <Button className="default-btn new-saleReturn" onClick={this.add}><i className="c2mfont c2m-jia" style={{paddingRight:7,fontSize:10}}></i>新建</Button>
                </div>

            </div>
        )
    }
}
export default Form.create()(LinkInputComp);