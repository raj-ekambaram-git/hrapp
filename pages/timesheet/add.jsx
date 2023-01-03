import {MODE_ADD, EMPTY_STRING} from "../../constants/accountConstants";
import { useRouter } from "next/router";
import React from "react";
import TimesheetAddEdit from "../../components/timesheet/timesheetAddEdit";
import { useDispatch } from "react-redux";
import {setTSEntries} from '../../store/modules/Timesheet/actions';


const AddNewTimesheet = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  //Resetting the TS Entries
  dispatch(setTSEntries([]));

  const requestData = {
    mode: MODE_ADD,
    timesheetId: ""
  }

  return (
    <div className="main__container">
        <TimesheetAddEdit data={requestData}/>
    </div>
  );
};

export default AddNewTimesheet;


