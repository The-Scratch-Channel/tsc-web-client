import React from "react";
import {Link} from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <strong>The Scratch Channel</strong> is not affiliated with Scratch, the Scratch Team, or the Scratch Foundation.
      </div>
      <div className="footer-links">
        <div className="footer-group">
          <h4>About</h4>
          <a href="/about">About and Credits</a><br/>
          <a href="https://raw.githubusercontent.com/The-Scratch-Channel/the-scratch-channel.github.io/refs/heads/main/LICENSE">License</a><br/>
          <a href="https://stats.uptimerobot.com/abiwl4EvLm">Status checker</a>
        </div>
        <div className="footer-group">
          <h4>Resources</h4>
          <Link to="/#articles">Articles</Link><br />
          <a href="https://www.google.com/search?sca_esv=a07cb0739b81081f&q=The%20Scratch%20Channel&stick=H4sIAAAAAAAAAONgU1I1qDBKTjIwMEtKMzQxM7FINje3MqiwSEo0STZOSTROTTEytEy0XMQqHJKRqhCcXJRYkpyh4JyRmJeXmgMAA7YRJD8AAAA&mat=CYAsXbaVju9Q&ved=2ahUKEwjene-VhJmPAxWqWkEAHRYWDPIQrMcEegQIFBAC">Google Business</a><br />
          <a href="https://github.com/The-Scratch-Channel/the-scratch-channel.github.io/issues/new/choose">Report an Issue</a><br />
          <a href="https://g.page/r/CakZ0j7aw6SLEBM/review">Leave a review</a>
        </div>
        <div className="footer-group">
          <h4>Community</h4>
          <a href="https://scratch.mit.edu/discuss/topic/814999/">Forum Topic</a><br />
          <a href="https://github.com/The-Scratch-Channel/the-scratch-channel.github.io/">GitHub</a>
        </div>
      </div>
      <br />
      <h4 className="footer-copyright-info">
        © {new Date().getFullYear()} The Scratch Channel
      </h4>
    </footer>
  );
}
