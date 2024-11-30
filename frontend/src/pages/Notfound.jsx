import { Link } from 'react-router-dom';

const Notfound = () => {
  return (
    <>
      <h1>NOT FOUND!</h1>
      <Link to="/">HOMEへ戻る</Link>
    </>
  );
};

export default Notfound;
