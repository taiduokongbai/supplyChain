/**
 * Created by MW on 2017/4/20.
 * 新建采购退货出库单
 */
import React, {Component,PropTypes} from 'react';
import {AutoComplete,Form,Spin} from "antd";
import { debounce } from '../../../base/consts/Utils';
const Option = AutoComplete.Option;
const FormItem = Form.Item;
let formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
};
export default class MyAutoComplete extends Component{
    state = {
        dataSource: [],
        loading: false,
    }
    constructor(props) {
        super(props)
        this.onSearch = debounce(this.onSearch,500);
    }

    componentWillMount(){
        if(this.props.fetchFn){
            this.props.fetchFn(this.props.initSearchCode).then((json)=>{
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
    onSearch=(value)=>{
        this.props.onSearch && this.props.onSearch(value);

        if(this.props.fetchFn){
            this.setState({loading:true});
            this.props.fetchFn(value).then((json)=>{
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
                    this.setState({loading:false});
                }
            });
        }
    }

    renderOption=(item,index)=>{
        return(
                <Option
                    key={`${item.materialCode}`} displayName={`${item.materialName}`}
                >
                    <div className="option-code">{item.materialCode}</div>
                    <div className="option-name">{item.materialName}</div>
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
                  onSearch={this.onSearch}
                 // onChange={this.handleOnSearch}
            >
                {
                    this.state.loading ? <Option key="" value="" disabled={true}><Spin size="small"></Spin></Option>:
                    this.state.dataSource.map(this.renderOption)
                }
            </AutoComplete>
        );

    }

    render() {
        if(this.props.getFieldDecorator){
            return  (
                <FormItem label='所属仓库：' {...formItemLayout}>
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
    initSearchCode:"",
    getFieldDecorator:null, //fn
    optionLabelProp:"displayName",
    beforeOption:null   // null ||  {}
}
