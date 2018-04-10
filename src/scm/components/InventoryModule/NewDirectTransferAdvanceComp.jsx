/**
 * Created by MW on 2017/9/5.
 */
import React, {Component} from 'react'
import FormModalComp from '../../../base/components/FormModalComp';
class NewDirectTransferAdvanceComp extends FormModalComp{
    constructor(props){
        super(props);
    };


    getComp= () => {

        return (
            <div>
               预收货
            </div>
        )
    }
}
NewDirectTransferAdvanceComp.defaultProps = {
    title: '预收货',
    okText: '确定',
    width: 740,
    maskClosable: true,
}

export default NewDirectTransferAdvanceComp;
