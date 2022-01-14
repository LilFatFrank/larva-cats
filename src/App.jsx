import "./app.scss";
import { isMobile, isTablet } from "react-device-detect";
import Sprite from "./Sprite/Sprite";
import { useState } from "react";

const App = () => {
  const [count, setCount] = useState(1);

  return !(isMobile || isTablet) ? (
    <>
      <img src="LandingPage.png" alt="landing-page" className="background" />
      <div className="minting">
        <div className="claim">
          <Sprite id="heart" width={32} height={32} />
          <span style={{ fontSize: "16px", color: "#ffffff" }}>
            claim your LARVA CAT
          </span>
          <Sprite id="heart" width={32} height={32} />
        </div>
        {false ? (
          <Sprite
            id="connect"
            width={350}
            height={60}
            style={{ cursor: "pointer" }}
            onClick={() => console.log("connect")}
          />
        ) : null}
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <div className="claim" style={{ borderBottom: "none" }}>
              <div
                className={`count-brick ${count == 2 ? "active" : ""}`}
                onClick={() => setCount(2)}
              >
                2
              </div>
              <div
                className={`count-brick ${count == 5 ? "active" : ""}`}
                onClick={() => setCount(5)}
              >
                5
              </div>
              <div
                className={`count-brick ${count == 10 ? "active" : ""}`}
                onClick={() => setCount(10)}
              >
                10
              </div>
            </div>
            <div className="claim" style={{ borderBottom: "none" }}>
              <Sprite
                id="up"
                width={30}
                height={30}
                style={{ cursor: "pointer" }}
                onClick={() => setCount(count >= 10 ? 10 : count + 1)}
              />
              <div className="count">{count}</div>
              <Sprite
                id="down"
                width={30}
                height={30}
                style={{ cursor: "pointer" }}
                onClick={() => setCount(count <= 1 ? 1 : count - 1)}
              />
            </div>
          </div>
          <div style={{ color: "#ffffff" }}>
            <span style={{ color: "#FF1BE8" }}>2500</span>
            <span>/5000</span>
          </div>
          <Sprite
            id="mint"
            width={280}
            height={80}
            style={{ cursor: "pointer" }}
          />
        </>
      </div>
    </>
  ) : (
    <div className="mobile">
      <img src="cat.png" alt="cat" />
      <div style={{ fontSize: "16px", color: "#f2f2f2" }}>
        Please use a desktop / laptop to mint the cat. Cats love big screens.
      </div>
    </div>
  );
};

export default App;
