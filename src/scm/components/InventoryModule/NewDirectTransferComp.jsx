/**
 * Created by MW on 2017/9/4.
 */
import React, {Component} from 'react'
import { Row, Col, Button, Input, Spin,Form, Select, DatePicker} from '../../../base/components/AntdComp';
import NewDirectTransferTopComp from './NewDirectTransferTopComp'
import NewDirectTransferStepOneComp from './NewDirectTransferStepOneComp'
import NewDirectTransferDialogCont from '../../dialogconts/InventoryModule/NewDirectTransferDialogCont'
import NewDirectTransferAdvanceCont from '../../dialogconts/InventoryModule/NewDirectTransferAdvanceCont'
import NewDirectTransferStepTwo from './NewDirectTransferStepTwo'
import NewDirectTransferStepThree from './NewDirectTransferStepThree'

class NewDirectTransferComp extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount = () => {
        this.props.onSearchOut('');
        this.props.storeInitOrderInfo();
    }

    render() {
        return (
            <div className="new-direct-transfer">
                <Spin spinning = {this.props.loading}>
                    <NewDirectTransferTopComp {...this.props} />
                    {
                        this.props.tableOne ? <NewDirectTransferStepOneComp {...this.props} /> :
                            (this.props.tableTwo ? <NewDirectTransferStepTwo {...this.props} /> :
                            (
                                this.props.tableThree ?  <NewDirectTransferStepThree {...this.props} /> :
                                     null
                            )

                            )
                    }
                    <NewDirectTransferDialogCont {...this.props} />
                    <NewDirectTransferAdvanceCont {...this.props} />
                </Spin>
            </div>
        )
    }
}

export default NewDirectTransferComp