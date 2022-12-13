import { useRouter } from "next/router";


export default function Home(props) {
  const router = useRouter();
  const { data } = props;

  return (
    <div className="main__container">
        <h1> Welcome!</h1>
    </div>
  );
}


