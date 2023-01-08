import TimesheetAddEdit from "../../../components/timesheet/timesheetAddEdit";
import {MODE_EDIT} from "../../../constants/accountConstants";
import { useRouter } from "next/router";



const EditTimesheet = (props) => {
  const router = useRouter();

  const timesheetId = props.data.timesheetId;
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



export async function getStaticPaths() {

  return {
    paths: [{ params: { timesheetId: "5" } }],
    fallback: false,
  };

} 

export async function getStaticProps(context) {
  const { timesheetId } = context.params;
  return {
    props: {
      data: {
        timesheetId: timesheetId
      },
    },
    revalidate: 1,
  };
}