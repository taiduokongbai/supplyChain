import React,{Component} from "react";
import { Form, Input, Button , Select , Popover} from '../../../base/components/AntdComp';
import TableComp from "../../../base/components/TableComp"
import {prefixScm} from '../../../base/consts/UrlsConfig'
import {getCookie} from '../../../base/services/ReqApi'
const FormItem = Form.Item;
const Option = Select.Option;

const columns = [{
    title: '物料编码',
    dataIndex: 'materialCode',
    key: 'materialCode',
    width:147,
    }, {
    title: '物料名称',
    dataIndex: 'materialName',
    key: 'materialName',
    }, {
    title: '站点',
    dataIndex: 'warehouseName',
    key: 'warehouseName',
    },{
    title: '仓库',
    dataIndex: 'stockName',
    key: 'stockName',
    }, {
    title: '仓位',
    dataIndex: 'freightSpaceCode',
    key: 'freightSpaceCode',
    }, {
    title: '批次号',
    dataIndex: 'batchCode',
    key: 'batchCode',
    width:200,
    }, {
    title: '库存状态',
    dataIndex: 'status',
    key: 'status',
    width:129,
    },{
    title: '库存数量',
    dataIndex: 'amount',
    key: 'amount',
    },{
    title: '库存单位',
    dataIndex: 'materialUnitName',
    key: 'materialUnitName',
}];

const selectData = [
    {
        value:"materialCode",
        name:"物料编码",
    },
    {
        value:"materialName",
        name:"物料名称",
    },
    {
        value:"warehouseName",
        name:"站点",
    },
    {
        value:"stockName",
        name:"仓库",
    },
    {
        value:"freightSpaceCode",
        name:"仓位",
    },
    {
        value:"batchCode",
        name:"批次号",
    }
];

class InstantInventoryComp extends Component{
    constructor(props,context){
        super(props,context);
        columns[0].render= (text,record) =>{
            if(record.status!=-1){
                return <a href="#" onClick={()=>props.SidebarBtn(record.materialCode,record.status,record.id)}>{text}</a>
            }else{
                return <span>{text}</span>
            }
        }
        columns[6].render= (text,record,index) =>{
           return window.ENUM.getEnum("inventoryStatus").map(inventoryStatus => {
                if(inventoryStatus.catCode==text){
                        return <span key={index}>{inventoryStatus.catName}</span>
                }
            })
            
        }
        this.state={
            searchLoading:false,
            value:selectData[0].value,
            url:prefixScm+"/inventory/export?tokenid="+getCookie("tokenId")
        }
       // this.searchPm = {page: 1,pageSize: 10,};
 
    }
    componentDidMount(){
        this.tablePaging(1);
        this.props.form.validateFields((err, data) => {
            for(var key in data){
                this.setState({
                    url:prefixScm+"/inventory/export?tokenid="+getCookie("tokenId")+"&"+key+"="+data[key]
                })
            }
        })
    }
    handleSelectChange = (value) => {
        this.setState({
            value:value
        });
    }
    tablePaging = (page) => {
        const { listLoading, InventoryList } = this.props;
        this.props.form.validateFields((err, data) => {
            data.pageSize = this.props.paging.pageSize;
            if (!listLoading){
                if (typeof page === "number") {
                    data.page = page;
                } else {
                    data = { ...this.data, ...page ,};
                };
                InventoryList(data);
            }
        })
    }
   handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            searchLoading:true
        })
        this.props.form.validateFields((err, data) => {
            if (!err) {
                data.page = 1;
                data.pageSize = this.props.paging.pageSize||15;
                this.props.InventoryList(data)
                setTimeout(() => {
                    this.setState({
                        searchLoading:false,
                    })
                },1000)
                let param = '';
                for(var key in data){
                    if(key=="page"||key=='pageSize'){
                        param+='';
                    }else{
                        param += "&"+key+"="+data[key]
                    }
                }
                this.setState({
                    url:prefixScm+"/inventory/export?tokenid="+getCookie("tokenId")+param
                })
            }
        })   
    }
    render(){
        let {getFieldDecorator} = this.props.form;
        let Options = selectData.map(select => <Option key={select.value }>{select.name}</Option>);
        return (
            <div className="instant-inventory-box">
                <Form onSubmit={this.handleSubmit} className="instant-inventory-search">
                    <FormItem>
                        <Select onChange={this.handleSelectChange} value={this.state.value} style={{ width: 170 }}>
                            {Options}
                        </Select>
                    </FormItem>
                    <FormItem>
                    {getFieldDecorator(this.state.value, {
                        initialValue:""
                    })(
                        <Input placeholder="请输入关键字搜索"/>
                    )}
                    </FormItem>
                    <FormItem>
                    <Button type="primary" htmlType="submit" loading={this.state.searchLoading}><i className='c2mfont c2m-search1'></i>查询</Button>
                    </FormItem>
                    <a href={this.state.url} className='instant-inventory-export-a'><Button type="primary" onClick={this.handleExport} className='instant-inventory-export'><span className='c2mfont c2m-daochu'></span>导出</Button></a>
                </Form>
                <TableComp
                    {...this.props}
                    cols={columns}
                    dataSource={this.props.dataSource}
                    rowKey={"id"}
                    loading={this.props.listLoading}
                    pageOnChange={this.tablePaging}
                />
            </div>
        )
    }
}
export default Form.create()(InstantInventoryComp)