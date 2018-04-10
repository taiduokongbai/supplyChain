import ReportIndexComp from './ReportIndexComp';
import ReportStore from "../stores/ReportStore";

export default class SaleReportComp extends ReportIndexComp {
    constructor(props) {
        super(props);
        this.type = "SALE_REPORT";
        this.store = new ReportStore({ type: this.type });
    }
}