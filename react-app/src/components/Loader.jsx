import './Loader.css';

export default function Loader({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <LoaderBox />
      </div>
    );
  }
  return (
    <div className="loader-center">
      <LoaderBox />
    </div>
  );
}

function LoaderBox() {
  return (
    <div className="loader">
      <div className="ground">
        <div></div>
      </div>
      {[0,1,2,3,4,5,6,7].map(i => (
        <div key={i} className={`box box${i}`}>
          <div></div>
        </div>
      ))}
    </div>
  );
}
