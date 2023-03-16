import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./Home.css";
import send from './icons/send.png';
import copyicon from './icons/copy.png';
import copiedicon from './icons/copied.png';

function Home() {
  const [longURL, setLongUrl] = useState("");
  const [shortLink, setShortLink] = useState({});
  const [active, setActive] = useState(false);
  const [copy, setCopy] = useState(false);

  function handleChange(e) {
    setLongUrl(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_BITLY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        long_url: longURL,
        domain: "bit.ly",
        group_guid: `${process.env.REACT_APP_GUID}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const new_link = data.link.replace("https://", "");
        fetch(
          `https://api-ssl.bitly.com/v4/bitlinks/${new_link}/qr?image_format=png`,
          {
            mode: "cors",
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_BITLY_TOKEN}`,
            },
          }
        )
          .then((response) => response.json())
          .then((result) => {
            setShortLink(result);
            setActive(true);
          });
      });
    setLongUrl("");
  }

  return (
    <div className="App">
      <h2>A Simple Bitly Link Shortener</h2>
      <div>
        <form method="post" action="" onSubmit={handleSubmit}>
          <input
            name="long_url"
            type="text"
            value={longURL}
            placeholder="Paste your url"
            onChange={handleChange}
          />
          <button type="submit"><img src={send} alt="send icon" id="send_icon"/></button>
        </form>
        
      </div>

      {/* show on success... */}

      {active ? (
        <div className="show_links">
          <img src={shortLink.qr_code} alt="Qr code" className="qr_img"/>
          <div>
            <h3>Here's your short link...</h3>
            <span>
              <p>{shortLink.link}</p>
              <CopyToClipboard onCopy={()=>{
                setCopy(true);
              }} text={shortLink.link}>{ !copy ? <img src={copyicon} alt="copy icon" width="17px" height="17px"/> : <img src={copiedicon} alt="copy icon" width="17px" height="17px"/>  }</CopyToClipboard>

            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Home;