import React, { Component } from 'react';
import { Button, Popconfirm, message, Select } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import SearchBarComp from '../../../base/components/SearchBarComp';
import OperationsComp from '../../../base/components/OperationsComp';

const Option = Select.Option;
const columns = [
    {
        title: '物料编码',
        dataIndex: 'materialCode',
        key: 'materialCode',
    },
    {
        title: '简码',
        dataIndex: 'simpleCode',
        key: 'simpleCode',
    },
    {
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
    },{
        title: '基本单位',
        dataIndex: 'measureUnitName',
        key: 'measureUnitName',
    },{
        title: '规格',
        dataIndex: 'materialSpec',
        key: 'materialSpec',
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => window.ENUM.getEnum("materialStatusData", text.toString()),
    }, {
        title: '更新人',
        dataIndex: 'updateByName',
        key: 'updateByName',
    }, {
        title: '更新时间',
        dataIndex: 'updateDate',
        key: 'updateDate',
    }, {    
        dataIndex: 'handle',
        title: '操作',
        
    }];

class MaterialComp extends Component {
     constructor(props, context) {
        super(props, context);
         this.searchData={
                left:[
                {
                    key:"materialCode",
                    val:"物料编码",
                    type:"string"
                },
                {
                    key:"simpleCode",
                    val:"简码",
                    type:"string"
                },
                {
                    key:"materialName",
                    val:"物料名称",
                    type:"string"
                },
                {
                    key:"status",
                    val:"状态",
                    type:"select",
                    data:{
                        list: window.ENUM.getEnum("materialStatusData"),
                        keyName:"catCode",
                        labelName:"catName",
                        style:{width:200}
                    }
                },
                {
                    key:"materialSpec",
                    val:"规格",
                    type:"string"
                }
            ],
            center:[
                {
                    title:"查询",
                    Func:null,
                    style:{},
                    type:"button"
                }
            ],
            right:[
                {
                    title:"新建",
                    Func:this.AddMaterial,
                    style:{}
                },
                {
                    title:"导入",
                    Func:this.importViewVisiable,
                    style:{}
                }
                ,
                {
                    title:"导出",
                    Func:null,
                    url:'',
                    style:{}
                }
            ]
          }

     columns[0].render=(txt,record,index)=>
            <a href="#" onClick={()=>this.MaterialViewShow(record.materialCode)}>{record.materialCode}</a>
    
            columns[columns.length - 1].render = (txt, record, index) =>{
                let opts=[
                    {
                        title: '编辑',
                        titleText: [],
                        icon: '',
                        fun: () => this.editMaterial(record.materialCode),
                        show: true,//record.orderStatus == "0" || record.orderStatus == "4",
                    },
                    {
                        title: "删除",
                        titleText: ['你是否确定删除这项内容', '删除后，该物料信息将被清除。'],
                        icon: '',
                        show: record.status == 0,
                        fun: () => this.delMaterial(record.materialCode),
                    },
                    {
                        title: record.status==0?'启用':record.status==1?'禁用':'启用',
                        titleText: [],
                        icon: '',
                        show: true,
                        fun: () => this.MaterialIsDisable(record.materialCode,record.status==1||0?2:1)
                    }
                ]
                return <OperationsComp operations={opts} />;
            }
        
        {/*<div>
            <a href="#" onClick={()=>this.editMaterial(record.materialCode)} >编辑 </a>
            &nbsp;<a href="#" onClick={()=>this.MaterialIsDisable(record.materialCode,record.status==1||0?2:1)}>{record.status==0?'启用':record.status==1?'禁用':'启用'}</a>&nbsp;
            <Popconfirm title={
                <div>
                    <h5>你是否确定删除这项内容</h5>
                    <p>删除后，该物料信息将被清除。</p>
                </div>
            }
            onConfirm={()=>this.delMaterial(record.materialCode)}
            >
                {record.status==0?<a href="#">删除</a>:null}
            </Popconfirm>
        </div>*/}

     }   
     importViewVisiable=()=>{
         this.props.ImportViewVisiable()
     }
  AddMaterial=()=>{
      //1：长度，2：质量，3：面积，4：体积，5：容量
        let type=["length","weight","area","volume","all"],
            str=["1","2","3","4",""];
        this.props.GetCodeRule().then(json=>{
            if(json.status===2000){
                this.props.AddModul();
                this.props.supplierEditData({})
                // this.props.getDept();
                // this.props.getBusinessPartnerData({
                //     "page": "1",
                //     "pageSize": "10"
                // });
                str.map((item,index)=>{
                    this.props.getCurrencyList({
                        "dimensionality":item,
                        "page": "1",
                        "pageSize": "10"
                    },type[index]);
                })
                // this.props.GetMaterialList({
                //     "page": "1",
                //     "pageSize": "10"
                // });
        
            }
        })
        
  }
  editMaterial=(materialCode)=>{
        this.props.EditModul();
        this.props.getEditData(materialCode);
         //1：长度，2：质量，3：面积，4：体积，5：容量
        let type=["length","weight","area","volume","all"],
            str=["1","2","3","4",""]
        str.map((item,index)=>{
            this.props.getCurrencyList({
                "dimensionality":item,
                "page": "1",
                "pageSize": "10"
            },type[index]);
        })
  }
  MaterialViewShow =(materialCode)=>{
        this.props.MaterialViewClick();
        this.props.SupplierBaseLoading(true);
        this.props.getEditData(materialCode,'detail');
        // this.props.ContactsListCode(materialCode);
    }; 
  delMaterial=(materialCode)=>{
      this.props.delMaterial(materialCode)
        .then(json=>{
            if(json.status==2000){
                message.success('物料删除成功!');
                this.props.tablePaging();
            }
        })
  }
    MaterialIsDisable=(materialCode,status)=>{
        this.props.MaterialIsDisable(materialCode,status)
            .then(json=>{
                if(json.status==2000){
                    if(status==1){
                       message.success('物料启用成功!');
                    }else{
                       message.success('物料禁用成功!');
                    }
                    this.props.tablePaging();
                }
            })

    }

    render() {
        let {onSearch,SearchVal,tablePaging, tabLoading,url,...props} = this.props;
        this.searchData.right.map(item => {
            if (item.title == "导出") {
                item.url = url;
            }
            return item;
        });
        return (
            <div className="material">
                <SearchBarComp
                    onSearch={onSearch}
                    searchData={this.searchData}
                />
               <div className="material-body">
                    <MTable
                        {...props}
                        loading={tabLoading}
                        cols={columns}
                        rowKey={"materialCode"}
                        pageOnChange={tablePaging}
                    />
               </div>
            </div>
        );
    }
    componentDidMount() {
        this.props.tablePaging(1);
    }
}

export default MaterialComp;    