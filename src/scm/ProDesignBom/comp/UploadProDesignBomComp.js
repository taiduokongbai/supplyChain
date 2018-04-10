import React, { Component } from "react";
import { Form, Input,Upload, Spin,Select, Button, Modal ,Col,Row,message,Icon} from '../../../base/components/AntdComp';
import { ProDesignBomFetch ,UploadUrl} from '../../consts/ProDesignBomUrls';
import { Urls } from '../../../base/consts/Urls';
import { shouldComponentUpdate } from '../../../base/consts/Utils';
import { jsonHead } from '../../../base/services/ReqApi';
import FormModalComp from '../../../base/components/FormModalComp';
import {editProDesignBomTableStore,addProDesignBomStore} from "../store/AddProDesignBomStore";
import { proDesignBomDetailsInfoStore,detailsEditTable} from '../store/ProDesignBomDetailsStore'

import statusPNG from '../img/status_icon.png';

let { observer } = mobxReact;

@observer
class UploadProDesignBomComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.urlAttr=[];
        this.state = {
            value: '',
            urlArr:[],
            fileUid: null,
        }; 
    }
    beforeUpload=(file) => {
       const isJPG = /^image\/(jpeg|jpg|png|bmp)$/.test(file.type);
        if (!isJPG) {
            message.error('只允许上传 jpeg/jpg/png/bmp 类型文件！');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片文件大小不能超过 2MB ！');
        }
        return isJPG && isLt2M;
    }

    onRemove= (file) => {
        let {removeBomPictureFetch,getBomPictureList,removeBomDetailPictureFetch}=proDesignBomDetailsInfoStore;
        if(!detailsEditTable.detailOrProduct){
            removeBomPictureFetch({id:file.id,fileId:file.fileId}).then(json=>{
                if(json.status===2000){
                    getBomPictureList({productCode:file.productCode}).then(json=>{
                        if(json.status===2000){
                            proDesignBomDetailsInfoStore.fileList=json.data.list;
                        }
                    })
                }
            })
        }else{
            removeBomDetailPictureFetch({id:file.id,fileId:file.fileId}).then(json=>{
                if(json.status===2000){
                    ProDesignBomFetch.getBomDetailPictureList({materialCode:detailsEditTable.materialCode}).then(json=>{
                        if(json.status===2000){
                            proDesignBomDetailsInfoStore.fileList=json.data.list; 
                        }
                    })
                }
            })
        }
        
    }
     
    onChange=(info) => {
        if(info.file.status == 'uploading'){
            proDesignBomDetailsInfoStore.fileList.push(info.file);
        }
        if (info.file.status == 'done') {
             if (info.file.response.status === 2000) {
                let {init,saveBomPictureFetch,getBomPictureList,saveBomDetailPictureFetch}=proDesignBomDetailsInfoStore;
                let {data}=info.file.response;
                if(!detailsEditTable.detailOrProduct){
                    data.fileId=data.id;
                    data.productCode=init.productCode;
                    saveBomPictureFetch(data).then(json=>{
                        if(json.status===2000){
                            getBomPictureList({productCode:data.productCode}).then(json=>{
                                if(json.status===2000){
                                    proDesignBomDetailsInfoStore.fileList=json.data.list;
                                }
                            })
                        }
                    })
                }else{
                        data.fileId=data.id;
                        data.materialCode=detailsEditTable.materialCode
                        data.productDetailId=detailsEditTable.productDetailId;
                        saveBomDetailPictureFetch(data).then(json=>{
                            if(json.status===2000){
                                ProDesignBomFetch.getBomDetailPictureList({materialCode:detailsEditTable.materialCode}).then(json=>{
                                    if(json.status===2000){
                                        proDesignBomDetailsInfoStore.fileList=json.data.list; 
                                    }
                            })
                        
                        }
                    })
                }
                
                message.success('图片上传成功！')  

             }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 图片上传失败！`);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (!err) {

            }
        });
    }

   handleCancel=()=>{
       addProDesignBomStore.addVisible=false;
       detailsEditTable.detailOrProduct=false;
       proDesignBomDetailsInfoStore.getProDesignBomDetailsInfo({id:proDesignBomDetailsInfoStore.init.id})
   }
   

    getComp = () => {
        let {fileList}=proDesignBomDetailsInfoStore;
        return (
            <div className="uploadProDesignBom" style={{height:fileList.length>0?'auto':'204px'}}>
                <Upload 
                    headers= {
                        {
                            authorization: 'authorization-text',
                            tokenId: jsonHead.tokenId,
                        }
                    }
                    data={
                        {module: "picture"}
                    }
                    action={ProDesignBomFetch.uploadPic} 
                    listType= 'picture'
                    name='file'
                    showUploadList= { {showPreviewIcon: false, showRemoveIcon: true }}
                    className= 'upload-list-inline'
                    fileList={fileList.slice()}
                    onRemove={this.onRemove}
                    onChange={this.onChange}
                    beforeUpload={this.beforeUpload}
                 >
                    <Button type="upload" style={{width:'91px',height:'31px',float:'left',border:'1px solid #4C80CF',borderRadius:'3px',color:'#4C80CF',padding:0}}>
                        <Icon type="upload" /> 上传图片
                    </Button>
                </Upload>
                {
                    fileList.length>0?
                    null:
                    <div className="status_img" >
                        <img src={statusPNG} />  
                        <p >暂无图片信息，请点击上传图片上传</p>
                    </div>
                }
            </div>
        )
    }
    render() {
        return (
            <Modal  visible={addProDesignBomStore.addVisible}
                onCancel={this.handleCancel}
                className={"ProDesignBom"}
                title= {"图片管理"}
                width={922}
                footer={[]}
            >
                {
                    this.getComp()
                }
               
            </Modal>

        );

    }
}

export default Form.create()(UploadProDesignBomComp);
