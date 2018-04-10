/**
 * Created by MW on 2017/4/20.
 * 新建采购退货出库单
 */
import React, {Component,PropTypes} from 'react';
import {AutoComplete,Form} from "antd";
const Option = AutoComplete.Option;
const FormItem = Form.Item;
export default class MyAutoComplete extends Component{
    state = {
        dataSource: [],
    }
    constructor(props) {
        super(props)
    }

    componentWillMount(){
        if(this.props.fetchFn){
            this.props.fetchFn(this.props.initSearchCode,this.props.warehouseCode).then((json)=>{
                if(json.status === 2000 && json.data){
                    if(this.props.beforeOption){
                        this.setState({
                            dataSource:[this.props.beforeOption].concat(json.data.list)
                        });
                    }else {
                        this.setState({
                            dataSource:json.data.list
                        });
                    }
                }
            });
        }
    }
    handleOnSearch=(value)=>{
        this.props.onSearch && this.props.onSearch(value);

        if(this.props.fetchFn){
            this.props.fetchFn(value,this.props.warehouseCode).then((json)=>{
                if(json.status === 2000 && json.data){
                    if(this.props.beforeOption){
                        this.setState({
                            dataSource:[this.props.beforeOption].concat(json.data.list)
                        });
                    }else {
                        this.setState({
                            dataSource:json.data.list
                        });
                    }
                }
            });
        }
    }

    renderOption=(item,index)=>{
        return(
            <Option
                key={`${item.code}`} displayName={`${item.code}`}
            >
                <div className="option-code">{item.code}</div>
                <div className="option-name">{item.name}</div>
            </Option>
        );
    }

    handlerOnChange=(val)=>{
        if(this.props.onChange && this.props.onChange(arguments));
    }


    getAutoComplete=()=>{
        return(
            <AutoComplete
                {...this.props}
                dataSource={this.state.dataSource}
                // onSearch={this.handleOnSearch}
                onChange={this.handleOnSearch}
            >
                {
                    this.state.dataSource.map(this.renderOption)
                }
            </AutoComplete>
        );

    }

    render() {
        if(this.props.getFieldDecorator){
            return  (
                <FormItem>
                    {
                        (this.props.getFieldDecorator(this.state.dataSource)(this.getAutoComplete()))
                    }
                </FormItem>
            );
        }else {
            return  this.getAutoComplete()
        }
    }
}



MyAutoComplete.defaultProps = {
    warehouseCode:"",
    initSearchCode:"",
    getFieldDecorator:null, //fn
    optionLabelProp:"displayName",
    beforeOption:null   // null ||  {}
}
