import './Loader.css';

function Loader() {
  return (
    <div className="lds-ellipsis loading-applications">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default Loader;
