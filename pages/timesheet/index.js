import TimesheetAddEdit from "../../components/timesheet/timesheetAddEdit";
import {MODE_EDIT} from "../../constants/accountConstants";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";



const EditTimesheet = (props) => {
  const router = useRouter();

  const timesheetId = useSelector(state => state.timesheet.selectedTimesheetId);
  console.log("timesheetId::"+timesheetId)
  const requestData = {
    mode: MODE_EDIT,
    timesheetId: timesheetId
  }
  
    return (
      <div className="main__container">
          <TimesheetAddEdit data={requestData}/>
      </div>
    );
  };
export default EditTimesheet;
