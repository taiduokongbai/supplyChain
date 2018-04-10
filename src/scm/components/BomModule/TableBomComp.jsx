import React, {Component} from "react";
import MTable from '../../../base/components/TableComp';
import {store} from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import TooltipComp from "../../../base/components/TooltipComp";
import OperationsComp from '../../../base/components/OperationsComp'

class TableBomComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.columns = [
            {
                title: 'bomId',
                className: "id",
                key: "id",
                hidden: true
            },
            {
                title: 'BOM编码',
                dataIndex: 'bomCode',
                key: "bomCode",
                width:156,
                render: (text, record) => (
                    <a onClick={() => this.getBomDetail(record.bomCode, record.version) }>{text}</a>)
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width:80,
                render: (txt, record, index) => {
                    return window.ENUM.getEnum("bomStatus", txt + '')
                },
            }, {
                title: '版本号',
                dataIndex: 'version',
                key: 'version',
                width:80,
            }, {
                title: 'BOM名称',
                dataIndex: 'bomName',
                key: 'bomName',
                render: (txt, index, record) => <TooltipComp attr={{text:txt, wid: 70, placement: 'left'}} />
            }, {
                title: '产品编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width:153,  
            }, {
                title: '名称',
                dataIndex: 'materialName',
                key: 'materialName',
                render: (txt, index, record) => <TooltipComp attr={{text:txt, wid:100, placement: 'left'}} />
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                width:120,
                render: (txt, index, record) => <TooltipComp attr={{text:txt, wid: 70, placement: 'left'}} />
            }, {
                title: '生效日期',
                dataIndex: 'startTime',
                key: 'startTime',
                width:120,
            }, {
                title: '失效日期',
                dataIndex: 'endTime',
                key: 'endTime',
                width:120,
            }, {
                title: '操作',
                dataIndex: 'operate',
                className: 'operate-center',
                key: 'operate',
                width: 80,
                fixed:'right',
            }];

        this.columns[this.columns.length - 1].render = (txt, record, index) =>{
            let opts = [
                {
                    title: '编辑',
                    titleText: [],
                    icon: '',
                    default: '--',
                    show: record.status == 0,
                    fun: () => this.onEditBom(record.bomCode, record.version),

                },
                {
                    title: "删除",
                    titleText: ['确定要删除该BOM吗', '删除后，该条BOM记录将不可恢复！'],
                    icon: '',
                    show: record.status == 0,
                    default: '--',
                    fun: () => this.onDelete(record.bomCode, record.version),
                },
            ];
            return <OperationsComp operations={opts} />;
        };
    }

    getBomDetail = (bomCode, version) => {
        this.props.GetBom(bomCode, version, "detail")
        store.dispatch(TabsAct.TabAdd({title: "BOM详情", key: "bomDetail"}));

    };

    onEditBom = (bomCode, version) => {
        this.props.GetBom(bomCode, version, "edit")
        this.props.CheckEdit(bomCode,version);
    };
    onDelete = (bomCode, version) => {
        this.props.DeleteBom(bomCode, version)
    }

    componentDidMount() {
        this.props.tablePaging(1);
    }

    render() {
        const {tabLoading, tablePaging, ...props} = this.props;
        return (
            <div className="bom-table-wrap">
                <div className="bom-body">
                    <MTable
                        {...props}
                        loading={tabLoading}
                        cols={this.columns}
                        rowKey={"id"}
                        pageOnChange={tablePaging}
                    />
                </div>
            </div>
        );
    }
}
export default TableBomComp;