import AccountAddEdit from "../../../components/account/accountAddEdit";
import {MODE_EDIT} from "../../../constants/accountConstants";

const EditAccount = (props) => {
  console.log("Props::"+JSON.stringify(props))
  const accountId = props.data.accountId;
  const requestData = {
    mode: MODE_EDIT,
    accountId: accountId
  }
  
    return (
      <div className="main__container">
          <AccountAddEdit data={requestData}/>
      </div>
    );
  };
export default EditAccount;



export async function getStaticPaths() {

  return {
    paths: [{ params: { accountId: "5" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { accountId } = context.params;
  return {
    props: {
      data: {
        accountId: accountId
      },
    },
    revalidate: 1,
  };
}