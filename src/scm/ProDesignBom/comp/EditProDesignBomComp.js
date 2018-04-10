import React, { Component } from "react";
import { Form, Input, Spin,Select, Modal } from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/components/FormModalComp';
import AddProDesignBomComp from './AddProDesignBomComp';
import { measurestore} from '../store/EditProDesignStore';
const FormItem = Form.Item;
const Option = Select.Option;
let { observer } = mobxReact;
@observer
class EditProDesignBomComp extends AddProDesignBomComp {
    constructor(props, context) {
        super(props, context);
         this.measurestore =measurestore;
    }
                     
}
EditProDesignBomComp.defaultProps={
    title:"编辑产品BOM"
}
export default Form.create()(EditProDesignBomComp);
