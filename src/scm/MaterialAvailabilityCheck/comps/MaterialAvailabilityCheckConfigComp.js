import React, {Component} from "react";
import {
    Table,
    Row,
    Col,
    Button
} from '../../../base/components/AntdComp';
import {MaterialAvailabilityCheckConfigCompStores} from "../stores/index"
import TooltipComp from '../../../base/mobxComps/TooltipComp';

import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';

let {observer} = mobxReact;



@observer
export default class MaterialAvailabilityCheckConfigComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle:true,
            expandForm: true,
        }
        this.store = MaterialAvailabilityCheckConfigCompStores;

        this.columns = [
            {
                title: '销售合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
                fixed: 'left',
                width: 150,
                render: (text, record, index) => <TooltipComp attr={{text: text|| `--`, wid: 150}} />
            },
            {
                title: '产品名称',
                dataIndex: 'productionName',
                key: 'productionName',
                fixed: 'left',
                width: 88,
                render: (text, record, index) => <TooltipComp attr={{text: text|| `--`, wid: 88}} />
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width:148,
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
                render: (text, record, index) => <TooltipComp attr={{text: text|| `--`, wid: 88}} />
            },
            {
                title: '代号',
                dataIndex: 'materialCodeName',
                key: 'materialCodeName',
                render: (text, record, index) => <TooltipComp attr={{text: text|| `--`, wid: 88}} />
            },
            {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                render: (text, record, index) => <TooltipComp attr={{text: text|| `--`, wid: 88}} />
            },
            {
                title: '数量',
                dataIndex: 'qty',
                key: 'qty',
                width:85,
                render: (text, record, index) => <TooltipComp attr={{text: text|| `--`, wid: 85}} />
            },
            {
                title: '到位数量',
                dataIndex: 'dwQty',
                key: 'dwQty',
                fixed: 'right',
                width: 100,
            },
            {
                title: '到位状态',
                dataIndex: 'dwStatus',
                key: 'dwStatus',
                fixed: 'right',
                width: 60,
                render:(text, record, index)=>{
                    switch (text){
                        case 0 :
                            return <span style={{color:"#F6A623"}}>部分到位</span>;
                        case 1 :
                            return <span style={{color:"#F04134"}}>未到位</span>;
                        case 2 :
                            return <span style={{color:"#26B327"}}>已到位</span>;
                        default:
                            return "--";
                    }
                }
            }
        ];
    }


    handlerToggleForm = (e) => {
        this.setState({
            toggle:!this.state.toggle
        })
    }
    componentWillMount(){
        this.store.fetchTableList();
    }


    getPlanModeEnum=(planMode)=>{
        switch (planMode){
            case -1:
                return "全部";
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

    handlerRefresh=(e)=>{
        this.store.refreshTableList();
    }

    handlerConfig=(e)=>{
        store.dispatch(TabsAct.TabAdd({
            title: "监控条件配置",
            key: "materialAvailabilityCheck"
        }));
    }
    getTimeType=(timeType)=>{
        switch (timeType){
            case "1":
                return "秒";
            case "2":
                return "分";
            case "3":
                return "时";
            case "4":
                return "天";
        }
    }
    render() {
        let {cacheDataSource,dataSource,loading} = this.store.Props;

        return (
            <div className="materialAvailabilityCheckConfig">
                <div className="materialAvailabilityCheckConfig-search-bar">
                    <div className="materialAvailabilityCheckConfig-warp">

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
                                    <Button onClick={this.handlerConfig} className="toolbar-btn-serve" loading={loading}  type="primary" ><i className="c2mfont c2m-jinrupeizhi"></i>进入配置</Button>
                                    <Button onClick={this.handlerRefresh} loading={loading} className="toolbar-btn-serve" type="primary" ><i className="c2mfont c2m-shuaxin"></i>立即刷新</Button>
                                </div>
                            </div>
                        </div>

                        <div className="material-check-list" style={{display:this.state.toggle ? "block" : "none"}}>
                            <div  className="tableListForm tableListForm-show" layout="inline">
                                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                    <Col md={8} sm={24}>
                                        <div className="ant-row ant-form-item">
                                            <div className="ant-form-item-label">
                                                <label  className="" title="计划单号">计划单号</label>
                                            </div>
                                            <div className="ant-form-item-control-wrapper">
                                                <div className="ant-form-item-control ">
                                                    {cacheDataSource.planOrderCode || "--"}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className="ant-row ant-form-item">
                                            <div className="ant-form-item-label">
                                                <label  className="" title="合同编号">合同编号</label>
                                            </div>
                                            <div className="ant-form-item-control-wrapper">
                                                <div className="ant-form-item-control ">
                                                    {cacheDataSource.contractCode || "--"}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className="ant-row ant-form-item">
                                            <div className="ant-form-item-label">
                                                <label  className="" title="计划方式">计划方式</label>
                                            </div>
                                            <div className="ant-form-item-control-wrapper">
                                                <div className="ant-form-item-control ">
                                                    {
                                                        this.getPlanModeEnum(cacheDataSource.planMode)
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                    <Col md={8} sm={24}>

                                        <div className="ant-row ant-form-item">
                                            <div className="ant-form-item-label">
                                                <label  className="" title="销售订单号">销售订单号</label>
                                            </div>
                                            <div className="ant-form-item-control-wrapper">
                                                <div className="ant-form-item-control ">
                                                    {cacheDataSource.sellOrderCode || "--"}
                                                </div>
                                            </div>
                                        </div>

                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className="ant-row ant-form-item">
                                            <div className="ant-form-item-label">
                                                <label  className="" title="产品编码">产品编码</label>
                                            </div>
                                            <div className="ant-form-item-control-wrapper">
                                                <div className="ant-form-item-control ">
                                                    {cacheDataSource.productionCode || "--"}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className="ant-row ant-form-item">
                                            <div className="ant-form-item-label">
                                                <label  className="" title="产品名称">产品名称</label>
                                            </div>
                                            <div className="ant-form-item-control-wrapper">
                                                <div className="ant-form-item-control ">
                                                    {cacheDataSource.productionName || "--"}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                                    <Col md={8} sm={24}>
                                        <div className="ant-row ant-form-item">
                                            <div className="ant-form-item-label">
                                                <label  className="" title="物料编码">物料编码</label>
                                            </div>
                                            <div className="ant-form-item-control-wrapper">
                                                <div className="ant-form-item-control ">
                                                    {cacheDataSource.materialCode || "--"}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <div className="ant-row ant-form-item">
                                            <div className="ant-form-item-label">
                                                <label  className="" title="物料名称">物料名称</label>
                                            </div>
                                            <div className="ant-form-item-control-wrapper">
                                                <div className="ant-form-item-control ">
                                                    {cacheDataSource.materialName || "--"}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={8} sm={24}>

                                    </Col>
                                </Row>


                                <div style={{overflow: 'hidden'}}>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="">

                    </div>
                </div>
                <div className="materialAvailabilityCheckConfig-table">
                    <div  className="ant-form ant-form-inline tableListForm" layout="inline">
                        <div className="time-information">
                            <span>
                                {`上次刷新时间:${cacheDataSource.updateDate || "--"}  刷新间隔:`}<i className="time">{cacheDataSource.intervalTime || "--"}</i>
                                {
                                    this.getTimeType(cacheDataSource.timeType)
                                }
                            </span>
                        </div>
                    </div>
                    <div className="material-table-body">
                        <Table dataSource={dataSource} columns={this.columns} loading={loading}  scroll={{ x: 1500 }} pagination={false}/>
                    </div>
                </div>
            </div>
        );
    }



}


