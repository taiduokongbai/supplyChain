import ReportIndexComp from './ReportIndexComp';
import ReportStore from "../stores/ReportStore";

export default class PurchaseReportComp extends ReportIndexComp{
    constructor(props) {
        super(props);
        this.type = "PURCHASE_REPORT";
        this.store = new ReportStore({ type: this.type });
    }
}