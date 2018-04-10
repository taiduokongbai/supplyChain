import React,{Component} from "react";
import AdjustmentMoveDetailsComp from '../../components/InventoryModule/AdjustmentMoveDetailsComp';
import { connect } from 'react-redux'
class AdjustmentMoveDetailsCont extends Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        let {newState} = this.props;
        return (
            <div>
                    <AdjustmentMoveDetailsComp {...this.props}/>
            </div>
        );
    }
}
const mapStateToProps = (state) =>  {   
    return {
        newState: state.AdjustmentMoveDetailsRedu.toJS(),
    }
};

const mapDispatchToProps = (dispatch) => ({
  
})
export default connect( mapStateToProps, mapDispatchToProps )(AdjustmentMoveDetailsCont)


