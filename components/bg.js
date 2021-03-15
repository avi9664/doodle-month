const Bg = () => (
  <>
    <div aria-hidden>
      <div className="overlay">
        <svg id="ff" xmlns="http://www.w3.org/2000/svg">
          <circle cx={-10} cy={51} r={152} fill="#FFA987" />
        </svg>
      </div>
      <div className="grainy bg" />
    </div>
    <style jsx>{`
      .bg {
        position: absolute;
        left: 0;
        top: 0;
      }
      .overlay {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        z-index: -1;
        width: 100%;
        filter: blur(24px);
      }
      svg {
        position: absolute;
        left: 0;
        top: 0;
        height: 100vh;
        z-index: -1;
        width: 100%;
      }
    `}</style>
  </>
)

export default Bg
