import { Form } from 'antd';
import { AddPurReturnAddMatComp } from './AddPurReturnAddMatComp';
import { purReturnEditStore, editPurReturnDetailStore, editMaterialStore } from '../stores/EditPurchaseReturnStore';
import { measureStore } from '../../data/DropDownStore';
let { observer } = mobxReact;
@observer
class EditPurReturnEditMatComp extends AddPurReturnAddMatComp {
    constructor(props, context) {
        super(props, context);
        this.store = editMaterialStore;
        this.purReturnFormStore = purReturnEditStore;
        this.onMaterialSubmit = editPurReturnDetailStore.onMaterialEdit;
    }
}

const options = {
    onValuesChange(props, values) {
        editMaterialStore.setMaterialDetail(values)
    }
}
export default Form.create(options)(EditPurReturnEditMatComp);