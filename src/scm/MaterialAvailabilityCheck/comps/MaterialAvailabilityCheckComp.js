import React, {Component} from "react";
import {
    Table,
    Form,
    message,
    Switch,
    Row,
    Col,
    Input,
    Select,
    Button,
    Spin
} from 'antd';
import {MaterialAvailabilityCheckStores,MaterialAvailabilityCheckConfigCompStores} from "../stores/index"

import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';

const InputGroup = Input.Group;


let {observer} = mobxReact;

const FormItem = Form.Item;




class TimeInput extends React.Component {
    constructor(props) {
        super(props);
        const value = this.props.value || {};
        this.state = {
            intervalTime: value.intervalTime || 0,
            timeType: value.timeType || '1',
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    handleIntervalTimeChange = (e) => {
        const intervalTime = parseInt(e.target.value || 0, 10);
        if (isNaN(intervalTime)) {
            return;
        }
        if (!('value' in this.props)) {
            this.setState({intervalTime});
        }
        this.triggerChange({intervalTime});
    }
    handleTimeTypeChange = (timeType) => {
        if (!('value' in this.props)) {
            this.setState({timeType});
        }
        this.triggerChange({timeType});
    }
    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    render() {
        const state = this.state;
        return (
            <InputGroup compact>
                <Input style={{width: 140}} value={state.intervalTime} onChange={this.handleIntervalTimeChange}
                       placeholder={this.props.placeholder}/>
                <Select style={{width: 46}} value={state.timeType} onChange={this.handleTimeTypeChange}>
                    <Option value="1">秒</Option>
                    <Option value="2">分</Option>
                    <Option value="3">时</Option>
                    <Option value="4">天</Option>
                </Select>
            </InputGroup>
        )
    }
}


@observer
export class MaterialAvailabilityCheckComp extends Component {
    store = MaterialAvailabilityCheckStores;

    constructor(props) {
        super(props);
        this.state = {
            toggle: true,
            expandForm: true,
        }

        this.columns = [
            {
                title: '计划单编号',
                dataIndex: 'planOrderCode',
                key: 'planOrderCode',
                fixed: 'left',
                width: 150,
                render: (text, record, index) => <TooltipComp attr={{text: text || `--`, wid: 150}} />
            },
            {
                title: '销售订单号',
                dataIndex: 'sellOrderCode',
                key: 'sellOrderCode',
                width: 148,
            /*    render:()=>this.store.Props.cacheDataSource.sellOrderCode || `--`*/

            },
            {
                title: '合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
                width: 148,
       /*         render:()=>this.store.Props.cacheDataSource.contractCode || `--`*/
            },
            {
                title: '产品编码',
                dataIndex: 'productionCode',
                key: 'productionCode',
                width: 148,
            /*    render:()=>this.store.Props.cacheDataSource.productionCode || `--`*/
            },
            {
                title: '产品名称',
                dataIndex: 'productionName',
                key: 'productionName',
                width: 88,
                render: (text, record, index) => <TooltipComp attr={{text: text|| `--`, wid: 88}} />
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width: 148,
            },
            {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                render: (text, record, index) => <TooltipComp attr={{text: text|| `--`, wid: "auto"}} />
            },
            {
                title: '材料',
                dataIndex: 'materialTexture',
                key: 'materialTexture',
            },
            {
                title: '代号',
                dataIndex: 'materialCodeName',
                key: 'materialCodeName',
            },
            {
                title: '数量',
                dataIndex: 'qty',
                key: 'qty',
            },
            {
                title: '单位',
                dataIndex: 'materialUnitName',
                key: 'materialUnitName',
            },
            {
                title: '计划方式',
                dataIndex: 'planMode',
                key: 'planMode',
                fixed: 'right',
                width: 70,
                render:(text, record, index)=>{
                    switch (text){
                        case 1 :
                            return "标准采购";
                        case 2 :
                            return "外协采购"
                        case 3 :
                            return "外协加工"
                        case 4 :
                            return "自制生产"
                        default:
                            return "--";
                    }
                }
            },
            {
                title: '检查标识',
                dataIndex: 'checkFlag',
                key: 'checkFlag',
                fixed: 'right',
                width: 60,
                render:(text, record, index)=><Switch checked={text === 0 ? true : false}   checkedChildren="开" unCheckedChildren="关" onChange={(checked)=>this.handleSearchSwitchOnChange(checked,text, record, index)}/>
            }
        ];
    }

    handleSearchSwitchOnChange =(checked,text, record, index)=>{
        let newRow =  JSON.parse(JSON.stringify(record));
        newRow.checkFlag = checked ? 0 : 1;
        this.store.switchRow(newRow).then((json)=>{
            if(json.status === 2000){
                this.handlerSubmit();
            }
        });
    }

    handleSearch = () => {

    }

    handlerToggleForm = (e) => {

        this.setState({
            toggle: !this.state.toggle
        })
    }


    componentDidMount(){
        this.store.fetchTableInformation().then(()=>{
            this.handlerSubmit()
        });
    }

    handlerSubmit = () => {
        this.props.form.validateFields((error,values)=>{
            let {page,pageSize} = this.store.pages;
            let newVal = Object.assign({page,pageSize},values);
            newVal.planMode =  parseInt(newVal.planMode,10);
            delete newVal.time;
            this.store.fetchTableList(newVal);
        });
    }

    handlerSave=(e)=>{
        this.props.form.validateFields((error,values)=>{
            let newVal = Object.assign({},{},values.time,values);

            newVal.timeType = Number(newVal.timeType);
            newVal.planMode =  parseInt(newVal.planMode,10);
            delete newVal.time;

            this.store.save(newVal).then((json)=>{
                if(json.status === 2000){
                    store.dispatch(TabsAct.TabRemove("materialAvailabilityCheck", "materialAvailabilityCheckConfig"));
                    store.dispatch(TabsAct.TabAdd({
                        title: "物料可用性检查",
                        key: "materialAvailabilityCheckConfig"
                    }));
                    MaterialAvailabilityCheckConfigCompStores.fetchTableList();
                }
            });
        });

    }
    onChangePage=(page)=>{
        this.store.pageOnChange(page);
        this.handlerSubmit();
    }
    handlerOnShowSizeChange=(current, size)=>{
        this.store.pageOnChange({ page: current, pageSize:size, });
        this.handlerSubmit();
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        let {cacheDataSource,dataSource,loading} = this.store.Props;
        let props = this.store.Props;
        props.pagination.onChange = this.onChangePage;
        props.pagination.onShowSizeChange = this.handlerOnShowSizeChange;
        return (
            <div className="materialAvailabilityCheck">
                <Spin tip="" spinning={loading}>
                    <div className="materialAvailabilityCheck-search-bar">
                        <div className="materialAvailabilityCheck-warp">

                            <div className="toggle-bar">
                                {
                                    this.state.toggle ?
                                        <div className="toggle-handle-bar" onClick={this.handlerToggleForm}>收起搜索条件</div> :
                                        <div className="toggle-handle-bar" onClick={this.handlerToggleForm}>展开搜索条件</div>
                                }

                            </div>

                            <div className="material-check-list">
                                <div className="material-search-tip">
                                    <div className="material-search-title">
                                        <span><h2>监控条件</h2></span>
                                    </div>
                                    <div className="material-search-save">
                                        <Button className="toolbar-btn-serve" type="primary"  onClick={this.handlerSave} loading={props.loading}><i
                                            className="c2mfont c2m-baocun"></i>保存</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="material-check-list" style={{display: this.state.toggle ? "block" : "none"}}>
                                <Form className="tableListForm" layout="inline">
                                    <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                        <Col md={8} sm={24}>
                                            <FormItem label="计划单编号">
                                                {getFieldDecorator('planOrderCode',{
                                                    initialValue: cacheDataSource.planOrderCode || ""
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col md={8} sm={24}>
                                            <FormItem label="合同编号">
                                                {getFieldDecorator('contractCode',{
                                                    initialValue: cacheDataSource.contractCode || ""
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col md={8} sm={24}>
                                            <FormItem label="计划方式">
                                                {getFieldDecorator('planMode', {
                                                    initialValue: (cacheDataSource.planMode &&  cacheDataSource.planMode+"") ||  '-1'
                                                })(
                                                    <Select placeholder="请选择" style={{width: '100%'}}>
                                                        <Option value="-1">全部</Option>
                                                        <Option value="1">标准采购</Option>
                                                        <Option value="2">外协采购</Option>
                                                        <Option value="3">外协加工</Option>
                                                        <Option value="4">自制生产</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                        <Col md={8} sm={24}>
                                            <FormItem label="销售订单号">
                                                {getFieldDecorator('sellOrderCode',{
                                                    initialValue: cacheDataSource.sellOrderCode || ""

                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col md={8} sm={24}>
                                            <FormItem label="产品编码">
                                                {getFieldDecorator('productionCode',{
                                                    initialValue: cacheDataSource.productionCode || ""
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col md={8} sm={24}>
                                            <FormItem label="产品名称">
                                                {getFieldDecorator('productionName',{
                                                    initialValue: cacheDataSource.productionName || ""
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>

                                    <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                        <Col md={8} sm={24}>
                                            <FormItem label="物料编码">
                                                {getFieldDecorator('materialCode',{
                                                    initialValue: cacheDataSource.materialCode || ""
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col md={8} sm={24}>
                                            <FormItem label="物料名称">
                                                {getFieldDecorator('materialName',{
                                                    initialValue: cacheDataSource.materialName || ""
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col md={8} sm={24} className="material-search-btn">
                                         <span style={{float: 'right', marginBottom: 24}}>
                                             <Button type="primary"  onClick={this.handlerSubmit} loading={props.loading}><i className="c2mfont c2m-search1"></i>查询</Button>
                                         </span>
                                        </Col>
                                    </Row>


                                    <div style={{overflow: 'hidden'}}>

                                    </div>
                                </Form>
                            </div>
                        </div>

                        <div className="">

                        </div>
                    </div>
                    <div className="materialAvailabilityCheck-table">
                        <div className="ant-form ant-form-inline tableListForm" layout="inline">
                            <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                <Col md={8} sm={24}>
                                    <FormItem label="刷新时间">
                                        {getFieldDecorator('time', {
                                            initialValue: {intervalTime: cacheDataSource.intervalTime || 30, timeType:cacheDataSource.timeType|| "1"},
                                        })(
                                            <TimeInput placeholder="请输入数字"/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                        <div className="material-table-body">
                            <Table columns={this.columns}  {...props} scroll={{ x: 1500 }}/>
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }


}

export default Form.create()(MaterialAvailabilityCheckComp);

