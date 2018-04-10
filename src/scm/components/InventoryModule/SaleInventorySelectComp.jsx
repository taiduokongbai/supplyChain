import React,{Component} from "react";
import { Form, Input, Button ,Select,message,InputNumber} from '../../../base/components/AntdComp';
import TableComp from "../../../base/components/TableComp"
import FormModalComp from '../../../base/components/FormModalComp';
const FormItem = Form.Item;
const Option = Select.Option;

const columns = [{
    title: '仓库名称',
    dataIndex: 'warehouseName',
    key: 'warehouseName',
    width:129
}, {
    title: '仓位',
    dataIndex: 'freightSpaceCode',
    key: 'freightSpaceCode',
}, {
    title: '批次号',
    dataIndex: 'batchCode',
    key: 'batchCode',
}, {
    title: '库存数量',
    dataIndex: 'amount',
    key: 'amount',
    width:103
},{
    title: '分配数量',
    dataIndex: 'materialAmount',
    key: 'materialAmount',
    width:80
}];
class SaleInventorySelectComp extends FormModalComp{
    constructor(props,context){
        super(props,context);
        this.state={
            value:"freightSpaceCode",
            searchLoading:false,
            disabled:true
        }
        columns[columns.length - 1].render=(text,record,index)=>{
            let {InventorySelectTableData,InventorySelectData} = this.props;
            return <Form onSubmit={this.handleSubmit}>
                <FormItem>
                    {this.props.form.getFieldDecorator(record.idStr, {
                        initialValue:0,
                        rules: [
                            {validator: (rule,val="",callback)=>{

                                // if (value.length <= 0) {
                                //     callback("分配数量必填。")
                                // } else if (!/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)) {
                                //     callback("请输入数字。")
                                // } else if (!(value > 0)) {
                                //     callback("输入值必须大于 0。")
                                // } else if (!(value <= 99999999)) {
                                //     callback("输入值不能大于 99999999。")
                                // } else if (!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
                                //     callback("小数点后不能超过两位");
                                // }

                                if (val.length <= 0) {
                                    callback("分配数量必填。")
                                }else if (!/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(val)) {
                                    callback("请输入数字。")
                                } else if(val < 0 ){
                                    callback('分配数量不能小于0');
                                } else if(!(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(val))){
                                    callback("小数点后不能超过两位");
                                }else if(val<=Number(record.amount)&&val<=(Number(InventorySelectData.planAmount)-Number(InventorySelectData.allocatedAmount)).toFixed(2)){
                                    callback();
                                } else{
                                    callback("数量分配不对，请重新输入");
                                }
                            }}
                        ],
                    })(
                        <InputNumber  />
                    )}
                </FormItem>
            </Form>
        }
    }
    handleSubmit = (e) => {
        let {InventorySelectTableData,InventorySelectData} = this.props;
        e.preventDefault();
        if(!this.props.loading){
            this.validateFds((err, data) => {
                let listData = [];
                let Data = {};
                let amount = 0;
                //let materialAmount = [];
                InventorySelectTableData.map(list=>{
                    amount = list.amount;
                    Data = {
                        outCode:InventorySelectData.outCode,
                        lineNum:InventorySelectData.lineNum,
                        warehouseCode:list.warehouseCode,
                        freightSpaceCode:list.freightSpaceCode,
                        batchCode:list.batchCode,
                        materialAmount:0
                    }
                    for(let i in data){
                        if(i==list.idStr){
                            Data={...Data,materialAmount:data[i]}
                        }else{
                            Data={...Data}
                        }
                    }
                    listData.push(Data)
                })
                data={list:listData}
                if (!err) {
                    this.props.onOk && this.props.onOk(data);
                }
            });
        }
    }
    searchSubmit=(e)=>{
        let {InventorySelectData} = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            this.setState({
                searchLoading:true,
            });


            if(data.freightSpaceCode||data.freightSpaceCode==""){
                data = {
                    freightSpaceCode:data.freightSpaceCode,
                    outCode:InventorySelectData.outCode,
                    lineNum:InventorySelectData.lineNum,
                }
            }else if(data.batchCode||data.batchCode==""){
                data = {
                    batchCode:data.batchCode,
                    outCode:InventorySelectData.outCode,
                    lineNum:InventorySelectData.lineNum,
                }
            }
            else if(data.warehouseName||data.warehouseName==""){
                data = {
                    warehouseName:data.warehouseName,
                    outCode:InventorySelectData.outCode,
                    lineNum:InventorySelectData.lineNum,
                }
            }

            this.props.form.resetFields();

            this.props.InventorySelectTableList(data).then(()=>{
                this.setState({
                    searchLoading:false,
                })
            });

        })
    }
    handleChange=(value)=>{
        this.setState({
            value:value
        })
    }
    getComp = () => {
        let {getFieldDecorator} = this.props.form;
        let {InventorySelectData,title,...props} = this.props;
        return (
            <div className="inventory-select-dialog">
                <div className="inventory-select-dialog-title" key="">
                    <div className="inventory-select-dialog-title-left">
                        <p className="inventory-select-dialog-title-left-up">
                            <span>物料编码：{InventorySelectData.materialCode}</span>
                            <span>物料名称：{InventorySelectData.materialName}</span>
                        </p>
                        <p className="inventory-select-dialog-title-left-down">
                            {/*   <span>规格：{InventorySelectData.materialSpec}</span>
                                <span>型号：{InventorySelectData.materialModel}</span>*/}
                            <span>库存单位：{InventorySelectData.materialUnitName}</span>
                        </p>
                    </div>
                    <div className="inventory-select-dialog-title-right">
                        <p>计划数量：<span className="receipt-number">{InventorySelectData.planAmount}</span></p>
                        <p>已分配数量：<span className="distribute-number">{InventorySelectData.allocatedAmount}</span></p>
                    </div>
                </div>
                <Form onSubmit={this.searchSubmit}>
                    <FormItem>
                        <Select defaultValue="freightSpaceCode" onChange={this.handleChange}>
                            <Option value="freightSpaceCode">仓位</Option>
                            <Option value="batchCode">批次号</Option>
                            <Option value="warehouseName">仓库名称</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator(this.state.value, {
                            initialValue:""
                        })(
                            <Input placeholder="请输入关键字搜索" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" loading={this.state.searchLoading}>查询</Button>
                    </FormItem>
                </Form>
                <TableComp
                    {...props}
                    dataSource={this.props.InventorySelectTableData}
                    cols={columns}
                    rowKey={"id"}
                    pagination={false}
                    loading={false}
                />
            </div>
        )


    }
}

SaleInventorySelectComp.defaultProps={
    title: '库存选择',
    okText: '确定',
    width: 740,
    maskClosable: true,
}
export default Form.create()(SaleInventorySelectComp);
