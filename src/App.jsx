import "./app.scss";
import { isMobile, isTablet } from "react-device-detect";
import Sprite from "./Sprite/Sprite";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "./redux/data/dataActions";
import { useEffect } from "react";
import CONFIG from "./config/config.json";
import { connect } from "./redux/blockchain/blockchainActions";

const App = () => {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [mintAmount, setMintAmount] = useState(1);
  const [feedback, setFeedback] = useState(`Click mint.`);

  useEffect(() => {
    dispatch(connect());
    if (window.ethereum) {
      window.ethereum.on("chainChanged", (val) => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", (val) => {
        window.location.reload();
      });
    }
  }, []);

  const claimNFTs = async () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    setFeedback(`Please wait`);
    if (data.totalSupply < 1001) {
      totalCostWei = String(0);
    }
    const hasLad = await blockchain.smartContract.methods
      .larvaladHolders(blockchain.account)
      .call();
    if (hasLad) {
      totalCostWei = String(cost * (mintAmount - 1));
    }
    blockchain.smartContract.methods
      .mintLarvaCat(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Something went wrong.");
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`It is yours!`);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount <= 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount >= 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" || blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

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
        {blockchain?.account === "" || blockchain?.account === null ? (
          <Sprite
            id="connect"
            width={350}
            height={60}
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(connect())}
          />
        ) : (
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
                  className={`count-brick ${mintAmount == 2 ? "active" : ""}`}
                  onClick={() => setMintAmount(2)}
                >
                  2
                </div>
                <div
                  className={`count-brick ${mintAmount == 5 ? "active" : ""}`}
                  onClick={() => setMintAmount(5)}
                >
                  5
                </div>
                <div
                  className={`count-brick ${mintAmount == 10 ? "active" : ""}`}
                  onClick={() => setMintAmount(10)}
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
                  onClick={incrementMintAmount}
                />
                <div className="count">{mintAmount}</div>
                <Sprite
                  id="down"
                  width={30}
                  height={30}
                  style={{ cursor: "pointer" }}
                  onClick={decrementMintAmount}
                />
              </div>
            </div>
            {window.ethereum?.networkVersion == "1" ? (
              <>
                {data.totalSupply == CONFIG.MAX_SUPPLY ? (
                  <div style={{ color: "#ffffff", fontSize: "14px" }}>
                    The sale has ended
                  </div>
                ) : (
                  <div style={{ color: "#ffffff" }}>
                    <span style={{ color: "#FF1BE8" }}>{data.totalSupply}</span>
                    <span>/{CONFIG.MAX_SUPPLY}</span>
                  </div>
                )}
                {data.totalSupply == CONFIG.MAX_SUPPLY ? null : (
                  <span style={{ position: "relative" }}>
                    <Sprite
                      id="mint"
                      width={280}
                      height={80}
                      style={{ cursor: "pointer" }}
                      onClick={claimNFTs}
                    />
                    <div
                      style={{
                        color: "#ffffff",
                        fontSize: "12px",
                        position: "absolute",
                        top: "-15px",
                        width: "100%",
                        textAlign: "center"
                      }}
                    >
                      {feedback}
                    </div>
                  </span>
                )}
              </>
            ) : (
              <div style={{ color: "#ffffff", fontSize: "14px" }}>
                Please use the Ethereum network
              </div>
            )}
          </>
        )}
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
